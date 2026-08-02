from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
import os
import shutil

from app.database.connection import get_db
from app.models.models import (
    User, ActivityLog, Course, Department, FeeStructure, AdmissionProcess, 
    RequiredDocument, AdmissionTimeline, Hostel, Laboratory, Library, StudentClub, 
    SportsFacility, Gallery, PlacementStatistics, Recruiter, Alumni, StudentEnquiry, College
)
from app.schemas.schemas import ApiResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/v1/cms", tags=["CMS Portal"])

def log_action(db: Session, user_id: str, action: str, module: str, description: str):
    log_item = ActivityLog(
        user_id=user_id,
        action=action,
        module=module,
        description=description,
        created_at=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(log_item)
    db.commit()

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return ApiResponse(data={
        "courses": db.query(Course).count(),
        "departments": db.query(Department).count(),
        "student_enquiries": db.query(StudentEnquiry).count(),
        "events": db.query(ActivityLog).filter(ActivityLog.module == "Events").count() + 3, # offset mock
        "gallery_images": db.query(Gallery).count()
    })

@router.get("/logs")
def get_activity_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(ActivityLog).order_by(ActivityLog.id.desc()).limit(50).all()
    # Populate user details in logs response
    result = []
    for log in logs:
        user = db.query(User).filter(User.id == log.user_id).first()
        result.append({
            "id": log.id,
            "user_name": user.full_name if user else "System",
            "action": log.action,
            "module": log.module,
            "description": log.description,
            "created_at": log.created_at
        })
    return ApiResponse(data=result)

# Reusable Simulated Image Upload Endpoint
@router.post("/upload")
def upload_media(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    # Validate extension
    ext = file.filename.split('.')[-1].lower() if "." in file.filename else ""
    if ext not in {"jpg", "jpeg", "png", "webp"}:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed formats: jpg, jpeg, png, webp")
        
    # Validate size (Max 5MB)
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    if size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum allowed size is 5MB")

    # Create public/uploads directory if not exists
    upload_dir = os.path.join("public", "uploads")
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return path accessible by frontend
    public_url = f"/uploads/{file.filename}"
    return ApiResponse(data={"url": public_url})

# ----------------- College Info CRUD -----------------
@router.put("/college")
def update_college(name: str = Form(...), description: str = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    col = db.query(College).filter(College.id == "ssiet").first()
    if not col:
        raise HTTPException(status_code=404, detail="College registry not found")
    col.name = name
    col.description = description
    db.commit()
    log_action(db, current_user.id, "UPDATE", "College", f"Updated college general info parameters.")
    return ApiResponse(data={"success": True})

# ----------------- Departments CRUD -----------------
@router.post("/departments")
def create_department(id: str = Form(...), name: str = Form(...), description: str = Form(...), hod: str = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dept = Department(
        id=id,
        department_name=name,
        description=description,
        head_of_department=hod,
        hod_image="/images/alumni/career-growth.webp",
        department_image="/images/campus/main-building.webp",
        short_name=id.upper(),
        established_year=2000,
        faculty_count=15,
        student_count=180
    )
    db.add(dept)
    db.commit()
    log_action(db, current_user.id, "CREATE", "Departments", f"Created department {name}.")
    return ApiResponse(data=dept)

@router.put("/departments/{id}")
def update_department(id: str, name: str = Form(...), description: str = Form(...), hod: str = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    dept.department_name = name
    dept.description = description
    dept.head_of_department = hod
    db.commit()
    log_action(db, current_user.id, "UPDATE", "Departments", f"Updated department {name} metadata.")
    return ApiResponse(data=dept)

@router.delete("/departments/{id}")
def delete_department(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only ADMIN users can execute delete actions")
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    db.delete(dept)
    db.commit()
    log_action(db, current_user.id, "DELETE", "Departments", f"Deleted department {id}.")
    return ApiResponse(data={"success": True})

# ----------------- Courses CRUD -----------------
@router.post("/courses")
def create_course(id: str = Form(...), name: str = Form(...), dept_id: str = Form(...), duration: str = Form(...), intake: int = Form(...), overview: str = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = Course(
        id=id,
        course_name=name,
        department_id=dept_id,
        degree_type="B.Tech",
        duration=duration,
        intake=intake,
        overview=overview,
        career_scope="Engineers in leading companies",
        eligibility="Intermediate MPC with minimum 60%",
        course_image="/images/campus/main-building.webp"
    )
    db.add(course)
    db.commit()
    log_action(db, current_user.id, "CREATE", "Courses", f"Created course {name}.")
    return ApiResponse(data=course)

@router.put("/courses/{id}")
def update_course(id: str, name: str = Form(...), duration: str = Form(...), intake: int = Form(...), overview: str = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    course.course_name = name
    course.duration = duration
    course.intake = intake
    course.overview = overview
    db.commit()
    log_action(db, current_user.id, "UPDATE", "Courses", f"Updated course {name} outlines.")
    return ApiResponse(data=course)

@router.delete("/courses/{id}")
def delete_course(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only ADMIN users can execute delete actions")
    course = db.query(Course).filter(Course.id == id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    log_action(db, current_user.id, "DELETE", "Courses", f"Deleted course {id}.")
    return ApiResponse(data={"success": True})

# ----------------- Fees CRUD -----------------
@router.post("/fees")
def create_fee(course_id: str = Form(...), academic_year: str = Form(...), tuition_fee: float = Form(...), hostel_fee: float = Form(...), other_charges: float = Form(...), fee_type: str = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    fee = FeeStructure(
        id=f"fee-{course_id}-{academic_year}-{fee_type.lower()}",
        course_id=course_id,
        academic_year=academic_year,
        tuition_fee=tuition_fee,
        hostel_fee=hostel_fee,
        other_charges=other_charges,
        total_fee=tuition_fee + hostel_fee + other_charges,
        fee_type=fee_type
    )
    db.add(fee)
    db.commit()
    log_action(db, current_user.id, "CREATE", "Fees", f"Added fee structure for {course_id} - {academic_year}.")
    return ApiResponse(data=fee)

@router.put("/fees/{id}")
def update_fee(id: str, tuition_fee: float = Form(...), hostel_fee: float = Form(...), other_charges: float = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    fee = db.query(FeeStructure).filter(FeeStructure.id == id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee structure not found")
    fee.tuition_fee = tuition_fee
    fee.hostel_fee = hostel_fee
    fee.other_charges = other_charges
    fee.total_fee = tuition_fee + hostel_fee + other_charges
    db.commit()
    log_action(db, current_user.id, "UPDATE", "Fees", f"Updated fee structure {id}.")
    return ApiResponse(data=fee)

@router.delete("/fees/{id}")
def delete_fee(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only ADMIN users can execute delete actions")
    fee = db.query(FeeStructure).filter(FeeStructure.id == id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee structure not found")
    db.delete(fee)
    db.commit()
    log_action(db, current_user.id, "DELETE", "Fees", f"Deleted fee structure {id}.")
    return ApiResponse(data={"success": True})

# ----------------- Admissions CRUD -----------------
@router.post("/admissions/process")
def create_admission_step(id: str = Form(...), title: str = Form(...), description: str = Form(...), step_number: int = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    step = AdmissionProcess(
        id=id,
        title=title,
        description=description,
        step_number=step_number,
        category="General",
        created_at=datetime.datetime.utcnow().strftime("%Y-%m-%d")
    )
    db.add(step)
    db.commit()
    log_action(db, current_user.id, "CREATE", "Admissions", f"Added admission step {step_number}.")
    return ApiResponse(data=step)

@router.delete("/admissions/process/{id}")
def delete_admission_step(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only ADMIN users can execute delete actions")
    step = db.query(AdmissionProcess).filter(AdmissionProcess.id == id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    db.delete(step)
    db.commit()
    log_action(db, current_user.id, "DELETE", "Admissions", f"Deleted admission step {id}.")
    return ApiResponse(data={"success": True})

# ----------------- Placements CRUD -----------------
@router.post("/placements")
def create_placement_stat(id: str = Form(...), year: int = Form(...), dept_id: str = Form(...), registered: int = Form(...), placed: int = Form(...), percentage: float = Form(...), highest: float = Form(...), average: float = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stat = PlacementStatistics(
        id=id,
        year=year,
        department_id=dept_id,
        students_registered=registered,
        students_placed=placed,
        placement_percentage=percentage,
        highest_package=highest,
        average_package=average,
        companies_count=10,
        created_at=datetime.datetime.utcnow().strftime("%Y-%m-%d")
    )
    db.add(stat)
    db.commit()
    log_action(db, current_user.id, "CREATE", "Placements", f"Added placements stats for {dept_id} - {year}.")
    return ApiResponse(data=stat)

@router.delete("/placements/{id}")
def delete_placement_stat(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only ADMIN users can execute delete actions")
    stat = db.query(PlacementStatistics).filter(PlacementStatistics.id == id).first()
    if not stat:
        raise HTTPException(status_code=404, detail="Stat not found")
    db.delete(stat)
    db.commit()
    log_action(db, current_user.id, "DELETE", "Placements", f"Deleted placement stat {id}.")
    return ApiResponse(data={"success": True})

# ----------------- Gallery CRUD -----------------
@router.post("/gallery")
def create_gallery_image(id: str = Form(...), title: str = Form(...), category: str = Form(...), image_url: str = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = Gallery(
        id=id,
        title=title,
        category=category,
        image_url=image_url,
        description="Uploaded campus view",
        created_at=datetime.datetime.utcnow().strftime("%Y-%m-%d")
    )
    db.add(item)
    db.commit()
    log_action(db, current_user.id, "CREATE", "Gallery", f"Added gallery image {title}.")
    return ApiResponse(data=item)

@router.delete("/gallery/{id}")
def delete_gallery_image(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only ADMIN users can execute delete actions")
    item = db.query(Gallery).filter(Gallery.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(item)
    db.commit()
    log_action(db, current_user.id, "DELETE", "Gallery", f"Deleted gallery image {id}.")
    return ApiResponse(data={"success": True})

# ----------------- Student Enquiries CRUD -----------------
@router.get("/enquiries")
def get_enquiries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(StudentEnquiry).order_by(StudentEnquiry.id.desc()).all()
    return ApiResponse(data=items)

@router.put("/enquiries/{id}/status")
def update_enquiry_status(id: int, status: str = Form(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(StudentEnquiry).filter(StudentEnquiry.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    item.status = status
    db.commit()
    log_action(db, current_user.id, "UPDATE", "Enquiries", f"Updated enquiry {id} status to {status}.")
    return ApiResponse(data=item)
