import type { Metadata } from "next";
import CampusTourClient from "@/components/college/CampusTourClient";

export const metadata: Metadata = {
  title: "Virtual Campus Tour | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore Sri Satya Institute of Engineering and Technology campus map. Take an interactive 2D tour of the Academic Block, AI Labs, Central Library, and Hostels.",
};

export default function CampusPage() {
  return <CampusTourClient />;
}
