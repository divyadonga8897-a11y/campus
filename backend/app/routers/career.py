from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import (
    PlacementOverview, PlacementStatistics, Recruiter, PlacementProcess, TrainingProgram, Internship, StudentSuccessStory, Alumni, CareerResource
)
from app.schemas.schemas import (
    ApiResponse, PlacementOverviewBase, PlacementStatisticsBase, RecruiterCareerBase, PlacementProcessBase, TrainingProgramBase, InternshipCareerBase, StudentSuccessStoryBase, AlumniCareerBase, CareerResourceBase
)

router = APIRouter(prefix="/api/v1/career", tags=["Career & Placements"])

@router.get("/placements", response_model=ApiResponse[List[PlacementOverviewBase]])
def get_placement_overviews(db: Session = Depends(get_db)):
    items = db.query(PlacementOverview).all()
    return ApiResponse(data=items)

@router.get("/placements/{department_id}", response_model=ApiResponse[List[PlacementStatisticsBase]])
def get_department_placements(department_id: str, db: Session = Depends(get_db)):
    items = db.query(PlacementStatistics).filter(PlacementStatistics.department_id == department_id).all()
    return ApiResponse(data=items)

@router.get("/recruiters", response_model=ApiResponse[List[RecruiterCareerBase]])
def get_recruiters(
    industry: Optional[str] = Query(None, description="Filter recruiters by industry"),
    db: Session = Depends(get_db)
):
    query = db.query(Recruiter)
    if industry:
        query = query.filter(Recruiter.industry.ilike(industry))
    items = query.all()
    return ApiResponse(data=items)

@router.get("/process", response_model=ApiResponse[List[PlacementProcessBase]])
def get_placement_process(db: Session = Depends(get_db)):
    items = db.query(PlacementProcess).order_by(PlacementProcess.step_number.asc()).all()
    return ApiResponse(data=items)

@router.get("/training", response_model=ApiResponse[List[TrainingProgramBase]])
def get_training_programs(db: Session = Depends(get_db)):
    items = db.query(TrainingProgram).all()
    return ApiResponse(data=items)

@router.get("/internships", response_model=ApiResponse[List[InternshipCareerBase]])
def get_internships(db: Session = Depends(get_db)):
    items = db.query(Internship).all()
    return ApiResponse(data=items)

@router.get("/stories", response_model=ApiResponse[List[StudentSuccessStoryBase]])
def get_stories(db: Session = Depends(get_db)):
    items = db.query(StudentSuccessStory).all()
    return ApiResponse(data=items)

@router.get("/alumni", response_model=ApiResponse[List[AlumniCareerBase]])
def get_alumni(db: Session = Depends(get_db)):
    items = db.query(Alumni).all()
    return ApiResponse(data=items)

@router.get("/resources", response_model=ApiResponse[List[CareerResourceBase]])
def get_resources(db: Session = Depends(get_db)):
    items = db.query(CareerResource).all()
    return ApiResponse(data=items)
