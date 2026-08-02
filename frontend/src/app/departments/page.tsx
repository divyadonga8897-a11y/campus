import type { Metadata } from "next";
import DepartmentsClient from "@/components/college/DepartmentsClient";

export const metadata: Metadata = {
  title: "Departments | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore all engineering departments at SSIET — CSE, AI&DS, ECE, Mechanical, and Civil Engineering.",
};

export default function DepartmentsPage() {
  return <DepartmentsClient />;
}
