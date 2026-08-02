import type { Metadata } from "next";
import "./globals.css";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

export const metadata: Metadata = {
  title: {
    default: "SSIET — Sri Satya Institute of Engineering & Technology",
    template: "%s | SSIET CampusConnect",
  },
  description:
    "Sri Satya Institute of Engineering and Technology — NAAC accredited premier engineering institution in Andhra Pradesh.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
