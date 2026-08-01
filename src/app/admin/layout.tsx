import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import {
  Building2,
  Users,
  FileText,
  Image as ImageIcon,
  CreditCard,
  Settings,
  LayoutDashboard,
  LogOut
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Wesvion AI",
  description: "Secure Hotel AI Management Console",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif text-lg font-bold">
            A
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 leading-tight">
              Aura Boutique Hotel & Villa
            </h1>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-sky-700" /> Wesvion AI Admin Console
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {user && (
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center gap-1 overflow-x-auto">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-700 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all shrink-0"
          >
            <LayoutDashboard className="w-4 h-4 text-sky-700" />
            <span>Overview</span>
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-700 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all shrink-0"
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Lead Inbox</span>
          </Link>
          <Link
            href="/admin/knowledge"
            className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all shrink-0"
          >
            <FileText className="w-4 h-4 text-purple-700" />
            <span>Knowledge Base</span>
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all shrink-0"
          >
            <ImageIcon className="w-4 h-4 text-amber-700" />
            <span>Media Assets</span>
          </Link>
          <Link
            href="/admin/payment-reviews"
            className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all shrink-0"
          >
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>Payment Reviews</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all shrink-0"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Settings</span>
          </Link>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
