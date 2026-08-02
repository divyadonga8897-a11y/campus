import type { Metadata } from "next";
import AlumniClient from "@/components/college/AlumniClient";

export const metadata: Metadata = {
  title: "SSIET Alumni Showcase | Sri Satya Institute of Engineering and Technology",
  description:
    "Connect with our global alumni network. Search by graduation year, departments, and corporate company names to discover achievements.",
};

export default function AlumniPage() {
  return <AlumniClient />;
}
