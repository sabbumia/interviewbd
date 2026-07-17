// app/_components/HeroSection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Users, BookOpen, Layers, Sparkles, Search, Plus, Grid2x2 } from 'lucide-react';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface Stats {
  users: number;
  questions: number;
  fields: number;
  categories: number;
}

interface HeroSectionProps {
  currentUser: CurrentUser | null;
  animatedStats: Stats;
}

const STATS = [
  { key: 'users', label: 'Active Users', icon: Users },
  { key: 'questions', label: 'Questions', icon: BookOpen },
  { key: 'fields', label: 'Fields', icon: Layers },
  { key: 'categories', label: 'Categories', icon: Grid2x2 },
] as const;

export default function HeroSection({ currentUser, animatedStats }: HeroSectionProps) {
  const router = useRouter();

  return (
    <section className="relative pt-20 pb-24 sm:pt-28 overflow-hidden bg-aurora">
      {/* Backdrop texture */}
      <div aria-hidden className="absolute inset-0 bg-grid-fade" />

      {/* Floating gradient orbs */}
      <div aria-hidden className="absolute top-24 -left-16 w-72 h-72 rounded-full bg-brand-300/25 blur-3xl animate-float" />
      <div aria-hidden className="absolute top-40 -right-20 w-80 h-80 rounded-full bg-purple-300/25 blur-3xl animate-float-slow" />

      <div className="relative section-container text-center">
        {/* Eyebrow */}
        <div className="animate-fade-up inline-flex items-center gap-2.5 px-4 py-2 glass rounded-full text-sm font-semibold text-zinc-700 mb-8">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
          </span>
          Bangladesh&apos;s interview preparation community
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up text-5xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[1.05] tracking-tight mb-8 text-balance"
          style={{ animationDelay: '80ms' }}
        >
          Master your next
          <br className="hidden sm:block" />
          <span className="text-gradient"> interview</span>, together.
        </h1>

        {/* Quote */}
        <p
          className="animate-fade-up max-w-2xl mx-auto text-lg sm:text-xl text-zinc-500 italic font-light leading-relaxed mb-4"
          style={{ animationDelay: '160ms' }}
        >
          &ldquo;From every question, from every answer — knowledge takes its first breath.&rdquo;
        </p>

        <p
          className="animate-fade-up text-base sm:text-lg text-zinc-500 mb-10 max-w-xl mx-auto"
          style={{ animationDelay: '220ms' }}
        >
          Practice with thousands of real interview questions, connect with verified
          professionals, and elevate your career preparation.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row gap-3 justify-center items-center mb-20"
          style={{ animationDelay: '300ms' }}
        >
          {currentUser ? (
            <>
              <button
                onClick={() => router.push('/fields')}
                className="btn-brand btn-lg w-full sm:w-auto group"
              >
                <Search className="w-5 h-5" />
                Browse Questions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => router.push('/questions/new')}
                className="btn-primary btn-lg w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>
              <button
                onClick={() => router.push('/users')}
                className="btn-secondary btn-lg w-full sm:w-auto"
              >
                <Users className="w-5 h-5" />
                Network
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/signup')}
                className="btn-brand btn-lg w-full sm:w-auto group"
              >
                <Sparkles className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => router.push('/fields')}
                className="btn-secondary btn-lg w-full sm:w-auto"
              >
                Explore Questions
              </button>
            </>
          )}
        </div>

        {/* Stats strip */}
        <div
          className="animate-fade-up max-w-4xl mx-auto glass rounded-3xl grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-zinc-200/60 overflow-hidden"
          style={{ animationDelay: '380ms' }}
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className="p-6 sm:p-7 group hover:bg-white/60 transition-colors duration-300">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-100 transition-all duration-300">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-ink tabular-nums tracking-tight">
                  {animatedStats[stat.key].toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
