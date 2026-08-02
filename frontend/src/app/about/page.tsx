import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AboutPageClient from "@/components/college/AboutPageClient";

export const metadata: Metadata = {
  title: "About Sri Satya Institute of Engineering and Technology | CampusConnect AI",
  description:
    "Explore college history, vision, mission, leadership, achievements and campus information.",
};

export default function AboutPage() {
  return (
    <>
      <AboutPageClient />
    </>
  );
}
