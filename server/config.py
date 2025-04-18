from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    SECRET_KEY: str
    ALGORITHM: str
    DATABASE_URL: str
    ORIGIN: str

    class Config:
        env_file = str(Path(__file__).resolve().parent / ".env")  # absolute path


settings = Settings()
