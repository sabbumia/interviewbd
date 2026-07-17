// src/app/users/_components/UsersHeader.tsx
import { Users, Network, Shield, BadgeCheck, ChevronDown, X } from 'lucide-react';
import PageHero from '@/components/PageHero';

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
    <PageHero
      eyebrow={
        <span className="section-eyebrow">
          <Users className="w-3.5 h-3.5 text-brand-600" />
          Community
        </span>
      }
      title={
        <>
          Community <span className="text-gradient">Network</span>
        </>
      }
      description="Connect and collaborate with professionals and students."
      stats={[
        { icon: Users, value: totalUsers, label: 'Total Members' },
        { icon: Network, value: totalConnections, label: 'Your Connections', iconClass: 'text-emerald-600' },
      ]}
      search={{
        value: searchQuery,
        onChange: onSearchChange,
        placeholder: 'Search by name, email, or university…',
      }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Verification status filter */}
          <div className="relative">
            <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              aria-label="Filter by verification status"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700
                appearance-none cursor-pointer shadow-soft transition-all duration-200
                hover:border-zinc-300 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          {/* Role filter */}
          {onFilterRoleChange && (
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
              <select
                value={filterRole}
                onChange={(e) => onFilterRoleChange(e.target.value)}
                aria-label="Filter by role"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700
                  appearance-none cursor-pointer shadow-soft transition-all duration-200
                  hover:border-zinc-300 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
              >
                <option value="all">All Roles</option>
                <option value="admin">👑 Admin</option>
                <option value="moderator">🛡️ Moderator</option>
                <option value="premium">⭐ Premium</option>
                <option value="member">👤 Member</option>
                <option value="user">👥 User</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Active filters */}
        {(filterStatus !== 'all' || filterRole !== 'all') && (
          <div className="flex items-center gap-2 flex-wrap animate-fade-in">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Active filters
            </span>
            {filterStatus !== 'all' && (
              <span className="chip-brand">
                {filterStatus === 'verified' ? 'Verified' : 'Unverified'}
                <button
                  onClick={() => onFilterChange('all')}
                  aria-label="Clear status filter"
                  className="hover:text-brand-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterRole !== 'all' && onFilterRoleChange && (
              <span className="chip-amber capitalize">
                {filterRole}
                <button
                  onClick={() => onFilterRoleChange('all')}
                  aria-label="Clear role filter"
                  className="hover:text-amber-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </PageHero>
  );
}
