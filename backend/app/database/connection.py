import os
from urllib.parse import quote_plus, unquote_plus
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

Base = declarative_base()

def get_safe_db_url(url: str) -> str:
    """
    Ensure the password in PostgreSQL connection URL is correctly percent-encoded,
    preventing SQLAlchemy URL parsing issues on special characters like '@' or brackets.
    """
    if not url:
        return url
    if url.startswith("postgresql://") or url.startswith("postgres://"):
        try:
            prefix = "postgresql://" if url.startswith("postgresql://") else "postgres://"
            rest = url[len(prefix):]
            if "@" in rest:
                userinfo, hostinfo = rest.rsplit("@", 1)
                if ":" in userinfo:
                    username, password = userinfo.split(":", 1)
                    decoded_pwd = unquote_plus(password)
                    encoded_pwd = quote_plus(decoded_pwd)
                    return f"postgresql://{username}:{encoded_pwd}@{hostinfo}"
        except Exception:
            pass
    return url

def create_app_engine():
    raw_url = settings.DATABASE_URL
    safe_url = get_safe_db_url(raw_url)
    is_sqlite = safe_url.startswith("sqlite")
    
    if is_sqlite:
        return create_engine(safe_url, connect_args={"check_same_thread": False})
    
    # Try connecting to the configured PostgreSQL database
    connect_args = {"connect_timeout": 4}
    try:
        pg_engine = create_engine(
            safe_url,
            connect_args=connect_args,
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=True,
            pool_recycle=300
        )
        # Test connection with a quick ping
        with pg_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("[Database] Successfully connected to PostgreSQL database.")
        return pg_engine
    except Exception as e:
        print(f"[Database] Notice: PostgreSQL connection failed: {e}")
        if settings.ENVIRONMENT != "production":
            # In development, fall back to persistent local SQLite so the admin portal and all features function seamlessly
            db_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            db_file_path = os.path.join(db_dir, "campusconnect_dev.db")
            local_sqlite_url = f"sqlite:///{db_file_path}"
            print(f"[Database] Local development fallback active: {local_sqlite_url}")
            return create_engine(local_sqlite_url, connect_args={"check_same_thread": False})
        else:
            # In production, preserve PostgreSQL engine
            return pg_engine

engine = create_app_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
