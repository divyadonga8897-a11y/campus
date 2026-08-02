import type { Metadata } from "next";
import FAQClient from "@/components/college/FAQClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Sri Satya Institute of Engineering and Technology",
  description:
    "Get answers regarding B.Tech admissions requirements, intermediate board marks cutoffs, tuition fees, hostels boarding, and campus approvals.",
};

export default function FAQPage() {
  return <FAQClient />;
}
