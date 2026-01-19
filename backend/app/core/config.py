from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Network Watcher"
    DATABASE_URL: str
    REDIS_URL: str

    class Config:
        env_file = ".env"

settings = Settings()