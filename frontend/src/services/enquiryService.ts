import type { ApiResponse } from "@/types";

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  step_number: number;
  category: string;
}

export interface EligibilityDetail {
  id: string;
  course_id: string;
  qualification: string;
  minimum_percentage: number;
  entrance_requirement: string;
  additional_requirements: string[];
}

export interface RequiredDoc {
  id: string;
  document_name: string;
  description: string;
  category: string;
  mandatory: boolean;
}

export interface TimelineEvent {
  id: string;
  event_name: string;
  description: string;
  start_date: string;
  end_date: string;
  category: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
}

export interface ContactDetail {
  id: string;
  department: string;
  phone: string;
  email: string;
  address: string;
  office_hours: string;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  course_interest: string;
  message: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fallbacks
const fallbackProcess: ProcessStep[] = [
  { id: "step-1", title: "Select Preferred Program", description: "Browse B.Tech specializations (CSE, AIDS, ECE, Mech, Civil) matching your career goals.", step_number: 1, category: "General" },
  { id: "step-2", title: "Check Eligibility & Cut-offs", description: "Verify qualifying Intermediate MPC percentages (min 60%) and counseling cutoffs.", step_number: 2, category: "General" },
  { id: "step-3", title: "Counseling Seat Allocation", description: "Secure state EAPCET counseling allocations or register under direct management quotas.", step_number: 3, category: "General" },
  { id: "step-4", title: "Verify Credentials & Confirm", description: "Submit certificates, deposit the fee tier, and retrieve your student ID catalog.", step_number: 4, category: "General" }
];

const fallbackDocs: RequiredDoc[] = [
  { id: "doc-ssc", document_name: "SSC / 10th Class Marks Memo", description: "Proof of age and standard compliance verification.", category: "Academic", mandatory: true },
  { id: "doc-inter", document_name: "Intermediate / 12th Class Marks Memo", description: "Verifies qualifying subject percentages.", category: "Academic", mandatory: true },
  { id: "doc-rank", document_name: "EAPCET / JEE Rank Statement", description: "Counseling allocation eligibility rank sheet.", category: "Entrance", mandatory: true }
];

const fallbackTimeline: TimelineEvent[] = [
  { id: "time-app", event_name: "Online Application Window", description: "Submission of application forms online.", start_date: "May 15, 2026", end_date: "July 15, 2026", category: "Application" },
  { id: "time-counsel", event_name: "State Counseling Options Web-Entry", description: "Seat allocation selection rounds.", start_date: "July 20, 2026", end_date: "August 05, 2026", category: "Counselling" }
];

const fallbackFAQs: FAQItem[] = [
  { id: "faq-1", question: "What is the minimum intermediate cutoff score for B.Tech CSE?", answer: "Candidates require a minimum of 60% aggregate in MPC (Math, Physics, Chemistry) and qualifying EAPCET/JEE Main rank.", category: "Admission", display_order: 1 },
  { id: "faq-2", question: "Is there transportation facility available for day scholars?", answer: "Yes, the institution operates a fleet of buses covering key boarding points across the surrounding towns.", category: "Campus", display_order: 2 }
];

const fallbackContacts: ContactDetail[] = [
  {
    id: "contact-general",
    department: "General Admissions Wing",
    phone: "+91 9000-000-000",
    email: "admissions@ssiet.ac.in",
    address: "Administrative Block Ground Floor, SSIET Campus, West Godavari, AP",
    office_hours: "9:00 AM - 5:00 PM (Monday to Saturday)"
  }
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

export const enquiryService = {
  getAdmissionProcess: () => apiFetch<ProcessStep[]>("/api/v1/admission/process", fallbackProcess),
  
  getEligibility: (courseId: string) => {
    const fallbackEligibility: EligibilityDetail = {
      id: `elig-${courseId}`,
      course_id: courseId,
      qualification: "Intermediate (10+2) with MPC stream",
      minimum_percentage: 60,
      entrance_requirement: "State counseling EAPCET rank or national level JEE Main rank qualification",
      additional_requirements: ["MPC aggregate must be >= 60%"]
    };
    return apiFetch<EligibilityDetail>(`/api/v1/admission/eligibility/${courseId}`, fallbackEligibility);
  },

  getDocuments: () => apiFetch<RequiredDoc[]>("/api/v1/admission/documents", fallbackDocs),
  
  getTimeline: () => apiFetch<TimelineEvent[]>("/api/v1/admission/timeline", fallbackTimeline),
  
  getFAQs: (category?: string) => {
    const queryStr = category ? `?category=${encodeURIComponent(category)}` : "";
    return apiFetch<FAQItem[]>(`/api/v1/admission/faqs${queryStr}`, fallbackFAQs);
  },

  getContactInfo: () => apiFetch<ContactDetail[]>("/api/v1/contact", fallbackContacts),

  submitEnquiry: async (payload: EnquiryPayload): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admission/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Failed to submit enquiry");
      return { success: true, data: json };
    } catch (err: any) {
      return { success: false, error: err.message || "Connection error" };
    }
  }
};
