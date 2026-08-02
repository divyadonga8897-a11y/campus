import type { Metadata } from "next";
import InfrastructureClient from "@/components/college/InfrastructureClient";

export const metadata: Metadata = {
  title: "Academic & Tech Infrastructure | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore modern smart classrooms, high-performance GPU AI laboratories, software research labs, central libraries, and innovation incubator centers at SSIET.",
};

export default function InfrastructurePage() {
  return <InfrastructureClient />;
}
