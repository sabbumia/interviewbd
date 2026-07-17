// src/app/users/[id]/_components/StatisticsCard.tsx
import { TrendingUp, Heart, Award, BarChart3 } from 'lucide-react';

interface StatisticsCardProps {
  questionCount: number;
  totalLikes: number;
  avgLikes: string;
}

const STAT_STYLES = [
  { bg: 'bg-brand-50/70 border-brand-100', tile: 'from-brand-500 to-indigo-600' },
  { bg: 'bg-rose-50/70 border-rose-100', tile: 'from-rose-500 to-pink-600' },
  { bg: 'bg-emerald-50/70 border-emerald-100', tile: 'from-emerald-500 to-teal-600' },
];

export default function StatisticsCard({ questionCount, totalLikes, avgLikes }: StatisticsCardProps) {
  const stats = [
    { icon: TrendingUp, label: 'Questions', value: questionCount },
    { icon: Heart, label: 'Total Likes', value: totalLikes },
    { icon: Award, label: 'Avg. Likes', value: avgLikes },
  ];

  return (
    <div className="card p-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
      <h2 className="font-display text-lg font-bold text-ink mb-5 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-brand-600" />
        Statistics
      </h2>
      <div className="space-y-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const style = STAT_STYLES[i];
          return (
            <div
              key={stat.label}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border ${style.bg} transition-transform duration-300 hover:scale-[1.02]`}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-linear-to-br ${style.tile} flex items-center justify-center shadow-card shrink-0`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500">{stat.label}</p>
                <p className="font-display text-2xl font-bold text-ink tabular-nums">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
