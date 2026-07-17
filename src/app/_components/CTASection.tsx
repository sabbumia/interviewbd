// app/_components/CTASection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Heart, ArrowRight, User, MessageSquare } from 'lucide-react';
import Reveal from '@/components/Reveal';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface CTASectionProps {
  currentUser: CurrentUser | null;
}

export default function CTASection({ currentUser }: CTASectionProps) {
  const router = useRouter();

  return (
    <section className="py-24 relative overflow-hidden bg-aurora">
      <div aria-hidden className="absolute inset-0 bg-grid-fade" />

      <div className="relative section-container max-w-4xl text-center">
        <Reveal>
          <span className="chip-emerald">
            <Heart className="w-3.5 h-3.5" />
            Join Our Growing Community
          </span>

          <h2 className="section-title mt-6 text-balance">
            Ready to start your <span className="text-gradient">journey</span>?
          </h2>
          <p className="section-subtitle mt-4 mb-10 max-w-xl mx-auto">
            Join thousands of professionals preparing for their dream careers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {currentUser ? (
              <>
                <button
                  onClick={() => router.push('/profile')}
                  className="btn-brand btn-lg group"
                >
                  <User className="w-5 h-5" />
                  View My Profile
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => router.push('/messages')}
                  className="btn-secondary btn-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  My Messages
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/signup')}
                  className="btn-brand btn-lg group"
                >
                  Sign Up Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => router.push('/fields')}
                  className="btn-secondary btn-lg"
                >
                  Browse Questions
                </button>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
