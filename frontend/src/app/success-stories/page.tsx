import type { Metadata } from "next";
import SuccessStoriesClient from "@/components/college/SuccessStoriesClient";

export const metadata: Metadata = {
  title: "Student Success Stories | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore how our students progressed from college classrooms to securing elite engineering positions at Microsoft, Qualcomm, Wipro, and other leading firms.",
};

export default function SuccessStoriesPage() {
  return <SuccessStoriesClient />;
}
