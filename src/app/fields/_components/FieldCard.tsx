// src/app/fields/_components/FieldCard.tsx
import Link from 'next/link';

interface Field {
  id: string;
  name: string;
  description: string;
  categories?: Array<{ id: string }>;
}

interface FieldCardProps {
  field: Field;
}

export default function FieldCard({ field }: FieldCardProps) {
  return (
    <Link
      href={`/fields/${field.id}`}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-slate-300 transform hover:-translate-y-2"
    >
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      {/* Card Content */}
      <div className="p-6">
        {/* Icon Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-800 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          {/* Arrow Icon */}
          <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg group-hover:bg-slate-900 transition-colors">
            <svg className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
          {field.name}
        </h2>
        
        {/* Description */}
        <p className="text-slate-600 mb-5 line-clamp-2 leading-relaxed">
          {field.description}
        </p>
        
        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {field.categories?.length || 0}
              </div>
              <div className="text-xs text-slate-500">Categories</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors">
            <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">Explore</span>
            <svg className="w-3 h-3 text-slate-700 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </Link>
  );
}