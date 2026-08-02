import type { ApiResponse } from "@/types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Detailed local mock response generator in case API is unreachable
function getLocalMockResponse(message: string): string {
  const query = message.toLowerCase();

  if (anyWord(query, ["fee", "fees", "cost", "charge", "tuition"])) {
    return (
      "Here is the annual B.Tech fee structure (A.Y. 2024-25):\n\n" +
      "- **CSE**: 85,000 INR/year\n" +
      "- **AI & Data Science**: 90,000 INR/year\n" +
      "- **ECE**: 80,000 INR/year\n" +
      "- **Mechanical**: 78,000 INR/year\n" +
      "- **Civil**: 75,000 INR/year\n\n" +
      "*Additional Options: Hostel & Dining: 55,000 INR/year | Transport: 18,000 INR/year.*"
    );
  }

  if (anyWord(query, ["scholarship", "scholarships", "concession", "reimbursement", "financial aid"])) {
    return (
      "SSIET offers the following scholarships:\n\n" +
      "1. **Merit Excellence Scholarship**: 50% tuition waiver for top ranks or 90%+ marks in 10+2.\n" +
      "2. **SC/ST Government Reimbursements**: Full tuition fee waiver for eligible students with family income < 2.5 LPA.\n" +
      "3. **Sports Achievements**: Special concessions for state/national-level medalists."
    );
  }

  if (anyWord(query, ["placement", "placements", "recruit", "recruiter", "salary", "package", "lpa"])) {
    return (
      "SSIET has recorded exceptional placement metrics (Class of 2024):\n\n" +
      "- **Placement Rate**: 94%\n" +
      "- **Highest Package**: 14.5 LPA\n" +
      "- **Average Package**: 5.1 LPA\n" +
      "- **Top Recruiters**: TCS, Infosys, Wipro, Accenture, Amazon, and Qualcomm."
    );
  }

  if (anyWord(query, ["hostel", "hostels", "mess", "dining", "room", "accommodation"])) {
    return (
      "Our residential hostel blocks include:\n\n" +
      "- Separate multi-story buildings for boys and girls inside the security boundaries.\n" +
      "- Double & triple sharing spacious rooms equipped with study tables, beds, and wardrobes.\n" +
      "- Hygienic student dining mess serving vegetarian and non-vegetarian menus.\n" +
      "- 24/7 security guards, biometric checkpoints, and active RO drinking water points."
    );
  }

  if (anyWord(query, ["course", "courses", "department", "departments", "programs", "b.tech", "cse", "aids", "ece", "civil", "mech"])) {
    return (
      "SSIET offers five 4-year undergraduate B.Tech programs:\n\n" +
      "- **Computer Science Engineering (CSE)**\n" +
      "- **Artificial Intelligence & Data Science (AI&DS)**\n" +
      "- **Electronics & Communication Engineering (ECE)**\n" +
      "- **Mechanical Engineering (ME)**\n" +
      "- **Civil Engineering (CE)**\n\n" +
      "Eligibility: 10+2 with MPC subjects and valid EAMCET / JEE ranks."
    );
  }

  return (
    "Hello! I am the **CampusConnect AI Assistant**.\n\n" +
    "I can help you clear up any doubts about admissions, engineering departments, fee structures, hostel rules, or placement statistics.\n\n" +
    "Try asking: *'What is the highest placement package?'* or *'Are there any scholarships?'*"
  );
}

function anyWord(query: string, words: string[]): boolean {
  return words.some((w) => query.includes(w));
}

export const chatService = {
  sendMessage: async (
    message: string,
    history: ChatMessage[]
  ): Promise<ApiResponse<string>> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      if (!res.ok) throw new Error("API Offline");
      const json = await res.json();
      return { success: true, data: json.data ?? json };
    } catch {
      // Return semantic fallback response if API crashes
      return { success: true, data: getLocalMockResponse(message) };
    }
  },
};
