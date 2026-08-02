import type { Metadata } from "next";
import { Suspense } from "react";
import CoursesClient from "@/components/courses/CoursesClient";

export const metadata: Metadata = {
  title: "Engineering Courses | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore engineering programs, departments, fees, eligibility and career opportunities.",
};

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-xs text-slate-400">Loading courses catalog...</div>}>
      <CoursesClient />
    </Suspense>
  );
}
