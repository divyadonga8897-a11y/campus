// ============================================================
// API Service Layer for CampusConnect AI
// Connects to FastAPI backend
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

export const getApiBase = () => {
  const envVal = process.env.NEXT_PUBLIC_API_URL;
  const isProduction = process.env.NODE_ENV === "production";
  
  if (!envVal) {
    if (isProduction) {
      console.warn("WARNING: NEXT_PUBLIC_API_URL is missing in production environment!");
    }
    return "http://localhost:8000";
  }
  
  let val = envVal.trim();
  if (val.includes(",")) {
    val = val.split(",")[0].trim();
  }
  
  // Strip trailing slashes
  val = val.replace(/\/+$/, "");
  
  return val;
};

export const API_BASE = getApiBase();

export async function apiFetch<T>(endpoint: string, fallback: T): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    // Normalize endpoint to prevent duplicate slashes
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE}${cleanEndpoint}`;
    
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60s
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
    
    if (!res.ok) {
      throw new Error(`API error: HTTP ${res.status}`);
    }
    
    const json = await res.json();
    return { success: true, data: json.data ?? json };
  } catch (err: any) {
    console.error(`[API Fetch Failure] Endpoint: ${endpoint}, Error:`, err);
    
    // In production, do not silently fall back to mock data
    if (process.env.NODE_ENV === "production") {
      return { success: false, data: fallback, error: err.message || "Connection error" };
    }
    
    // In development/local, fall back to local constants
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
