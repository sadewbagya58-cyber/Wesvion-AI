import KnowledgeDemoChat from "@/components/ui/KnowledgeDemoChat";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, FileText } from "lucide-react";

export const metadata = {
  title: "Clean Uploaded Knowledge Demo — Wesvion AI",
  description: "Grounded AI guest Q&A engine powered by uploaded hotel property documents.",
};

export default function KnowledgeDemoPage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/demo"
            className="flex items-center gap-2 text-stone-400 hover:text-amber-400 text-xs font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Demo</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Demo v2 — Knowledge Engine
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Property-Scoped RAG
            </span>
          </div>
        </div>

        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-600/10 border border-amber-500/20 mb-2">
            <FileText className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-100 font-semibold tracking-tight">
            Uploaded Knowledge Base Demo
          </h1>
          <p className="text-stone-400 text-sm md:text-base leading-relaxed">
            Test direct guest Q&A grounded exclusively in PDF, TXT, and CSV documents uploaded via the Admin Panel for <strong className="text-stone-200">Aura Boutique Hotel & Villa</strong>.
          </p>
        </div>

        {/* Clean Knowledge Chat */}
        <KnowledgeDemoChat />
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-stone-500 border-t border-stone-900 pt-6">
        <p>Wesvion AI — Grounded Hospitality Intelligence Engine &copy; 2026</p>
      </footer>
    </main>
  );
}
