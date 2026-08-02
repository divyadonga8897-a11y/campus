from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import PlacementStatistics, Recruiter, Internship, Alumni, Testimonial
from app.schemas.schemas import (
    ApiResponse, PlacementStatisticsBase, RecruiterBase, InternshipBase, AlumniBase, TestimonialBase
)

router = APIRouter(prefix="/api/v1", tags=["Placements & Alumni"])

@router.get("/placements", response_model=ApiResponse[List[PlacementStatisticsBase]])
def get_placements(db: Session = Depends(get_db)):
    stats = db.query(PlacementStatistics).order_by(PlacementStatistics.year.asc()).all()
    return ApiResponse(data=stats)

@router.get("/placements/year/{year}", response_model=ApiResponse[PlacementStatisticsBase])
def get_placements_by_year(year: int, db: Session = Depends(get_db)):
    stat = db.query(PlacementStatistics).filter(PlacementStatistics.year == year).first()
    if not stat:
        raise HTTPException(status_code=404, detail=f"Placement stats for year {year} not found")
    return ApiResponse(data=stat)

@router.get("/recruiters", response_model=ApiResponse[List[RecruiterBase]])
def get_recruiters(db: Session = Depends(get_db)):
    recruiters = db.query(Recruiter).all()
    return ApiResponse(data=recruiters)

@router.get("/internships", response_model=ApiResponse[List[InternshipBase]])
def get_internships(db: Session = Depends(get_db)):
    internships = db.query(Internship).all()
    return ApiResponse(data=internships)

@router.get("/alumni", response_model=ApiResponse[List[AlumniBase]])
def get_alumni(db: Session = Depends(get_db)):
    alumni = db.query(Alumni).all()
    return ApiResponse(data=alumni)

@router.get("/testimonials", response_model=ApiResponse[List[TestimonialBase]])
def get_testimonials(db: Session = Depends(get_db)):
    testimonials = db.query(Testimonial).all()
    return ApiResponse(data=testimonials)
