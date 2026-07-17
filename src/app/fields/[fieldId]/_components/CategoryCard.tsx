// src/app/fields/[fieldId]/_components/CategoryCard.tsx
import Link from 'next/link';
import { ArrowRight, FileText, MessageCircleQuestion } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  fieldId: string;
  _count?: {
    questions: number;
  };
}

interface CategoryCardProps {
  category: Category;
  fieldId: string;
  index?: number;
}

const GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-brand-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-orange-500 to-amber-600',
  'from-sky-500 to-cyan-600',
];

export default function CategoryCard({ category, fieldId, index = 0 }: CategoryCardProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <Link
      href={`/fields/${fieldId}/categories/${category.id}`}
      className="card-hover group relative flex flex-col p-7 overflow-hidden"
    >
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
          <FileText className="w-7 h-7 text-white" />
        </div>
        {category._count && (
          <span className="chip-emerald">
            <MessageCircleQuestion className="w-3.5 h-3.5" />
            {category._count.questions} Questions
          </span>
        )}
      </div>

      <h3 className="relative font-display text-lg font-bold text-ink mb-2 leading-snug group-hover:text-brand-700 transition-colors duration-300">
        {category.name}
      </h3>
      <p className="relative text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-6 flex-1">
        {category.description}
      </p>

      <div className="relative flex items-center justify-between pt-5 border-t border-zinc-100">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          View Questions
        </span>
        <span className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-ink transition-colors duration-300">
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
        </span>
      </div>
    </Link>
  );
}
