import type { Metadata } from "next";
import EventsClient from "@/components/college/EventsClient";

export const metadata: Metadata = {
  title: "Campus Events & Festivals | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore upcoming campus fests, workshops, developer hackathons, and cultural events timeline at SSIET.",
};

export default function EventsPage() {
  return <EventsClient />;
}
