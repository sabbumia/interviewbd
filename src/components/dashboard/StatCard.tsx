// src/components/dashboard/StatCard.tsx
import type { LucideIcon, } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: LucideIcon;
  /** e.g. "bg-brand-50 text-brand-600 border-brand-100" */
  accent: string;
  value: ReactNode;
  label: string;
  /** Small chip rendered in the top-right corner */
  trend?: ReactNode;
  /** Footnote under the divider */
  footer?: ReactNode;
}

/** Metric tile used across dashboard tabs. */
export default function StatCard({ icon: Icon, accent, value, label, trend, footer }: StatCardProps) {
  return (
    <div className="card p-5 transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${accent}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
        {trend}
      </div>
      <p className="font-display text-3xl font-bold text-ink tabular-nums mb-0.5">{value}</p>
      <p className="text-sm font-semibold text-zinc-500">{label}</p>
      {footer && <div className="mt-3 pt-3 border-t border-zinc-100 text-xs text-zinc-400">{footer}</div>}
    </div>
  );
}
