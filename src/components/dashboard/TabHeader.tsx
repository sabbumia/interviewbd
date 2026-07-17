// src/components/dashboard/TabHeader.tsx
import type { LucideIcon } from 'lucide-react';

interface TabHeaderProps {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  description: string;
}

/** Section heading used at the top of every dashboard tab. */
export default function TabHeader({ icon: Icon, iconClass, title, description }: TabHeaderProps) {
  return (
    <div className="flex items-center gap-3.5 animate-fade-up">
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${iconClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">{title}</h2>
        <p className="text-sm text-zinc-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
