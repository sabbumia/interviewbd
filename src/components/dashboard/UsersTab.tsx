// src/components/dashboard/UsersTab.tsx
'use client';

import { useState } from 'react';
import {
  Trash2,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Filter,
  ShieldCheck,
  Crown,
  ChevronDown,
} from 'lucide-react';
import Avatar from '@/components/Avatar';
import TabHeader from './TabHeader';
import StatCard from './StatCard';
import { User, getBadge } from './types';

interface UsersTabProps {
  users: User[];
  currentUserId: string;
  onRoleChange: (userId: string, newRole: string) => void;
  onDeleteUser: (userId: string) => void;
  /** Admins can change roles; moderators see a read-only role chip */
  canManageRoles?: boolean;
}

const ROLE_CHIPS: Record<string, string> = {
  admin: 'chip-rose',
  moderator: 'chip-amber',
  user: 'chip-zinc',
};

export default function UsersTab({
  users,
  currentUserId,
  onRoleChange,
  onDeleteUser,
  canManageRoles = true,
}: UsersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && user.isVerified) ||
      (statusFilter === 'unverified' && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    verified: users.filter((u) => u.isVerified).length,
    admins: users.filter((u) => u.role === 'admin').length,
    moderators: users.filter((u) => u.role === 'moderator').length,
    totalQuestions: users.reduce((sum, u) => sum + (u.questionCount || 0), 0),
  };

  return (
    <div className="space-y-8">
      <TabHeader
        icon={Users}
        iconClass="bg-brand-50 text-brand-600 border-brand-100"
        title="User Management"
        description="Manage user accounts, roles, and permissions"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <StatCard icon={Users} accent="bg-brand-50 text-brand-600 border-brand-100" value={stats.total} label="Total Users" />
        <StatCard icon={CheckCircle2} accent="bg-emerald-50 text-emerald-600 border-emerald-100" value={stats.verified} label="Verified" />
        <StatCard icon={Crown} accent="bg-rose-50 text-rose-600 border-rose-100" value={stats.admins} label="Admins" />
        <StatCard icon={ShieldCheck} accent="bg-amber-50 text-amber-600 border-amber-100" value={stats.moderators} label="Moderators" />
        <StatCard icon={Award} accent="bg-violet-50 text-violet-600 border-violet-100" value={stats.totalQuestions} label="Questions" />
      </div>

      {/* Filters */}
      <div className="card p-5 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="field-input pl-10"
            />
          </div>

          <div className="relative w-full md:w-44">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter by role"
              className="field-input pl-9.5 pr-9 appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by verification status"
              className="field-input pr-9 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <p className="mt-4 pt-4 border-t border-zinc-100 text-sm text-zinc-500">
          Showing <span className="font-bold text-ink">{filteredUsers.length}</span> of{' '}
          <span className="font-bold text-ink">{users.length}</span> users
        </p>
      </div>

      {/* Users table */}
      <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: '200ms' }}>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-zinc-300" />
            </div>
            <p className="font-semibold text-zinc-500">No users found</p>
            <p className="text-sm text-zinc-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-100">
              <thead className="bg-zinc-50/80">
                <tr>
                  {['User', 'Email', 'Badge', 'Questions', 'Role', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredUsers.map((u) => {
                  const badge = getBadge(u.questionCount || 0);
                  const isCurrentUser = u.id === currentUserId;

                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors hover:bg-brand-50/40 ${isCurrentUser ? 'bg-brand-50/30' : ''}`}
                    >
                      {/* User */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <Avatar src={u.profilePicture} name={u.name} size={42} verified={u.isVerified} />
                            {u.role === 'admin' && (
                              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center" title="Admin">
                                <Crown className="w-2.5 h-2.5 text-white" />
                              </span>
                            )}
                            {u.role === 'moderator' && (
                              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center" title="Moderator">
                                <ShieldCheck className="w-2.5 h-2.5 text-white" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink text-sm">{u.name}</span>
                            {isCurrentUser && <span className="chip-brand">You</span>}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-zinc-500">{u.email}</span>
                      </td>

                      {/* Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {badge ? (
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl" title={badge.name}>
                              {badge.emoji}
                            </span>
                            <div>
                              <span className="block text-sm font-bold text-ink">{badge.name}</span>
                              <span className="text-[11px] text-zinc-400">
                                {badge.maxQuestions === Infinity
                                  ? `${badge.minQuestions}+`
                                  : `${badge.minQuestions}–${badge.maxQuestions}`}{' '}
                                questions
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-zinc-300 font-medium">No badge</span>
                        )}
                      </td>

                      {/* Questions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="chip-brand tabular-nums">{u.questionCount || 0}</span>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {canManageRoles ? (
                          <div className="relative inline-block">
                            <select
                              value={u.role}
                              onChange={(e) => onRoleChange(u.id, e.target.value)}
                              disabled={isCurrentUser}
                              aria-label={`Change role for ${u.name}`}
                              className="field-input py-1.5 pr-8 text-xs font-semibold appearance-none cursor-pointer w-36
                                disabled:bg-zinc-50 disabled:cursor-not-allowed"
                            >
                              <option value="user">👤 User</option>
                              <option value="moderator">🛡️ Moderator</option>
                              <option value="admin">⚡ Admin</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                          </div>
                        ) : (
                          <span className={`${ROLE_CHIPS[u.role] ?? 'chip-zinc'} capitalize`}>{u.role}</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {u.isVerified ? (
                          <span className="chip-emerald">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="chip-zinc">
                            <XCircle className="w-3.5 h-3.5" />
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {!isCurrentUser ? (
                          <button
                            onClick={() => onDeleteUser(u.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-100
                              hover:bg-rose-100 transition-all duration-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-300 italic">Cannot delete self</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
