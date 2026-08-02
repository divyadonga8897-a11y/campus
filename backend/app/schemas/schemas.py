from pydantic import BaseModel, Field
from typing import List, Optional, Generic, TypeVar, Union

T = TypeVar("T")

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T
    message: Optional[str] = None


# College Schemas
class CollegeBase(BaseModel):
    id: str
    name: str
    description: str
    history: Optional[List[dict]] = None
    vision: str
    mission: List[str]
    established_year: int
    location: str

    class Config:
        from_attributes = True


# Department Schemas
class DepartmentBase(BaseModel):
    id: str
    department_name: str
    short_name: str
    description: str
    head_of_department: str
    hod_image: str
    department_image: str
    established_year: int
    faculty_count: int
    student_count: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


# Course Feature Schemas
class CourseFeatureBase(BaseModel):
    id: str
    course_id: str
    feature_title: str
    feature_description: str
    icon: str
    display_order: int

    class Config:
        from_attributes = True


# Fee Structure Schemas
class FeeStructureBase(BaseModel):
    id: str
    course_id: str
    academic_year: str
    tuition_fee: int
    hostel_fee: int
    other_charges: int
    total_fee: int
    fee_type: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


# Admission Requirement Schemas
class AdmissionRequirementBase(BaseModel):
    id: str
    course_id: str
    qualification: str
    minimum_percentage: int
    entrance_exam: str
    required_documents: List[str]
    admission_notes: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


# Course Schemas
class CourseBase(BaseModel):
    id: str
    department_id: str
    course_name: str
    degree_type: str
    duration: str
    intake: int
    overview: str
    career_scope: List[str]
    eligibility: List[str]
    course_image: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


# Scholarship Schemas
class ScholarshipBase(BaseModel):
    id: str
    title: str
    description: str
    eligibility: List[str]
    benefits: List[str]
    application_process: List[str]
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


# Facility Schemas
class FacilityBase(BaseModel):
    id: str
    name: str
    category: str
    description: str
    image_url: str
    location: str

    class Config:
        from_attributes = True


# Gallery Schemas
class GalleryBase(BaseModel):
    id: str
    title: str
    category: str
    image_url: str
    description: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


# CampusLocation Schemas
class CampusLocationBase(BaseModel):
    id: str
    name: str
    description: str
    latitude: float
    longitude: float
    image_url: str

    class Config:
        from_attributes = True


# PlacementStatistics Schemas
class PlacementStatisticsBase(BaseModel):
    id: str
    year: int
    highest_package: Union[float, str]
    average_package: Union[float, str]
    placement_percentage: float
    companies_count: int
    students_placed: int

    class Config:
        from_attributes = True


# Recruiter Schemas
class RecruiterBase(BaseModel):
    id: str
    company_name: str
    logo_url: str
    industry: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


# Internship Schemas
class InternshipBase(BaseModel):
    id: str
    company_name: str
    domain: str
    duration: str
    description: str

    class Config:
        from_attributes = True


# Alumni Schemas
class AlumniBase(BaseModel):
    id: str
    name: str
    graduation_year: int
    department: str
    company: str
    role: str
    achievement: str
    image_url: str

    class Config:
        from_attributes = True


# Testimonial Schemas
class TestimonialBase(BaseModel):
    id: str
    student_name: str
    department: str
    batch: str
    message: str
    rating: int
    image_url: str

    class Config:
        from_attributes = True


class CollegeProfileBase(BaseModel):
    id: str
    college_name: str
    short_description: str
    full_description: str
    established_year: int
    location: str
    affiliation: str
    approval_details: str
    website: str
    email: str
    phone: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class VisionMissionBase(BaseModel):
    id: str
    vision: str
    mission: List[str]
    core_values: List[str]
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class LeadershipBase(BaseModel):
    id: str
    name: str
    designation: str
    qualification: str
    description: str
    image_url: str
    display_order: int
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class AchievementBase(BaseModel):
    id: str
    title: str
    description: str
    category: str
    year: int
    image_url: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class AccreditationBase(BaseModel):
    id: str
    organization_name: str
    certificate_name: str
    description: str
    year: int
    image_url: str

    class Config:
        from_attributes = True


