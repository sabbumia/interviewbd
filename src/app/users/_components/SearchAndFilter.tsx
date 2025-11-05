// src/app/users/_components/SearchAndFilter.tsx
import { Search, Filter, Shield } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  filterStatus: string;
  filterRole?: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: string) => void;
  onFilterRoleChange?: (role: string) => void;
}

export default function SearchAndFilter({
  searchQuery,
  filterStatus,
  filterRole = 'all',
  onSearchChange,
  onFilterChange,
  onFilterRoleChange,
}: SearchAndFilterProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="md:col-span-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Verification Status Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
          >
            <option value="all">All Status</option>
            <option value="verified">✓ Verified Only</option>
            <option value="unverified">⊘ Unverified Only</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Role Filter */}
        {onFilterRoleChange && (
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={filterRole}
              onChange={(e) => onFilterRoleChange(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
            >
              <option value="all">All Roles</option>
              <option value="admin">👑 Admin</option>
              <option value="moderator">🛡️ Moderator</option>
              <option value="premium">⭐ Premium</option>
              <option value="member">👤 Member</option>
              <option value="user">👥 User</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(filterStatus !== 'all' || filterRole !== 'all') && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filterStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {filterStatus === 'verified' ? '✓ Verified' : '⊘ Unverified'}
              <button
                onClick={() => onFilterChange('all')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {filterRole !== 'all' && onFilterRoleChange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
              {filterRole}
              <button
                onClick={() => onFilterRoleChange('all')}
                className="ml-1 hover:text-purple-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
