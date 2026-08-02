import type { Metadata } from "next";
import FeesClient from "@/components/fees/FeesClient";

export const metadata: Metadata = {
  title: "Fee Structure | Sri Satya Institute of Engineering and Technology",
  description:
    "View detailed annual tuition fees, hostel charges, transport options, and available scholarships for all B.Tech programs at SSIET.",
};

export default function FeesPage() {
  return <FeesClient />;
}
