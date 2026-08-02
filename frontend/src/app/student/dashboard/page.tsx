import type { Metadata } from "next";
import StudentDashboardClient from "@/components/college/StudentDashboardClient";

export const metadata: Metadata = {
  title: "Student Dashboard | CampusConnect AI Portal",
  description: "View your classes attendance rate, exam results, assignments ledger, hostel status, and fees payment schedules.",
};

export default function StudentDashboardPage() {
  return <StudentDashboardClient />;
}
