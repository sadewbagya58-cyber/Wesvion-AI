import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndustryCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  features: string[];
  className?: string;
}

export default function IndustryCard({
  icon: Icon,
  title,
  subtitle,
  features,
  className,
}: IndustryCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between",
        className
      )}
    >
      <div>
        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">{subtitle}</p>

        <ul className="space-y-2 mb-4">
          {features.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-cyan-400/90">
        Tailored Hospitality AI Workflows
      </div>
    </div>
  );
}
