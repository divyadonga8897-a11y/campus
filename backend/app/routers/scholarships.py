from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import Scholarship
from app.schemas.schemas import ApiResponse, ScholarshipBase

router = APIRouter(prefix="/api/v1/scholarships", tags=["Scholarships"])

@router.get("", response_model=ApiResponse[List[ScholarshipBase]])
def get_scholarships(db: Session = Depends(get_db)):
    scholarships = db.query(Scholarship).all()
    return ApiResponse(data=scholarships)
