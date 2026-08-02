import type { ApiResponse } from "@/types";

export interface PlacementOverviewData {
  id: string;
  academic_year: string;
  placement_percentage: number;
  total_students: number;
  students_placed: number;
  highest_package: number;
  average_package: number;
  top_recruiters: string[];
  description: string;
}

export interface DepartmentPlacementStat {
  id: string;
  year: number;
  department_id: string;
  students_registered: number;
  students_placed: number;
  placement_percentage: number;
  highest_package: number;
  average_package: number;
}

export interface RecruiterDetail {
  id: string;
  company_name: string;
  company_logo: string;
  industry: string;
  description?: string;
  website?: string;
  hiring_roles?: string[];
}

export interface PlacementStep {
  id: string;
  step_title: string;
  description: string;
  step_number: number;
  icon?: string;
}

export interface TrainingProgramDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  skills_covered: string[];
  image_url: string;
}

export interface InternshipDetail {
  id: string;
  company_name: string;
  domain: string;
  description: string;
  duration: string;
  eligibility?: string;
  application_information?: string;
  image_url?: string;
}

export interface SuccessStory {
  id: string;
  student_name: string;
  department_id: string;
  graduation_year: number;
  current_company: string;
  current_role: string;
  story: string;
  student_image: string;
}

export interface AlumniProfile {
  id: string;
  name: string;
  graduation_year: number;
  department: string;
  current_company: string;
  designation: string;
  achievement: string;
  profile_image: string;
}

export interface CareerResourceDetail {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  link: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fallbacks
const fallbackOverview: PlacementOverviewData[] = [
  {
    id: "overview-2025",
    academic_year: "2025-26",
    placement_percentage: 94.5,
    total_students: 450,
    students_placed: 425,
    highest_package: 15.0,
    average_package: 4.8,
    top_recruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture"],
    description: "Sri Satya Institute of Engineering and Technology holds a stellar reputation for producing industry-ready graduates. Our dedicated Placement Cell bridges the gap between academic education and corporate demands."
  }
];

const fallbackDeptStats: DepartmentPlacementStat[] = [
  { id: "stat-cse-2025", year: 2025, department_id: "cse", students_registered: 120, students_placed: 115, placement_percentage: 95.8, highest_package: 15.0, average_package: 5.2 }
];

const fallbackRecruiters: RecruiterDetail[] = [
  { id: "rec-tcs", company_name: "TCS", company_logo: "/images/recruiters/tcs.webp", industry: "IT", description: "Tata Consultancy Services - A global leader in IT services.", website: "https://www.tcs.com", hiring_roles: ["Systems Engineer", "Developer Associate"] },
  { id: "rec-infosys", company_name: "Infosys", company_logo: "/images/recruiters/infosys.webp", industry: "IT", description: "Infosys - A global leader in next-generation digital services.", website: "https://www.infosys.com", hiring_roles: ["Systems Engineer", "Power Programmer"] }
];

const fallbackProcess: PlacementStep[] = [
  { id: "proc-1", step_title: "Resume Building & Review", description: "Our career mentors review profiles to build professional resumes.", step_number: 1, icon: "FileText" },
  { id: "proc-2", step_title: "Aptitude & Coding Bootcamps", description: "Rigorous training on mathematical aptitude and programming fundamentals.", step_number: 2, icon: "Cpu" },
  { id: "proc-3", step_title: "Mock Interviews", description: "Alumni and industry professionals conduct mock interviews.", step_number: 3, icon: "Users" },
  { id: "proc-4", step_title: "On-Campus Interviews", description: "Leading multinational companies visit the campus.", step_number: 4, icon: "Briefcase" }
];

const fallbackTraining: TrainingProgramDetail[] = [
  { id: "train-coding", title: "Advanced Coding & Data Structures", description: "Intensive bootcamp covering DSA concepts, recursion, trees, and graphs.", category: "Programming", duration: "60 Hours", skills_covered: ["Data Structures", "Algorithms", "C++", "Java", "Python"], image_url: "/images/alumni/career-growth.webp" },
  { id: "train-verbal", title: "Communication Skills Workshop", description: "Polishing public speaking and presentation dynamics.", category: "Communication", duration: "30 Hours", skills_covered: ["Business English", "Public Speaking"], image_url: "/images/alumni/career-growth.webp" }
];

const fallbackInternships: InternshipDetail[] = [
  { id: "intern-1", company_name: "Wipro Limited", domain: "Software Engineering Intern", description: "Work on real-world IT services projects.", duration: "3 Months", eligibility: "B.Tech 3rd/4th Year students.", application_information: "Apply via Placement cell portal.", image_url: "/images/alumni/career-growth.webp" }
];

const fallbackStories: SuccessStory[] = [
  { id: "story-rahul", student_name: "Rahul Kumar", department_id: "cse", graduation_year: 2025, current_company: "TCS", current_role: "Assistant Systems Engineer", story: "Entering college, I was anxious about my tech skills, but the rigorous training bootcamps at SSIET built my foundations.", student_image: "/images/alumni/career-growth.webp" }
];

const fallbackAlumni: AlumniProfile[] = [
  { id: "alum-sita", name: "Sita Devi", graduation_year: 2022, department: "Computer Science & Engineering", current_company: "Microsoft", designation: "Software Engineer II", achievement: "Won the Microsoft Global Hackathon Innovation trophy in 2024.", profile_image: "/images/alumni/career-growth.webp" }
];

const fallbackResources: CareerResourceDetail[] = [
  { id: "res-dsa", title: "Data Structures & Algorithms Interview Sheet", description: "A handpicked directory of 150 most common coding questions.", resource_type: "Preparation Guide", link: "#" }
];

async function apiFetch<T>(endpoint: string, fallback: T): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error("API Connection down");
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch {
    return { success: true, data: fallback };
  }
}

export const careerService = {
  getPlacementOverview: () => apiFetch<PlacementOverviewData[]>("/api/v1/career/placements", fallbackOverview),
  
  getDepartmentPlacements: (deptId: string) => 
    apiFetch<DepartmentPlacementStat[]>(`/api/v1/career/placements/${deptId}`, fallbackDeptStats),
  
  getRecruiters: (industry?: string) => {
    const queryStr = industry ? `?industry=${encodeURIComponent(industry)}` : "";
    return apiFetch<RecruiterDetail[]>(`/api/v1/career/recruiters${queryStr}`, fallbackRecruiters);
  },
  
  getPlacementProcess: () => apiFetch<PlacementStep[]>("/api/v1/career/process", fallbackProcess),
  
  getTrainingPrograms: () => apiFetch<TrainingProgramDetail[]>("/api/v1/career/training", fallbackTraining),
  
  getInternships: () => apiFetch<InternshipDetail[]>("/api/v1/career/internships", fallbackInternships),
  
  getStudentStories: () => apiFetch<SuccessStory[]>("/api/v1/career/stories", fallbackStories),
  
  getAlumni: () => apiFetch<AlumniProfile[]>("/api/v1/career/alumni", fallbackAlumni),
  
  getCareerResources: () => apiFetch<CareerResourceDetail[]>("/api/v1/career/resources", fallbackResources)
};
