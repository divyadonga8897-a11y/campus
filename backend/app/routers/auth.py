from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import User, Admin
from app.schemas.schemas import ApiResponse, UserLogin, TokenResponse, UserBase
from app.services.auth_service import verify_password, create_access_token, decode_access_token
from app.core.config import settings

from typing import Optional
Optional_str = Optional[str]

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

def get_supabase_client():
    if settings.SUPABASE_URL and (settings.SUPABASE_ANON_KEY or settings.SUPABASE_KEY):
        try:
            from supabase import create_client
            key = settings.SUPABASE_ANON_KEY or settings.SUPABASE_KEY
            return create_client(settings.SUPABASE_URL, key)
        except Exception as e:
            print(f"[Auth] Could not create Supabase client: {e}")
            return None
    return None

ALLOWED_PORTAL_ROLES = {"super_admin", "ADMIN", "CONTENT_MANAGER"}

def _resolve_authorized_account(db: Session, email: str):
    """Look up an authorized portal user (Admin or active User) strictly from the database."""
    admin = db.query(Admin).filter(Admin.email == email).first()
    if admin:
        if admin.role not in ALLOWED_PORTAL_ROLES:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Insufficient privileges."
            )
        return admin

    user = db.query(User).filter(User.email == email).first()
    if user:
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="This administrator profile is disabled"
            )
        if user.role not in ALLOWED_PORTAL_ROLES:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Administrators only."
            )
        return user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access denied. Account is not an authorized administrator."
    )

def get_current_user(authorization: Optional_str = Header(None), db: Session = Depends(get_db)):
    # Handle Optional_str token check safely
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    token = authorization.split(" ")[1]
    
    # 1. Try Supabase Auth token verification first (for ES256/GoTrue tokens)
    supabase = get_supabase_client()
    if supabase:
        try:
            user_resp = supabase.auth.get_user(token)
            if user_resp and user_resp.user and user_resp.user.email:
                return _resolve_authorized_account(db, user_resp.user.email)
        except HTTPException:
            raise
        except Exception:
            pass
            
    # 2. Fall back to local HMAC JWT decoding
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token"
        )
    user_id = payload.get("user_id")
    
    # 1. Check admins table first
    admin = db.query(Admin).filter(Admin.id == user_id).first()
    if admin:
        if admin.role not in ALLOWED_PORTAL_ROLES:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Insufficient privileges."
            )
        return admin
        
    # 2. Fall back to users table
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User profile is inactive or missing"
        )
    if user.role not in ALLOWED_PORTAL_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Administrators only."
        )
    return user

@router.post("/login", response_model=ApiResponse[TokenResponse])
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    # 1. Attempt Supabase Auth first
    supabase = get_supabase_client()
    if supabase:
        try:
            auth_res = supabase.auth.sign_in_with_password({
                "email": login_in.email,
                "password": login_in.password
            })
            if auth_res and auth_res.user and auth_res.session and auth_res.user.email:
                # Strictly resolve role from database; never auto-grant admin from Supabase metadata
                account = _resolve_authorized_account(db, auth_res.user.email)
                return ApiResponse(data={
                    "access_token": auth_res.session.access_token,
                    "token_type": "bearer",
                    "user_role": account.role
                })
        except HTTPException:
            raise
        except Exception as sb_err:
            err_str = str(sb_err).lower()
            if "invalid login credentials" in err_str or "invalid credentials" in err_str:
                pass # Try local database fallback before failing
            else:
                print(f"[Auth] Supabase auth notice: {sb_err}")

    # 2. Query admins table fallback (local PBKDF2 hash)
    user = db.query(Admin).filter(Admin.email == login_in.email).first()
    if user and user.password_hash != "[supabase_managed]":
        if not verify_password(login_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        token = create_access_token(data={"user_id": user.id, "email": user.email, "role": user.role})
        return ApiResponse(data={
            "access_token": token,
            "token_type": "bearer",
            "user_role": user.role
        })
        
    # 3. Query users table as fallback
    user = db.query(User).filter(User.email == login_in.email).first()
    if user and verify_password(login_in.password, user.password_hash):
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="This administrator profile is disabled"
            )
        token = create_access_token(data={"user_id": user.id, "email": user.email, "role": user.role})
        return ApiResponse(data={
            "access_token": token,
            "token_type": "bearer",
            "user_role": user.role
        })
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password"
    )

@router.get("/me", response_model=ApiResponse[UserBase])
def get_me(current_user: User = Depends(get_current_user)):
    return ApiResponse(data=current_user)

@router.post("/logout", response_model=ApiResponse[dict])
def logout():
    return ApiResponse(data={"success": True, "message": "Successfully logged out"})
