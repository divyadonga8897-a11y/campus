import type { Metadata } from "next";
import CampusAIClient from "./CampusAIClient";

export const metadata: Metadata = {
  title: "Campus AI — Ask Anything About SSIET",
  description:
    "Get instant answers about SSIET courses, fees, hostel, placements, labs, and admissions from our AI-powered campus assistant.",
};

export default function CampusAIPage() {
  return <CampusAIClient />;
}
