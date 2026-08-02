# ============================================================
# Academic Router
# Exposes courses, departments, fee structures, admissions, and scholarships
# ============================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import (
    Department, Course, CourseFeature, FeeStructure, AdmissionRequirement, Scholarship
)
from app.schemas.schemas import ApiResponse

router = APIRouter(prefix="/api/v1/academic", tags=["Academic"])


@router.get("/departments")
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    result = []
    for d in departments:
        result.append({
            "id": d.id,
            "name": d.department_name,
            "description": d.description,
            "image": d.department_image,
            "short_name": d.short_name,
            "established_year": d.established_year,
            "faculty_count": d.faculty_count,
            "student_count": d.student_count
        })
    return ApiResponse(data=result)


@router.get("/departments/{id}")
def get_department_details(id: str, db: Session = Depends(get_db)):
    d = db.query(Department).filter(Department.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Department not found")
    courses_list = db.query(Course).filter(Course.department_id == id).all()
    
    # Highlights include labs and facilities info
    highlights = [
        "State-of-the-art engineering laboratories running customized software boards.",
        "Regular expert lecture series hosted in partnership with tech companies.",
        "Active student bodies planning hackathons and technical exhibition events."
    ]
    
    # Faculty overview list
    faculty_list = [
        {"name": d.head_of_department, "designation": "HOD & Professor", "image": d.hod_image},
        {"name": "Dr. A. K. Sastry", "designation": "Associate Professor", "image": "/images/alumni/career-growth.webp"},
        {"name": "Mrs. G. Sujatha", "designation": "Assistant Professor", "image": "/images/alumni/career-growth.webp"}
    ]
    
    return ApiResponse(data={
        "id": d.id,
        "department_name": d.department_name,
        "short_name": d.short_name,
        "description": d.description,
        "head_of_department": d.head_of_department,
        "hod_image": d.hod_image,
        "department_image": d.department_image,
        "established_year": d.established_year,
        "faculty_count": d.faculty_count,
        "student_count": d.student_count,
        "courses": [
            {
                "id": c.id,
                "course_name": c.course_name,
                "degree_type": c.degree_type,
                "duration": c.duration,
                "intake": c.intake,
                "course_image": c.course_image
            } for c in courses_list
        ],
        "faculty": faculty_list,
        "highlights": highlights
    })


@router.get("/courses")
def get_courses(degree: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Course)
    if degree:
        query = query.filter(Course.degree_type == degree)
    courses_list = query.all()
    result = []
    for c in courses_list:
        dept = db.query(Department).filter(Department.id == c.department_id).first()
        result.append({
            "id": c.id,
            "department_id": c.department_id,
            "department_name": dept.department_name if dept else "",
            "course_name": c.course_name,
            "degree_type": c.degree_type,
            "duration": c.duration,
            "intake": c.intake,
            "overview": c.overview,
            "career_scope": c.career_scope,
            "eligibility": c.eligibility,
            "course_image": c.course_image
        })
    return ApiResponse(data=result)


@router.get("/courses/{id}")
def get_course_details(id: str, db: Session = Depends(get_db)):
    c = db.query(Course).filter(Course.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    
    dept = db.query(Department).filter(Department.id == c.department_id).first()
    features_list = db.query(CourseFeature).filter(CourseFeature.course_id == id).order_by(CourseFeature.display_order.asc()).all()
    fees_list = db.query(FeeStructure).filter(FeeStructure.course_id == id).all()
    requirements = db.query(AdmissionRequirement).filter(AdmissionRequirement.course_id == id).first()
    
    return ApiResponse(data={
        "id": c.id,
        "department_id": c.department_id,
        "department_name": dept.department_name if dept else "",
        "course_name": c.course_name,
        "degree_type": c.degree_type,
        "duration": c.duration,
        "intake": c.intake,
        "overview": c.overview,
        "career_scope": c.career_scope,
        "eligibility": c.eligibility,
        "course_image": c.course_image,
        "features": [
            {
                "id": f.id,
                "feature_title": f.feature_title,
                "feature_description": f.feature_description,
                "icon": f.icon,
                "display_order": f.display_order
            } for f in features_list
        ],
        "fees": [
            {
                "id": fee.id,
                "academic_year": fee.academic_year,
                "tuition_fee": fee.tuition_fee,
                "hostel_fee": fee.hostel_fee,
                "other_charges": fee.other_charges,
                "total_fee": fee.total_fee,
                "fee_type": fee.fee_type
            } for fee in fees_list
        ],
        "admission_requirements": {
            "qualification": requirements.qualification if requirements else "",
            "minimum_percentage": requirements.minimum_percentage if requirements else 60,
            "entrance_exam": requirements.entrance_exam if requirements else "",
            "required_documents": requirements.required_documents if requirements else [],
            "admission_notes": requirements.admission_notes if requirements else ""
        }
    })


@router.get("/fees")
def get_fees(course_id: Optional[str] = None, academic_year: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(FeeStructure)
    if course_id:
        query = query.filter(FeeStructure.course_id == course_id)
    if academic_year:
        query = query.filter(FeeStructure.academic_year == academic_year)
    fees_list = query.all()
    result = []
    for f in fees_list:
        course = db.query(Course).filter(Course.id == f.course_id).first()
        result.append({
            "id": f.id,
            "course_id": f.course_id,
            "course_name": course.course_name if course else "",
            "academic_year": f.academic_year,
            "tuition_fee": f.tuition_fee,
            "hostel_fee": f.hostel_fee,
            "other_charges": f.other_charges,
            "total_fee": f.total_fee,
            "fee_type": f.fee_type
        })
    return ApiResponse(data=result)


@router.get("/admission")
def get_admission_info(db: Session = Depends(get_db)):
    docs = [
        "SSC or equivalent passing certificate (10th Standard Marks Memo).",
        "Intermediate or 10+2 marks memo showing MPC stream grades.",
        "Transfer Certificate (TC) from previous school/college.",
        "State EAPCET (EAMCET) / JEE Main counseling hall ticket and rank card.",
        "Study and Conduct Certificates (class 6th to 12th).",
        "Community/Caste Certificate (for scholarship quotas).",
        "Income Certificate (if seeking government fee reimbursement)."
    ]
    
    steps = [
        {"step": 1, "title": "Choose Engineering Course", "description": "Select from B.Tech specialized programs (CSE, AIDS, ECE, Mech, Civil) that fit your aspirations."},
        {"step": 2, "title": "Check Eligibility Criteria", "description": "Verify qualifying marks (minimum 60% in Intermediate MPC) and check entrance rank requirements."},
        {"step": 3, "title": "Submit Required Documents", "description": "Provide required certificates, rank statements, and photos to counselors for verification."},
        {"step": 4, "title": "Complete Seat Registration", "description": "Securing seat allocation through convener counseling or direct administrative merit allocation."}
    ]
    
    notes = [
        "Counseling and seat reservations are conducted strictly in accordance with JNTU and APSCHE state council guidelines.",
        "Candidates eligible under fee waiver programs must submit updated income certificates to avoid processing delays."
    ]
    
    return ApiResponse(data={
        "eligibility_summary": "10+2 / Intermediate with Mathematics, Physics & Chemistry stream with valid EAPCET or JEE rankings.",
        "required_documents": docs,
        "process_steps": steps,
        "admission_notes": notes
    })


@router.get("/scholarships")
def get_scholarships(db: Session = Depends(get_db)):
    scholarships_list = db.query(Scholarship).all()
    return ApiResponse(data=scholarships_list)
