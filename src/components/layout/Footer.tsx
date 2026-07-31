import Link from "next/link";
import { Bot, Globe, Shield, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05070e] text-slate-400 pt-16 pb-12 relative overflow-hidden">
      {/* Glow effect overlay */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Wesvion <span className="text-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Intelligent Automation. Built for Growth. We build custom AI agents and business automation systems for boutique hotels, resorts, and growing businesses.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/90 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-full w-fit">
              <Globe className="w-3.5 h-3.5" />
              <span>Initial Focus: Australia & United Kingdom</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Platform & Products
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/agents" className="hover:text-cyan-400 transition-colors">
                  AI Agents Overview
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  AI Guest Agent <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">MVP</span>
                </Link>
              </li>
              <li>
                <Link href="/automation" className="hover:text-cyan-400 transition-colors">
                  Workflow Automation
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-cyan-400 transition-colors">
                  Hospitality Focus
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-cyan-400 transition-colors">
                  Deployment Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Capabilities
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>24/7 Guest Communication</li>
              <li>Property FAQ Automation</li>
              <li>Lead Qualification & Capture</li>
              <li>Booking Enquiry Handling</li>
              <li>Human Staff Handoff</li>
              <li>Email Notification Flows</li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About Wesvion AI
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Book a Consultation
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  Interactive Demo <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Wesvion AI. All rights reserved. Custom AI Automation Agency.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Enterprise Data Security & Human In The Loop Handoff
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
