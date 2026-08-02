import type { Metadata } from "next";
import InternshipsClient from "@/components/college/InternshipsClient";

export const metadata: Metadata = {
  title: "Internship Opportunities | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore internship hiring domains, durations, company listings, eligibility criteria, and application protocols at SSIET.",
};

export default function InternshipsPage() {
  return <InternshipsClient />;
}
