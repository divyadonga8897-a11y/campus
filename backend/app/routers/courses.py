from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import Course
from app.schemas.schemas import ApiResponse, CourseBase

router = APIRouter(prefix="/api/v1/courses", tags=["Courses"])

@router.get("", response_model=ApiResponse[List[CourseBase]])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return ApiResponse(data=courses)

@router.get("/{slug}", response_model=ApiResponse[CourseBase])
def get_course_by_slug(slug: str, db: Session = Depends(get_db)):
    # Map friendly URL slugs back to seed database IDs
    slug_map = {
        "computer-science-engineering": "b-tech-cse",
        "artificial-intelligence-data-science": "b-tech-aids",
        "electronics-communication-engineering": "b-tech-ece",
        "mechanical-engineering": "b-tech-mech",
        "civil-engineering": "b-tech-civil"
    }
    
    course_id = slug_map.get(slug, slug)
    course = db.query(Course).filter((Course.id == course_id) | (Course.id == slug)).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return ApiResponse(data=course)
