import type { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin CMS Dashboard | Sri Satya Institute of Engineering and Technology",
  description: "Manage college profiles, departments, fees structures, placements, student enquiries, and image galleries.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
