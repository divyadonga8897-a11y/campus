from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import FeeStructure
from app.schemas.schemas import ApiResponse, FeeStructureBase

router = APIRouter(prefix="/api/v1/fees", tags=["Fees"])

@router.get("", response_model=ApiResponse[List[FeeStructureBase]])
def get_fees(db: Session = Depends(get_db)):
    fees = db.query(FeeStructure).all()
    return ApiResponse(data=fees)
