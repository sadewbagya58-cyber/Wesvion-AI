"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    property: "",
    propertyType: "Boutique Hotel",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card-light rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-slate-200/80 bg-white">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-serif text-slate-900">Demo Request Received</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you, {formData.name}. Our hospitality team has received your enquiry for {formData.property || "your property"} and will reach out shortly to schedule your private demonstration.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-light rounded-3xl p-8 sm:p-12 space-y-6 border border-slate-200/80 bg-white">
      <div className="space-y-2">
        <h3 className="text-2xl font-serif text-slate-900">Book a Private Demo</h3>
        <p className="text-xs text-slate-600">
          Learn how the Wesvion AI Guest Agent can be tailored for your property.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Your Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Sarah Jenkins"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Business Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="sarah@boutiquehotel.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Property Name</label>
          <input
            type="text"
            value={formData.property}
            onChange={(e) => setFormData({ ...formData, property: e.target.value })}
            placeholder="Aura Villa & Resort"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Property Type</label>
          <select
            value={formData.propertyType}
            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-400"
          >
            <option value="Boutique Hotel">Boutique Hotel</option>
            <option value="Independent Hotel">Independent Hotel</option>
            <option value="Luxury Resort">Luxury Resort</option>
            <option value="Private Villa">Private Villa</option>
            <option value="Bed & Breakfast">Bed & Breakfast / Guest House</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-700">How can we help your property?</label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us about your room capacity, current guest inquiry channels, or key automation goals..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-400"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-2xs"
      >
        <span>Request Private Demo</span>
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
