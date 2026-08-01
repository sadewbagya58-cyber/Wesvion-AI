interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`space-y-3 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}>
      {badge && (
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200/80">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
