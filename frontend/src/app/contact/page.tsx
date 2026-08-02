import type { Metadata } from "next";
import ContactClient from "@/components/college/ContactClient";

export const metadata: Metadata = {
  title: "Contact SSIET Guidance Desk | Sri Satya Institute of Engineering and Technology",
  description:
    "Get in touch with general administration offices, engineering department desks, admissions advisors, and check maps location details.",
};

export default function ContactPage() {
  return <ContactClient />;
}
