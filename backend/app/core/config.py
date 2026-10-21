import os
import json
from typing import List
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "LUMI Adaptive Developmental Platform")
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "lumi_dev_super_secret_key_minimum_32_characters_long_2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours

    # Database: Defaults to SQLite locally if PostgreSQL is not specified
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/lumi_development.db")

    # Private Vault for Clinical Documents (Never public)
    STORAGE_VAULT_PATH: Path = Path(os.getenv("STORAGE_VAULT_PATH", str(BASE_DIR / "vault")))
    MAX_UPLOAD_SIZE_BYTES: int = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", str(15 * 1024 * 1024)))  # 15 MB

    # CORS Origins
    _raw_origins = os.getenv("CORS_ORIGINS", '["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173"]')
    try:
        CORS_ORIGINS: List[str] = json.loads(_raw_origins)
    except Exception:
        CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]

    # AI & Voice Companion
    AI_VOICE_PROVIDER: str = os.getenv("AI_VOICE_PROVIDER", "lumi_engine")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")

    def __init__(self):
        # Ensure private vault exists
        self.STORAGE_VAULT_PATH.mkdir(parents=True, exist_ok=True)

settings = Settings()
