import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Wesvion AI | Intelligent Automation. Built for Growth.",
    template: "%s | Wesvion AI",
  },
  description:
    "Wesvion AI is a premium B2B AI Automation Agency building intelligent AI agents and custom workflow automation systems for hospitality and growing enterprises in Australia and the United Kingdom.",
  keywords: [
    "AI Automation Agency",
    "AI Guest Agent",
    "Hospitality AI",
    "Hotel AI Chatbot",
    "Business Automation Australia",
    "Business Automation UK",
    "Workflow Automation",
    "Lead Capture Automation",
  ],
  authors: [{ name: "Wesvion AI Team" }],
  openGraph: {
    title: "Wesvion AI | Intelligent Automation. Built for Growth.",
    description:
      "We build AI agents and automation systems that help businesses respond faster, reduce repetitive work, and capture more opportunities.",
    url: "https://wesvion.ai",
    siteName: "Wesvion AI",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wesvion AI | Intelligent Automation. Built for Growth.",
    description: "Custom AI Agents & Workflow Automation for Modern Enterprise.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070913] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-300">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
