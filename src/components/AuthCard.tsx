// src/components/AuthCard.tsx
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Shared shell for the auth pages — aurora backdrop with a centered card
 * and the brand mark on top.
 */
export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-paper bg-aurora px-4 py-12 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-grid-fade" />
      <div aria-hidden className="absolute top-16 -left-20 w-72 h-72 rounded-full bg-brand-300/20 blur-3xl animate-float" />
      <div aria-hidden className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-purple-300/20 blur-3xl animate-float-slow" />

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Brand mark */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            Interview<span className="text-gradient">BD</span>
          </span>
        </Link>

        <div className="card p-7 sm:p-8 shadow-lift">{children}</div>
      </div>
    </div>
  );
}
