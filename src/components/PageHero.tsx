// src/components/PageHero.tsx
import { Search, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Stat {
  icon: LucideIcon;
  value: number | string;
  label: string;
  /** Tailwind text color class for the icon (defaults to brand) */
  iconClass?: string;
}

interface PageHeroProps {
  /** Small chip above the title (pass icon + text) */
  eyebrow?: ReactNode;
  /** Breadcrumb / back-link row rendered above the eyebrow */
  breadcrumb?: ReactNode;
  title: ReactNode;
  description?: string;
  /** Stat cards rendered on the right */
  stats?: Stat[];
  /** Action buttons rendered next to the stats */
  actions?: ReactNode;
  /** Search input rendered under the header row */
  search?: { value: string; onChange: (value: string) => void; placeholder: string };
  /** Extra content (filters, sort controls…) below the search */
  children?: ReactNode;
}

/**
 * Shared page header — aurora-washed band with title, optional stat cards,
 * search input, and slot for filters. Used across listing pages.
 */
export default function PageHero({
  eyebrow,
  breadcrumb,
  title,
  description,
  stats,
  actions,
  search,
  children,
}: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-aurora border-b border-zinc-200/60">
      <div aria-hidden className="absolute inset-0 bg-grid-fade" />

      <div className="relative section-container py-10 sm:py-14">
        {breadcrumb && <div className="mb-5 animate-fade-up">{breadcrumb}</div>}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 min-w-0 animate-fade-up">
            {eyebrow && <div className="mb-4">{eyebrow}</div>}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-3 text-balance">
              {title}
            </h1>
            {description && (
              <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {(stats?.length || actions) && (
            <div
              className="flex flex-wrap items-center gap-3 shrink-0 animate-fade-up"
              style={{ animationDelay: '100ms' }}
            >
              {actions}
              {stats?.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label} className="glass rounded-2xl px-6 py-4 text-center min-w-32">
                    <div className="flex items-center justify-center gap-2 mb-0.5">
                      <StatIcon className={`w-4.5 h-4.5 ${stat.iconClass ?? 'text-brand-600'}`} />
                      <span className="font-display text-2xl sm:text-3xl font-bold text-ink tabular-nums">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {search && (
          <div className="relative mt-8 group animate-fade-up" style={{ animationDelay: '160ms' }}>
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-brand-500 transition-colors pointer-events-none" />
            <input
              type="text"
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder}
              className="w-full pl-12 pr-5 py-3.5 bg-white border border-zinc-200 rounded-2xl shadow-card text-[15px] font-medium
                transition-all duration-200
                hover:border-zinc-300
                focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 focus:shadow-lift"
            />
          </div>
        )}

        {children && <div className="mt-7 animate-fade-up" style={{ animationDelay: '220ms' }}>{children}</div>}
      </div>
    </div>
  );
}
