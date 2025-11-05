// src/app/fields/[fieldId]/_components/CategorySearchBar.tsx
interface CategorySearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function CategorySearchBar({ searchQuery, onSearchChange }: CategorySearchBarProps) {
  return (
    <div className="mb-8">
      <div className="relative max-w-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition"></div>
        <div className="relative flex items-center">
          <div className="absolute left-5 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-6 py-3.5 bg-white rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-slate-900 placeholder-slate-400 font-medium"
          />
        </div>
      </div>
    </div>
  );
}