from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import Department
from app.schemas.schemas import ApiResponse, DepartmentBase

router = APIRouter(prefix="/api/v1/departments", tags=["Departments"])

@router.get("", response_model=ApiResponse[List[DepartmentBase]])
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    return ApiResponse(data=departments)

@router.get("/{id}", response_model=ApiResponse[DepartmentBase])
def get_department(id: str, db: Session = Depends(get_db)):
    department = db.query(Department).filter(Department.id == id).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return ApiResponse(data=department)
