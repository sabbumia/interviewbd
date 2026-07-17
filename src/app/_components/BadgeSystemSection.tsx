// app/_components/BadgeSystemSection.tsx
import { Medal } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { badges } from '@/lib/badges';

export default function BadgeSystemSection() {
  return (
    <section className="py-24">
      <div className="section-container">
        <Reveal>
          <div className="text-center mb-14">
            <span className="section-eyebrow">
              <Medal className="w-3.5 h-3.5 text-amber-500" />
              Achievements
            </span>
            <h2 className="section-title mt-5">The badge journey</h2>
            <p className="section-subtitle mt-3 max-w-xl mx-auto">
              Earn badges as you contribute more questions to the community.
            </p>
          </div>
        </Reveal>

        <div className="relative">
          {/* Progression rail (desktop) */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 -translate-y-1/2 rounded-full
              bg-linear-to-r from-zinc-200 via-brand-200 to-amber-300"
          />

          <div className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {badges.map((badge, i) => (
              <Reveal key={badge.name} delay={i * 60}>
                <div
                  className="card-hover group h-full p-5 text-center cursor-default"
                  title={badge.description}
                >
                  <div className="text-4xl mb-3 group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-300 will-change-transform">
                    {badge.emoji}
                  </div>
                  <div className="font-display font-bold text-ink text-sm mb-1">{badge.name}</div>
                  <div className="text-[11px] font-medium text-zinc-400">
                    {badge.maxQuestions === Infinity
                      ? `${badge.minQuestions}+ questions`
                      : `${badge.minQuestions}–${badge.maxQuestions} questions`}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
