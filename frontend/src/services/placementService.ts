import { apiFetch } from "./api";
import type { ApiResponse } from "@/types";

export interface PlacementStat {
  id: string;
  year: number;
  highest_package: string;
  average_package: string;
  placement_percentage: number;
  companies_count: number;
  students_placed: number;
}

export interface Recruiter {
  id: string;
  company_name: string;
  logo_url: string;
  industry: string;
  description?: string;
}

export interface Testimonial {
  id: string;
  student_name: string;
  department: string;
  batch: string;
  message: string;
  rating: number;
  image_url: string;
}


// Local static fallbacks
const fallbackStats: PlacementStat[] = [
  { id: "stat-2022", year: 2022, highest_package: "10.5 LPA", average_package: "4.2 LPA", placement_percentage: 89, companies_count: 85, students_placed: 295 },
  { id: "stat-2023", year: 2023, highest_package: "12.0 LPA", average_package: "4.5 LPA", placement_percentage: 92, companies_count: 98, students_placed: 312 },
  { id: "stat-2024", year: 2024, highest_package: "14.5 LPA", average_package: "5.1 LPA", placement_percentage: 94, companies_count: 112, students_placed: 338 },
];

const fallbackRecruiters: Recruiter[] = [
  { id: "rec-tcs", company_name: "TCS", logo_url: "/images/recruiters/tcs.webp", industry: "Technology", description: "Tata Consultancy Services" },
  { id: "rec-infosys", company_name: "Infosys", logo_url: "/images/recruiters/infosys.webp", industry: "Technology", description: "Infosys Limited" },
  { id: "rec-wipro", company_name: "Wipro", logo_url: "/images/recruiters/wipro.webp", industry: "Service", description: "Wipro Limited" },
  { id: "rec-accenture", company_name: "Accenture", logo_url: "/images/recruiters/accenture.webp", industry: "Service", description: "Accenture" },
  { id: "rec-cognizant", company_name: "Cognizant", logo_url: "/images/recruiters/cognizant.webp", industry: "Service", description: "Cognizant" },
  { id: "rec-techm", company_name: "Tech Mahindra", logo_url: "/images/recruiters/techm.webp", industry: "Technology", description: "Tech Mahindra" },
];

const fallbackTestimonials: Testimonial[] = [
  {
    id: "test-1",
    student_name: "Nikhil Reddy",
    department: "Computer Science Engineering",
    batch: "2020-2024",
    message: "SSIET's placement cell and bootcamps prepared me thoroughly for mock interviews. The coding clubs and faculty mentoring helped me land a Software Engineer role at a top IT firm.",
    rating: 5,
    image_url: "/images/alumni/success-story.webp"
  },
  {
    id: "test-2",
    student_name: "Divya Sri",
    department: "Artificial Intelligence & Data Science",
    batch: "2020-2024",
    message: "The curriculum in the AI & DS department is perfectly aligned with industry needs. I was able to secure a Data Analyst internship which transitioned into a full-time role during campus drives.",
    rating: 5,
    image_url: "/images/alumni/career-growth.webp"
  },
  {
    id: "test-3",
    student_name: "Pavan Kalyan",
    department: "Electronics & Communication Engineering",
    batch: "2019-2023",
    message: "The VLSI and embedded labs at SSIET gave me rich practical experience. I'm thankful to my professors who guided me to secure a placement at an premium electronics firm.",
    rating: 5,
    image_url: "/images/alumni/success-story.webp"
  }
];


export const placementService = {
  getStats: () => apiFetch("/api/v1/placements", fallbackStats),
  getRecruiters: () => apiFetch("/api/v1/recruiters", fallbackRecruiters),
  getTestimonials: () => apiFetch("/api/v1/testimonials", fallbackTestimonials),
};
