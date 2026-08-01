import { CreditCard, Clock } from "lucide-react";

export default function AdminPaymentReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Phase 1B Feature
        </span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2">
          Payment Slip Reviews
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Guest Payment Verification & Staff Approval Console
        </p>
      </div>

      <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
          <CreditCard className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-base font-serif font-semibold text-slate-900">
            Payment Slip Inspection (Coming in Phase 1B)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            In Phase 1B, bank payment slips uploaded by guests will be displayed here with extracted details for human staff verification and approval.
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
