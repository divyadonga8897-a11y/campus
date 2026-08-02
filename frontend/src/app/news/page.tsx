import type { Metadata } from "next";
import NewsClient from "@/components/college/NewsClient";

export const metadata: Metadata = {
  title: "Campus News & Notices | Sri Satya Institute of Engineering and Technology",
  description:
    "Stay updated with academic bulletins, engineering notices, placement announcements, and press reports from SSIET.",
};

export default function NewsPage() {
  return <NewsClient />;
}
