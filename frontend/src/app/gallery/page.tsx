import type { Metadata } from "next";
import GalleryClient from "@/components/college/GalleryClient";

export const metadata: Metadata = {
  title: "Media Gallery | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore the visual showcase of Sri Satya Institute. View categorizable high-fidelity campus photography of lawns, laboratories, technical hackathons, cultural fests, and student achievements.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
