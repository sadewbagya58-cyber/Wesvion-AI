import { LucideIcon } from "lucide-react";

interface IndustryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function IndustryCard({
  icon: Icon,
  title,
  description,
}: IndustryCardProps) {
  return (
    <div className="card-light card-light-hover rounded-3xl p-8 space-y-3 bg-white border border-slate-200/80">
      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-2">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-serif text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
