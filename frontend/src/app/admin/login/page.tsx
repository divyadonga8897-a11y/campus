import type { Metadata } from "next";
import AdminLoginClient from "@/components/admin/AdminLoginClient";

export const metadata: Metadata = {
  title: "Admin Portal Login | Sri Satya Institute of Engineering and Technology",
  description: "Secure login portal for authorized college administrators and content managers.",
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
