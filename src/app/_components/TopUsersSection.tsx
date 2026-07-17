// app/_components/TopUsersSection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Crown, BookOpen, ShieldCheck, ThumbsUp, type LucideIcon } from 'lucide-react';
import Avatar from '@/components/Avatar';
import Reveal from '@/components/Reveal';
import { badges, getBadge } from '@/lib/badges';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
  role: string;
  questionCount: number;
  likeCount?: number;
}

interface TopUsersSectionProps {
  users: User[];
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  accent: 'amber' | 'rose';
  title: string;
  subtitle: string;
  metric: 'questions' | 'likes';
}

const RANK_STYLES = [
  'bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-card',
  'bg-linear-to-br from-zinc-300 to-zinc-400 text-white shadow-card',
  'bg-linear-to-br from-orange-300 to-amber-600 text-white shadow-card',
];

/**
 * Shared leaderboard section for "top contributors" and "most liked" users.
 */
export default function TopUsersSection({
  users,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  accent,
  title,
  subtitle,
  metric,
}: TopUsersSectionProps) {
  const router = useRouter();

  const accentChip = accent === 'amber' ? 'chip-amber' : 'chip-rose';
  const metricColor = accent === 'amber' ? 'text-brand-700 bg-brand-50/70' : 'text-rose-700 bg-rose-50/70';
  const MetricIcon = metric === 'questions' ? BookOpen : ThumbsUp;

  return (
    <section className="py-24">
      <div className="section-container">
        <Reveal>
          <div className="text-center mb-14">
            <span className={accentChip}>
              <EyebrowIcon className="w-3.5 h-3.5" />
              {eyebrow}
            </span>
            <h2 className="section-title mt-5">{title}</h2>
            <p className="section-subtitle mt-3 max-w-2xl mx-auto">{subtitle}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {users.map((user, i) => {
            const badge = getBadge(user.questionCount) ?? badges[0];
            const metricValue = metric === 'questions' ? user.questionCount : user.likeCount ?? 0;

            return (
              <Reveal key={user.id} delay={i * 70}>
                <button
                  onClick={() => router.push(`/users/${user.id}`)}
                  className="card-hover group w-full h-full p-6 pt-8 text-center relative"
                >
                  {/* Rank */}
                  <span
                    className={`absolute top-4 left-4 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      RANK_STYLES[i] ?? 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    #{i + 1}
                  </span>

                  {/* Role marker */}
                  {user.role === 'admin' && (
                    <span className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center" title="Admin">
                      <Crown className="w-4 h-4 text-rose-500" />
                    </span>
                  )}
                  {user.role === 'moderator' && (
                    <span className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center" title="Moderator">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    </span>
                  )}

                  <div className="inline-block mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Avatar
                      src={user.profilePicture}
                      name={user.name}
                      size={76}
                      verified={user.isVerified}
                      ring={i === 0}
                    />
                  </div>

                  <h3 className="font-display text-base font-bold text-ink mb-0.5 line-clamp-1">{user.name}</h3>
                  <p className="text-xs text-zinc-400 mb-4 truncate">{user.email}</p>

                  <div className="chip-zinc mb-4">
                    <span aria-hidden>{badge.emoji}</span>
                    {badge.name}
                  </div>

                  <div className={`rounded-2xl p-3.5 ${metricColor}`}>
                    <div className="flex items-center justify-center gap-2">
                      <MetricIcon className="w-4 h-4" />
                      <span className="font-display text-2xl font-bold tabular-nums">
                        {metricValue.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-zinc-500 mt-0.5">
                      {metric === 'questions' ? 'Questions Posted' : 'Total Likes'}
                    </p>
                  </div>

                  {metric === 'likes' && (
                    <p className="text-xs text-zinc-500 mt-3">
                      <span className="font-bold text-ink">{user.questionCount}</span> Questions
                    </p>
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
