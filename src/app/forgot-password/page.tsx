// src/app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  Send,
} from 'lucide-react';
import AuthCard from '@/components/AuthCard';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send reset link');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      {!success ? (
        <>
          <div className="text-center mb-7">
            <div className="relative inline-flex mb-4">
              <div aria-hidden className="absolute inset-0 rounded-2xl bg-brand-200/60 blur-lg" />
              <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-brand-50 to-purple-50 border border-brand-100 flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-brand-600" />
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Forgot password?
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium mb-5 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="forgot-email" className="field-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-brand w-full py-3">
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4.5 h-4.5" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
              Back to Login
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="relative inline-flex mb-4">
              <div aria-hidden className="absolute inset-0 rounded-2xl bg-emerald-200/60 blur-lg" />
              <div className="relative w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5">We sent a password reset link to</p>
            <p className="text-sm font-bold text-brand-600 mt-0.5">{email}</p>
          </div>

          <div className="rounded-2xl bg-brand-50/60 border border-brand-100 p-4 mb-6">
            <p className="text-sm font-bold text-ink mb-2">Didn&apos;t receive the email?</p>
            <ul className="text-sm text-zinc-500 space-y-1 list-disc list-inside">
              <li>Check your spam folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="btn-brand w-full py-3"
            >
              Try Another Email
            </button>
            <Link href="/login" className="btn-ghost w-full justify-center">
              Back to Login
            </Link>
          </div>
        </>
      )}
    </AuthCard>
  );
}
