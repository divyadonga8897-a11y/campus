import sys
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import ValidationError
from typing import List, Union

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres.zayoiqgkbinpegqmgjeu:[Divya@120531]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "ssiet_jwt_secret_key_999_super_secured"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "https://campus-connect-ai-5b5p.vercel.app",
        "https://campus-connect-ai-lake.vercel.app",
        "*"
    ] 
    
    # Upload configuration
    UPLOAD_DIR: str = "public/uploads"
    MAX_UPLOAD_SIZE: int = 5242880  # 5MB
    
    # AI API Keys
    OPENAI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "campusconnect-ai"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

try:
    settings = Settings()
except ValidationError as e:
    print(f"WARNING: Configuration validation failed. Error: {e}")
    print("Falling back to safe default settings.")
    class DefaultSettings:
        DATABASE_URL = "postgresql://postgres.zayoiqgkbinpegqmgjeu:[Divya@120531]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
        ENVIRONMENT = "development"
        SECRET_KEY = "ssiet_jwt_secret_key_999_super_secured"
        ALGORITHM = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES = 1440
        CORS_ORIGINS = ["*"]
        UPLOAD_DIR = "public/uploads"
        MAX_UPLOAD_SIZE = 5242880
        OPENAI_API_KEY = ""
        GROQ_API_KEY = ""
        PINECONE_API_KEY = ""
        PINECONE_INDEX_NAME = "campusconnect-ai"
    settings = DefaultSettings()

