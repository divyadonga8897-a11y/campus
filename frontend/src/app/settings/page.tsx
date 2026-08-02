import type { Metadata } from "next";
import SettingsClient from "@/components/college/SettingsClient";

export const metadata: Metadata = {
  title: "Preferences & Settings | CampusConnect AI Portal",
  description: "Manage system preferences, change authentication passcode credentials, and customize notifications feed.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
