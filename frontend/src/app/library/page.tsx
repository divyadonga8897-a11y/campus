import type { Metadata } from "next";
import LibraryClient from "@/components/college/LibraryClient";

export const metadata: Metadata = {
  title: "Central Digital Library | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore our central digital library housing over 45,000 book volumes, IEEE subscriptions, individual quiet study spaces, and digital reading portals.",
};

export default function LibraryPage() {
  return <LibraryClient />;
}
