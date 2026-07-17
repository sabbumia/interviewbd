// src/components/dashboard/OverviewTab.tsx
'use client';

import {
  Users,
  CheckCircle2,
  Activity,
  Heart,
  TrendingUp,
  AlertCircle,
  Flag,
  FolderTree,
  Tag,
  BarChart3,
  Trophy,
  Mail,
  Crown,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import Avatar from '@/components/Avatar';
import TabHeader from './TabHeader';
import StatCard from './StatCard';
import { Analytics, getBadge } from './types';

interface OverviewTabProps {
  analytics: Analytics;
  pendingReportsCount: number;
  pendingVerificationsCount: number;
  /** Navigate to another dashboard tab (used by the alert cards) */
  onNavigate?: (tab: string) => void;
}

const RANK_STYLES = [
  'bg-linear-to-br from-amber-400 to-orange-500 text-white',
  'bg-linear-to-br from-zinc-300 to-zinc-400 text-white',
  'bg-linear-to-br from-orange-300 to-amber-600 text-white',
];

export default function OverviewTab({
  analytics,
  pendingReportsCount,
  pendingVerificationsCount,
  onNavigate,
}: OverviewTabProps) {
  const verifiedPct =
    analytics.totalUsers > 0
      ? Math.round((analytics.verifiedUsers / analytics.totalUsers) * 100)
      : 0;
  const avgQuestions =
    analytics.totalUsers > 0
      ? Math.round(analytics.totalQuestions / analytics.totalUsers)
      : 0;
  const engagementRate =
    analytics.totalQuestions > 0
      ? Math.round((analytics.totalLikes / analytics.totalQuestions) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <TabHeader
        icon={BarChart3}
        iconClass="bg-brand-50 text-brand-600 border-brand-100"
        title="Dashboard Overview"
        description="Monitor your platform statistics and activity"
      />

      {/* Primary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <StatCard
          icon={Users}
          accent="bg-brand-50 text-brand-600 border-brand-100"
          value={analytics.totalUsers.toLocaleString()}
          label="Total Users"
          trend={
            <span className="chip-emerald">
              <TrendingUp className="w-3.5 h-3.5" />
              Active
            </span>
          }
          footer={
            <>
              <span className="font-bold text-emerald-600">{analytics.verifiedUsers}</span> verified
            </>
          }
        />
        <StatCard
          icon={CheckCircle2}
          accent="bg-emerald-50 text-emerald-600 border-emerald-100"
          value={analytics.verifiedUsers.toLocaleString()}
          label="Verified Users"
          trend={<span className="chip-emerald">{verifiedPct}%</span>}
          footer={<>of {analytics.totalUsers} total users</>}
        />
        <StatCard
          icon={Activity}
          accent="bg-violet-50 text-violet-600 border-violet-100"
          value={analytics.totalQuestions.toLocaleString()}
          label="Total Questions"
          trend={<span className="chip bg-violet-50 text-violet-700 border border-violet-100">{avgQuestions} avg</span>}
          footer="across all categories"
        />
        <StatCard
          icon={Heart}
          accent="bg-rose-50 text-rose-600 border-rose-100"
          value={analytics.totalLikes.toLocaleString()}
          label="Total Likes"
          trend={<span className="chip-rose">{engagementRate}% rate</span>}
          footer="engagement activity"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <StatCard
          icon={FolderTree}
          accent="bg-sky-50 text-sky-600 border-sky-100"
          value={analytics.totalFields}
          label="Fields"
        />
        <StatCard
          icon={Tag}
          accent="bg-violet-50 text-violet-600 border-violet-100"
          value={analytics.totalCategories}
          label="Categories"
        />
        <button
          onClick={() => onNavigate?.('verifications')}
          className="card p-5 text-left transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5 border-orange-200/80 bg-linear-to-br from-orange-50/60 to-white group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl border bg-orange-50 text-orange-600 border-orange-100 flex items-center justify-center">
              <AlertCircle className="w-5.5 h-5.5" />
            </div>
            {pendingVerificationsCount > 0 && (
              <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform duration-300" />
            )}
          </div>
          <p className="font-display text-3xl font-bold text-orange-700 tabular-nums mb-0.5">
            {pendingVerificationsCount}
          </p>
          <p className="text-sm font-semibold text-orange-600">Pending Verifications</p>
          {pendingVerificationsCount > 0 && (
            <div className="mt-3 pt-3 border-t border-orange-200/70 text-xs font-semibold text-orange-500">
              Requires attention
            </div>
          )}
        </button>
        <button
          onClick={() => onNavigate?.('reports')}
          className="card p-5 text-left transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5 border-rose-200/80 bg-linear-to-br from-rose-50/60 to-white group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl border bg-rose-50 text-rose-600 border-rose-100 flex items-center justify-center">
              <Flag className="w-5.5 h-5.5" />
            </div>
            {pendingReportsCount > 0 && (
              <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform duration-300" />
            )}
          </div>
          <p className="font-display text-3xl font-bold text-rose-700 tabular-nums mb-0.5">
            {pendingReportsCount}
          </p>
          <p className="text-sm font-semibold text-rose-600">Pending Reports</p>
          {pendingReportsCount > 0 && (
            <div className="mt-3 pt-3 border-t border-rose-200/70 text-xs font-semibold text-rose-500">
              Requires review
            </div>
          )}
        </button>
      </div>

      {/* Top contributors */}
      <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-ink">Top Contributors</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Most active users on the platform</p>
            </div>
          </div>
          <span className="chip-amber">Top {analytics.topContributors.length}</span>
        </div>

        <div className="p-5 sm:p-6">
          {analytics.topContributors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-7 h-7 text-zinc-300" />
              </div>
              <p className="font-semibold text-zinc-500">No contributors yet</p>
              <p className="text-sm text-zinc-400 mt-1">User activity will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.topContributors.map((contributor, index) => {
                const badge = getBadge(contributor.questionCount);

                return (
                  <div
                    key={contributor.userId}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-zinc-200/80 bg-white
                      transition-all duration-300 hover:border-brand-200 hover:shadow-card"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 ${
                          RANK_STYLES[index] ?? 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        #{index + 1}
                      </span>

                      <div className="relative shrink-0">
                        <Avatar
                          src={contributor.user.profilePicture}
                          name={contributor.user.name}
                          size={52}
                          verified={contributor.user.isVerified}
                        />
                        {contributor.user.role === 'admin' && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center" title="Admin">
                            <Crown className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                        {contributor.user.role === 'moderator' && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center" title="Moderator">
                            <ShieldCheck className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-ink truncate">
                            {contributor.user.name}
                          </span>
                          {badge && (
                            <span className="text-lg shrink-0" title={badge.name}>
                              {badge.emoji}
                            </span>
                          )}
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-zinc-400 truncate mt-0.5">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          {contributor.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="px-4 py-2 rounded-xl bg-brand-50/70 border border-brand-100 text-center min-w-20">
                        <p className="font-display font-bold text-brand-700 tabular-nums">
                          {contributor.questionCount}
                        </p>
                        <p className="text-[10px] font-semibold text-zinc-500">Questions</p>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-rose-50/70 border border-rose-100 text-center min-w-20">
                        <p className="font-display font-bold text-rose-600 tabular-nums">
                          {contributor.totalLikes}
                        </p>
                        <p className="text-[10px] font-semibold text-zinc-500">Likes</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
