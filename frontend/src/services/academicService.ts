// ============================================================
// Academic Catalog Service
// Manages courses, departments, fee structures, admissions, and scholarships
// ============================================================

import type { ApiResponse } from "@/types";

export interface DepartmentSummary {
  id: string;
  name: string;
  description: string;
  image: string;
  short_name: string;
  established_year: number;
  faculty_count: number;
  student_count: number;
}

export interface DepartmentDetail extends DepartmentSummary {
  department_name: string;
  head_of_department: string;
  hod_image: string;
  department_image: string;
  courses: {
    id: string;
    course_name: string;
    degree_type: string;
    duration: string;
    intake: number;
    course_image: string;
  }[];
  faculty: {
    name: string;
    designation: string;
    image: string;
  }[];
  highlights: string[];
}

export interface CourseSummary {
  id: string;
  department_id: string;
  department_name: string;
  course_name: string;
  degree_type: string;
  duration: string;
  intake: number;
  overview: string;
  career_scope: string[];
  eligibility: string[];
  course_image: string;
}

export interface CourseDetail extends CourseSummary {
  features: {
    id: string;
    feature_title: string;
    feature_description: string;
    icon: string;
    display_order: number;
  }[];
  fees: {
    id: string;
    academic_year: string;
    tuition_fee: number;
    hostel_fee: number;
    other_charges: number;
    total_fee: number;
    fee_type: string;
  }[];
  admission_requirements: {
    qualification: string;
    minimum_percentage: number;
    entrance_exam: string;
    required_documents: string[];
    admission_notes: string;
  };
}

export interface FeeItem {
  id: string;
  course_id: string;
  course_name: string;
  academic_year: string;
  tuition_fee: number;
  hostel_fee: number;
  other_charges: number;
  total_fee: number;
  fee_type: string;
}

export interface AdmissionInfo {
  eligibility_summary: string;
  required_documents: string[];
  process_steps: {
    step: number;
    title: string;
    description: string;
  }[];
  admission_notes: string[];
}

