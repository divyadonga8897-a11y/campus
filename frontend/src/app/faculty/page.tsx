import type { Metadata } from "next";
import FacultyClient from "@/components/college/FacultyClient";

export const metadata: Metadata = {
  title: "Faculty Directory | Sri Satya Institute of Engineering and Technology",
  description:
    "Meet our distinguished engineering faculty members, professors, research advisors, and laboratory guides at SSIET.",
};

export default function FacultyPage() {
  return <FacultyClient />;
}
