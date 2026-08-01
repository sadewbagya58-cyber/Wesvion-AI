import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Wesvion AI | Intelligent Automation for Luxury Hospitality",
    template: "%s | Wesvion AI",
  },
  description:
    "Wesvion AI builds intelligent AI Guest Agents and business automation systems for boutique hotels, resorts, villas, and luxury hospitality businesses in Australia and the UK.",
  keywords: [
    "AI Automation Agency",
    "AI Guest Agent",
    "Hospitality AI",
    "Hotel Guest Automation",
    "Boutique Hotel AI",
    "Business Automation Australia",
    "Business Automation UK",
    "Lead Capture Hospitality",
  ],
  authors: [{ name: "Wesvion AI Team" }],
  openGraph: {
    title: "Wesvion AI | Intelligent Automation for Luxury Hospitality",
    description:
      "Turn every guest enquiry into an opportunity with 24/7 AI guest assistance, booking enquiry capture, and instant staff escalation.",
    url: "https://wesvion.ai",
    siteName: "Wesvion AI",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wesvion AI | Intelligent Automation for Luxury Hospitality",
    description: "Turn every guest enquiry into an opportunity with 24/7 AI Guest Assistance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-slate-900 selection:bg-sky-100 selection:text-sky-900 font-sans">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
