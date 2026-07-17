// src/components/Loading.tsx
import { Sparkles } from 'lucide-react';

interface LoadingProps {
  message?: string;
  /** Render at full viewport height (default) or inline within a section */
  fullScreen?: boolean;
}

export default function Loading({ message = 'Loading…', fullScreen = true }: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center bg-paper bg-aurora ${
        fullScreen ? 'min-h-[70vh]' : 'py-20'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="text-center animate-fade-in">
        <div className="relative w-16 h-16 mx-auto">
          {/* Orbiting ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-brand-100" />
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-brand-600 animate-spin" />
          {/* Logo core */}
          <div className="absolute inset-3 rounded-xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-glow animate-pulse-soft">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="mt-5 text-sm font-semibold text-zinc-500 tracking-wide">{message}</p>
      </div>
    </div>
  );
}
