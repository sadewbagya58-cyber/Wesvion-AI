"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Ban,
  FileCode
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export interface KnowledgeDocumentRow {
  id: string;
  title: string;
  document_type: string;
  document_category: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  processing_status: "pending" | "processing" | "ready" | "failed";
  active: boolean;
  is_image_based: boolean;
  extracted_character_count: number;
  error_message: string | null;
  original_filename?: string;
  created_at: string;
}

export default function AdminKnowledgePage() {
  const [documents, setDocuments] = useState<KnowledgeDocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [file, setFile] = useState<File | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const refreshDocuments = async () => {
    try {
      const { data } = await supabase
        .from("knowledge_documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setDocuments(data as KnowledgeDocumentRow[]);
    } catch {
      // Error
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const loadDocuments = async () => {
      try {
        const { data } = await supabase
          .from("knowledge_documents")
          .select("*")
          .order("created_at", { ascending: false });
        if (data && isSubscribed) {
          setDocuments(data as KnowledgeDocumentRow[]);
        }
      } catch {
        // Error handling
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    loadDocuments();

    return () => {
      isSubscribed = false;
    };
  }, [supabase]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|txt|csv|docx)$/i)) {
      setStatusMsg("Error: Invalid file type. Allowed: PDF, TXT, CSV, DOCX");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatusMsg("Error: File size exceeds 10 MB limit.");
      return;
    }

    setUploading(true);
    setStatusMsg("Uploading document to private storage...");

    try {
      const { data: props } = await supabase.from("properties").select("id").limit(1).single();
      const propertyId = props?.id;

      if (!propertyId) {
        setStatusMsg("Error: Failed to resolve property");
        setUploading(false);
        return;
      }

      const fileExt = file.name.split(".").pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const docId = crypto.randomUUID();
      const storagePath = `${propertyId}/${docId}/${sanitizedName}`;

      const { error: storageErr } = await supabase.storage
        .from("property-knowledge")
        .upload(storagePath, file);

      if (storageErr) {
        setStatusMsg("Upload failed: " + storageErr.message);
        setUploading(false);
        return;
      }

      const { error: metaErr } = await supabase.from("knowledge_documents").insert([
        {
          id: docId,
          property_id: propertyId,
          title,
          document_type: fileExt?.toLowerCase() || "pdf",
          document_category: category,
          storage_path: storagePath,
          mime_type: file.type || "application/pdf",
          file_size: file.size,
          processing_status: "pending",
          active: true,
          original_filename: file.name,
        },
      ]);

      if (metaErr) {
        setStatusMsg("Metadata creation failed: " + metaErr.message);
        setUploading(false);
        return;
      }

      setStatusMsg("Document uploaded. Processing text extraction...");

      const procRes = await fetch("/api/admin/knowledge/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId }),
      });

      const procData = await procRes.json();
      if (procData.success) {
        setStatusMsg(`Success! Document processed into ${procData.chunksCount} chunks.`);
      } else {
        setStatusMsg(`Notice: ${procData.error || "Processing failed"}`);
      }

      setTitle("");
      setFile(null);
      await refreshDocuments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setStatusMsg("Error: " + msg);
    } finally {
      setUploading(false);
    }
  };

  const handleProcessRetry = async (docId: string) => {
    setStatusMsg("Retrying document processing...");
    try {
      const procRes = await fetch("/api/admin/knowledge/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId }),
      });
      const procData = await procRes.json();
      if (procData.success) {
        setStatusMsg(`Success! Reprocessed into ${procData.chunksCount} chunks.`);
      } else {
        setStatusMsg(`Notice: ${procData.error || "Processing failed"}`);
      }
      await refreshDocuments();
    } catch {
      setStatusMsg("Retry request failed.");
    }
  };

  const handleToggleActive = async (docId: string, currentActive: boolean) => {
    try {
      await supabase
        .from("knowledge_documents")
        .update({ active: !currentActive })
        .eq("id", docId);
      await refreshDocuments();
    } catch {
      // Error
    }
  };

  const handleDelete = async (docId: string, storagePath: string) => {
    if (!confirm("Are you sure you want to delete this document and all its chunks?")) return;

    try {
      const { error: storageErr } = await supabase.storage
        .from("property-knowledge")
        .remove([storagePath]);

      if (storageErr) {
        alert("Failed to delete storage file: " + storageErr.message);
        return;
      }

      await supabase.from("knowledge_documents").delete().eq("id", docId);
      await refreshDocuments();
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Phase 1B Knowledge Ingestion
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2">
            Knowledge Base Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload PDFs, menus, and policies for AI retrieval • Aura Boutique Hotel & Villa
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900 flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-purple-700 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Upload Form Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs">
        <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-purple-700" />
          Upload New Document (PDF, TXT, CSV max 10MB)
        </h3>

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset Seafood Menu 2026"
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            >
              <option value="general">General</option>
              <option value="menu">Restaurant Menu</option>
              <option value="policy">Hotel Policy</option>
              <option value="room_info">Room Information</option>
              <option value="spa">Spa & Wellness</option>
              <option value="wedding">Weddings & Events</option>
              <option value="transport">Transport & Tours</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-3">
            <label className="text-xs font-semibold text-slate-700">Select File</label>
            <input
              type="file"
              accept=".pdf,.txt,.csv,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !file || !title}
            className="sm:col-span-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Uploading & Processing..." : "Upload & Process Document"}</span>
          </button>
        </form>
      </div>

      {/* Document List Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-slate-900">Uploaded Documents ({documents.length})</h3>

        {loading ? (
          <p className="text-xs text-slate-500">Loading documents...</p>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No documents uploaded yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload PDF menus, room policies, or tour details to make them available for Anya&apos;s AI responses.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-2xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                      <p className="text-[10px] text-slate-400">
                        {doc.original_filename || doc.storage_path} • {(doc.file_size / 1024).toFixed(1)} KB • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      {doc.document_category}
                    </span>

                    {!doc.active ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center gap-1">
                        <Ban className="w-3 h-3" /> Disabled
                      </span>
                    ) : doc.processing_status === "ready" ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ready ({doc.extracted_character_count} chars)
                      </span>
                    ) : doc.processing_status === "processing" ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" /> Processing
                      </span>
                    ) : (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" /> Failed
                      </span>
                    )}
                  </div>
                </div>

                {doc.is_image_based && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>This document appears to be image-based and requires vision processing.</span>
                  </div>
                )}

                {doc.error_message && !doc.is_image_based && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                    Error: {doc.error_message}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleProcessRetry(doc.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reprocess</span>
                  </button>

                  <button
                    onClick={() => handleToggleActive(doc.id, doc.active)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
                  >
                    {doc.active ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id, doc.storage_path)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
