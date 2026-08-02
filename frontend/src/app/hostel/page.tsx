import type { Metadata } from "next";
import HostelClient from "@/components/college/HostelClient";

export const metadata: Metadata = {
  title: "Student Accommodations & Hostel Life | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore residential blocks, room facilities, mess hygiene structures, and round-the-clock security protocols inside Boys & Girls hostels at SSIET.",
};

export default function HostelPage() {
  return <HostelClient />;
}
