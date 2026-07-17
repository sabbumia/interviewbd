// src/app/fields/[fieldId]/categories/[categoryId]/_components/QuestionsHeader.tsx
import Link from 'next/link';
import { ChevronRight, Clock, FileText, Flame, Layers, Plus } from 'lucide-react';
import PageHero from '@/components/PageHero';

interface Field {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface QuestionsHeaderProps {
  field: Field;
  category: Category;
  categoryId: string;
  user: any;
  questionsCount: number;
  sortBy: 'recent' | 'popular';
  onSortChange: (sort: 'recent' | 'popular') => void;
}

export default function QuestionsHeader({
  field,
  category,
  categoryId,
  user,
  questionsCount,
  sortBy,
  onSortChange,
}: QuestionsHeaderProps) {
  return (
    <PageHero
      breadcrumb={
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
          <Link
            href={`/fields/${field.id}`}
            className="chip bg-white border border-zinc-200 text-zinc-600 hover:text-brand-700 hover:border-brand-200 transition-colors shadow-soft"
          >
            <Layers className="w-3.5 h-3.5 text-brand-500" />
            {field.name}
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-300" />
          <span className="chip-brand shadow-soft">
            <FileText className="w-3.5 h-3.5" />
            {category.name}
          </span>
        </nav>
      }
      title={`${category.name} Questions`}
      description={category.description}
      actions={
        user && (
          <Link href={`/questions/new?categoryId=${categoryId}`} className="btn-brand">
            <Plus className="w-4.5 h-4.5" />
            Post Question
          </Link>
        )
      }
    >
      {questionsCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Sort segmented control */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 border border-zinc-200/70" role="tablist" aria-label="Sort questions">
            <button
              role="tab"
              aria-selected={sortBy === 'recent'}
              onClick={() => onSortChange('recent')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                sortBy === 'recent' ? 'bg-white text-ink shadow-soft' : 'text-zinc-500 hover:text-ink'
              }`}
            >
              <Clock className="w-4 h-4" />
              Recent
            </button>
            <button
              role="tab"
              aria-selected={sortBy === 'popular'}
              onClick={() => onSortChange('popular')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                sortBy === 'popular' ? 'bg-white text-ink shadow-soft' : 'text-zinc-500 hover:text-ink'
              }`}
            >
              <Flame className={`w-4 h-4 ${sortBy === 'popular' ? 'text-orange-500' : ''}`} />
              Popular
            </button>
          </div>

          <span className="text-sm font-semibold text-zinc-500">
            {questionsCount} {questionsCount === 1 ? 'Question' : 'Questions'}
          </span>
        </div>
      )}
    </PageHero>
  );
}
