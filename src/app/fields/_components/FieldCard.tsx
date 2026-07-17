// src/app/fields/_components/FieldCard.tsx
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Briefcase, FolderOpen } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  description: string;
  categories?: Array<{ id: string }>;
}

interface FieldCardProps {
  field: Field;
  index?: number;
}

const GRADIENTS = [
  'from-brand-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-sky-500 to-cyan-600',
  'from-rose-500 to-pink-600',
];

export default function FieldCard({ field, index = 0 }: FieldCardProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <Link href={`/fields/${field.id}`} className="card-hover group relative flex flex-col p-7 overflow-hidden">
      {/* Hover wash */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between mb-5">
        <div
          className={`w-14 h-14 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center shadow-card
            group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}
        >
          <Briefcase className="w-7 h-7 text-white" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center
          group-hover:bg-ink transition-colors duration-300"
        >
          <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
        </div>
      </div>

      <h2 className="relative font-display text-xl font-bold text-ink mb-2 leading-snug group-hover:text-brand-700 transition-colors duration-300">
        {field.name}
      </h2>
      <p className="relative text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-6 flex-1">
        {field.description}
      </p>

      <div className="relative flex items-center justify-between pt-5 border-t border-zinc-100">
        <span className="chip-zinc">
          <FolderOpen className="w-3.5 h-3.5" />
          {field.categories?.length || 0} Categories
        </span>
        <span className="flex items-center gap-1 text-sm font-semibold text-brand-600">
          Explore
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}
