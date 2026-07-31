import { LucideIcon } from "lucide-react";

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  details: string[];
}

export default function ProcessStep({
  number,
  title,
  description,
  icon: Icon,
  details,
}: ProcessStepProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
      {/* Large background step index */}
      <span className="absolute top-3 right-4 text-5xl font-mono font-extrabold text-white/[0.04] group-hover:text-cyan-500/10 transition-colors pointer-events-none select-none">
        {number}
      </span>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
          {number}
        </div>
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
          <Icon className="w-4 h-4 text-cyan-400" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-5 font-normal">
        {description}
      </p>

      <ul className="space-y-2 pt-4 border-t border-white/10">
        {details.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
