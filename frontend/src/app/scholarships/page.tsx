import type { Metadata } from "next";
import ScholarshipsClient from "@/components/college/ScholarshipsClient";

export const metadata: Metadata = {
  title: "Scholarships | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore merit-based, sports, and community-specific scholarship programs at SSIET. Learn about eligibility criteria, benefit rates, and applications.",
};

export default function ScholarshipsPage() {
  return <ScholarshipsClient />;
}
