import type { Metadata } from "next";
import ResearchClient from "@/components/college/ResearchClient";

export const metadata: Metadata = {
  title: "Research & Innovations | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore engineering research patents, scholarly publications, dynamic projects, and centers of excellence at SSIET.",
};

export default function ResearchPage() {
  return <ResearchClient />;
}
