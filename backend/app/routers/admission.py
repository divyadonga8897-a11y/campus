from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database.connection import get_db
from app.models.models import (
    AdmissionProcess, EligibilityCriteria, RequiredDocument, AdmissionTimeline, StudentEnquiry, FAQ, ContactInformation
)
from app.schemas.schemas import (
    ApiResponse, AdmissionProcessBase, EligibilityCriteriaBase, RequiredDocumentBase, AdmissionTimelineBase,
    StudentEnquiryCreate, StudentEnquiryBase, FAQBase, ContactInformationBase
)

router = APIRouter(prefix="/api/v1", tags=["Admissions & Enquiry"])

@router.get("/admission/process", response_model=ApiResponse[List[AdmissionProcessBase]])
def get_admission_process(db: Session = Depends(get_db)):
    steps = db.query(AdmissionProcess).order_by(AdmissionProcess.step_number.asc()).all()
    return ApiResponse(data=steps)

@router.get("/admission/eligibility/{course_id}", response_model=ApiResponse[EligibilityCriteriaBase])
def get_eligibility_by_course(course_id: str, db: Session = Depends(get_db)):
    elig = db.query(EligibilityCriteria).filter(EligibilityCriteria.course_id == course_id).first()
    if not elig:
        raise HTTPException(status_code=404, detail="Eligibility details for this course not found")
    return ApiResponse(data=elig)

@router.get("/admission/documents", response_model=ApiResponse[List[RequiredDocumentBase]])
def get_required_documents(db: Session = Depends(get_db)):
    docs = db.query(RequiredDocument).all()
    return ApiResponse(data=docs)

@router.get("/admission/timeline", response_model=ApiResponse[List[AdmissionTimelineBase]])
def get_admission_timeline(db: Session = Depends(get_db)):
    events = db.query(AdmissionTimeline).all()
    return ApiResponse(data=events)

@router.get("/admission/faqs", response_model=ApiResponse[List[FAQBase]])
def get_faqs(
    category: Optional[str] = Query(None, description="Filter FAQs by category"),
    db: Session = Depends(get_db)
):
    query = db.query(FAQ)
    if category:
        query = query.filter(FAQ.category.ilike(category))
    items = query.order_by(FAQ.display_order.asc()).all()
    return ApiResponse(data=items)

@router.post("/admission/enquiry", response_model=ApiResponse[dict])
def create_enquiry(enquiry_in: StudentEnquiryCreate, db: Session = Depends(get_db)):
    # Email and phone validations are executed by Pydantic models automatically.
    # Write to database
    enquiry = StudentEnquiry(
        student_name=enquiry_in.name,
        email=enquiry_in.email,
        phone=enquiry_in.phone,
        course_interest=enquiry_in.course_interest,
        message=enquiry_in.message,
        status="New",
        created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return ApiResponse(data={"success": True, "message": "Your enquiry has been submitted successfully."})

@router.get("/contact", response_model=ApiResponse[List[ContactInformationBase]])
def get_contacts(db: Session = Depends(get_db)):
    items = db.query(ContactInformation).all()
    return ApiResponse(data=items)
