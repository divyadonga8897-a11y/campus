from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import College, CollegeProfile, VisionMission, Leadership, Achievement, Accreditation, Gallery
from app.schemas.schemas import (
    ApiResponse, CollegeBase, CollegeProfileBase, VisionMissionBase, LeadershipBase, AchievementBase, AccreditationBase, GalleryBase
)

router = APIRouter(prefix="/api/v1/college", tags=["College"])

@router.get("", response_model=ApiResponse[CollegeBase])
def get_college_info(db: Session = Depends(get_db)):
    college = db.query(College).filter(College.id == "ssiet").first()
    return ApiResponse(data=college)

@router.get("/profile", response_model=ApiResponse[CollegeProfileBase])
def get_college_profile(db: Session = Depends(get_db)):
    profile = db.query(CollegeProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="College profile details not found")
    return ApiResponse(data=profile)

@router.get("/vision", response_model=ApiResponse[VisionMissionBase])
def get_college_vision(db: Session = Depends(get_db)):
    vision = db.query(VisionMission).first()
    if not vision:
        raise HTTPException(status_code=404, detail="Vision and Mission details not found")
    return ApiResponse(data=vision)

@router.get("/leadership", response_model=ApiResponse[List[LeadershipBase]])
def get_college_leadership(db: Session = Depends(get_db)):
    leadership_list = db.query(Leadership).order_by(Leadership.display_order.asc()).all()
    return ApiResponse(data=leadership_list)

@router.get("/achievements", response_model=ApiResponse[List[AchievementBase]])
def get_college_achievements(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Achievement)
    if category:
        query = query.filter(Achievement.category == category)
    achievements_list = query.order_by(Achievement.year.desc()).all()
    return ApiResponse(data=achievements_list)

@router.get("/accreditation", response_model=ApiResponse[List[AccreditationBase]])
def get_college_accreditation(db: Session = Depends(get_db)):
    accreditations_list = db.query(Accreditation).all()
    return ApiResponse(data=accreditations_list)

@router.get("/gallery", response_model=ApiResponse[List[GalleryBase]])
def get_college_gallery(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Gallery)
    if category:
        query = query.filter(Gallery.category == category)
    gallery_list = query.all()
    return ApiResponse(data=gallery_list)
