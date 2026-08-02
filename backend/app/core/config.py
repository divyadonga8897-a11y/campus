import sys
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import ValidationError, model_validator
from typing import List, Union

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres.zayoiqgkbinpegqmgjeu:[Divya@120531]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "ssiet_jwt_secret_key_999_super_secured"
    JWT_SECRET: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "https://campus-eight-alpha.vercel.app",
        "*"
    ] 
    
    # Upload configuration
    UPLOAD_DIR: str = "/tmp/uploads"
    MAX_UPLOAD_SIZE: int = 5242880  # 5MB
    
    # AI & Service API Keys
    OPENAI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "campusconnect-ai"
    WASENDER_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    EMBEDDING_MODEL_KEYS: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @model_validator(mode="after")
    def validate_and_align_keys(self) -> 'Settings':
        # Fallback JWT_SECRET -> SECRET_KEY
        if self.JWT_SECRET and (not self.SECRET_KEY or self.SECRET_KEY == "ssiet_jwt_secret_key_999_super_secured"):
            self.SECRET_KEY = self.JWT_SECRET
        
        # Fallback Supabase keys
        if not self.SUPABASE_KEY:
            if self.SUPABASE_SERVICE_KEY:
                self.SUPABASE_KEY = self.SUPABASE_SERVICE_KEY
            elif self.SUPABASE_ANON_KEY:
                self.SUPABASE_KEY = self.SUPABASE_ANON_KEY

        # Validate settings on startup without throwing crashes
        warnings = []
        if self.ENVIRONMENT == "production":
            if "aws-0-ap-southeast-1.pooler.supabase.com" in self.DATABASE_URL and "[Divya@120531]" in self.DATABASE_URL:
                warnings.append("DATABASE_URL is using placeholder credentials in a production environment.")
            if not self.GROQ_API_KEY:
                warnings.append("GROQ_API_KEY is not set. Chatbot features will be disabled.")
            if not self.PINECONE_API_KEY:
                warnings.append("PINECONE_API_KEY is not set. Knowledge Base RAG searches will fail.")
            if not self.SUPABASE_URL or not self.SUPABASE_KEY:
                warnings.append("SUPABASE_URL or SUPABASE_KEY are not configured.")
        
        if warnings:
            print("\n" + "=" * 60)
            print("CONFIGURATION WARNINGS IN PRODUCTION:")
            for w in warnings:
                print(f"  - WARNING: {w}")
            print("=" * 60 + "\n")
            
        return self

try:
    settings = Settings()
except ValidationError as e:
    print(f"WARNING: Configuration validation failed. Error: {e}")
    print("Falling back to safe default settings.")
    class DefaultSettings:
        DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres.zayoiqgkbinpegqmgjeu:[Divya@120531]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres")
        ENVIRONMENT = os.getenv("ENVIRONMENT", "production")
        SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY") or "ssiet_jwt_secret_key_999_super_secured"
        ALGORITHM = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES = 1440
        CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
        UPLOAD_DIR = "/tmp/uploads"
        MAX_UPLOAD_SIZE = 5242880
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
        GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
        PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
        PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "campusconnect-ai")
        WASENDER_API_KEY = os.getenv("WASENDER_API_KEY", "")
        SUPABASE_URL = os.getenv("SUPABASE_URL", "")
        SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY", "")
    settings = DefaultSettings()
