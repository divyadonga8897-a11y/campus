// ============================================================
// College Information Management Service
// Connects to FastAPI college endpoints
// Falls back to static configurations if server is offline
// ============================================================

import type { ApiResponse } from "@/types";
import { COLLEGE_INFO, ACHIEVEMENTS } from "@/constants/collegeData";

export interface CollegeProfile {
  id: string;
  college_name: string;
  short_description: string;
  full_description: string;
  established_year: number;
  location: string;
  affiliation: string;
  approval_details: string;
  website: string;
  email: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export interface VisionMission {
  id: string;
  vision: string;
  mission: readonly string[];
  core_values: readonly string[];
  created_at?: string;
  updated_at?: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at?: string;
}

export interface CollegeAchievement {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
  image_url: string;
  created_at?: string;
}

export interface CollegeAccreditation {
  id: string;
  organization_name: string;
  certificate_name: string;
  description: string;
  year: number;
  image_url: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description?: string;
  created_at?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Static Fallbacks for offline resilience ---
const fallbackProfile: CollegeProfile = {
  id: "ssiet-profile",
  college_name: COLLEGE_INFO.name,
  short_description: COLLEGE_INFO.description.substring(0, 120) + "...",
  full_description: COLLEGE_INFO.description,
  established_year: COLLEGE_INFO.established,
  location: COLLEGE_INFO.location,
  affiliation: "Affiliated to Jawaharlal Nehru Technological University (JNTU)",
  approval_details: "Approved by AICTE, New Delhi",
  website: COLLEGE_INFO.website,
  email: COLLEGE_INFO.email,
  phone: COLLEGE_INFO.phone
};

const fallbackVision: VisionMission = {
  id: "ssiet-vision",
  vision: COLLEGE_INFO.vision,
  mission: COLLEGE_INFO.mission,
  core_values: ["Innovation", "Excellence", "Integrity", "Leadership", "Research Focus"]
};

const fallbackLeadership: LeadershipMember[] = [
  {
    id: "ldr-chairman",
    name: "Sri K. Satyanarayana",
    designation: "Chairman",
    qualification: "M.S. (USA)",
    description: "A visionary educationist with over 25 years of experience in establishing premier institutions. Dedicated to fostering innovation and holistic student growth.",
    image_url: "/images/alumni/success-story.webp",
    display_order: 1
  },
  {
    id: "ldr-principal",
    name: "Dr. Ramesh Kumar",
    designation: "Principal",
    qualification: "Ph.D, M.Tech (IIT Madras)",
    description: "An esteemed academician and administrator who has published 30+ international research papers. Guided the college towards high-quality JNTU academic standards.",
    image_url: "/images/alumni/success-story.webp",
    display_order: 2
  },
  {
    id: "ldr-director",
    name: "Dr. Priya Sharma",
    designation: "Director of Academics",
    qualification: "Ph.D (NIT)",
    description: "Under her supervision, the institution co-designed industry-focused curriculums and set up specialized AI labs.",
    image_url: "/images/alumni/career-growth.webp",
    display_order: 3
  }
];

const fallbackAchievements: CollegeAchievement[] = ACHIEVEMENTS.map((ach, idx) => ({
  id: `ach-${idx}`,
  title: ach.title,
  description: ach.description,
  category: ach.category,
  year: idx % 2 === 0 ? 2024 : 2023,
  image_url: idx % 2 === 0 ? "/images/campus/main-building.webp" : "/images/campus/computer-lab.png"
}));

const fallbackAccreditation: CollegeAccreditation[] = [
  {
    id: "acc-naac",
    organization_name: "NAAC",
    certificate_name: "A-Grade Accreditation",
    description: "Accredited with an A-Grade representing high standards in classroom quality, infrastructure, and leadership.",
    year: 2024,
    image_url: "/images/accreditations/naac.webp"
  },
  {
    id: "acc-nba",
    organization_name: "NBA",
    certificate_name: "NBA Certification",
    description: "NBA accredited programs for key engineering streams including CSE, AIDS and ECE.",
    year: 2023,
    image_url: "/images/accreditations/nba.webp"
  },
  {
    id: "acc-aicte",
    organization_name: "AICTE",
    certificate_name: "AICTE Approval",
    description: "Approved by All India Council for Technical Education, New Delhi for technical B.Tech courses.",
    year: 2000,
    image_url: "/images/accreditations/aicte.webp"
  }
];

const fallbackGallery: GalleryItem[] = [
  { id: "gal-1", title: "Cinematic Campus Aerial", category: "campus", image_url: "/images/campus/main-building.webp", description: "Aerial view of Sri Satya Institute green campus lawns." },
  { id: "gal-2", title: "Modern Academic Block", category: "campus", image_url: "/images/campus/academic-block.webp", description: "Main entrance to the state-of-the-art engineering block." },
  { id: "gal-3", title: "AI Deep Learning Lab", category: "labs", image_url: "/images/campus/computer-lab.png", description: "Students collaborating on deep learning research projects." },
  { id: "gal-4", title: "Spacious Central Library", category: "labs", image_url: "/images/campus/library-interior.png", description: "Comfortable reading cabins and computer reference sections." },
  { id: "gal-5", title: "Smart Smart Classrooms", category: "labs", image_url: "/images/campus/academic-block.webp", description: "Interactive digital classroom environment in progress." },
  { id: "gal-6", title: "National Hackathon Finals", category: "events", image_url: "/images/student-life/coding.webp", description: "Tech-savvy minds solving real-world challenges at the annual event." },
  { id: "gal-7", title: "College Annual Cultural Fest", category: "events", image_url: "/images/student-life/events.webp", description: "A lively stage event showcasing student artistic talents." },
  { id: "gal-8", title: "Inter-College Football Finals", category: "student_life", image_url: "/images/campus/sports-ground.png", description: "Our college football team celebrating a league victory." },
  { id: "gal-9", title: "Modern Hostel Quadrangle", category: "campus", image_url: "/images/hostel/hostel-room.png", description: "Green courtyards and study spaces inside the hostel wings." },
  { id: "gal-10", title: "Spacious Student Dining Mess", category: "student_life", image_url: "/images/hostel/mess.webp", description: "Clean and hygienic dining services for hostel students." },
  { id: "gal-11", title: "Robotics Project Exhibition", category: "achievements", image_url: "/images/student-life/coding.webp", description: "Students showcasing autonomous drone prototypes." },
  { id: "gal-12", title: "Best Engineering College Award", category: "achievements", image_url: "/images/campus/main-building.webp", description: "Receiving academic excellence awards from state council representatives." }
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

export const collegeService = {
  getCollege: () => apiFetch<any>("/api/v1/college", {
    ...COLLEGE_INFO,
    stats: [
      { label: "Years of Excellence", value: 25, suffix: "+", icon: "Award" },
      { label: "Students Enrolled", value: 5000, suffix: "+", icon: "Users" },
      { label: "Faculty Members", value: 150, suffix: "+", icon: "GraduationCap" },
      { label: "Engineering Programs", value: 8, suffix: "", icon: "BookOpen" },
      { label: "Placement Rate", value: 92, suffix: "%", icon: "TrendingUp" }
    ],
    timeline: [
      { year: 2000, title: "College Establishment", description: "Founded with a vision to provide quality engineering education." },
      { year: 2004, title: "Infrastructure Expansion", description: "Major campus expansion with new academic blocks and labs." },
      { year: 2008, title: "New Engineering Departments", description: "Launch of specialized programs in ECE, Mech, and Civil." },
      { year: 2012, title: "Industry Collaborations", description: "Strategic partnerships with leading IT and manufacturing firms." },
      { year: 2016, title: "AI & Innovation Hub", description: "Established cutting-edge AI and Data Science lab." },
      { year: 2020, title: "Digital Transformation", description: "Smart classrooms and online learning platforms launched." },
      { year: 2024, title: "Centre of Excellence", description: "Accredited with NAAC high-grade certifications." }
    ],
    achievements: ACHIEVEMENTS
  }),
  getProfile: () => apiFetch<CollegeProfile>("/api/v1/college/profile", fallbackProfile),
  getVision: () => apiFetch<VisionMission>("/api/v1/college/vision", fallbackVision),
  getLeadership: () => apiFetch<LeadershipMember[]>("/api/v1/college/leadership", fallbackLeadership),
  getAchievements: (category?: string) => {
    const query = category ? `?category=${category}` : "";
    const filteredFallback = category 
      ? fallbackAchievements.filter(ach => ach.category.toLowerCase() === category.toLowerCase())
      : fallbackAchievements;
    return apiFetch<CollegeAchievement[]>(`/api/v1/college/achievements${query}`, filteredFallback);
  },
  getAccreditation: () => apiFetch<CollegeAccreditation[]>("/api/v1/college/accreditation", fallbackAccreditation),
  getGallery: (category?: string) => {
    const query = category && category !== "all" ? `?category=${category}` : "";
    const filteredFallback = category && category !== "all"
      ? fallbackGallery.filter(item => item.category.toLowerCase() === category.toLowerCase())
      : fallbackGallery;
    return apiFetch<GalleryItem[]>(`/api/v1/college/gallery${query}`, filteredFallback);
  }
};
