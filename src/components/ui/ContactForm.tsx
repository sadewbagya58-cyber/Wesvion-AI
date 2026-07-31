"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Building2, Globe2, User, Mail, Sparkles } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    website: "",
    email: "",
    country: "Australia",
    automationGoal: "AI Guest Agent & FAQ Automation",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.businessName.trim()) {
      setError("Please complete all required fields (Name, Business Name, and Email).");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {submitted ? (
        <div className="text-center py-10 space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Demo Request Received</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-cyan-400 font-semibold">{formData.name}</span>. We have logged your request for <strong className="text-white">{formData.businessName}</strong> ({formData.country}).
            </p>
          </div>

          <div className="bg-[#0b1022] p-4 rounded-xl border border-white/10 text-xs text-slate-400 max-w-md mx-auto text-left space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-mono font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Next Steps:</span>
            </div>
            <p>1. Our automation strategy team will review your business requirements.</p>
            <p>2. We will prepare a tailored demonstration of the AI Guest Agent workflow for {formData.businessName}.</p>
            <p>3. A calendar invitation will be dispatched to <strong className="text-slate-200">{formData.email}</strong>.</p>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: "",
                businessName: "",
                website: "",
                email: "",
                country: "Australia",
                automationGoal: "AI Guest Agent & FAQ Automation",
                notes: "",
              });
            }}
            className="text-xs text-cyan-400 hover:underline font-mono"
          >
            Submit Another Enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">Book a Consultation & Demo</h3>
            <p className="text-sm text-slate-400">
              Discover how custom AI agents and workflow automation can transform your hospitality operations.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-[#0a0e1c] border border-white/10 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Business Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@aurahotel.com"
                className="w-full bg-[#0a0e1c] border border-white/10 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Business Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Grand Horizon Boutique Hotel"
                className="w-full bg-[#0a0e1c] border border-white/10 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Business Website */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" /> Business Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="www.grandhorizon.com.au"
                className="w-full bg-[#0a0e1c] border border-white/10 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-[#0a0e1c] border border-white/10 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="Australia">Australia</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Other International">Other International</option>
              </select>
            </div>

            {/* Automation Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Primary Automation Focus
              </label>
              <select
                value={formData.automationGoal}
                onChange={(e) => setFormData({ ...formData, automationGoal: e.target.value })}
                className="w-full bg-[#0a0e1c] border border-white/10 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="AI Guest Agent & FAQ Automation">AI Guest Agent & FAQ Automation</option>
                <option value="Booking Enquiry & Lead Qualification">Booking Enquiry & Lead Qualification</option>
                <option value="Customer Support & Handoff Automation">Customer Support & Handoff Automation</option>
                <option value="Custom Workflow & CRM Integration">Custom Workflow & CRM Integration</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              What would you like to automate? (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Tell us briefly about your guest enquiry volume, current tools, or specific operational bottlenecks..."
              className="w-full bg-[#0a0e1c] border border-white/10 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* CTA Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                Processing Request...
              </span>
            ) : (
              <>
                <span>Book My Free Demo</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 font-mono">
            No long-term contracts. Designed for hospitality businesses in Australia and the United Kingdom.
          </p>
        </form>
      )}
    </div>
  );
}
