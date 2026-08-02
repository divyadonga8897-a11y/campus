from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import User, Admin
from app.schemas.schemas import ApiResponse, UserLogin, TokenResponse, UserBase
from app.services.auth_service import verify_password, create_access_token, decode_access_token

from typing import Optional
Optional_str = Optional[str]

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

def get_current_user(authorization: Optional_str = Header(None), db: Session = Depends(get_db)):
    # Handle Optional_str token check safely
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token"
        )
    user_id = payload.get("user_id")
    
    # 1. Check admins table first
    user = db.query(Admin).filter(Admin.id == user_id).first()
    if user:
        return user
        
    # 2. Fall back to users table
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User profile is inactive or missing"
        )
    return user

@router.post("/login", response_model=ApiResponse[TokenResponse])
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    # 1. Query admins table first
    user = db.query(Admin).filter(Admin.email == login_in.email).first()
    if user:
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
        
    # 2. Query users table as fallback
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
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

@router.get("/me", response_model=ApiResponse[UserBase])
def get_me(current_user: User = Depends(get_current_user)):
    return ApiResponse(data=current_user)

@router.post("/logout", response_model=ApiResponse[dict])
def logout():
    return ApiResponse(data={"success": True, "message": "Successfully logged out"})
