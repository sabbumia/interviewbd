// src/components/EmptyState.tsx
import { SearchX, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional CTA button(s) */
  action?: ReactNode;
  className?: string;
}

/** Shared empty state used by listing pages, dashboards, and search results. */
export default function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-20 px-6 bg-white/70 rounded-3xl border-2 border-dashed border-zinc-200 animate-fade-in ${className}`}
    >
      <div className="relative inline-flex mb-6">
        <div aria-hidden className="absolute inset-0 rounded-3xl bg-brand-200/40 blur-xl" />
        <div className="relative w-18 h-18 rounded-3xl bg-linear-to-br from-brand-50 to-purple-50 border border-brand-100 flex items-center justify-center">
          <Icon className="w-8 h-8 text-brand-400" strokeWidth={1.75} />
        </div>
      </div>
      <h3 className="font-display text-xl font-bold text-ink mb-2">{title}</h3>
      {description && <p className="text-sm text-zinc-500 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-7 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
}
