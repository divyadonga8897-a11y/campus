from sqlalchemy import Column, String, Integer, Float, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database.connection import Base

class College(Base):
    __tablename__ = "colleges"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    history = Column(JSON, nullable=True) # JSON list of timeline events
    vision = Column(String, nullable=False)
    mission = Column(JSON, nullable=False) # JSON list of mission points
    established_year = Column(Integer, nullable=False)
    location = Column(String, nullable=False)


class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, index=True)
    department_name = Column(String, nullable=False)
    short_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    head_of_department = Column(String, nullable=False)
    hod_image = Column(String, nullable=False)
    department_image = Column(String, nullable=False)
    established_year = Column(Integer, nullable=False)
    faculty_count = Column(Integer, nullable=False)
    student_count = Column(Integer, nullable=False)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)

    courses = relationship("Course", back_populates="department")


class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True)
    department_id = Column(String, ForeignKey("departments.id"), nullable=False, index=True)
    course_name = Column(String, nullable=False)
    degree_type = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    intake = Column(Integer, nullable=False)
    overview = Column(String, nullable=False)
    career_scope = Column(JSON, nullable=False) # JSON list of career options
    eligibility = Column(JSON, nullable=False) # JSON list of eligibility requirements
    course_image = Column(String, nullable=False)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)

    department = relationship("Department", back_populates="courses")
    features = relationship("CourseFeature", back_populates="course")
    fees = relationship("FeeStructure", back_populates="course")
    admission_requirements = relationship("AdmissionRequirement", back_populates="course")


class CourseFeature(Base):
    __tablename__ = "course_features"

    id = Column(String, primary_key=True, index=True)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    feature_title = Column(String, nullable=False)
    feature_description = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    display_order = Column(Integer, nullable=False)

    course = relationship("Course", back_populates="features")


class FeeStructure(Base):
    __tablename__ = "fee_structures"

    id = Column(String, primary_key=True, index=True)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False, index=True)
    academic_year = Column(String, nullable=False)
    tuition_fee = Column(Integer, nullable=False)
    hostel_fee = Column(Integer, nullable=False)
    other_charges = Column(Integer, nullable=False)
    total_fee = Column(Integer, nullable=False)
    fee_type = Column(String, nullable=False) # Government Quota, Management Quota, Scholarship Category, Other
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)

    course = relationship("Course", back_populates="fees")


class AdmissionRequirement(Base):
    __tablename__ = "admission_requirements"

    id = Column(String, primary_key=True, index=True)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    qualification = Column(String, nullable=False)
    minimum_percentage = Column(Integer, nullable=False)
    entrance_exam = Column(String, nullable=False)
    required_documents = Column(JSON, nullable=False) # JSON list of required docs
    admission_notes = Column(String, nullable=False)
    created_at = Column(String, nullable=True)

    course = relationship("Course", back_populates="admission_requirements")


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    eligibility = Column(JSON, nullable=False) # JSON list of eligibility criteria
    benefits = Column(JSON, nullable=False) # JSON list of benefits
    application_process = Column(JSON, nullable=False) # JSON list of application steps
    created_at = Column(String, nullable=True)


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # e.g. "academic", "lab", "recreation"
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    location = Column(String, nullable=False)


class Gallery(Base):
    __tablename__ = "gallery"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # e.g. "campus", "events", "labs"
    image_url = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(String, nullable=True)


class CampusLocation(Base):
    __tablename__ = "campus_locations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_url = Column(String, nullable=False)


class PlacementStatistics(Base):
    __tablename__ = "placement_statistics"

    id = Column(String, primary_key=True, index=True)
    year = Column(Integer, nullable=False)
    department_id = Column(String, nullable=True, index=True)
    students_registered = Column(Integer, nullable=True, default=0)
    students_placed = Column(Integer, nullable=False)
    placement_percentage = Column(Float, nullable=False)
    highest_package = Column(Float, nullable=False) # e.g. 12.0 for 12 LPA
    average_package = Column(Float, nullable=False) # e.g. 4.5 for 4.5 LPA
    companies_count = Column(Integer, nullable=True, default=0) # keep for legacy
    created_at = Column(String, nullable=True)


class Recruiter(Base):
    __tablename__ = "recruiters"

    id = Column(String, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True) # legacy
    company_logo = Column(String, nullable=False) # new
    industry = Column(String, nullable=False) # e.g. "IT", "Core", "Startup"
    description = Column(String, nullable=True)
    website = Column(String, nullable=True)
    hiring_roles = Column(JSON, nullable=True) # JSON list
    created_at = Column(String, nullable=True)


