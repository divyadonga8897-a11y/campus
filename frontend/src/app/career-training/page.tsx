import type { Metadata } from "next";
import TrainingClient from "@/components/college/TrainingClient";

export const metadata: Metadata = {
  title: "Career & Placement Training Programs | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore SSIET's placement bootcamps, programming courses, communication workshops, quantitative aptitude training, and corporate readiness preparation.",
};

export default function CareerTrainingPage() {
  return <TrainingClient />;
}
