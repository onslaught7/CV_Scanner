from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    ENV: str
    UPLOAD_DIR: str
    UPLOAD_MOUNT_PATH: str
    OPENAI_API_KEY: str
    GEMINI_API_KEY: str
    SECRET_KEY: str
    ALGORITHM: str
    DATABASE_URL: str
    ORIGIN: str
    SCRAPINGDOG_API_KEY: str
    SCRAPINGDOG_URL: str

    class Config:
        env_file = str(Path(__file__).resolve().parent / ".env")  # absolute path


settings = Settings()
