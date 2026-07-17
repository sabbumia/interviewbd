// app/_components/HowItWorksSection.tsx
import { Users, Target, Zap, Route } from 'lucide-react';
import Reveal from '@/components/Reveal';

const STEPS = [
  {
    step: '01',
    icon: Users,
    title: 'Create Account',
    description: 'Sign up for free and set up your profile with your interests.',
  },
  {
    step: '02',
    icon: Target,
    title: 'Choose Your Field',
    description: 'Browse through various fields and select categories you want to practice.',
  },
  {
    step: '03',
    icon: Zap,
    title: 'Start Practicing',
    description: 'Post questions, answer others, and earn badges as you grow.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white border-y border-zinc-100">
      <div className="section-container">
        <Reveal>
          <div className="text-center mb-14">
            <span className="section-eyebrow">
              <Route className="w-3.5 h-3.5 text-brand-600" />
              How It Works
            </span>
            <h2 className="section-title mt-5">Three steps to get started</h2>
            <p className="section-subtitle mt-3 max-w-xl mx-auto">
              From sign-up to your first badge in minutes.
            </p>
          </div>
        </Reveal>

        <div className="relative grid md:grid-cols-3 gap-6">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-24 left-[16%] right-[16%] border-t-2 border-dashed border-brand-200"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.step} delay={i * 100}>
                <div className="card-hover relative h-full p-8">
                  <div className="font-display text-6xl font-bold text-transparent mb-5 select-none"
                    style={{ WebkitTextStroke: '1.5px var(--color-brand-200)' }}
                  >
                    {step.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-5 shadow-glow">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink mb-2.5">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