class InfrastructureBase(BaseModel):
    id: str
    title: str
    description: str
    facility_type: str
    location: str
    capacity: Optional[int] = None
    features: List[str]
    image_url: str
    video_url: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class LaboratoryBase(BaseModel):
    id: str
    lab_name: str
    department_id: str
    description: str
    equipment_details: List[str]
    software_details: List[str]
    capacity: int
    image_url: str
    video_url: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class LibraryBase(BaseModel):
    id: str
    title: str
    description: str
    book_count: int
    digital_resources: List[str]
    seating_capacity: int
    facilities: List[str]
    image_url: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class HostelBase(BaseModel):
    id: str
    hostel_type: str
    description: str
    capacity: int
    room_type: str
    facilities: List[str]
    mess_information: List[str]
    security_features: List[str]
    image_url: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class SportsFacilityBase(BaseModel):
    id: str
    sport_name: str
    description: str
    facility_details: List[str]
    image_url: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class StudentClubBase(BaseModel):
    id: str
    club_name: str
    category: str
    description: str
    activities: List[str]
    image_url: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class CampusEventBase(BaseModel):
    id: str
    event_name: str
    description: str
    event_date: str
    category: str
    image_url: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class AdmissionProcessBase(BaseModel):
    id: str
    title: str
    description: str
    step_number: int
    category: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class EligibilityCriteriaBase(BaseModel):
    id: str
    course_id: str
    qualification: str
    minimum_percentage: int
    entrance_requirement: str
    additional_requirements: List[str]
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class RequiredDocumentBase(BaseModel):
    id: str
    document_name: str
    description: str
    category: str
    mandatory: bool
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class AdmissionTimelineBase(BaseModel):
    id: str
    event_name: str
    description: str
    start_date: str
    end_date: str
    category: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class StudentEnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    phone: str = Field(..., pattern=r"^\+?[0-9]{10,15}$")
    course_interest: str
    message: str = Field(..., min_length=10, max_length=1000)


class StudentEnquiryBase(BaseModel):
    id: int
    student_name: str
    email: str
    phone: str
    course_interest: str
    message: str
    status: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class FAQBase(BaseModel):
    id: str
    question: str
    answer: str
    category: str
    display_order: int
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class ContactInformationBase(BaseModel):
    id: str
    department: str
    phone: str
    email: str
    address: str
    office_hours: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class PlacementOverviewBase(BaseModel):
    id: str
    academic_year: str
    placement_percentage: float
    total_students: int
    students_placed: int
    highest_package: float
    average_package: float
    top_recruiters: List[str]
    description: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class RecruiterCareerBase(BaseModel):
    id: str
    company_name: str
    company_logo: str
    industry: str
    description: Optional[str] = None
    website: Optional[str] = None
    hiring_roles: Optional[List[str]] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class PlacementProcessBase(BaseModel):
    id: str
    step_title: str
    description: str
    step_number: int
    icon: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class TrainingProgramBase(BaseModel):
    id: str
    title: str
    description: str
    category: str
    duration: str
    skills_covered: List[str]
    image_url: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class InternshipCareerBase(BaseModel):
    id: str
    company_name: str
    domain: str
    description: str
    duration: str
    eligibility: Optional[str] = None
    application_information: Optional[str] = None
    image_url: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class StudentSuccessStoryBase(BaseModel):
    id: str
    student_name: str
    department_id: str
    graduation_year: int
    current_company: str
    current_role: str
    story: str
    student_image: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class AlumniCareerBase(BaseModel):
    id: str
    name: str
    graduation_year: int
    department: str
    current_company: str
    designation: str
    achievement: str
    profile_image: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class CareerResourceBase(BaseModel):
    id: str
    title: str
    description: str
    resource_type: str
    link: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    is_active: Optional[bool] = True
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: str


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_role: str


class ActivityLogBase(BaseModel):
    id: int
    user_id: str
    action: str
    module: str
    description: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class KnowledgeDocumentBase(BaseModel):
    id: str
    filename: str
    category: str
    file_type: str
    upload_date: str
    status: str
    chunk_count: int
    indexed_status: bool
    file_path: Optional[str] = None
    error_message: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class KnowledgeStats(BaseModel):
    total_documents: int
    total_chunks: int
    total_embeddings: int
    last_updated: Optional[str] = None
    pinecone_status: str
    groq_status: str

