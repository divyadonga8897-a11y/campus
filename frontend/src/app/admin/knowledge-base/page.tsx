import type { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Knowledge Base | Sri Satya Institute of Engineering and Technology",
  description: "Manage AI Assistant knowledge assets, documents recursive chunking, and Pinecone vector store databases.",
};

export default function AdminKnowledgeBasePage() {
  return <AdminDashboardClient defaultView="knowledge-base" />;
}
