"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Upload, Trash2, CheckCircle2, Ban } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export interface MediaAssetRow {
  id: string;
  title: string;
  asset_type: string;
  storage_path: string;
  mime_type: string;
  alt_text: string | null;
  room_reference: string | null;
  active: boolean;
  signed_url?: string;
  created_at: string;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAssetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [assetType, setAssetType] = useState("room");
  const [altText, setAltText] = useState("");
  const [roomRef, setRoomRef] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const refreshAssets = async () => {
    try {
      const { data } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        const withSigned: MediaAssetRow[] = await Promise.all(
          data.map(async (asset: MediaAssetRow) => {
            try {
              const { data: signedData } = await supabase.storage
                .from("property-media")
                .createSignedUrl(asset.storage_path, 3600);
              return { ...asset, signed_url: signedData?.signedUrl };
            } catch {
              return asset;
            }
          })
        );
        setAssets(withSigned);
      }
    } catch {
      // Error
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const loadAssets = async () => {
      try {
        const { data } = await supabase
          .from("media_assets")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && isSubscribed) {
          const withSigned: MediaAssetRow[] = await Promise.all(
            data.map(async (asset: MediaAssetRow) => {
              try {
                const { data: signedData } = await supabase.storage
                  .from("property-media")
                  .createSignedUrl(asset.storage_path, 3600);
                return { ...asset, signed_url: signedData?.signedUrl };
              } catch {
                return asset;
              }
            })
          );
          if (isSubscribed) setAssets(withSigned);
        }
      } catch {
        // Error handling
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    loadAssets();

    return () => {
      isSubscribed = false;
    };
  }, [supabase]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      setStatusMsg("Error: Allowed types: JPEG, PNG, WEBP, PDF");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatusMsg("Error: File size exceeds limit.");
      return;
    }

    setUploading(true);
    setStatusMsg("Uploading media asset...");

    try {
      const { data: props } = await supabase.from("properties").select("id").limit(1).single();
      const propertyId = props?.id;

      if (!propertyId) {
        setStatusMsg("Error: Failed to resolve property");
        setUploading(false);
        return;
      }

      const assetId = crypto.randomUUID();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storagePath = `${propertyId}/${assetId}/${sanitizedName}`;

      const { error: storageErr } = await supabase.storage
        .from("property-media")
        .upload(storagePath, file);

      if (storageErr) {
        setStatusMsg("Upload failed: " + storageErr.message);
        setUploading(false);
        return;
      }

      const { error: metaErr } = await supabase.from("media_assets").insert([
        {
          id: assetId,
          property_id: propertyId,
          title,
          asset_type: assetType,
          storage_path: storagePath,
          mime_type: file.type || "image/jpeg",
          alt_text: altText || title,
          room_reference: roomRef || null,
          active: true,
        },
      ]);

      if (metaErr) {
        setStatusMsg("Metadata creation failed: " + metaErr.message);
        setUploading(false);
        return;
      }

      setStatusMsg("Media asset uploaded successfully!");
      setTitle("");
      setAltText("");
      setRoomRef("");
      setFile(null);
      await refreshAssets();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setStatusMsg("Error: " + msg);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (assetId: string, currentActive: boolean) => {
    try {
      await supabase
        .from("media_assets")
        .update({ active: !currentActive })
        .eq("id", assetId);
      await refreshAssets();
    } catch {
      // Error
    }
  };

  const handleDelete = async (assetId: string, storagePath: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;

    try {
      const { error: storageErr } = await supabase.storage
        .from("property-media")
        .remove([storagePath]);

      if (storageErr) {
        alert("Failed to delete storage file: " + storageErr.message);
        return;
      }

      await supabase.from("media_assets").delete().eq("id", assetId);
      await refreshAssets();
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Phase 1B Media Assets
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2">
            Media Assets Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload room, restaurant & spa photos • Aura Boutique Hotel & Villa
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-amber-700 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Upload Form Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs">
        <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-amber-700" />
          Upload Media Asset (JPEG, PNG, WEBP max 5MB)
        </h3>

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Asset Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ocean View Suite Balcony"
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Asset Type</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            >
              <option value="room">Room & Villa</option>
              <option value="restaurant">Restaurant & Dining</option>
              <option value="pool">Pool & Beach</option>
              <option value="spa">Spa & Wellness</option>
              <option value="event">Weddings & Events</option>
              <option value="brochure">Brochure / Map</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Room / Category Reference</label>
            <input
              type="text"
              value={roomRef}
              onChange={(e) => setRoomRef(e.target.value)}
              placeholder="e.g. ocean-suite"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="space-y-1 sm:col-span-3">
            <label className="text-xs font-semibold text-slate-700">Select Image File</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
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
            <span>{uploading ? "Uploading..." : "Upload Media Asset"}</span>
          </button>
        </form>
      </div>

      {/* Media Grid Gallery */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-slate-900">Media Assets ({assets.length})</h3>

        {loading ? (
          <p className="text-xs text-slate-500">Loading media assets...</p>
        ) : assets.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No media assets uploaded yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload room photos and facility images to show them to guests during Anya AI chat interactions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs space-y-3 p-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200/80">
                    {asset.signed_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={asset.signed_url}
                        alt={asset.alt_text || asset.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 right-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white font-semibold">
                      {asset.asset_type}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{asset.title}</h4>
                    {asset.room_reference && (
                      <p className="text-[10px] text-slate-500 font-mono">Ref: {asset.room_reference}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleActive(asset.id, asset.active)}
                    className="text-xs font-semibold flex items-center gap-1 text-slate-700 hover:text-slate-900"
                  >
                    {asset.active ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Ban className="w-3.5 h-3.5" /> Disabled
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id, asset.storage_path)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
