// ============================================================
// API Service Layer for CampusConnect AI
// Connects to FastAPI backend at localhost:8000
// Falls back to constants if backend unavailable
// ============================================================

import {
  COLLEGE_INFO,
  COLLEGE_STATS,
  COLLEGE_TIMELINE,
  ACHIEVEMENTS,
  DEPARTMENTS,
  COURSES,
  FEE_STRUCTURE,
  SCHOLARSHIPS,
  PLACEMENT_STATS,
} from "@/constants/collegeData";
import type { ApiResponse } from "@/types";

const getApiBase = () => {
  const envVal = process.env.NEXT_PUBLIC_API_URL;
  if (!envVal) return "http://localhost:8000";
  if (envVal.includes(",")) return envVal.split(",")[0].trim();
  return envVal.trim();
};
const API_BASE = getApiBase();

async function apiFetch<T>(endpoint: string, fallback: T): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 60 }, // Cache for 60s
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch {
    // Fallback to local constants when backend is unavailable
    return { success: true, data: fallback };
  }
}

export const collegeService = {
  getCollege: () =>
    apiFetch("/api/v1/college", {
      ...COLLEGE_INFO,
      stats: COLLEGE_STATS,
      timeline: COLLEGE_TIMELINE,
      achievements: ACHIEVEMENTS,
    }),

  getDepartments: () => apiFetch("/api/v1/departments", DEPARTMENTS),

  getDepartment: (id: string) =>
    apiFetch(
      `/api/v1/departments/${id}`,
      DEPARTMENTS.find((d) => d.id === id || d.slug === id) ?? DEPARTMENTS[0]
    ),

  getCourses: () => apiFetch("/api/v1/courses", COURSES),

  getCourse: (slug: string) =>
    apiFetch(
      `/api/v1/courses/${slug}`,
      COURSES.find((c) => c.slug === slug) ?? COURSES[0]
    ),

  getFees: () => apiFetch("/api/v1/fees", FEE_STRUCTURE),

  getScholarships: () => apiFetch("/api/v1/scholarships", SCHOLARSHIPS),

  getPlacementStats: () => apiFetch("/api/v1/placements", PLACEMENT_STATS),
};
