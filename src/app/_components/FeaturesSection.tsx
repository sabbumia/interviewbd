// app/_components/FeaturesSection.tsx
import { BookOpen, Users, Award, MessageSquare, Shield, TrendingUp, Sparkles } from 'lucide-react';
import Reveal from '@/components/Reveal';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Diverse Question Bank',
    description: 'Access thousands of interview questions across multiple fields and categories.',
    accent: 'bg-brand-50 text-brand-600 border-brand-100',
  },
  {
    icon: Users,
    title: 'Connect & Network',
    description: 'Build connections with professionals and learners in your field.',
    accent: 'bg-sky-50 text-sky-600 border-sky-100',
  },
  {
    icon: Award,
    title: 'Earn Badges',
    description: 'Get recognized for your contributions with achievement badges.',
    accent: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Messaging',
    description: 'Chat with other users and share knowledge instantly.',
    accent: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  {
    icon: Shield,
    title: 'Verified Accounts',
    description: 'Get the blue verification badge and build credibility.',
    accent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your learning journey and see your growth over time.',
    accent: 'bg-rose-50 text-rose-600 border-rose-100',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white border-y border-zinc-100 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-aurora opacity-60" />

      <div className="relative section-container">
        <Reveal>
          <div className="text-center mb-14">
            <span className="section-eyebrow">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Why InterviewBD
            </span>
            <h2 className="section-title mt-5">
              Everything you need to <span className="text-gradient">ace it</span>
            </h2>
            <p className="section-subtitle mt-3 max-w-xl mx-auto">
              One platform for practice, community, and career growth.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 60}>
                <div className="card-hover group h-full p-7">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${feature.accent}
                      group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
