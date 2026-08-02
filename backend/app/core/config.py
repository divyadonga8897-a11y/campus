import sys
import os
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
        "https://campusconnect-ai2.vercel.app",
        "*"
    ] 
    
    # Upload configuration
    UPLOAD_DIR: str = "public/uploads"
    MAX_UPLOAD_SIZE: int = 5242880  # 5MB
    
    # AI & Service API Keys
    OPENAI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "campusconnect-ai"
    WASENDER_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

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
        DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres.zayoiqgkbinpegqmgjeu:[Divya@120531]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres")
        ENVIRONMENT = os.getenv("ENVIRONMENT", "production")
        SECRET_KEY = os.getenv("SECRET_KEY", "ssiet_jwt_secret_key_999_super_secured")
        ALGORITHM = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES = 1440
        CORS_ORIGINS = ["*"]
        UPLOAD_DIR = "public/uploads"
        MAX_UPLOAD_SIZE = 5242880
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
        GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
        PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
        PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "campusconnect-ai")
        WASENDER_API_KEY = os.getenv("WASENDER_API_KEY", "")
        SUPABASE_URL = os.getenv("SUPABASE_URL", "")
        SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    settings = DefaultSettings()


