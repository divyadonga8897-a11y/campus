from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import (
    Facility, Gallery, CampusLocation, Infrastructure, Laboratory, Library, Hostel, SportsFacility, StudentClub, CampusEvent
)
from app.schemas.schemas import (
    ApiResponse, FacilityBase, GalleryBase, CampusLocationBase,
    InfrastructureBase, LaboratoryBase, LibraryBase, HostelBase, SportsFacilityBase, StudentClubBase, CampusEventBase
)

router = APIRouter(prefix="/api/v1/campus", tags=["Campus Experience"])

@router.get("/infrastructure", response_model=ApiResponse[List[InfrastructureBase]])
def get_infrastructure(
    facility_type: Optional[str] = Query(None, description="Filter by facility type"),
    db: Session = Depends(get_db)
):
    query = db.query(Infrastructure)
    if facility_type:
        query = query.filter(Infrastructure.facility_type == facility_type)
    items = query.all()
    return ApiResponse(data=items)

@router.get("/labs", response_model=ApiResponse[List[LaboratoryBase]])
def get_labs(
    department_id: Optional[str] = Query(None, description="Filter by department ID"),
    db: Session = Depends(get_db)
):
    query = db.query(Laboratory)
    if department_id:
        query = query.filter(Laboratory.department_id == department_id)
    items = query.all()
    return ApiResponse(data=items)

@router.get("/library", response_model=ApiResponse[LibraryBase])
def get_library(db: Session = Depends(get_db)):
    lib = db.query(Library).first()
    return ApiResponse(data=lib)

@router.get("/hostel", response_model=ApiResponse[List[HostelBase]])
def get_hostels(db: Session = Depends(get_db)):
    items = db.query(Hostel).all()
    return ApiResponse(data=items)

@router.get("/sports", response_model=ApiResponse[List[SportsFacilityBase]])
def get_sports(db: Session = Depends(get_db)):
    items = db.query(SportsFacility).all()
    return ApiResponse(data=items)

@router.get("/clubs", response_model=ApiResponse[List[StudentClubBase]])
def get_clubs(db: Session = Depends(get_db)):
    items = db.query(StudentClub).all()
    return ApiResponse(data=items)

@router.get("/events", response_model=ApiResponse[List[CampusEventBase]])
def get_events(db: Session = Depends(get_db)):
    items = db.query(CampusEvent).all()
    return ApiResponse(data=items)

# Backward compatibility routes
@router.get("/facilities", response_model=ApiResponse[List[FacilityBase]])
def get_facilities(db: Session = Depends(get_db)):
    facilities = db.query(Facility).all()
    return ApiResponse(data=facilities)

@router.get("/gallery", response_model=ApiResponse[List[GalleryBase]])
def get_gallery_compat(db: Session = Depends(get_db)):
    gallery_items = db.query(Gallery).all()
    return ApiResponse(data=gallery_items)

@router.get("/campus-locations", response_model=ApiResponse[List[CampusLocationBase]])
def get_campus_locations(db: Session = Depends(get_db)):
    locations = db.query(CampusLocation).all()
    return ApiResponse(data=locations)
