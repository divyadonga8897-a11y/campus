from typing import Optional, Union

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.connection import get_db
from app.models.models import Admin, User
from app.schemas.schemas import ApiResponse, TokenResponse, UserBase, UserLogin
from app.services.auth_service import create_access_token, decode_access_token, verify_password

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

ALLOWED_PORTAL_ROLES = {"super_admin", "ADMIN", "CONTENT_MANAGER"}


def get_supabase_client():
    """Create a Supabase client if project URL and anon/service key are configured."""
    if settings.SUPABASE_URL and (settings.SUPABASE_ANON_KEY or settings.SUPABASE_KEY):
        try:
            from supabase import create_client
            key = settings.SUPABASE_ANON_KEY or settings.SUPABASE_KEY
            return create_client(settings.SUPABASE_URL, key)
        except Exception as e:
            print(f"[Auth] Could not create Supabase client: {e}")
            return None
    return None


def _validate_account_access(account: Union[Admin, User]) -> Union[Admin, User]:
    """Ensure the portal account is active and holds an authorized role."""
    if isinstance(account, User) and not bool(account.is_active):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This administrator profile is disabled"
        )
    if str(account.role) not in ALLOWED_PORTAL_ROLES:
        detail = (
            "Access denied. Insufficient privileges."
            if isinstance(account, Admin)
            else "Access denied. Administrators only."
        )
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)
    return account


def _resolve_authorized_account(db: Session, email: str) -> Union[Admin, User]:
    """Look up an authorized portal user (Admin or active User) strictly from the database."""
    admin = db.query(Admin).filter(Admin.email == email).first()
    if admin:
        return _validate_account_access(admin)

    user = db.query(User).filter(User.email == email).first()
    if user:
        return _validate_account_access(user)

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access denied. Account is not an authorized administrator."
    )


def _issue_local_token_response(account: Union[Admin, User]) -> ApiResponse[TokenResponse]:
    """Validate access and return a signed local JWT TokenResponse for fallback accounts."""
    _validate_account_access(account)
    role = str(account.role)
    token = create_access_token(
        data={"user_id": str(account.id), "email": str(account.email), "role": role}
    )
    return ApiResponse(
        data=TokenResponse(access_token=token, token_type="bearer", user_role=role)
    )


def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> Union[Admin, User]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )

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
    if not payload or not payload.get("user_id"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token"
        )
    user_id = payload.get("user_id")

    admin = db.query(Admin).filter(Admin.id == user_id).first()
    if admin:
        return _validate_account_access(admin)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User profile is inactive or missing"
        )
    return _validate_account_access(user)


@router.post("/login", response_model=ApiResponse[TokenResponse])
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    # 1. Attempt Supabase Auth first
    supabase = get_supabase_client()
    if supabase:
        try:
            auth_res = supabase.auth.sign_in_with_password({
                "email": login_in.email,
                "password": login_in.password,
            })
            if auth_res and auth_res.user and auth_res.session and auth_res.user.email:
                # Strictly resolve role from database; never auto-grant admin from Supabase metadata
                account = _resolve_authorized_account(db, auth_res.user.email)
                return ApiResponse(
                    data=TokenResponse(
                        access_token=auth_res.session.access_token,
                        token_type="bearer",
                        user_role=str(account.role),
                    )
                )
        except HTTPException:
            raise
        except Exception as sb_err:
            err_str = str(sb_err).lower()
            if "invalid login credentials" in err_str or "invalid credentials" in err_str:
                pass  # Try local database fallback before failing
            else:
                print(f"[Auth] Supabase auth notice: {sb_err}")

    # 2. Query admins table fallback (local PBKDF2 hash)
    admin_account = db.query(Admin).filter(Admin.email == login_in.email).first()
    if admin_account and str(admin_account.password_hash) != "[supabase_managed]":
        if not verify_password(login_in.password, str(admin_account.password_hash)):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        return _issue_local_token_response(admin_account)

    # 3. Query users table as fallback
    user_account = db.query(User).filter(User.email == login_in.email).first()
    if user_account and verify_password(login_in.password, str(user_account.password_hash)):
        return _issue_local_token_response(user_account)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password"
    )


@router.get("/me", response_model=ApiResponse[UserBase])
def get_me(current_user: Union[Admin, User] = Depends(get_current_user)):
    return ApiResponse(data=UserBase.model_validate(current_user))


@router.post("/logout", response_model=ApiResponse[dict])
def logout():
    return ApiResponse(data={"success": True, "message": "Successfully logged out"})
