import type { Metadata } from "next";
import AchievementsClient from "@/components/college/AchievementsClient";

export const metadata: Metadata = {
  title: "Academic & Placement Achievements | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore the state rankings, academic milestones, research publications, and core placement achievements of Sri Satya Institute of Engineering and Technology.",
  keywords: [
    "SSIET Achievements",
    "JNTU Rank Holders",
    "Engineering College Awards AP",
    "College Research Publications",
    "Top Placed Students"
  ]
};

export default function AchievementsPage() {
  return <AchievementsClient />;
}
