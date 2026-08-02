import type { Metadata } from "next";
import LeadershipClient from "@/components/college/LeadershipClient";

export const metadata: Metadata = {
  title: "College Leadership | Sri Satya Institute of Engineering and Technology",
  description:
    "Meet the visionaries, directors, principal, and administrative leaders guiding the academic roadmap at Sri Satya Institute of Engineering and Technology.",
  keywords: [
    "SSIET Leadership",
    "College Principal JNTU",
    "Chairman Sri Satya Institute",
    "SSIET Board of Directors",
    "Engineering College Management"
  ]
};

export default function LeadershipPage() {
  return <LeadershipClient />;
}
