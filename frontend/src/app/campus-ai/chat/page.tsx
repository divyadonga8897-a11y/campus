import type { Metadata } from "next";
import ChatWorkspaceClient from "@/components/college/ChatWorkspaceClient";

export const metadata: Metadata = {
  title: "Campus AI Workspace | Sri Satya Institute of Engineering and Technology",
  description: "ChatGPT-style interactive workspace to query college facilities, course structures, intake options, and guidelines.",
};

export default function ChatWorkspacePage() {
  return <ChatWorkspaceClient />;
}
