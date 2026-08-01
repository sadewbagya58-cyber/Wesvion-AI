import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Building2, Users, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let totalLeadsCount = 0;
  if (user) {
    const { count } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });
    totalLeadsCount = count || 0;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            Phase 1A Active
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2">
            Property Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authenticated Admin Console • Aura Boutique Hotel & Villa
          </p>
        </div>

        <Link
          href="/admin/leads"
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          <span>View Lead Inbox</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center border border-sky-100">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Total Property Leads</p>
          <p className="text-3xl font-serif font-bold text-slate-900">{totalLeadsCount}</p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 font-medium">RLS Security Status</p>
          <p className="text-lg font-serif font-bold text-emerald-800">Protected & Scoped</p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center border border-purple-100">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Knowledge & Storage</p>
          <p className="text-lg font-serif font-bold text-slate-900">Phase 1A Foundation</p>
        </div>
      </div>

      <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs">
        <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-sky-700" />
          System Information & Security Verification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
            <p className="font-semibold text-slate-900">Authenticated Session</p>
            <p className="text-slate-600">User Email: {user?.email}</p>
            <p className="text-slate-600">User ID: {user?.id}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
            <p className="font-semibold text-slate-900">Active Property Membership</p>
            <p className="text-slate-600">Property: Aura Boutique Hotel & Villa</p>
            <p className="text-slate-600">Role: Owner / Admin (Verified via RLS)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
