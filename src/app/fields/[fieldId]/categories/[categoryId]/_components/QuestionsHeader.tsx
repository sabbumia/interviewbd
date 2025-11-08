// src/app/fields/[fieldId]/categories/[categoryId]/_components/QuestionsHeader.tsx
import Link from 'next/link';

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
  onSortChange 
}: QuestionsHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/20"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {/* Path Display */}
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <Link
                    href={`/fields/${field.id}`} className="text-blue-300 text-sm font-medium">{field.name}</Link>
              </div>
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-purple-300 text-sm font-medium">{category.name}</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">{category.name} Questions</h1>
            <p className="text-slate-300 max-w-3xl">{category.description}</p>
          </div>
          
          {user && (
            <Link
              href={`/questions/new?categoryId=${categoryId}`}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post Question
            </Link>
          )}
        </div>

        {/* Stats and Sort */}
        {questionsCount > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSortChange('recent')}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'recent'
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                🕐 Recent
              </button>
              <button
                onClick={() => onSortChange('popular')}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'popular'
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                🔥 Popular
              </button>
            </div>
            
            <div className="text-white font-medium">
              {questionsCount} {questionsCount === 1 ? 'Question' : 'Questions'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}