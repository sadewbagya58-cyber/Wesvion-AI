interface ProcessStepProps {
  stepNumber: string;
  title: string;
  description: string;
}

export default function ProcessStep({
  stepNumber,
  title,
  description,
}: ProcessStepProps) {
  return (
    <div className="card-light rounded-3xl p-8 space-y-4 bg-white border border-slate-200/80">
      <div className="text-xs font-mono font-semibold uppercase text-sky-700 bg-sky-50 px-3 py-1 rounded-full w-fit">
        Step {stepNumber}
      </div>
      <h3 className="text-xl font-serif text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
