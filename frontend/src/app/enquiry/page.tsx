import type { Metadata } from "next";
import EnquiryClient from "@/components/college/EnquiryClient";

export const metadata: Metadata = {
  title: "Student Enquiry Desk | Sri Satya Institute of Engineering and Technology",
  description:
    "Submit your admissions questions, program inquiries, and details requests directly to the SSIET guidance counselor office.",
};

export default function EnquiryPage() {
  return <EnquiryClient />;
}