class Internship(Base):
    __tablename__ = "internships"

    id = Column(String, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    description = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    eligibility = Column(String, nullable=True)
    application_information = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(String, nullable=True)


class Alumni(Base):
    __tablename__ = "alumni"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    graduation_year = Column(Integer, nullable=False)
    department = Column(String, nullable=False)
    company = Column(String, nullable=True) # legacy
    role = Column(String, nullable=True) # legacy
    current_company = Column(String, nullable=False) # new
    designation = Column(String, nullable=False) # new
    achievement = Column(String, nullable=False)
    image_url = Column(String, nullable=True) # legacy
    profile_image = Column(String, nullable=False) # new
    created_at = Column(String, nullable=True)


class PlacementOverview(Base):
    __tablename__ = "placement_overview"

    id = Column(String, primary_key=True, index=True)
    academic_year = Column(String, nullable=False)
    placement_percentage = Column(Float, nullable=False)
    total_students = Column(Integer, nullable=False)
    students_placed = Column(Integer, nullable=False)
    highest_package = Column(Float, nullable=False)
    average_package = Column(Float, nullable=False)
    top_recruiters = Column(JSON, nullable=False) # JSON list
    description = Column(String, nullable=False)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)


class PlacementProcess(Base):
    __tablename__ = "placement_process"

    id = Column(String, primary_key=True, index=True)
    step_title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    step_number = Column(Integer, nullable=False)
    icon = Column(String, nullable=True)
    created_at = Column(String, nullable=True)


class TrainingProgram(Base):
    __tablename__ = "career_training"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False) # Technical Skills, Programming, Aptitude, Communication, Interview Preparation
    duration = Column(String, nullable=False)
    skills_covered = Column(JSON, nullable=False) # JSON list
    image_url = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class StudentSuccessStory(Base):
    __tablename__ = "student_success_stories"

    id = Column(String, primary_key=True, index=True)
    student_name = Column(String, nullable=False)
    department_id = Column(String, nullable=False)
    graduation_year = Column(Integer, nullable=False)
    current_company = Column(String, nullable=False)
    current_role = Column(String, nullable=False)
    story = Column(String, nullable=False)
    student_image = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class CareerResource(Base):
    __tablename__ = "career_resources"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    resource_type = Column(String, nullable=False) # Preparation Guide, Interview Tips, Skill Development, Industry Trends
    link = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(String, primary_key=True, index=True)
    student_name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    batch = Column(String, nullable=False)
    message = Column(String, nullable=False)
    rating = Column(Integer, nullable=False) # e.g. 5
    image_url = Column(String, nullable=False)


class CollegeProfile(Base):
    __tablename__ = "college_profile"

    id = Column(String, primary_key=True, index=True)
    college_name = Column(String, nullable=False)
    short_description = Column(String, nullable=False)
    full_description = Column(String, nullable=False)
    established_year = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    affiliation = Column(String, nullable=False)
    approval_details = Column(String, nullable=False)
    website = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)


class VisionMission(Base):
    __tablename__ = "vision_mission"

    id = Column(String, primary_key=True, index=True)
    vision = Column(String, nullable=False)
    mission = Column(JSON, nullable=False)
    core_values = Column(JSON, nullable=False)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)


class Leadership(Base):
    __tablename__ = "leadership"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    display_order = Column(Integer, nullable=False)
    created_at = Column(String, nullable=True)


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False) # Academic, Research, Awards, Events, Recognition
    year = Column(Integer, nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class Accreditation(Base):
    __tablename__ = "accreditations"

    id = Column(String, primary_key=True, index=True)
    organization_name = Column(String, nullable=False)
    certificate_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    image_url = Column(String, nullable=False)


class Infrastructure(Base):
    __tablename__ = "infrastructure"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    facility_type = Column(String, nullable=False) # Academic Block, Classrooms, Auditorium, Cafeteria, Transportation, Campus Area, Administrative Block
    location = Column(String, nullable=False)
    capacity = Column(Integer, nullable=True)
    features = Column(JSON, nullable=False) # JSON list of features
    image_url = Column(String, nullable=False)
    video_url = Column(String, nullable=True)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)


class Laboratory(Base):
    __tablename__ = "laboratories"

    id = Column(String, primary_key=True, index=True)
    lab_name = Column(String, nullable=False)
    department_id = Column(String, nullable=False)
    description = Column(String, nullable=False)
    equipment_details = Column(JSON, nullable=False) # JSON list of equipment
    software_details = Column(JSON, nullable=False) # JSON list of software
    capacity = Column(Integer, nullable=False)
    image_url = Column(String, nullable=False)
    video_url = Column(String, nullable=True)
    created_at = Column(String, nullable=True)


