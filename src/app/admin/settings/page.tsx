import { PROPERTY_CONFIG } from "@/lib/propertyConfig";
import { Building2, Clock } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Property Configuration Inspector
        </span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2">
          Property Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Active Property Rules & Operating Policies
        </p>
      </div>

      <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-2xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-serif text-lg font-bold">
            A
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{PROPERTY_CONFIG.name}</h3>
            <p className="text-xs text-slate-500">{PROPERTY_CONFIG.tagline}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-700" />
              General Details
            </h4>
            <div className="space-y-1.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-slate-600">Location: <strong className="text-slate-900">{PROPERTY_CONFIG.location}</strong></p>
              <p className="text-slate-600">Timezone: <strong className="text-slate-900">{PROPERTY_CONFIG.timezone}</strong></p>
              <p className="text-slate-600">Reception: <strong className="text-slate-900">{PROPERTY_CONFIG.receptionHours}</strong></p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              Check-In / Out Hours
            </h4>
            <div className="space-y-1.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-slate-600">Check-in: <strong className="text-slate-900">{PROPERTY_CONFIG.checkInTime}</strong></p>
              <p className="text-slate-600">Check-out: <strong className="text-slate-900">{PROPERTY_CONFIG.checkOutTime}</strong></p>
              <p className="text-slate-600">Late Check-in: <strong className="text-slate-900">Allowed with advance notice</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
