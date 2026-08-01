import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
}: FeatureCardProps) {
  return (
    <div className="card-light card-light-hover rounded-3xl p-8 space-y-4 bg-white border border-slate-200/80">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        {badge && (
          <span className="text-[11px] font-medium bg-sky-50 border border-sky-200 text-sky-800 px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-xl font-serif text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
