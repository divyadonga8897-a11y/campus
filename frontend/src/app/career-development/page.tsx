import type { Metadata } from "next";
import CareerDevelopmentClient from "@/components/college/CareerDevelopmentClient";

export const metadata: Metadata = {
  title: "Career Development Center (CDC) | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore training programs, coding prep classes, aptitude sessions, technical mock interviews, and the 4-year placement preparation journey at SSIET's CDC.",
};

export default function CareerDevelopmentPage() {
  return <CareerDevelopmentClient />;
}
