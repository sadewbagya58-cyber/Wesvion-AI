import { FileText, Clock } from "lucide-react";

export default function AdminKnowledgePage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Phase 1B Feature
        </span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2">
          Knowledge Base Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          PDF / Menu Ingestion & Gemini Managed RAG Indexing
        </p>
      </div>

      <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto border border-purple-100">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-base font-serif font-semibold text-slate-900">
            Document Ingestion & RAG (Coming in Phase 1B)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            In Phase 1B, hotel administrators will be able to upload PDFs, dining menus, and operational policies to private Supabase storage for automated Gemini chunking & indexing.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full font-medium">
          <Clock className="w-3.5 h-3.5" />
          Scheduled for Phase 1B Implementation
        </span>
      </div>
    </div>
  );
}
