import pytest

def test_caregiver_registration_and_login(client):
    # 1. Register Caregiver A
    reg_res = client.post("/api/auth/register", json={
        "email": "caregiver_a@example.com",
        "password": "Password123!",
        "display_name": "Sarah Connor",
        "preferred_language": "en",
        "consent_given": True
    })
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    token_a = reg_data["access_token"]
    caregiver_a_id = reg_data["caregiver"]["id"]

    # 2. Login with valid credentials
    login_res = client.post("/api/auth/login", json={
        "email": "caregiver_a@example.com",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 3. Login with invalid password
    bad_login = client.post("/api/auth/login", json={
        "email": "caregiver_a@example.com",
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 4. Check /me endpoint
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token_a}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "caregiver_a@example.com"

    # 5. Create Child for Caregiver A
    child_res = client.post("/api/children", json={
        "preferred_name": "Leo",
        "age": 4,
        "age_months": 3,
        "preferred_language": "en",
        "sensory_preferences": {"sound_sensitivity": True},
        "interests": ["trains", "space"]
    }, headers={"Authorization": f"Bearer {token_a}"})
    assert child_res.status_code == 201
    child_a = child_res.json()
    child_a_id = child_a["id"]
    assert child_a["preferred_name"] == "Leo"

    # 6. Register Caregiver B
    reg_b = client.post("/api/auth/register", json={
        "email": "caregiver_b@example.com",
        "password": "SecurePassword456!",
        "display_name": "Marcus Wright",
        "preferred_language": "en"
    })
    assert reg_b.status_code == 200
    token_b = reg_b.json()["access_token"]

    # 7. Caregiver B attempts to access Caregiver A's child -> MUST BE 403 FORBIDDEN
    forbidden_res = client.get(f"/api/children/{child_a_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert forbidden_res.status_code == 403
    assert "Access denied" in forbidden_res.json()["detail"]

    # 8. Caregiver A can view their child
    ok_res = client.get(f"/api/children/{child_a_id}", headers={"Authorization": f"Bearer {token_a}"})
    assert ok_res.status_code == 200
    assert ok_res.json()["id"] == child_a_id
