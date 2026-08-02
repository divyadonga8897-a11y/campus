import type { Metadata } from "next";
import StudentLifeClient from "@/components/college/StudentLifeClient";

export const metadata: Metadata = {
  title: "Student Life & Journey | Sri Satya Institute of Engineering and Technology",
  description:
    "Discover the vibrant student life at SSIET. Explore technical activities, hackathons, cultural events, clubs, sports complexes, and follow the 4-year student growth timeline journey.",
};

export default function StudentLifePage() {
  return <StudentLifeClient />;
}
