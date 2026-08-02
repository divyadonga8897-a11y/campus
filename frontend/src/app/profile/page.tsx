import type { Metadata } from "next";
import ProfileClient from "@/components/college/ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | CampusConnect AI Portal",
  description: "View and manage your academic profile records, contact information and credentials safety.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
