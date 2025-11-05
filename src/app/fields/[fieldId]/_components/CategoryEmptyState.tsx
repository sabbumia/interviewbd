// src/app/fields/[fieldId]/_components/CategoryEmptyState.tsx
interface CategoryEmptyStateProps {
  searchQuery: string;
}

export default function CategoryEmptyState({ searchQuery }: CategoryEmptyStateProps) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-6">
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">No Results Found</h3>
      <p className="text-slate-600">
        {searchQuery ? 'Try adjusting your search terms' : 'No categories available yet'}
      </p>
    </div>
  );
}