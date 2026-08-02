import type { Metadata } from "next";
import ErrorClient from "@/components/ui/ErrorClient";

export const metadata: Metadata = {
  title: "Error Encountered | Sri Satya Institute of Engineering and Technology",
  description: "An unexpected error occurred during your request. Please try again.",
};

export default function ErrorPage() {
  return <ErrorClient />;
}