class Library(Base):
    __tablename__ = "library_information"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    book_count = Column(Integer, nullable=False)
    digital_resources = Column(JSON, nullable=False) # JSON list of digital libraries
    seating_capacity = Column(Integer, nullable=False)
    facilities = Column(JSON, nullable=False) # JSON list of reading room facilities
    image_url = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class Hostel(Base):
    __tablename__ = "hostel_information"

    id = Column(String, primary_key=True, index=True)
    hostel_type = Column(String, nullable=False) # Boys Hostel, Girls Hostel
    description = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    room_type = Column(String, nullable=False) # Double, Triple sharing
    facilities = Column(JSON, nullable=False) # JSON list of hostel facilities
    mess_information = Column(JSON, nullable=False) # JSON list of dining rules/items
    security_features = Column(JSON, nullable=False) # JSON list of security specs
    image_url = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class SportsFacility(Base):
    __tablename__ = "sports_facilities"

    id = Column(String, primary_key=True, index=True)
    sport_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    facility_details = Column(JSON, nullable=False) # JSON list of details
    image_url = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class StudentClub(Base):
    __tablename__ = "student_clubs"

    id = Column(String, primary_key=True, index=True)
    club_name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Technical, Cultural, Sports, Innovation, Social
    description = Column(String, nullable=False)
    activities = Column(JSON, nullable=False) # JSON list of activities
    image_url = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class CampusEvent(Base):
    __tablename__ = "campus_events"

    id = Column(String, primary_key=True, index=True)
    event_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    event_date = Column(String, nullable=False)
    category = Column(String, nullable=False) # Technical Events, Cultural Events, Workshops, Hackathons, Festivals
    image_url = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class AdmissionProcess(Base):
    __tablename__ = "admission_process"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    step_number = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)


class EligibilityCriteria(Base):
    __tablename__ = "eligibility_criteria"

    id = Column(String, primary_key=True, index=True)
    course_id = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    minimum_percentage = Column(Integer, nullable=False)
    entrance_requirement = Column(String, nullable=False)
    additional_requirements = Column(JSON, nullable=False) # JSON list
    created_at = Column(String, nullable=True)


class RequiredDocument(Base):
    __tablename__ = "required_documents"

    id = Column(String, primary_key=True, index=True)
    document_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    mandatory = Column(Boolean, default=True)
    created_at = Column(String, nullable=True)


class AdmissionTimeline(Base):
    __tablename__ = "admission_timeline"

    id = Column(String, primary_key=True, index=True)
    event_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=False)
    category = Column(String, nullable=False) # Application, Counselling, Document Verification, Admission Confirmation
    created_at = Column(String, nullable=True)


class StudentEnquiry(Base):
    __tablename__ = "student_enquiries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    course_interest = Column(String, nullable=False)
    message = Column(String, nullable=False)
    status = Column(String, default="New", index=True) # New, Contacted, Resolved
    created_at = Column(String, nullable=True)


class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(String, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    category = Column(String, nullable=False) # Admission, Fees, Courses, Hostel, Campus, General
    display_order = Column(Integer, nullable=False)
    created_at = Column(String, nullable=True)


class ContactInformation(Base):
    __tablename__ = "contact_information"

    id = Column(String, primary_key=True, index=True)
    department = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    address = Column(String, nullable=False)
    office_hours = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # ADMIN, CONTENT_MANAGER
    is_active = Column(Boolean, default=True)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, nullable=False)
    action = Column(String, nullable=False)
    module = Column(String, nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(String, nullable=True)


class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    category = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    upload_date = Column(String, nullable=False)
    status = Column(String, nullable=False) # "Processing", "Indexed", "Failed"
    chunk_count = Column(Integer, default=0)
    indexed_status = Column(Boolean, default=False)
    file_path = Column(String, nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)


class SearchHistory(Base):
    __tablename__ = "search_histories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    query = Column(String, nullable=False)
    response = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)


class Admin(Base):
    __tablename__ = "admins"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="super_admin") # super_admin, etc.
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)

    @property
    def is_active(self) -> bool:
        return True


class WhatsappChatSession(Base):
    __tablename__ = "whatsapp_chat_sessions"

    phone_number = Column(String, primary_key=True, index=True)
    history = Column(JSON, nullable=False, default=list)  # List of message roles & content
    last_interaction = Column(String, nullable=False)
    session_context = Column(JSON, nullable=True, default=dict)


class WhatsappMessageLog(Base):
    __tablename__ = "whatsapp_message_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phone_number = Column(String, nullable=False, index=True)
    query = Column(String, nullable=False)
    response = Column(String, nullable=True)
    status = Column(String, nullable=False)  # "Success", "Failed"
    timestamp = Column(String, nullable=False)
    latency = Column(Float, nullable=True)  # in seconds


