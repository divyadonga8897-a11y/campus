import type { Metadata } from "next";
import LabsClient from "@/components/college/LabsClient";

export const metadata: Metadata = {
  title: "Advanced Engineering Laboratories | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore our specialized laboratories including the AI Research Lab, Programming Language Labs, and VLSI circuit rooms.",
};

export default function LabsPage() {
  return <LabsClient />;
}
