import type { Metadata } from "next";
import AdmissionsClient from "@/components/college/AdmissionsClient";

export const metadata: Metadata = {
  title: "Admissions Guidance 2026-27 | Sri Satya Institute of Engineering and Technology",
  description:
    "Learn about step-by-step admissions counseling, eligibility cutoffs, required documents checklist, fee payment protocols, and important registration dates at SSIET.",
  keywords: [
    "SSIET Admissions",
    "Engineering Admission AP",
    "EAMCET Cutoff",
    "B.Tech Eligibility",
    "Admission Dates 2026",
    "Sri Satya Institute Admission"
  ]
};

export default function AdmissionsPage() {
  return <AdmissionsClient />;
}
