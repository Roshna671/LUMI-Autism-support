import pytest
from app.services.screening_service import ScreeningService
from app.services.planning_service import PlanningService

def test_screening_instruments_and_scoring():
    # 1. Check instrument questions retrieval
    toddler_inst = ScreeningService.get_instrument_questions("toddler")
    assert toddler_inst is not None
    assert len(toddler_inst["questions"]) >= 5

    cast_inst = ScreeningService.get_instrument_questions("cast")
    assert cast_inst is not None
    assert len(cast_inst["questions"]) >= 10

    # 2. Test Toddler scoring below threshold
    mild_answers = {"todd_1": 0, "todd_2": 0, "todd_3": 0, "todd_4": 0, "todd_5": 0}
    res_mild = ScreeningService.evaluate("toddler", mild_answers)
    assert res_mild["total_score"] == 0.0
    assert res_mild["referral_recommended"] is False
    assert "developmental" in res_mild["interpretation"].lower()
    assert "diagnostic" in res_mild["non_diagnostic_disclaimer"].lower()

    # 3. Test CAST scoring above referral threshold
    elevated_answers = {
        "cast_1": 1, "cast_2": 1, "cast_5": 1, "cast_6": 1,
        "cast_8": 1, "cast_9": 1, "cast_10": 1, "cast_12": 1
    }
    res_elevated = ScreeningService.evaluate("cast", elevated_answers)
    assert res_elevated["total_score"] >= 3
    assert res_elevated["referral_recommended"] is True
    assert "specialist" in res_elevated["guidance_text"].lower()

def test_adaptive_planning_service():
    # 1. Child with sound sensitivity & fatigue history -> should get gentle difficulty and calming sensory
    child_profile = {
        "id": "child-123",
        "preferred_name": "Maya",
        "age": 3,
        "sensory_preferences": {"sound_sensitivity": True},
        "communication_preferences": {"style": "emerging"}
    }
    fatigued_sessions = [
        {"successful_responses": 2, "attempts": 10, "breaks_taken": 3},
        {"successful_responses": 3, "attempts": 8, "breaks_taken": 4}
    ]
    plan = PlanningService.generate_plan(child_profile, recent_sessions=fatigued_sessions)
    assert plan["child_id"] == "child-123"
    assert plan["difficulty_settings"]["overall_difficulty"] == "gentle"
    assert plan["difficulty_settings"]["hints_enabled"] is True
    # At least 3 structured activities
    assert len(plan["activities"]) >= 3
    # Check that sensory regulation activity is present
    skills = [a["developmental_skill"] for a in plan["activities"]]
    assert any("Sensory" in s for s in skills)

    # 2. Child with high accuracy -> should get challenging difficulty
    advanced_child = {
        "id": "child-456",
        "preferred_name": "Noah",
        "age": 6,
        "sensory_preferences": {},
        "communication_preferences": {"style": "spoken"}
    }
    high_perf_sessions = [
        {"successful_responses": 10, "attempts": 10, "breaks_taken": 0},
        {"successful_responses": 9, "attempts": 10, "breaks_taken": 0},
        {"successful_responses": 10, "attempts": 10, "breaks_taken": 1}
    ]
    adv_plan = PlanningService.generate_plan(advanced_child, recent_sessions=high_perf_sessions)
    assert adv_plan["difficulty_settings"]["overall_difficulty"] == "challenging"
