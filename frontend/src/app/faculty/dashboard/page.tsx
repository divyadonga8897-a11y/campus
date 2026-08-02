import type { Metadata } from "next";
import FacultyDashboardClient from "@/components/college/FacultyDashboardClient";

export const metadata: Metadata = {
  title: "Faculty Dashboard | CampusConnect AI Portal",
  description: "Manage classes allocations, submit grade sheets and results, track research guidelines and post student attendance metrics.",
};

export default function FacultyDashboardPage() {
  return <FacultyDashboardClient />;
}
