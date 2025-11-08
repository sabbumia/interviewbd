// src/app/fields/[fieldId]/_components/CategoryCard.tsx
import Link from 'next/link';

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
}

export default function CategoryCard({ category, fieldId }: CategoryCardProps) {
  return (
    <Link
      href={`/fields/${fieldId}/categories/${category.id}`}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-slate-300 transform hover:-translate-y-2"
    >
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
      
      {/* Card Content */}
      <div className="p-6">
        {/* Icon and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-200 to-cyan-900 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          {/* Questions Count Badge */}
          {category._count && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-bold text-green-700">{category._count.questions}</span>
            </div>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors leading-tight">
          {category.name}
        </h3>
        
        {/* Description */}
        <p className="text-slate-600 text-sm mb-5 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            View Questions
          </span>
          
          <div className="flex items-center justify-center w-9 h-9 bg-slate-100 rounded-lg group-hover:bg-slate-900 transition-colors">
            <svg className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </Link>
  );
}