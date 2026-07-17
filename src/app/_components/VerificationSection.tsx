// app/_components/VerificationSection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Shield, CheckCircle2, BadgeCheck, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface VerificationSectionProps {
  currentUser: CurrentUser | null;
}

const BENEFITS = [
  'Increase your credibility',
  'Gain trust from the community',
  'Unlock exclusive features',
  'Priority in search results',
];

export default function VerificationSection({ currentUser }: VerificationSectionProps) {
  const router = useRouter();

  // Only show if user is logged in and not verified
  if (!currentUser || currentUser.isVerified) {
    return null;
  }

  return (
    <section className="py-24">
      <div className="section-container max-w-5xl">
        <Reveal>
          <div className="relative rounded-4xl bg-[#12111a] p-10 md:p-14 text-white overflow-hidden shadow-lift">
            {/* Texture + glows */}
            <div aria-hidden className="absolute inset-0 bg-grid-dark" />
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #a855f7)' }}
            />
            <div
              aria-hidden
              className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full blur-3xl opacity-15"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #4f46e5)' }}
            />

            <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center">
                    <Shield className="w-6 h-6 text-brand-300" />
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Get Verified</h2>
                </div>
                <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                  Stand out from the crowd with a verification badge. Submit your request
                  and our team will review it within 24–48 hours.
                </p>
                <ul className="grid sm:grid-cols-2 gap-3.5 mb-9">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-zinc-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/profile?tab=verification')}
                  className="btn btn-lg bg-white text-ink hover:bg-zinc-100 hover:-translate-y-0.5 shadow-card group"
                >
                  Apply for Verification
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Decorative badge visual */}
              <div aria-hidden className="hidden lg:flex items-center justify-center">
                <div className="relative animate-float">
                  <div className="absolute inset-0 rounded-full bg-brand-500/40 blur-2xl scale-110" />
                  <div className="relative w-44 h-44 rounded-full bg-white/5 border border-white/15 backdrop-blur flex items-center justify-center">
                    <BadgeCheck className="w-24 h-24 text-brand-300" strokeWidth={1.25} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
