import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Users, Mail, Phone, Calendar } from "lucide-react";

export default async function AdminLeadsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let leads: Array<{
    id: string;
    guest_name: string | null;
    guest_email: string | null;
    guest_phone: string | null;
    check_in: string | null;
    check_out: string | null;
    guest_count: number | null;
    message: string | null;
    status: string | null;
    created_at: string;
  }> = [];

  if (user) {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) leads = data;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Property-Scoped RLS Protected
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2">
            Lead Inbox
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Property Enquiries • Aura Boutique Hotel & Villa
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl font-medium shadow-2xs">
          Total Leads: <strong className="text-slate-900">{leads.length}</strong>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-serif font-semibold text-slate-900">No leads captured yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When guests interact with Anya on your website and share booking details, their enquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                    {lead.guest_name ? lead.guest_name[0].toUpperCase() : "G"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {lead.guest_name || "Guest Enquiry"}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      ID: {lead.id} • {new Date(lead.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-medium">
                    Status: {lead.status || "new"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>{lead.guest_email || "No email provided"}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{lead.guest_phone || "No phone provided"}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>
                    {lead.check_in || "TBD"} → {lead.check_out || "TBD"} ({lead.guest_count || 2} guests)
                  </span>
                </div>
              </div>

              {lead.message && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 italic">
                  &ldquo;{lead.message}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
