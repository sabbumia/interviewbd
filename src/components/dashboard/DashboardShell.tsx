// src/components/dashboard/DashboardShell.tsx
'use client';

import {
  LayoutDashboard,
  Flag,
  BadgeCheck,
  Users,
  FolderTree,
  Crown,
  ShieldCheck,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import Avatar from '@/components/Avatar';

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  badge?: number;
}

interface DashboardShellProps {
  variant: 'admin' | 'moderator';
  userName: string;
  userProfilePicture?: string;
  activeTab: string;
  pendingReportsCount: number;
  pendingVerificationsCount: number;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

const VARIANT = {
  admin: {
    title: 'Admin Panel',
    subtitle: 'Management Console',
    roleLabel: 'Administrator',
    icon: Crown,
    chip: 'bg-rose-50 text-rose-600 border-rose-100',
    footerTitle: 'Full Access',
    footerText: 'Complete platform management',
  },
  moderator: {
    title: 'Moderator Panel',
    subtitle: 'Moderation Console',
    roleLabel: 'Moderator',
    icon: ShieldCheck,
    chip: 'bg-amber-50 text-amber-600 border-amber-100',
    footerTitle: 'Moderation Access',
    footerText: 'Review content and keep the community safe',
  },
} as const;

/**
 * Responsive dashboard chrome shared by the admin and moderator consoles:
 * fixed sidebar on desktop, horizontal tab bar on mobile.
 */
export default function DashboardShell({
  variant,
  userName,
  userProfilePicture,
  activeTab,
  pendingReportsCount,
  pendingVerificationsCount,
  onTabChange,
  children,
}: DashboardShellProps) {
  const v = VARIANT[variant];
  const VariantIcon = v.icon;
  const totalPending = pendingReportsCount + pendingVerificationsCount;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: Flag, badge: pendingReportsCount },
    { id: 'verifications', label: 'Verifications', icon: BadgeCheck, badge: pendingVerificationsCount },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'fields', label: 'Fields & Categories', shortLabel: 'Fields', icon: FolderTree },
  ];

  return (
    <div className="min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-zinc-200/80 flex-col z-30">
        {/* Panel header */}
        <div className="p-5 border-b border-zinc-100">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${v.chip}`}>
              <VariantIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-ink leading-tight">{v.title}</h1>
              <p className="text-[11px] text-zinc-400 font-medium">{v.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="relative shrink-0">
              <Avatar src={userProfilePicture} name={userName} size={38} />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink truncate">{userName}</p>
              <p className="text-[11px] text-zinc-400 font-medium">{v.roleLabel}</p>
            </div>
          </div>
        </div>

        {/* Pending banner */}
        {totalPending > 0 && (
          <div className="mx-4 mt-4 px-4 py-3 rounded-2xl bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200/70">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-orange-500 shrink-0 animate-pulse-soft" />
              <div>
                <p className="text-xs font-bold text-orange-900">Pending Actions</p>
                <p className="text-[11px] text-orange-700 mt-0.5">
                  {totalPending} {totalPending === 1 ? 'item needs' : 'items need'} attention
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-slim" aria-label="Dashboard sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasBadge = item.badge !== undefined && item.badge > 0;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-ink text-white shadow-card'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-ink'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-brand-300' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </span>
                {hasBadge && (
                  <span
                    className={`text-[11px] font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center ${
                      isActive ? 'bg-white text-ink' : 'bg-linear-to-br from-rose-500 to-pink-600 text-white shadow-soft'
                    }`}
                  >
                    {item.badge! > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100">
          <div className={`rounded-2xl p-4 border ${v.chip}`}>
            <div className="flex items-start gap-3">
              <VariantIcon className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold mb-0.5">{v.footerTitle}</p>
                <p className="text-[11px] leading-relaxed opacity-80">{v.footerText}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-zinc-200/80">
        <nav className="flex gap-1.5 px-3 py-2.5 overflow-x-auto scrollbar-slim" aria-label="Dashboard sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasBadge = item.badge !== undefined && item.badge > 0;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  isActive ? 'bg-ink text-white shadow-card' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.shortLabel ?? item.label}
                {hasBadge && (
                  <span
                    className={`text-[10px] font-bold rounded-full min-w-4.5 h-4.5 px-1 flex items-center justify-center ${
                      isActive ? 'bg-white text-ink' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge! > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="lg:pl-64">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
