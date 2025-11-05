// src/app/users/_components/UsersHeader.tsx
import { Users, Network, Search, Shield } from 'lucide-react';

interface UsersHeaderProps {
  totalUsers: number;
  totalConnections: number;
  searchQuery: string;
  filterStatus: string;
  filterRole?: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: string) => void;
  onFilterRoleChange?: (role: string) => void;
}

export default function UsersHeader({ 
  totalUsers, 
  totalConnections,
  searchQuery,
  filterStatus,
  filterRole = 'all',
  onSearchChange,
  onFilterChange,
  onFilterRoleChange,
}: UsersHeaderProps) {
  return (
    <div className="mx-auto relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="w-[58%] mx-auto relative overflow-hidden rounded-xl">
        <div className="relative px-6 md:px-8 py-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Network</span>
              </h1>
              <p className="text-gray-300 text-sm md:text-base">
                Connect and collaborate with professionals and students
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-blue-400" />
                  <p className="text-3xl font-bold text-white">{totalUsers}</p>
                </div>
                <p className="text-xs text-gray-300 font-medium">Total Members</p>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Network className="w-5 h-5 text-green-400" />
                  <p className="text-3xl font-bold text-white">{totalConnections}</p>
                </div>
                <p className="text-xs text-gray-300 font-medium">Your Connections</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition"></div>
            <div className="relative flex items-center">
              <div className="absolute left-5 pointer-events-none">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or university..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Verification Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-transparent appearance-none bg-white cursor-pointer transition-all text-slate-900 font-medium shadow-lg"
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
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Shield className="w-5 h-5" />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => onFilterRoleChange(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-transparent appearance-none bg-white cursor-pointer transition-all text-slate-900 font-medium shadow-lg"
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
              <span className="text-sm text-gray-300 font-medium">Active filters:</span>
              {filterStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                  {filterStatus === 'verified' ? '✓ Verified' : '⊘ Unverified'}
                  <button
                    onClick={() => onFilterChange('all')}
                    className="ml-1 hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterRole !== 'all' && onFilterRoleChange && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium capitalize border border-purple-500/30">
                  {filterRole}
                  <button
                    onClick={() => onFilterRoleChange('all')}
                    className="ml-1 hover:text-purple-100"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}