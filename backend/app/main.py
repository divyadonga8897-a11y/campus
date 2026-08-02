import sys
import os
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Resolve import paths when executing uvicorn inside the backend/ subfolder
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.database.connection import SessionLocal
from app.database.init_db import init_db
from app.routers import college, departments, courses, fees, scholarships, campus, placements, chat, academic, admission, career, auth, cms, admin_kb, whatsapp

app = FastAPI(
    title="CampusConnect AI API",
    description="Backend discovery engine for Sri Satya Institute of Engineering and Technology",
    version="1.0.0"
)

# Custom In-Memory Rate Limiter Middleware
class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit: int = 15, window: int = 60):
        super().__init__(app)
        self.limit = limit
        self.window = window
        self.requests = {}

    async def dispatch(self, request: Request, call_next):
        # Apply rate limits only on login and enquiries to avoid brute-forcing
        path = request.url.path
        if "/auth/login" in path or "/admission/enquiry" in path:
            client_ip = request.client.host if request.client else "unknown"
            now = time.time()
            
            # Clean up old timestamps
            timestamps = self.requests.get(client_ip, [])
            timestamps = [t for t in timestamps if now - t < self.window]
            
            if len(timestamps) >= self.limit:
                return Response(
                    content='{"detail": "Rate limit exceeded. Please retry in a minute."}',
                    status_code=429,
                    media_type="application/json"
                )
            
            timestamps.append(now)
            self.requests[client_ip] = timestamps
            
        return await call_next(request)

app.add_middleware(RateLimitMiddleware, limit=15, window=60)

# Configure CORS for Next.js dev and production URLs from settings
origins = settings.CORS_ORIGINS
if isinstance(origins, str):
    if origins == "*":
        origins = ["*"]
    else:
        origins = [o.strip() for o in origins.split(",") if o.strip()]
print("CORS ALLOWED ORIGINS:", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database on startup
@app.on_event("startup")
def on_startup():
    print("\n--- Starting FastAPI Application ---")
    print(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print("Database URL loaded from configuration settings.")
    print("Connecting to database...")
    db = SessionLocal()
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        print("[OK] Database connection successful.")
        print("Initializing & Seeding database models...")
        init_db(db)
        print("[OK] Database models initialized & seeded successfully.")
    except Exception as e:
        print("\n" + "!" * 80)
        print("CRITICAL DATABASE INITIALIZATION ERROR:")
        print(f"Could not connect to database at: {settings.DATABASE_URL}")
        print(f"Error details: {e}")
        print("WARNING: The backend server will still run so the API documentation is accessible,")
        print("but all endpoints requiring database access will return errors.")
        print("!" * 80 + "\n")
    finally:
        db.close()
        
    print("Registered Routers:")
    print("  - /api/v1/auth [Authentication]")
    print("  - /api/v1/college [College]")
    print("  - /api/v1/departments [Departments]")
    print("  - /api/v1/courses [Courses]")
    print("  - /api/v1/fees [Fees]")
    print("  - /api/v1/scholarships [Scholarships]")
    print("  - /api/v1/campus [Campus]")
    print("  - /api/v1/placements [Placements]")
    print("  - /api/v1/chat [Chat]")
    print("  - /api/v1/academic [Academic]")
    print("  - /api/v1/admission [Admission]")
    print("  - /api/v1/career [Career]")
    print("  - /api/v1/cms [CMS Portal]")
    print("FastAPI Backend Server Ready! Swagger docs available at: http://localhost:8000/docs")
    print("-" * 40 + "\n")

# Include Routers
app.include_router(college.router)
app.include_router(departments.router)
app.include_router(courses.router)
app.include_router(fees.router)
app.include_router(scholarships.router)
app.include_router(campus.router)
app.include_router(placements.router)
app.include_router(chat.router)
app.include_router(academic.router)
app.include_router(admission.router)
app.include_router(career.router)
app.include_router(auth.router)
app.include_router(cms.router)
app.include_router(admin_kb.router)
app.include_router(whatsapp.router)

@app.get("/")
def read_root():
    return "CampusConnect API Running"

@app.get("/health")
def health_check():
    db = SessionLocal()
    db_status = "disconnected"
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        pass
    finally:
        db.close()
        
    # Check Pinecone
    pinecone_status = "disconnected"
    if os.getenv("PINECONE_API_KEY"):
        try:
            from pinecone import Pinecone
            pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
            pc.list_indexes()
            pinecone_status = "connected"
        except Exception:
            pass

    # Check Groq
    groq_status = "disconnected"
    if os.getenv("GROQ_API_KEY"):
        groq_status = "connected"
        
    # Check Wasender
    wasender_status = "disconnected"
    if os.getenv("WASENDER_API_KEY"):
        wasender_status = "connected"
    else:
        # If running in local mock fallback mode
        wasender_status = "mocked"

    # Check Local Disk Storage
    storage_status = "healthy"
    try:
        if not os.path.exists("public/uploads/kb"):
            os.makedirs("public/uploads/kb", exist_ok=True)
    except Exception:
        storage_status = "unwritable"

    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "services": {
            "fastapi": "healthy",
            "postgresql": db_status,
            "pinecone": pinecone_status,
            "groq": groq_status,
            "wasender": wasender_status,
            "storage": storage_status,
            "background_workers": "healthy"
        }
    }
