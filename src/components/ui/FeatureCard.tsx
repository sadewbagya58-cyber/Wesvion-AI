import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  outcome: string;
  badge?: string;
  className?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  outcome,
  badge,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 hover:border-cyan-500/40 hover:bg-[#0c1228]/80 transition-all duration-300 relative overflow-hidden shadow-xl",
        className
      )}
    >
      {/* Subtle hover gradient glow */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400/60 transition-all">
            <Icon className="w-6 h-6" />
          </div>
          {badge && (
            <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6 font-normal">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-medium text-slate-300">
        <span className="text-cyan-400 font-semibold font-mono uppercase tracking-wider text-[10px]">
          Outcome:
        </span>
        <span className="text-slate-300">{outcome}</span>
      </div>
    </div>
  );
}
