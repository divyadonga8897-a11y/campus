import type { Metadata } from "next";
import PlacementsClient from "@/components/college/PlacementsClient";

export const metadata: Metadata = {
  title: "Placements & Career Opportunities | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore placement statistics, recruiting partners, internship opportunities, alumni success stories, and career mentoring details at SSIET.",
};

export default function PlacementsPage() {
  return <PlacementsClient />;
}
