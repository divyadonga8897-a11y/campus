import type { Metadata } from "next";
import CareerResourcesClient from "@/components/college/CareerResourcesClient";

export const metadata: Metadata = {
  title: "Career Resources & Interview Tips | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore interview preparation roadmaps, verbal reasoning guides, sample resumes, coding questions banks, and core engineering interview sheets.",
};

export default function CareerResourcesPage() {
  return <CareerResourcesClient />;
}