export interface ScholarshipItem {
  id: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  application_process: string[];
  created_at?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Static Fallbacks for offline resilience ---
const fallbackDepartments: DepartmentSummary[] = [
  { id: "cse", name: "Computer Science and Engineering", short_name: "CSE", description: "Comprehensive curriculum covering algorithms, networks, database management and software engineering.", image: "/images/campus/main-building.webp", established_year: 2000, faculty_count: 25, student_count: 600 },
  { id: "aids", name: "Artificial Intelligence and Data Science", short_name: "AIDS", description: "Focusing on intelligent systems, neural networks, machine learning models, and big data visualization.", image: "/images/campus/computer-lab.png", established_year: 2021, faculty_count: 18, student_count: 360 },
  { id: "ece", name: "Electronics and Communication Engineering", short_name: "ECE", description: "Trains students in silicon design, wireless communications, VLSI chipsets, and microprocessors.", image: "/images/campus/academic-block.webp", established_year: 2000, faculty_count: 22, student_count: 480 },
  { id: "mech", name: "Mechanical Engineering", short_name: "MECH", description: "Encompasses cad design, machine production control, CNC operations, and industrial robotics.", image: "/images/campus/sports.webp", established_year: 2005, faculty_count: 20, student_count: 240 },
  { id: "civil", name: "Civil Engineering", short_name: "CIVIL", description: "Focusing on smart city structures, concrete durability, satellite geomatics, and hydraulic designs.", image: "/images/campus/main-building.webp", established_year: 2008, faculty_count: 18, student_count: 180 }
];

const fallbackCourses: CourseSummary[] = [
  { id: "b-tech-cse", department_id: "cse", department_name: "Computer Science and Engineering", course_name: "B.Tech Computer Science and Engineering", degree_type: "B.Tech", duration: "4 Years", intake: 120, overview: "Bachelor of Technology in Computer Science Engineering is a 4-year undergraduate program covering core computer science fundamentals and cutting-edge software systems.", career_scope: ["Software Engineer", "Full Stack Developer", "Data Scientist", "DevOps Engineer"], eligibility: ["10+2 / Intermediate MPC", "60% aggregate score", "Valid EAMCET/JEE Rank"], course_image: "/images/campus/main-building.webp" },
  { id: "b-tech-aids", department_id: "aids", department_name: "Artificial Intelligence and Data Science", course_name: "B.Tech AI & Data Science", degree_type: "B.Tech", duration: "4 Years", intake: 60, overview: "Specialized undergraduate program focusing on data structures, statistics, machine learning algorithms and neural network design.", career_scope: ["AI Engineer", "Data Analyst", "ML Developer", "AI Specialist"], eligibility: ["10+2 / Intermediate MPC", "60% aggregate score", "Valid EAMCET/JEE Rank"], course_image: "/images/campus/computer-lab.png" },
  { id: "b-tech-ece", department_id: "ece", department_name: "Electronics and Communication Engineering", course_name: "B.Tech Electronics & Communication Engineering", degree_type: "B.Tech", duration: "4 Years", intake: 120, overview: "Acquire design competencies in microcontrollers, signal processing, VLSI circuits and wireless telemetry protocols.", career_scope: ["VLSI Engineer", "Telecom Analyst", "Embedded Developer", "Hardware Analyst"], eligibility: ["10+2 / Intermediate MPC", "60% aggregate score", "Valid EAMCET/JEE Rank"], course_image: "/images/campus/academic-block.webp" },
  { id: "b-tech-mech", department_id: "mech", department_name: "Mechanical Engineering", course_name: "B.Tech Mechanical Engineering", degree_type: "B.Tech", duration: "4 Years", intake: 60, overview: "Covers mechanical tooling, fluid dynamics, design graphics, smart manufacturing and robotics assemblies.", career_scope: ["Production Manager", "CAD Designer", "Robotics Specialist"], eligibility: ["10+2 / Intermediate MPC", "55% aggregate score", "Valid EAMCET/JEE Rank"], course_image: "/images/campus/sports.webp" },
  { id: "b-tech-civil", department_id: "civil", department_name: "Civil Engineering", course_name: "B.Tech Civil Engineering", degree_type: "B.Tech", duration: "4 Years", intake: 60, overview: "Study bridge designing, smart highways layout planning, environmental management and structural analytics.", career_scope: ["Structural Planner", "Construction Supervisor", "Urban Analyst"], eligibility: ["10+2 / Intermediate MPC", "55% aggregate score", "Valid EAMCET/JEE Rank"], course_image: "/images/campus/main-building.webp" }
];

const fallbackFees: FeeItem[] = [
  { id: "fee-cse-gov", course_id: "b-tech-cse", course_name: "B.Tech Computer Science and Engineering", academic_year: "2024-25", tuition_fee: 85000, hostel_fee: 55000, other_charges: 10000, total_fee: 150000, fee_type: "Government Quota" },
  { id: "fee-cse-mgmt", course_id: "b-tech-cse", course_name: "B.Tech Computer Science and Engineering", academic_year: "2024-25", tuition_fee: 185000, hostel_fee: 55000, other_charges: 15000, total_fee: 255000, fee_type: "Management Quota" },
  { id: "fee-cse-schol", course_id: "b-tech-cse", course_name: "B.Tech Computer Science and Engineering", academic_year: "2024-25", tuition_fee: 42500, hostel_fee: 55000, other_charges: 10000, total_fee: 107500, fee_type: "Scholarship Category" },
  { id: "fee-aids-gov", course_id: "b-tech-aids", course_name: "B.Tech AI & Data Science", academic_year: "2024-25", tuition_fee: 90000, hostel_fee: 55000, other_charges: 10000, total_fee: 155000, fee_type: "Government Quota" },
  { id: "fee-aids-mgmt", course_id: "b-tech-aids", course_name: "B.Tech AI & Data Science", academic_year: "2024-25", tuition_fee: 190000, hostel_fee: 55000, other_charges: 15000, total_fee: 260000, fee_type: "Management Quota" },
  { id: "fee-ece-gov", course_id: "b-tech-ece", course_name: "B.Tech Electronics & Communication Engineering", academic_year: "2024-25", tuition_fee: 80000, hostel_fee: 55000, other_charges: 10000, total_fee: 145000, fee_type: "Government Quota" },
  { id: "fee-ece-mgmt", course_id: "b-tech-ece", course_name: "B.Tech Electronics & Communication Engineering", academic_year: "2024-25", tuition_fee: 170000, hostel_fee: 55000, other_charges: 15000, total_fee: 240000, fee_type: "Management Quota" },
  { id: "fee-mech-gov", course_id: "b-tech-mech", course_name: "B.Tech Mechanical Engineering", academic_year: "2024-25", tuition_fee: 78000, hostel_fee: 55000, other_charges: 8000, total_fee: 141000, fee_type: "Government Quota" },
  { id: "fee-mech-mgmt", course_id: "b-tech-mech", course_name: "B.Tech Mechanical Engineering", academic_year: "2024-25", tuition_fee: 150000, hostel_fee: 55000, other_charges: 10000, total_fee: 215000, fee_type: "Management Quota" },
  { id: "fee-civil-gov", course_id: "b-tech-civil", course_name: "B.Tech Civil Engineering", academic_year: "2024-25", tuition_fee: 75000, hostel_fee: 55000, other_charges: 8000, total_fee: 138000, fee_type: "Government Quota" },
  { id: "fee-civil-mgmt", course_id: "b-tech-civil", course_name: "B.Tech Civil Engineering", academic_year: "2024-25", tuition_fee: 140000, hostel_fee: 55000, other_charges: 10000, total_fee: 205000, fee_type: "Management Quota" }
];

const fallbackAdmission: AdmissionInfo = {
  eligibility_summary: "10+2 / Intermediate with Mathematics, Physics & Chemistry stream with valid EAPCET or JEE rankings.",
  required_documents: [
    "SSC or equivalent passing certificate (10th Standard Marks Memo).",
    "Intermediate or 10+2 marks memo showing MPC stream grades.",
    "Transfer Certificate (TC) from previous school/college.",
    "State EAPCET (EAMCET) / JEE Main counseling hall ticket and rank card.",
    "Study and Conduct Certificates (class 6th to 12th).",
    "Community/Caste Certificate (for scholarship quotas).",
    "Income Certificate (if seeking government fee reimbursement)."
  ],
  process_steps: [
    { step: 1, title: "Choose Engineering Course", description: "Select from B.Tech specialized programs (CSE, AIDS, ECE, Mech, Civil) that fit your aspirations." },
    { step: 2, title: "Check Eligibility Criteria", description: "Verify qualifying marks (minimum 60% in Intermediate MPC) and check entrance rank requirements." },
    { step: 3, title: "Submit Required Documents", description: "Provide required certificates, rank statements, and photos to counselors for verification." },
    { step: 4, title: "Complete Seat Registration", description: "Securing seat allocation through convener counseling or direct administrative merit allocation." }
  ],
  admission_notes: [
    "Counseling and seat reservations are conducted strictly in accordance with JNTU and APSCHE state council guidelines.",
    "Candidates eligible under fee waiver programs must submit updated income certificates to avoid processing delays."
  ]
};

const fallbackScholarships: ScholarshipItem[] = [
  {
    id: "merit-scholarship",
    title: "Merit Excellence Scholarship",
    description: "Awarded annually to top-performing academic candidates to promote excellence in engineering.",
    eligibility: ["Minimum 90% aggregate score in Intermediate (10+2)", "EAPCET rank under 10,000", "Consistent performance (CGPA > 8.0) in subsequent years"],
    benefits: ["50% tuition fee waiver for convener quota seats", "Direct research mentorship with senior deans", "Access to innovation incubator funding"],
    application_process: ["Submit the Merit Concession form at the admission cell", "Provide EAMCET rank card and 10+2 mark statements during counseling verification", "Review updates on the college portal"]
  },
  {
    id: "sc-st-scholarship",
    title: "SC/ST Government fee reimbursement",
    description: "Government scholarship support to aid lower socio-economic backgrounds in technical education.",
    eligibility: ["Valid SC/ST/BC community certificate", "Annual parental income below 2.5 Lakhs INR"],
    benefits: ["100% tuition fee waiver covered by social welfare department", "Special hostel fee concessions", "Book-bank services from library"],
    application_process: ["Apply through the Jnanabhumi state portal after securing admission", "Submit local caste certificate, income card, and bank account details", "Verification is conducted by social welfare officers"]
  },
  {
    id: "pragati-scholarship",
    title: "Pragati Scholarship for Female Engineers",
    description: "AICTE sponsored national aid scheme supporting female candidates in engineering paths.",
    eligibility: ["Only female students enrolled in 1st year B.Tech", "Family income under 8 Lakhs INR"],
    benefits: ["Fixed annual credit of 50,000 INR toward college fees or materials purchase"],
    application_process: ["Apply on the National Scholarship Portal (NSP)", "Upload college bonafide letter and fee paid receipts", "Get verification from college principal portal"]
  }
];

async function apiFetch<T>(endpoint: string, fallback: T): Promise<ApiResponse<T>> {
  const startTime = Date.now();
  try {
    console.log(`[academicService] Starting fetch for ${endpoint}...`);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    const duration = Date.now() - startTime;
    console.log(`[academicService] Fetch ${endpoint} finished in ${duration}ms, status=${res.status}`);
    if (!res.ok) throw new Error(`API Connection down (status: ${res.status})`);
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.log(`[academicService] Fetch ${endpoint} FAILED/TIMEDOUT in ${duration}ms. Error: ${err?.message || err}`);
    return { success: true, data: fallback };
  }
}

export const academicService = {
  getDepartments: () => apiFetch<DepartmentSummary[]>("/api/v1/academic/departments", fallbackDepartments),
  
  getDepartment: (id: string) => {
    const defaultDept = fallbackDepartments.find(d => d.id === id) || fallbackDepartments[0];
    const fallbackDetail: DepartmentDetail = {
      ...defaultDept,
      department_name: defaultDept.name,
      head_of_department: id === "cse" ? "Dr. Ramesh Kumar" : (id === "aids" ? "Dr. Priya Sharma" : "Dr. Vijay Rao"),
      hod_image: "/images/alumni/success-story.webp",
      department_image: defaultDept.image,
      courses: fallbackCourses.filter(c => c.department_id === id).map(c => ({
        id: c.id,
        course_name: c.course_name,
        degree_type: c.degree_type,
        duration: c.duration,
        intake: c.intake,
        course_image: c.course_image
      })),
      faculty: [
        { name: id === "cse" ? "Dr. Ramesh Kumar" : (id === "aids" ? "Dr. Priya Sharma" : "Dr. Vijay Rao"), designation: "HOD & Professor", image: "/images/alumni/success-story.webp" },
        { name: "Dr. A. K. Sastry", designation: "Associate Professor", image: "/images/alumni/career-growth.webp" },
        { name: "Mrs. G. Sujatha", designation: "Assistant Professor", image: "/images/alumni/career-growth.webp" }
      ],
      highlights: [
        "State-of-the-art engineering laboratories running customized software boards.",
        "Regular expert lecture series hosted in partnership with tech companies.",
        "Active student bodies planning hackathons and technical exhibition events."
      ]
    };
    return apiFetch<DepartmentDetail>(`/api/v1/academic/departments/${id}`, fallbackDetail);
  },

  getCourses: (degree?: string) => {
    const filteredFallback = degree 
      ? fallbackCourses.filter(c => c.degree_type.toLowerCase() === degree.toLowerCase())
      : fallbackCourses;
    const query = degree ? `?degree=${degree}` : "";
    return apiFetch<CourseSummary[]>(`/api/v1/academic/courses${query}`, filteredFallback);
  },

  getCourse: (id: string) => {
    const courseSum = fallbackCourses.find(c => c.id === id) || fallbackCourses[0];
    const defaultFeatures = [
      { id: "feat-1", course_id: id, feature_title: "Industry-Oriented Curriculum", feature_description: "Designed in consultation with top technology firms, aligning lessons directly with current market tools.", icon: "Code2", display_order: 1 },
      { id: "feat-2", course_id: id, feature_title: "Advanced Smart Labs", feature_description: "High-speed developer boxes running GPU configurations and modern systems.", icon: "Cpu", display_order: 2 },
      { id: "feat-3", course_id: id, feature_title: "Global Placement Channels", feature_description: "Core recruitment links with high average package offerings for eligible graduates.", icon: "Trophy", display_order: 3 }
    ];
    const defaultFees = fallbackFees.filter(f => f.course_id === id);
    const defaultReq = {
      qualification: "10+2 / Intermediate MPC stream or equivalent from a recognized board.",
      minimum_percentage: 60,
      entrance_exam: "AP EAPCET (EAMCET) / JEE Main",
      required_documents: ["10th Standard Marks Memo", "Intermediate Marks Memo (10+2)", "Transfer Certificate (TC)", "EAMCET Rank Card", "Aadhaar Card", "Passport Photos"],
      admission_notes: "70% convener seats allocated via EAMCET rankings. 30% management seats reserved based on scholastic merit."
    };

    const fallbackDetail: CourseDetail = {
      ...courseSum,
      features: defaultFeatures,
      fees: defaultFees,
      admission_requirements: defaultReq
    };

    return apiFetch<CourseDetail>(`/api/v1/academic/courses/${id}`, fallbackDetail);
  },

  getFees: (courseId?: string, academicYear?: string) => {
    let filteredFallback = fallbackFees;
    if (courseId) {
      filteredFallback = filteredFallback.filter(f => f.course_id === courseId);
    }
    if (academicYear) {
      filteredFallback = filteredFallback.filter(f => f.academic_year === academicYear);
    }
    const params = new URLSearchParams();
    if (courseId) params.append("course_id", courseId);
    if (academicYear) params.append("academic_year", academicYear);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<FeeItem[]>(`/api/v1/academic/fees${query}`, filteredFallback);
  },

  getAdmissionInfo: () => apiFetch<AdmissionInfo>("/api/v1/academic/admission", fallbackAdmission),
  
  getScholarships: () => apiFetch<ScholarshipItem[]>("/api/v1/academic/scholarships", fallbackScholarships)
};
