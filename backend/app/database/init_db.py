from sqlalchemy.orm import Session
from app.database.connection import engine, Base
from app.models.models import (
    College, Department, Course, FeeStructure, Scholarship, Facility, Gallery, CampusLocation,
    PlacementStatistics, Recruiter, Internship, Alumni, Testimonial,
    CollegeProfile, VisionMission, Leadership, Achievement, Accreditation,
    CourseFeature, AdmissionRequirement,
    Infrastructure, Laboratory, Library, Hostel, SportsFacility, StudentClub, CampusEvent,
    AdmissionProcess, EligibilityCriteria, RequiredDocument, AdmissionTimeline, StudentEnquiry, FAQ, ContactInformation,
    PlacementOverview, PlacementProcess, TrainingProgram, StudentSuccessStory, CareerResource, User, ActivityLog, KnowledgeDocument, Admin, SearchHistory,
    WhatsappChatSession, WhatsappMessageLog
)

def init_db(db: Session):
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # Dynamic migration helper: Add error_message column if missing in database
    try:
        from sqlalchemy import text
        if engine.name == "postgresql":
            db.execute(text("ALTER TABLE knowledge_documents ADD COLUMN IF NOT EXISTS error_message VARCHAR"))
        else: # sqlite
            cursor = db.execute(text("PRAGMA table_info(knowledge_documents)"))
            columns = [row[1] for row in cursor.fetchall()]
            if "error_message" not in columns:
                db.execute(text("ALTER TABLE knowledge_documents ADD COLUMN error_message VARCHAR"))
        db.commit()
        print("[Init-DB] Database schema migration for error_message column completed successfully.")
    except Exception as alter_err:
        print(f"[Init-DB] Warning: Could not run schema migration: {alter_err}")

    # Check if college data exists; if not, seed it
    if db.query(College).first() is None:
        # Seed College Info
        college = College(
            id="ssiet",
            name="Sri Satya Institute of Engineering and Technology",
            description="Sri Satya Institute of Engineering and Technology is a premier engineering institution dedicated to nurturing talent, fostering innovation, and preparing students for the challenges of a technology-driven world. With state-of-the-art facilities and industry-aligned curriculum, we shape the engineers of tomorrow.",
            established_year=2000,
            location="Andhra Pradesh, India",
            vision="To be a globally recognized institution of excellence in engineering education, research, and innovation, producing competent professionals with strong ethical values.",
            mission=[
                "Provide quality technical education with industry-aligned curriculum",
                "Foster a culture of research, innovation, and entrepreneurship",
                "Develop professionally competent and socially responsible engineers",
                "Build strong industry-academia partnerships for real-world learning",
                "Promote ethical values, leadership skills, and holistic development",
            ],
            history=[
                {"year": 2000, "title": "College Establishment", "description": "Founded with a vision to provide quality engineering education."},
                {"year": 2004, "title": "Infrastructure Expansion", "description": "Major campus expansion with new academic blocks and labs."},
                {"year": 2008, "title": "New Engineering Departments", "description": "Launch of specialized programs in ECE, Mech, and Civil."},
                {"year": 2012, "title": "Industry Collaborations", "description": "Strategic partnerships with leading IT and manufacturing firms."},
                {"year": 2016, "title": "AI & Innovation Hub", "description": "Established cutting-edge AI and Data Science lab."},
                {"year": 2020, "title": "Digital Transformation", "description": "Smart classrooms and online learning platforms launched."},
                {"year": 2024, "title": "Centre of Excellence", "description": "Accredited with NAAC high-grade certifications."}
            ]
        )
        db.add(college)

        # Seed Departments
        depts = [
            Department(
                id="cse",
                department_name="Computer Science and Engineering",
                short_name="CSE",
                description="The CSE department offers a comprehensive curriculum covering algorithms, data structures, operating systems, networks, and modern software development practices.",
                head_of_department="Dr. Ramesh Kumar",
                hod_image="/images/alumni/success-story.webp",
                department_image="/images/campus/main-building.webp",
                established_year=2000,
                faculty_count=25,
                student_count=600,
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Department(
                id="aids",
                department_name="Artificial Intelligence and Data Science",
                short_name="AIDS",
                description="A future-focused department dedicated to the science of intelligent systems, big data analytics, and machine learning technologies that power the modern world.",
                head_of_department="Dr. Priya Sharma",
                hod_image="/images/alumni/career-growth.webp",
                department_image="/images/campus/ai-lab.webp",
                established_year=2021,
                faculty_count=18,
                student_count=360,
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Department(
                id="ece",
                department_name="Electronics and Communication Engineering",
                short_name="ECE",
                description="The ECE department trains students in the design of electronic circuits, communication systems, signal processing, and embedded technologies.",
                head_of_department="Dr. Vijay Rao",
                hod_image="/images/alumni/success-story.webp",
                department_image="/images/campus/academic-block.webp",
                established_year=2000,
                faculty_count=22,
                student_count=480,
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Department(
                id="mech",
                department_name="Mechanical Engineering",
                short_name="MECH",
                description="A classical yet evolving engineering discipline that covers thermodynamics, manufacturing, CAD/CAM, robotics, and sustainable energy systems.",
                head_of_department="Dr. Srinivas Rao",
                hod_image="/images/alumni/success-story.webp",
                department_image="/images/campus/sports.webp",
                established_year=2005,
                faculty_count=20,
                student_count=240,
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Department(
                id="civil",
                department_name="Civil Engineering",
                short_name="CIVIL",
                description="Civil Engineering at SSIET focuses on structural analysis, transportation, geotechnical engineering, environmental studies, and sustainable infrastructure development.",
                head_of_department="Dr. Lakshmi Devi",
                hod_image="/images/alumni/career-growth.webp",
                department_image="/images/campus/main-building.webp",
                established_year=2008,
                faculty_count=18,
                student_count=180,
                created_at="2026-07-28",
                updated_at="2026-07-28"
            )
        ]
        db.add_all(depts)

        # Seed Courses
        courses = [
            Course(
                id="b-tech-cse",
                department_id="cse",
                course_name="B.Tech Computer Science and Engineering",
                degree_type="B.Tech",
                duration="4 Years",
                intake=120,
                overview="Bachelor of Technology in Computer Science Engineering is a 4-year undergraduate program covering core computer science fundamentals and cutting-edge technologies like software development, full stack, cloud, and systems computing.",
                career_scope=["Software Engineer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "System Architect", "IT Consultant"],
                eligibility=["10+2 / Intermediate with Mathematics, Physics & Chemistry", "Minimum 60% aggregate in qualifying examination", "Valid EAPCET (EAMCET) / JEE Rank"],
                course_image="/images/campus/main-building.webp",
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Course(
                id="b-tech-aids",
                department_id="aids",
                course_name="B.Tech AI & Data Science",
                degree_type="B.Tech",
                duration="4 Years",
                intake=60,
                overview="B.Tech in Artificial Intelligence and Data Science is a specialized program designed to meet the growing global demand for machine learning professionals, big data engineers, and AI research developers.",
                career_scope=["AI Engineer", "Data Scientist", "ML Architect", "Research Scientist", "Business Intelligence Analyst", "AI Product Manager"],
                eligibility=["10+2 / Intermediate with Mathematics, Physics & Chemistry", "Minimum 60% aggregate in qualifying examination", "Valid EAPCET (EAMCET) / JEE Rank"],
                course_image="/images/campus/ai-lab.webp",
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Course(
                id="b-tech-ece",
                department_id="ece",
                course_name="B.Tech Electronics & Communication Engineering",
                degree_type="B.Tech",
                duration="4 Years",
                intake=120,
                overview="B.Tech in Electronics and Communication Engineering provides a strong foundation in electronic devices, communication protocols, cellular networks, VLSI chip design, and microcontrollers.",
                career_scope=["Electronics Engineer", "Telecom Analyst", "VLSI Designer", "Embedded System Developer", "RF Engineer", "Hardware Engineer"],
                eligibility=["10+2 / Intermediate with Mathematics, Physics & Chemistry", "Minimum 60% aggregate in qualifying examination", "Valid EAPCET (EAMCET) / JEE Rank"],
                course_image="/images/campus/academic-block.webp",
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Course(
                id="b-tech-mech",
                department_id="mech",
                course_name="B.Tech Mechanical Engineering",
                degree_type="B.Tech",
                duration="4 Years",
                intake=60,
                overview="B.Tech in Mechanical Engineering is a comprehensive program covering thermodynamics, fluid machinery, industrial production, CAD/CAM designing, and autonomous robotics.",
                career_scope=["Mechanical Engineer", "CAD Designer", "Production Manager", "Quality Control Inspector", "Robotics Specialist"],
                eligibility=["10+2 / Intermediate with Mathematics, Physics & Chemistry", "Minimum 60% aggregate in qualifying examination", "Valid EAPCET (EAMCET) / JEE Rank"],
                course_image="/images/campus/sports.webp",
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Course(
                id="b-tech-civil",
                department_id="civil",
                course_name="B.Tech Civil Engineering",
                degree_type="B.Tech",
                duration="4 Years",
                intake=60,
                overview="B.Tech Civil Engineering provides in-depth knowledge of structural engineering, soil mechanics, environmental engineering, smart city architectures, and bridge designing.",
                career_scope=["Structural Engineer", "Site Supervisor", "Urban Planner", "Geotechnical Engineer", "Project Estimator"],
                eligibility=["10+2 / Intermediate with Mathematics, Physics & Chemistry", "Minimum 60% aggregate in qualifying examination", "Valid EAPCET (EAMCET) / JEE Rank"],
                course_image="/images/campus/main-building.webp",
                created_at="2026-07-28",
                updated_at="2026-07-28"
            )
        ]
        db.add_all(courses)

        # Seed Course Features
        features = [
            # CSE
            CourseFeature(id="feat-cse-1", course_id="b-tech-cse", feature_title="Industry-Oriented Curriculum", feature_description="Designed in consultation with top technology firms, aligning lessons directly with current market tools.", icon="Code2", display_order=1),
            CourseFeature(id="feat-cse-2", course_id="b-tech-cse", feature_title="Advanced Smart Labs", feature_description="High-speed developer boxes running GPU configurations and modern systems.", icon="Cpu", display_order=2),
            CourseFeature(id="feat-cse-3", course_id="b-tech-cse", feature_title="Global Hackathons", feature_description="Active coding culture that supports participation in national/international software contests.", icon="Trophy", display_order=3),
            
            # AIDS
            CourseFeature(id="feat-aids-1", course_id="b-tech-aids", feature_title="AI Research Lab", feature_description="Dedicated workspace with powerful servers to run neural models and big-data computations.", icon="Brain", display_order=1),
            CourseFeature(id="feat-aids-2", course_id="b-tech-aids", feature_title="ML Project Internships", feature_description="Collaborative research opportunities with leading data consultancies in AI solutions.", icon="Microscope", display_order=2),
            
            # ECE
            CourseFeature(id="feat-ece-1", course_id="b-tech-ece", feature_title="VLSI Design Labs", feature_description="Specialized silicon design tools for embedded architectures and printed circuit prototyping.", icon="Settings", display_order=1),
            CourseFeature(id="feat-ece-2", course_id="b-tech-ece", feature_title="IoT & 5G Systems", feature_description="Equipped with spectrum analyzers and wireless microcontrollers for communications research.", icon="Cpu", display_order=2),

            # MECH
            CourseFeature(id="feat-mech-1", course_id="b-tech-mech", feature_title="Robotics & CAD/CAM Labs", feature_description="Prototyping automated parts with advanced CNC tooling and computer-aided layout planning.", icon="Settings", display_order=1),

            # CIVIL
            CourseFeature(id="feat-civil-1", course_id="b-tech-civil", feature_title="Smart Infrastructure", feature_description="Focusing on sustainable, eco-friendly concrete systems and GIS satellite mapping protocols.", icon="Building", display_order=1)
        ]
        db.add_all(features)

        # Seed Fee Structures
        fees = [
            # CSE
            FeeStructure(id="fee-cse-gov", course_id="b-tech-cse", academic_year="2024-25", tuition_fee=85000, hostel_fee=55000, other_charges=10000, total_fee=150000, fee_type="Government Quota", created_at="2026-07-28", updated_at="2026-07-28"),
            FeeStructure(id="fee-cse-mgmt", course_id="b-tech-cse", academic_year="2024-25", tuition_fee=185000, hostel_fee=55000, other_charges=15000, total_fee=255000, fee_type="Management Quota", created_at="2026-07-28", updated_at="2026-07-28"),
            FeeStructure(id="fee-cse-schol", course_id="b-tech-cse", academic_year="2024-25", tuition_fee=42500, hostel_fee=55000, other_charges=10000, total_fee=107500, fee_type="Scholarship Category", created_at="2026-07-28", updated_at="2026-07-28"),
            
            # AIDS
            FeeStructure(id="fee-aids-gov", course_id="b-tech-aids", academic_year="2024-25", tuition_fee=90000, hostel_fee=55000, other_charges=10000, total_fee=155000, fee_type="Government Quota", created_at="2026-07-28", updated_at="2026-07-28"),
            FeeStructure(id="fee-aids-mgmt", course_id="b-tech-aids", academic_year="2024-25", tuition_fee=190000, hostel_fee=55000, other_charges=15000, total_fee=260000, fee_type="Management Quota", created_at="2026-07-28", updated_at="2026-07-28"),

            # ECE
            FeeStructure(id="fee-ece-gov", course_id="b-tech-ece", academic_year="2024-25", tuition_fee=80000, hostel_fee=55000, other_charges=10000, total_fee=145000, fee_type="Government Quota", created_at="2026-07-28", updated_at="2026-07-28"),
            FeeStructure(id="fee-ece-mgmt", course_id="b-tech-ece", academic_year="2024-25", tuition_fee=170000, hostel_fee=55000, other_charges=15000, total_fee=240000, fee_type="Management Quota", created_at="2026-07-28", updated_at="2026-07-28"),

            # MECH
            FeeStructure(id="fee-mech-gov", course_id="b-tech-mech", academic_year="2024-25", tuition_fee=78000, hostel_fee=55000, other_charges=8000, total_fee=141000, fee_type="Government Quota", created_at="2026-07-28", updated_at="2026-07-28"),
            FeeStructure(id="fee-mech-mgmt", course_id="b-tech-mech", academic_year="2024-25", tuition_fee=150000, hostel_fee=55000, other_charges=10000, total_fee=215000, fee_type="Management Quota", created_at="2026-07-28", updated_at="2026-07-28"),

            # CIVIL
            FeeStructure(id="fee-civil-gov", course_id="b-tech-civil", academic_year="2024-25", tuition_fee=75000, hostel_fee=55000, other_charges=8000, total_fee=138000, fee_type="Government Quota", created_at="2026-07-28", updated_at="2026-07-28"),
            FeeStructure(id="fee-civil-mgmt", course_id="b-tech-civil", academic_year="2024-25", tuition_fee=140000, hostel_fee=55000, other_charges=10000, total_fee=205000, fee_type="Management Quota", created_at="2026-07-28", updated_at="2026-07-28")
        ]
        db.add_all(fees)

        # Seed Admission Requirements
        admissions = [
            AdmissionRequirement(
                id="adm-req-cse",
                course_id="b-tech-cse",
                qualification="10+2 / Intermediate MPC stream or equivalent from a recognized board.",
                minimum_percentage=60,
                entrance_exam="AP EAPCET (EAMCET) / JEE Main",
                required_documents=["10th Standard Marks Memo", "Intermediate Marks Memo (10+2)", "Transfer Certificate (TC)", "Study & Conduct Certificate (6th to 12th)", "EAMCET Rank Card & Hall Ticket", "Aadhaar Card", "Income Certificate (for fee concessions)", "Recent Passport Photos"],
                admission_notes="70% of seats are allocated via government counseling (Category-A) based on state rank. 30% of seats are reserved under management quota (Category-B) allocated on academic merit.",
                created_at="2026-07-28"
            ),
            AdmissionRequirement(
                id="adm-req-aids",
                course_id="b-tech-aids",
                qualification="10+2 / Intermediate MPC stream or equivalent from a recognized board.",
                minimum_percentage=60,
                entrance_exam="AP EAPCET (EAMCET) / JEE Main",
                required_documents=["10th Standard Marks Memo", "Intermediate Marks Memo (10+2)", "Transfer Certificate (TC)", "EAMCET Rank Card", "Aadhaar Card", "Income Certificate", "Passport Photos"],
                admission_notes="Eligible candidates must participate in the AP EAPCET counseling process or contact the administration desk directly for management seat reservations.",
                created_at="2026-07-28"
            ),
            AdmissionRequirement(
                id="adm-req-ece",
                course_id="b-tech-ece",
                qualification="10+2 / Intermediate MPC stream or equivalent from a recognized board.",
                minimum_percentage=60,
                entrance_exam="AP EAPCET (EAMCET) / JEE Main",
                required_documents=["10th Standard Marks Memo", "Intermediate Marks Memo (10+2)", "Transfer Certificate (TC)", "EAMCET Rank Card", "Aadhaar Card", "Passport Photos"],
                admission_notes="Seat allocation follows board directives, distributing seats across Convener Quota and Management quota merit filters.",
                created_at="2026-07-28"
            ),
            AdmissionRequirement(
                id="adm-req-mech",
                course_id="b-tech-mech",
                qualification="10+2 / Intermediate MPC stream or equivalent.",
                minimum_percentage=55,
                entrance_exam="AP EAPCET (EAMCET) / JEE Main",
                required_documents=["10th Marks Memo", "Intermediate Marks Memo", "TC", "EAMCET Rank Card", "Aadhaar Card"],
                admission_notes="Lateral entry options are open for Diploma students into 2nd year B.Tech based on ECET state ranks.",
                created_at="2026-07-28"
            ),
            AdmissionRequirement(
                id="adm-req-civil",
                course_id="b-tech-civil",
                qualification="10+2 / Intermediate MPC stream or equivalent.",
                minimum_percentage=55,
                entrance_exam="AP EAPCET (EAMCET) / JEE Main",
                required_documents=["10th Marks Memo", "Intermediate Marks Memo", "TC", "EAMCET Rank Card", "Aadhaar Card"],
                admission_notes="Lateral entry is available for eligible Diploma candidates through state ECET rankings.",
                created_at="2026-07-28"
            )
        ]
        db.add_all(admissions)

        # Seed Scholarships
        scholarships = [
            Scholarship(
                id="merit-scholarship",
                title="Merit Excellence Scholarship",
                description="Awarded annually to top-performing academic candidates to promote excellence in engineering.",
                eligibility=["Minimum 90% aggregate score in Intermediate (10+2)", "EAPCET rank under 10,000", "Consistent performance (CGPA > 8.0) in subsequent years"],
                benefits=["50% tuition fee waiver for convener quota seats", "Direct research mentorship with senior deans", "Access to innovation incubator funding"],
                application_process=["Submit the Merit Concession form at the admission cell", "Provide EAMCET rank card and 10+2 mark statements during counseling verification", "Review updates on the college portal"],
                created_at="2026-07-28"
            ),
            Scholarship(
                id="sc-st-scholarship",
                title="SC/ST Government fee reimbursement",
                description="Government scholarship support to aid lower socio-economic backgrounds in technical education.",
                eligibility=["Valid SC/ST/BC community certificate", "Annual parental income below 2.5 Lakhs INR"],
                benefits=["100% tuition fee waiver covered by social welfare department", "Special hostel fee concessions", "Book-bank services from library"],
                application_process=["Apply through the Jnanabhumi state portal after securing admission", "Submit local caste certificate, income card, and bank account details", "Verification is conducted by social welfare officers"],
                created_at="2026-07-28"
            ),
            Scholarship(
                id="pragati-scholarship",
                title="Pragati Scholarship for Female Engineers",
                description="AICTE sponsored national aid scheme supporting female candidates in engineering paths.",
                eligibility=["Only female students enrolled in 1st year B.Tech", "Family income under 8 Lakhs INR"],
                benefits=["Fixed annual credit of 50,000 INR toward college fees or materials purchase"],
                application_process=["Apply on the National Scholarship Portal (NSP)", "Upload college bonafide letter and fee paid receipts", "Get verification from college principal portal"],
                created_at="2026-07-28"
            )
        ]
        db.add_all(scholarships)

    # Seed Campus locations if empty
    if db.query(CampusLocation).first() is None:
        locations = [
            CampusLocation(
                id="entrance",
                name="Main Entrance",
                description="The welcoming entry point to Sri Satya Institute, featuring the administrative gatehouse and landscaped plaza leading to reception.",
                latitude=15.0,
                longitude=25.0,
                image_url="/images/campus/main-building.webp"
            ),
            CampusLocation(
                id="academic",
                name="Academic Block",
                description="The central academic zone comprising modern classrooms, faculty workspaces, and seminar rooms for core courses.",
                latitude=35.0,
                longitude=45.0,
                image_url="/images/campus/academic-block.webp"
            ),
            CampusLocation(
                id="cs-block",
                name="Computer Science Block",
                description="The advanced digital computing block hosting premium coding chambers, networks research labs, and GPU AI pods.",
                latitude=50.0,
                longitude=30.0,
                image_url="/images/campus/ai-lab.webp"
            ),
            CampusLocation(
                id="library",
                name="Central Library",
                description="A massive multi-level digital resource vault equipped with reading rooms, online journal stations, and discussion bays.",
                latitude=25.0,
                longitude=65.0,
                image_url="/images/campus/library.webp"
            ),
            CampusLocation(
                id="hostel",
                name="Hostel Block",
                description="Fully equipped housing zones featuring secure rooms, dining services, recreation spaces, and green study yards.",
                latitude=75.0,
                longitude=55.0,
                image_url="/images/hostel/hostel-room.webp"
            ),
            CampusLocation(
                id="sports",
                name="Sports Arena",
                description="An expansive athletics zone hosting cricket fields, basketball courts, and indoor gymnasiums.",
                latitude=60.0,
                longitude=80.0,
                image_url="/images/campus/sports.webp"
            )
        ]
        db.add_all(locations)

    # Seed Facilities if empty
    if db.query(Facility).first() is None:
        facilities = [
            Facility(
                id="smart-classrooms",
                name="Smart Classrooms",
                category="academic",
                description="Equipped with interactive visualizers, modern audio setups, and digital whiteboards to enable high-quality blended learning.",
                image_url="/images/campus/academic-block.webp",
                location="Academic Block"
            ),
            Facility(
                id="ai-labs",
                name="Artificial Intelligence Labs",
                category="lab",
                description="High-performance computing workstations featuring NVIDIA GPUs to support deep learning, computer vision, and NLP student projects.",
                image_url="/images/campus/ai-lab.webp",
                location="Computer Science Block"
            ),
            Facility(
                id="programming-labs",
                name="Computer Laboratories",
                category="lab",
                description="Fully networked computer labs running developer tools and software engineering platforms for algorithms and database research.",
                image_url="/images/campus/ai-lab.webp",
                location="Computer Science Block"
            ),
            Facility(
                id="central-library",
                name="Central Library",
                category="library",
                description="Housing 50,000+ volumes, scientific journals, and online access portals to digital catalogs like IEEE and Springer.",
                image_url="/images/campus/library.webp",
                location="Library Building"
            ),
            Facility(
                id="innovation-center",
                name="Innovation Center",
                category="innovation",
                description="Incubation spaces, hackathon zones, and mentor hubs to support student-led startup development and research experiments.",
                image_url="/images/campus/events.webp",
                location="Administrative Wing"
            )
        ]
        db.add_all(facilities)

    # Seed Gallery if empty
    if db.query(Gallery).first() is None:
        gallery_items = [
            Gallery(id="gal-1", title="Cinematic Campus Aerial", category="campus", image_url="/images/campus/main-building.webp", description="Aerial view of Sri Satya Institute green campus lawns.", created_at="2026-07-28"),
            Gallery(id="gal-2", title="Modern Academic Block", category="campus", image_url="/images/campus/academic-block.webp", description="Main entrance to the state-of-the-art engineering block.", created_at="2026-07-28"),
            Gallery(id="gal-3", title="AI Deep Learning Lab", category="labs", image_url="/images/campus/ai-lab.webp", description="Students collaborating on deep learning research projects.", created_at="2026-07-28"),
            Gallery(id="gal-4", title="Spacious Central Library", category="labs", image_url="/images/campus/library.webp", description="Comfortable reading cabins and computer reference sections.", created_at="2026-07-28"),
            Gallery(id="gal-5", title="Smart Smart Classrooms", category="labs", image_url="/images/campus/academic-block.webp", description="Interactive digital classroom environment in progress.", created_at="2026-07-28"),
            Gallery(id="gal-6", title="National Hackathon Finals", category="events", image_url="/images/student-life/coding.webp", description="Tech-savvy minds solving real-world challenges at the annual event.", created_at="2026-07-28"),
            Gallery(id="gal-7", title="College Annual Cultural Fest", category="events", image_url="/images/student-life/events.webp", description="A lively stage event showcasing student artistic talents.", created_at="2026-07-28"),
            Gallery(id="gal-8", title="Inter-College Football Finals", category="student_life", image_url="/images/campus/sports.webp", description="Our college football team celebrating a league victory.", created_at="2026-07-28"),
            Gallery(id="gal-9", title="Modern Hostel Quadrangle", category="campus", image_url="/images/hostel/hostel-room.webp", description="Green courtyards and study spaces inside the hostel wings.", created_at="2026-07-28"),
            Gallery(id="gal-10", title="Spacious Student Dining Mess", category="student_life", image_url="/images/hostel/mess.webp", description="Clean and hygienic dining services for hostel students.", created_at="2026-07-28"),
            Gallery(id="gal-11", title="Robotics Project Exhibition", category="achievements", image_url="/images/student-life/coding.webp", description="Students showcasing autonomous drone prototypes.", created_at="2026-07-28"),
            Gallery(id="gal-12", title="Best Engineering College Award", category="achievements", image_url="/images/campus/main-building.webp", description="Receiving academic excellence awards from state council representatives.", created_at="2026-07-28")
        ]
        db.add_all(gallery_items)

    # Seed Placement Statistics if empty
    if db.query(PlacementStatistics).first() is None:
        stats = [
            PlacementStatistics(
                id="stat-2022",
                year=2022,
                department_id="cse",
                students_registered=330,
                students_placed=295,
                placement_percentage=89.0,
                highest_package=10.5,
                average_package=4.2,
                companies_count=85,
                created_at="2026-07-28"
            ),
            PlacementStatistics(
                id="stat-2023",
                year=2023,
                department_id="cse",
                students_registered=340,
                students_placed=312,
                placement_percentage=92.0,
                highest_package=12.0,
                average_package=4.5,
                companies_count=98,
                created_at="2026-07-28"
            ),
            PlacementStatistics(
                id="stat-2024",
                year=2024,
                department_id="cse",
                students_registered=360,
                students_placed=338,
                placement_percentage=94.0,
                highest_package=14.5,
                average_package=5.1,
                companies_count=112,
                created_at="2026-07-28"
            )
        ]
        db.add_all(stats)

    # Seed Recruiters if empty
    if db.query(Recruiter).first() is None:
        recruiters = [
            Recruiter(
                id="rec-tcs",
                company_name="TCS",
                logo_url="/images/recruiters/tcs.webp",
                company_logo="/images/recruiters/tcs.webp",
                industry="IT",
                description="Tata Consultancy Services - A global leader in IT services, consulting, and business solutions.",
                website="https://www.tcs.com",
                hiring_roles=["Systems Engineer", "Developer Associate"],
                created_at="2026-07-28"
            ),
            Recruiter(
                id="rec-infosys",
                company_name="Infosys",
                logo_url="/images/recruiters/infosys.webp",
                company_logo="/images/recruiters/infosys.webp",
                industry="IT",
                description="Infosys - A global leader in next-generation digital services and consulting.",
                website="https://www.infosys.com",
                hiring_roles=["Systems Engineer", "Power Programmer"],
                created_at="2026-07-28"
            ),
            Recruiter(
                id="rec-wipro",
                company_name="Wipro",
                logo_url="/images/recruiters/wipro.webp",
                company_logo="/images/recruiters/wipro.webp",
                industry="IT",
                description="Wipro Limited - A leading technology services and consulting company.",
                website="https://www.wipro.com",
                hiring_roles=["Project Engineer", "Software Analyst"],
                created_at="2026-07-28"
            ),
            Recruiter(
                id="rec-accenture",
                company_name="Accenture",
                logo_url="/images/recruiters/accenture.webp",
                company_logo="/images/recruiters/accenture.webp",
                industry="IT",
                description="Accenture - A global professional services company with leading capabilities in digital, cloud, and security.",
                website="https://www.accenture.com",
                hiring_roles=["Associate Software Engineer", "Data Analyst"],
                created_at="2026-07-28"
            ),
            Recruiter(
                id="rec-cognizant",
                company_name="Cognizant",
                logo_url="/images/recruiters/cognizant.webp",
                company_logo="/images/recruiters/cognizant.webp",
                industry="IT",
                description="Cognizant - An American multinational information technology services and consulting company.",
                website="https://www.cognizant.com",
                hiring_roles=["Programmer Analyst", "Graduate Trainee"],
                created_at="2026-07-28"
            ),
            Recruiter(
                id="rec-techm",
                company_name="Tech Mahindra",
                logo_url="/images/recruiters/techm.webp",
                company_logo="/images/recruiters/techm.webp",
                industry="IT",
                description="Tech Mahindra - A leading provider of digital transformation, consulting, and business re-engineering services.",
                website="https://www.techmahindra.com",
                hiring_roles=["Software Engineer", "Technical Support"],
                created_at="2026-07-28"
            )
        ]
        db.add_all(recruiters)

    # Seed Internships if empty
    if db.query(Internship).first() is None:
        internships = [
            Internship(
                id="intern-1",
                company_name="TCS iON",
                domain="Software Engineering",
                duration="3 Months",
                description="Industry virtual internships focusing on Java development, software testing methodologies, and agile project execution.",
                eligibility="B.Tech 3rd/4th Year students with no active backlogs.",
                application_information="Apply via SSIET Placement Office.",
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            ),
            Internship(
                id="intern-2",
                company_name="AWS Academy",
                domain="Cloud Computing",
                duration="6 Months",
                description="Cloud architecture internships covering AWS services, VPC designs, cloud security configurations, and serverless compute pipelines.",
                eligibility="B.Tech 3rd/4th Year students with no active backlogs.",
                application_information="Apply via SSIET Placement Office.",
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            ),
            Internship(
                id="intern-3",
                company_name="Verzeo AI",
                domain="Machine Learning",
                duration="3 Months",
                description="Machine learning project internships covering predictive data analytics, regression modeling, and computer vision algorithms.",
                eligibility="B.Tech 3rd/4th Year students with no active backlogs.",
                application_information="Apply via SSIET Placement Office.",
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            ),
            Internship(
                id="intern-4",
                company_name="DRDO",
                domain="Defense Research",
                duration="6 Months",
                description="Government research internships allowing students to collaborate on embedded systems and telemetry data processing models.",
                eligibility="B.Tech 4th Year students with CGPA >= 7.5.",
                application_information="Apply via SSIET Placement Office.",
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(internships)

    # Seed Alumni if empty
    if db.query(Alumni).first() is None:
        alumni_list = [
            Alumni(
                id="al-1",
                name="Siddharth Verma",
                graduation_year=2021,
                department="Computer Science Engineering",
                company="Microsoft",
                role="Software Engineer",
                current_company="Microsoft",
                designation="Software Engineer",
                achievement="Led development of cloud storage optimization sub-modules within the Azure infrastructure wing.",
                image_url="/images/alumni/success-story.webp",
                profile_image="/images/alumni/success-story.webp",
                created_at="2026-07-28"
            ),
            Alumni(
                id="al-2",
                name="Ananya Hegde",
                graduation_year=2022,
                department="Artificial Intelligence & Data Science",
                company="Amazon",
                role="Data Scientist",
                current_company="Amazon",
                designation="Data Scientist",
                achievement="Built predictive product recommendation models scaling up conversion rates in Amazon retail systems by 8%.",
                image_url="/images/alumni/career-growth.webp",
                profile_image="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            ),
            Alumni(
                id="al-3",
                name="Rahul Nair",
                graduation_year=2020,
                department="Electronics & Communication Engineering",
                company="Qualcomm",
                role="VLSI Design Engineer",
                current_company="Qualcomm",
                designation="VLSI Design Engineer",
                achievement="Contributed to circuit validation testing loops for Snapdragon 5G baseband processing modules.",
                image_url="/images/alumni/success-story.webp",
                profile_image="/images/alumni/success-story.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(alumni_list)

    # Seed Testimonials if empty
    if db.query(Testimonial).first() is None:
        testimonials = [
            Testimonial(
                id="test-1",
                student_name="Nikhil Reddy",
                department="Computer Science Engineering",
                batch="2020-2024",
                message="SSIET's placement cell and bootcamps prepared me thoroughly for mock interviews. The coding clubs and faculty mentoring helped me land a Software Engineer role at a top IT firm.",
                rating=5,
                image_url="/images/alumni/success-story.webp"
            ),
            Testimonial(
                id="test-2",
                student_name="Divya Sri",
                department="Artificial Intelligence & Data Science",
                batch="2020-2024",
                message="The curriculum in the AI & DS department is perfectly aligned with industry needs. I was able to secure a Data Analyst internship which transitioned into a full-time role during campus drives.",
                rating=5,
                image_url="/images/alumni/career-growth.webp"
            ),
            Testimonial(
                id="test-3",
                student_name="Pavan Kalyan",
                department="Electronics & Communication Engineering",
                batch="2019-2023",
                message="The VLSI and embedded labs at SSIET gave me rich practical experience. I'm thankful to my professors who guided me to secure a placement at an premium electronics firm.",
                rating=5,
                image_url="/images/alumni/success-story.webp"
            )
        ]
        db.add_all(testimonials)

    # Seed CollegeProfile if empty
    if db.query(CollegeProfile).first() is None:
        profile = CollegeProfile(
            id="ssiet-profile",
            college_name="Sri Satya Institute of Engineering and Technology",
            short_description="SSIET is a premier engineering institution dedicated to nurturing talent and fostering innovation.",
            full_description="Sri Satya Institute of Engineering and Technology is a premier engineering institution dedicated to nurturing talent, fostering innovation, and preparing students for the challenges of a technology-driven world. With state-of-the-art facilities and industry-aligned curriculum, we shape the engineers of tomorrow. Located in West Godavari, Andhra Pradesh, the college provides a holistic learning experience.",
            established_year=2000,
            location="West Godavari, Andhra Pradesh, India",
            affiliation="Affiliated to Jawaharlal Nehru Technological University (JNTU)",
            approval_details="Approved by AICTE, New Delhi",
            website="www.ssiet.ac.in",
            email="info@ssiet.ac.in",
            phone="+91 9000-000-000",
            created_at="2026-07-28",
            updated_at="2026-07-28"
        )
        db.add(profile)

    # Seed VisionMission if empty
    if db.query(VisionMission).first() is None:
        vision_mission = VisionMission(
            id="ssiet-vision-mission",
            vision="To be a globally recognized institution of excellence in engineering education, research, and innovation, producing competent professionals with strong ethical values.",
            mission=[
                "Provide quality technical education with industry-aligned curriculum",
                "Foster a culture of research, innovation, and entrepreneurship",
                "Develop professionally competent and socially responsible engineers",
                "Build strong industry-academia partnerships for real-world learning",
                "Promote ethical values, leadership skills, and holistic development"
            ],
            core_values=["Innovation", "Excellence", "Integrity", "Leadership", "Research Focus"],
            created_at="2026-07-28",
            updated_at="2026-07-28"
        )
        db.add(vision_mission)

    # Seed Leadership if empty
    if db.query(Leadership).first() is None:
        leadership_team = [
            Leadership(
                id="ldr-chairman",
                name="Sri K. Satyanarayana",
                designation="Chairman",
                qualification="M.S. (USA)",
                description="A visionary educationist with over 25 years of experience in establishing premier institutions. Dedicated to fostering innovation and holistic student growth.",
                image_url="/images/alumni/success-story.webp",
                display_order=1,
                created_at="2026-07-28"
            ),
            Leadership(
                id="ldr-principal",
                name="Dr. Ramesh Kumar",
                designation="Principal",
                qualification="Ph.D, M.Tech (IIT Madras)",
                description="An esteemed academician and administrator who has published 30+ international research papers. Guided the college towards high-quality JNTU academic standards.",
                image_url="/images/alumni/success-story.webp",
                display_order=2,
                created_at="2026-07-28"
            ),
            Leadership(
                id="ldr-director",
                name="Dr. Priya Sharma",
                designation="Director of Academics",
                qualification="Ph.D (NIT)",
                description="Under her supervision, the institution co-designed industry-focused curriculums and set up specialized AI labs.",
                image_url="/images/alumni/career-growth.webp",
                display_order=3,
                created_at="2026-07-28"
            )
        ]
        db.add_all(leadership_team)

    # Seed Achievement if empty
    if db.query(Achievement).first() is None:
        achievements = [
            Achievement(
                id="ach-naac",
                title="NAAC A-Grade Institution",
                description="Accredited by the National Assessment and Accreditation Council with a high-grade score for academic excellence.",
                category="Awards",
                year=2024,
                image_url="/images/campus/main-building.webp",
                created_at="2026-07-28"
            ),
            Achievement(
                id="ach-toppers",
                title="University State Toppers",
                description="Consistently producing university rank holders and state board toppers across all engineering programs.",
                category="Academic",
                year=2023,
                image_url="/images/alumni/success-story.webp",
                created_at="2026-07-28"
            ),
            Achievement(
                id="ach-research",
                title="50+ Active Research Publications",
                description="Faculty and students have published over 50 research papers in national and international journals.",
                category="Research",
                year=2023,
                image_url="/images/campus/ai-lab.webp",
                created_at="2026-07-28"
            ),
            Achievement(
                id="ach-partners",
                title="100+ Core Placement Partners",
                description="Strong network of over 100 industry partners providing internship and placement opportunities.",
                category="Recognition",
                year=2024,
                image_url="/images/campus/main-building.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(achievements)

    # Seed Accreditation if empty
    if db.query(Accreditation).first() is None:
        accreditations = [
            Accreditation(
                id="acc-naac",
                organization_name="NAAC",
                certificate_name="A-Grade Accreditation",
                description="Accredited with an A-Grade representing high standards in classroom quality, infrastructure, and leadership.",
                year=2024,
                image_url="/images/accreditations/naac.webp"
            ),
            Accreditation(
                id="acc-nba",
                organization_name="NBA",
                certificate_name="NBA Certification",
                description="NBA accredited programs for key engineering streams including CSE, AIDS and ECE.",
                year=2023,
                image_url="/images/accreditations/nba.webp"
            ),
            Accreditation(
                id="acc-aicte",
                organization_name="AICTE",
                certificate_name="AICTE Approval",
                description="Approved by All India Council for Technical Education, New Delhi for technical B.Tech courses.",
                year=2000,
                image_url="/images/accreditations/aicte.webp"
            )
        ]
        db.add_all(accreditations)

    # Seed Infrastructure if empty
    if db.query(Infrastructure).first() is None:
        infrastructure_items = [
            Infrastructure(
                id="inf-acad",
                title="Academic Block A",
                description="State-of-the-art academic wings comprising clean digital smart classrooms, central faculty workspaces and core engineering department hubs.",
                facility_type="Academic Block",
                location="Central Campus Area",
                capacity=1500,
                features=["Digital Smartboards", "Central Air Conditioning", "High-speed Wi-Fi", "Passenger Elevators"],
                image_url="/images/campus/academic-block.webp",
                video_url=None,
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Infrastructure(
                id="inf-audi",
                title="Sri Satya Seminar Auditorium",
                description="A massive air-conditioned seminar and cultural hall equipped with professional acoustics panels, stage illumination systems, and greenrooms.",
                facility_type="Auditorium",
                location="Main Entrance West",
                capacity=800,
                features=["Acoustic wall linings", "Bose spatial sound system", "LED backdrop walls", "Stage greenrooms"],
                image_url="/images/campus/main-building.webp",
                video_url=None,
                created_at="2026-07-28",
                updated_at="2026-07-28"
            ),
            Infrastructure(
                id="inf-cafe",
                title="Student Cafeteria Deck",
                description="Spacious food court serving multi-cuisine vegetarian options, mocktails and refreshments in comfortable indoor and open-air decks.",
                facility_type="Cafeteria",
                location="Hostel Quadrangle East",
                capacity=350,
                features=["Steam hygienic kitchens", "Digital self-checkout kiosks", "Multi-cuisine food counters", "Garden lawn seats"],
                image_url="/images/hostel/mess.webp",
                video_url=None,
                created_at="2026-07-28",
                updated_at="2026-07-28"
            )
        ]
        db.add_all(infrastructure_items)

    # Seed Laboratories if empty
    if db.query(Laboratory).first() is None:
        labs = [
            Laboratory(
                id="lab-ai",
                lab_name="AI Research Laboratory",
                department_id="aids",
                description="Cutting-edge computing lab hosting specialized servers to compile deep learning, computer vision, and big data models.",
                equipment_details=["Intel Xeon GPU Servers", "Nvidia RTX Workstations"],
                software_details=["TensorFlow GPU", "PyTorch Toolkit", "Jupyter Enterprise Server", "Apache Hadoop Spark"],
                capacity=60,
                image_url="/images/campus/ai-lab.webp",
                video_url=None,
                created_at="2026-07-28"
            ),
            Laboratory(
                id="lab-prog",
                lab_name="Programming Language Lab",
                department_id="cse",
                description="Core software lab housing setups to compile algorithms, web architectures, and advanced data structures.",
                equipment_details=["Dell Multi-Core Developer Boxes", "CentOS File Repository server"],
                software_details=["Java Development Kit", "Python Anaconda", "Eclipse & VS Code IDEs", "PostgreSQL database engines"],
                capacity=60,
                image_url="/images/student-life/coding.webp",
                video_url=None,
                created_at="2026-07-28"
            ),
            Laboratory(
                id="lab-vlsi",
                lab_name="VLSI & Circuit Design Lab",
                department_id="ece",
                description="Specialized hardware lab where communications students test circuit schematics, logic boards, and FPGA trainers.",
                equipment_details=["FPGA Development Kits", "Mixed Signal Oscilloscopes", "RF Signal Generators"],
                software_details=["Xilinx Vivado Suite", "MATLAB Toolboxes", "PSPICE Simulator", "Cadence software sets"],
                capacity=60,
                image_url="/images/campus/academic-block.webp",
                video_url=None,
                created_at="2026-07-28"
            )
        ]
        db.add_all(labs)

    # Seed Library if empty
    if db.query(Library).first() is None:
        lib = Library(
            id="lib-central",
            title="Dr. A.P.J. Abdul Kalam Central Library",
            description="A modern multi-level resource vault carrying thousands of textbook volumes, digital directories, journals and quiet study chambers.",
            book_count=45000,
            digital_resources=["IEEE Xplore full database", "Elsevier ScienceDirect access", "NPTEL Video lecture servers", "DELNET institutional membership"],
            seating_capacity=300,
            facilities=["Computer-aided reference logs", "Silent individual study cubes", "Reprographic & printing setups"],
            image_url="/images/campus/academic-block.webp",
            created_at="2026-07-28"
        )
        db.add(lib)

    # Seed Hostels if empty
    if db.query(Hostel).first() is None:
        hostels = [
            Hostel(
                id="hostel-boys",
                hostel_type="Boys Hostel",
                description=" Sri Satya Boys Residency provides clean, well-furnished rooms with expansive study yards and indoor recreational facilities.",
                capacity=400,
                room_type="Double & Triple Sharing Rooms",
                facilities=["High-speed campus Wi-Fi access", "Hot water geysers and central laundry services", "Table tennis and TV recreational rooms"],
                mess_information=["Nutritious vegetarian menus served 4 times daily", "Weekly special spreads and festival meals"],
                security_features=["24/7 gate security guards", "Biometric check logs on entry/exit", "Resident wardens checking wings daily"],
                image_url="/images/hostel/hostel-room.webp",
                created_at="2026-07-28"
            ),
            Hostel(
                id="hostel-girls",
                hostel_type="Girls Hostel",
                description="Sri Satya Girls Residency provides a secure, fully-monitored residential block with reading libraries and separate dining halls.",
                capacity=300,
                room_type="Double Sharing Rooms",
                facilities=["High-speed campus Wi-Fi access", "In-house automatic laundry machinery", "Late-hour quiet study rooms"],
                mess_information=["Hygienic vegetarian menus", "Purified RO drinking water system"],
                security_features=["Female security guards at checkpoints", "Fingerprint login audit system", "High-walled perimeter fencing with CCTV control"],
                image_url="/images/hostel/hostel-room.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(hostels)

    # Seed Sports if empty
    if db.query(SportsFacility).first() is None:
        sports = [
            SportsFacility(
                id="sport-cricket",
                sport_name="SSIET Cricket Oval & Turf",
                description="A lush green matches ground equipped with practice nets, audience seating terraces, and floodlights.",
                facility_details=["Match turf pitch", "Side practice nets", "Match lighting systems", "Sports gear kits"],
                image_url="/images/campus/sports.webp",
                created_at="2026-07-28"
            ),
            SportsFacility(
                id="sport-volleyball",
                sport_name="Volleyball & Basketball Courts",
                description="Outdoor concrete and clay grounds matching standard board game rules.",
                facility_details=["Acrylic concrete basketball court", "Clay court for volleyball matches", "Sports equipment kits"],
                image_url="/images/campus/sports.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(sports)

    # Seed Clubs if empty
    if db.query(StudentClub).first() is None:
        clubs = [
            StudentClub(
                id="club-coding",
                club_name="SSIET Developer Coding Forum",
                category="Technical",
                description="A student developer forum organizing weekly programming contests, AI seminars, and open source code hackathons.",
                activities=["Weekly hackathons and mock coding tests", "Workshops on Git, Github, and Cloud systems", "Mentoring camps for GSOC and placements"],
                image_url="/images/student-life/coding.webp",
                created_at="2026-07-28"
            ),
            StudentClub(
                id="club-cultural",
                club_name="Spandana Cultural Club",
                category="Cultural",
                description="The core cultural wing celebrating music, drama, dancing, and theatrical arts across college festivals.",
                activities=["Annual day dance battles", "Folk singing workshops", "Theatre and mimicry performances"],
                image_url="/images/student-life/events.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(clubs)

    # Seed Events if empty
    if db.query(CampusEvent).first() is None:
        events = [
            CampusEvent(
                id="evt-hackathon",
                event_name="National Software Hackathon 2026",
                description="A 36-hour code sprint welcoming college candidates across the state to formulate web solutions for urban and agricultural challenges.",
                event_date="2026-09-15",
                category="Hackathons",
                image_url="/images/student-life/coding.webp",
                created_at="2026-07-28"
            ),
            CampusEvent(
                id="evt-annual",
                event_name="Sri Satya Annual Cultural Fest 2026",
                description="The grandest college cultural fest with dance battles, celebrity musical shows, and food zones.",
                event_date="2026-03-24",
                category="Festivals",
                image_url="/images/student-life/events.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(events)

    # Seed AdmissionProcess if empty
    if db.query(AdmissionProcess).first() is None:
        process_steps = [
            AdmissionProcess(
                id="step-1",
                title="Select Preferred Program",
                description="Browse through B.Tech streams (CSE, AIDS, ECE, Mech, Civil) to find your matching core specialization.",
                step_number=1,
                category="General",
                created_at="2026-07-28"
            ),
            AdmissionProcess(
                id="step-2",
                title="Check Eligibility & Cut-offs",
                description="Verify intermediate score aggregates (minimum 60% in MPC) and matching entrance exam cut-off ranks.",
                step_number=2,
                category="General",
                created_at="2026-07-28"
            ),
            AdmissionProcess(
                id="step-3",
                title="Counseling Seat Allocation",
                description="Participate in state counselling (EAPCET) or visit campus offices for management quota registration.",
                step_number=3,
                category="General",
                created_at="2026-07-28"
            ),
            AdmissionProcess(
                id="step-4",
                title="Verify Credentials & Confirm",
                description="Submit certificates, pay the academic tuition fee tier, and retrieve your formal registry credentials.",
                step_number=4,
                category="General",
                created_at="2026-07-28"
            )
        ]
        db.add_all(process_steps)

    # Seed EligibilityCriteria if empty
    if db.query(EligibilityCriteria).first() is None:
        eligibilities = [
            EligibilityCriteria(
                id="elig-cse",
                course_id="b-tech-cse",
                qualification="Intermediate (10+2) with MPC stream",
                minimum_percentage=60,
                entrance_requirement="State counseling EAPCET rank or national level JEE Main rank qualification",
                additional_requirements=["Physics, Chemistry & Mathematics aggregate must be >= 60%"],
                created_at="2026-07-28"
            ),
            EligibilityCriteria(
                id="elig-aids",
                course_id="b-tech-aids",
                qualification="Intermediate (10+2) with MPC stream",
                minimum_percentage=60,
                entrance_requirement="State counseling EAPCET rank or national level JEE Main rank qualification",
                additional_requirements=["Physics, Chemistry & Mathematics aggregate must be >= 60%"],
                created_at="2026-07-28"
            ),
            EligibilityCriteria(
                id="elig-ece",
                course_id="b-tech-ece",
                qualification="Intermediate (10+2) with MPC stream",
                minimum_percentage=55,
                entrance_requirement="State counseling EAPCET rank or national level JEE Main rank qualification",
                additional_requirements=["Physics, Chemistry & Mathematics aggregate must be >= 55%"],
                created_at="2026-07-28"
            )
        ]
        db.add_all(eligibilities)

    # Seed RequiredDocument if empty
    if db.query(RequiredDocument).first() is None:
        docs = [
            RequiredDocument(
                id="doc-ssc",
                document_name="SSC / 10th Class Marks Memo",
                description="Original proof of birth date and standard compliance memo.",
                category="Academic",
                mandatory=True,
                created_at="2026-07-28"
            ),
            RequiredDocument(
                id="doc-inter",
                document_name="Intermediate / 12th Class MPC Memo",
                description="Marks sheet verifying qualifying board percentages in math/physics/chemistry.",
                category="Academic",
                mandatory=True,
                created_at="2026-07-28"
            ),
            RequiredDocument(
                id="doc-rank",
                document_name="EAPCET / JEE Rank Card",
                description="Hall ticket and result statement verifying qualifying exam standings.",
                category="Entrance",
                mandatory=True,
                created_at="2026-07-28"
            ),
            RequiredDocument(
                id="doc-tc",
                document_name="Transfer Certificate (TC)",
                description="Formal release certificate issued from the last study institution.",
                category="General",
                mandatory=True,
                created_at="2026-07-28"
            ),
            RequiredDocument(
                id="doc-photo",
                document_name="Passport Photographs",
                description="6 recent passport-size color photographs of the student.",
                category="General",
                mandatory=True,
                created_at="2026-07-28"
            )
        ]
        db.add_all(docs)

    # Seed AdmissionTimeline if empty
    if db.query(AdmissionTimeline).first() is None:
        timelines = [
            AdmissionTimeline(
                id="time-app",
                event_name="Online Application Window",
                description="Submission of online application forms on college port portal.",
                start_date="May 15, 2026",
                end_date="July 15, 2026",
                category="Application",
                created_at="2026-07-28"
            ),
            AdmissionTimeline(
                id="time-counsel",
                event_name="State Counselling Ranks Call",
                description="EAPCET seat matching rounds conducted by the State Council.",
                start_date="July 20, 2026",
                end_date="August 05, 2026",
                category="Counselling",
                created_at="2026-07-28"
            ),
            AdmissionTimeline(
                id="time-audit",
                event_name="Credentials Verification Desk",
                description="Audit of original certificates at the college administrative block.",
                start_date="August 06, 2026",
                end_date="August 15, 2026",
                category="Document Verification",
                created_at="2026-07-28"
            )
        ]
        db.add_all(timelines)

    # Seed FAQ if empty
    if db.query(FAQ).first() is None:
        faq_items = [
            FAQ(
                id="faq-1",
                question="What is the minimum intermediate cutoff for B.Tech CSE admissions?",
                answer="Candidates must secure at least 60% aggregate marks in Mathematics, Physics, and Chemistry (MPC) in their 10+2 board exam, along with a valid EAPCET or JEE rank.",
                category="Admission",
                display_order=1,
                created_at="2026-07-28"
            ),
            FAQ(
                id="faq-2",
                question="Are there hostel accommodations for outstation students?",
                answer="Yes, the college provides separate residential wings for boys and girls inside secure campus limits, offering vegetarian boarding and continuous internet access.",
                category="Hostel",
                display_order=2,
                created_at="2026-07-28"
            ),
            FAQ(
                id="faq-3",
                question="What is the state code for counseling seat allocation?",
                answer="Sri Satya Institute of Engineering and Technology state counseling code is SSIET. Choose this during EAPCET options web entry.",
                category="General",
                display_order=3,
                created_at="2026-07-28"
            )
        ]
        db.add_all(faq_items)

    # Seed ContactInformation if empty
    if db.query(ContactInformation).first() is None:
        contacts = [
            ContactInformation(
                id="contact-general",
                department="General Admissions Desk",
                phone="+91 9000-000-000",
                email="admissions@ssiet.ac.in",
                address="Administrative Block Ground Floor, SSIET Campus, West Godavari, AP - 534001",
                office_hours="9:00 AM - 5:00 PM (Monday to Saturday)",
                created_at="2026-07-28"
            ),
            ContactInformation(
                id="contact-cse",
                department="Department of Computer Science",
                phone="+91 9000-111-111",
                email="cse@ssiet.ac.in",
                address="Technical Block A Room 202, SSIET Campus",
                office_hours="9:00 AM - 4:30 PM (Working Weekdays)",
                created_at="2026-07-28"
            )
        ]
        db.add_all(contacts)

    # Seed PlacementOverview if empty
    if db.query(PlacementOverview).first() is None:
        overviews = [
            PlacementOverview(
                id="overview-2025",
                academic_year="2025-26",
                placement_percentage=94.5,
                total_students=450,
                students_placed=425,
                highest_package=15.0,
                average_package=4.8,
                top_recruiters=["TCS", "Infosys", "Wipro", "Cognizant", "Accenture"],
                description="Sri Satya Institute of Engineering and Technology holds a stellar reputation for producing industry-ready graduates. Our dedicated Placement Cell bridges the gap between academic education and corporate demands by organizing training programs, internships, and campus interviews.",
                created_at="2026-07-28"
            )
        ]
        db.add_all(overviews)

    # Seed PlacementStatistics if empty
    if db.query(PlacementStatistics).first() is None:
        stats = [
            PlacementStatistics(
                id="stat-cse-2025",
                year=2025,
                department_id="cse",
                students_registered=120,
                students_placed=115,
                placement_percentage=95.8,
                highest_package=15.0,
                average_package=5.2,
                companies_count=24,
                created_at="2026-07-28"
            ),
            PlacementStatistics(
                id="stat-ece-2025",
                year=2025,
                department_id="ece",
                students_registered=110,
                students_placed=102,
                placement_percentage=92.7,
                highest_package=10.0,
                average_package=4.5,
                companies_count=18,
                created_at="2026-07-28"
            )
        ]
        db.add_all(stats)


    # Seed PlacementProcess if empty
    if db.query(PlacementProcess).first() is None:
        process_steps = [
            PlacementProcess(
                id="proc-1",
                step_title="Resume Building & Review",
                description="Our career mentors review profiles to build professional resumes matching industry standards.",
                step_number=1,
                icon="FileText",
                created_at="2026-07-28"
            ),
            PlacementProcess(
                id="proc-2",
                step_title="Aptitude & Coding Bootcamps",
                description="Rigorous training on mathematical aptitude, logical reasoning, and programming fundamentals.",
                step_number=2,
                icon="Cpu",
                created_at="2026-07-28"
            ),
            PlacementProcess(
                id="proc-3",
                step_title="Mock Interviews",
                description="Alumni and industry professionals conduct mock technical and HR interview rounds.",
                step_number=3,
                icon="Users",
                created_at="2026-07-28"
            ),
            PlacementProcess(
                id="proc-4",
                step_title="On-Campus Interviews",
                description="Leading multinational companies visit the campus to select students.",
                step_number=4,
                icon="Briefcase",
                created_at="2026-07-28"
            )
        ]
        db.add_all(process_steps)

    # Seed TrainingProgram if empty
    if db.query(TrainingProgram).first() is None:
        programs = [
            TrainingProgram(
                id="train-coding",
                title="Advanced Coding & Data Structures",
                description="Intensive bootcamp covering DSA concepts, recursion, trees, graphs, and dynamic programming.",
                category="Programming",
                duration="60 Hours",
                skills_covered=["Data Structures", "Algorithms", "C++", "Java", "Python"],
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            ),
            TrainingProgram(
                id="train-verbal",
                title="Communication & Business English",
                description="Interactive classroom workshop to polish public speaking, business communication, and writing skills.",
                category="Communication",
                duration="30 Hours",
                skills_covered=["Business English", "Public Speaking", "Presentation Skills", "Email Etiquette"],
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            ),
            TrainingProgram(
                id="train-apt",
                title="Quantitative & Analytical Aptitude",
                description="Comprehensive syllabus covering logical reasoning, puzzle-solving, algebra, and number series.",
                category="Aptitude",
                duration="40 Hours",
                skills_covered=["Logical Reasoning", "Quantitative Aptitude", "Problem Solving"],
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(programs)

    # Seed Internship if empty
    if db.query(Internship).first() is None:
        internships_list = [
            Internship(
                id="intern-career-1",
                company_name="Wipro Limited",
                domain="Software Engineering Intern",
                description="Work on real-world IT services projects under senior development guidance.",
                duration="3 Months",
                eligibility="B.Tech 3rd/4th Year (CSE/ECE/AI&DS) with no active backlogs.",
                application_information="Apply through the SSIET Placement Cell Portal by October 15, 2026.",
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            ),
            Internship(
                id="intern-career-2",
                company_name="TCS",
                domain="Research & Development Intern",
                description="Explore ML engineering pipelines and artificial intelligence frameworks in Tata labs.",
                duration="6 Months",
                eligibility="B.Tech 4th Year (CSE/AI&DS) with CGPA >= 8.0.",
                application_information="Send updated resumes to internships@ssiet.ac.in.",
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(internships_list)

    # Seed StudentSuccessStory if empty
    if db.query(StudentSuccessStory).first() is None:
        stories = [
            StudentSuccessStory(
                id="story-rahul",
                student_name="Rahul Kumar",
                department_id="cse",
                graduation_year=2025,
                current_company="TCS",
                current_role="Assistant Systems Engineer",
                story="Entering college, I was anxious about my tech skills, but the rigorous training bootcamps at SSIET built my foundations. Cracking the TCS Digital test was a dream come true, and I owe it all to our wonderful mentors.",
                student_image="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            ),
            StudentSuccessStory(
                id="story-deepa",
                student_name="Deepa G.",
                department_id="ece",
                graduation_year=2025,
                current_company="Wipro",
                current_role="Embedded Systems Analyst",
                story="The IoT laboratory at SSIET gave me hands-on project exposure. Designing a smart agriculture sensor kit during the final semester helped me stand out in my interviews.",
                student_image="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(stories)

    # Seed Alumni if empty
    if db.query(Alumni).first() is None:
        alumni_list = [
            Alumni(
                id="alum-sita",
                name="Sita Devi",
                graduation_year=2022,
                department="Computer Science & Engineering",
                company="Microsoft",
                role="Software Engineer II",
                current_company="Microsoft",
                designation="Software Engineer II",
                achievement="Won the Microsoft Global Hackathon Innovation trophy in 2024.",
                profile_image="/images/alumni/career-growth.webp",
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            ),
            Alumni(
                id="alum-krishna",
                name="Krishna Mohan",
                graduation_year=2023,
                department="Electronics & Communication",
                company="Qualcomm",
                role="Firmware Engineer",
                current_company="Qualcomm",
                designation="Firmware Engineer",
                achievement="Filed a dual core architecture performance optimization patent.",
                profile_image="/images/alumni/career-growth.webp",
                image_url="/images/alumni/career-growth.webp",
                created_at="2026-07-28"
            )
        ]
        db.add_all(alumni_list)

    # Seed CareerResource if empty
    if db.query(CareerResource).first() is None:
        resources = [
            CareerResource(
                id="res-dsa",
                title="Data Structures & Algorithms Interview Sheet",
                description="A handpicked directory of 150 most common coding questions asked in technical interviews.",
                resource_type="Preparation Guide",
                link="#",
                created_at="2026-07-28"
            ),
            CareerResource(
                id="res-hr",
                title="Behavioral & HR Interview Preparation Tips",
                description="Comprehensive guidelines on formatting project summaries, discussing weaknesses, and salary negotiation.",
                resource_type="Interview Tips",
                link="#",
                created_at="2026-07-28"
            )
        ]
        db.add_all(resources)

    # Seed User profiles if empty
    if db.query(User).first() is None:
        from app.services.auth_service import get_password_hash
        users = [
            User(
                id="user-admin",
                full_name="Admin Divya",
                email="admin@ssiet.ac.in",
                password_hash=get_password_hash("admin_password_123"),
                role="ADMIN",
                is_active=True,
                created_at="2026-07-28"
            ),
            User(
                id="user-manager",
                full_name="Manager Sri",
                email="manager@ssiet.ac.in",
                password_hash=get_password_hash("manager_password_123"),
                role="CONTENT_MANAGER",
                is_active=True,
                created_at="2026-07-28"
            )
        ]
        db.add_all(users)

    # Seed ActivityLog if empty
    if db.query(ActivityLog).first() is None:
        logs = [
            ActivityLog(
                user_id="user-admin",
                action="CREATE",
                module="Authentication",
                description="Admin initialized the content management database.",
                created_at="2026-07-28 12:00:00"
            ),
            ActivityLog(
                user_id="user-admin",
                action="UPDATE",
                module="Fees",
                description="Admin updated CSE fees structure.",
                created_at="2026-07-28 14:30:00"
            )
        ]
        db.add_all(logs)

    # Seed Admin profiles if empty
    if db.query(Admin).filter(Admin.email == "divyadonga8897@gmail.com").first() is None:
        from app.services.auth_service import get_password_hash
        import datetime
        now_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        super_admin = Admin(
            id="admin-super",
            full_name="Super Admin",
            email="divyadonga8897@gmail.com",
            password_hash=get_password_hash("DivyaDonga8897"),
            role="super_admin",
            created_at=now_str,
            updated_at=now_str
        )
        db.add(super_admin)

    db.commit()
