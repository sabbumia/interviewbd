// src/app/reset-password/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldQuestion,
  XCircle,
} from 'lucide-react';
import AuthCard from '@/components/AuthCard';
import Loading from '@/components/Loading';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="relative inline-flex mb-4">
          <div aria-hidden className="absolute inset-0 rounded-2xl bg-rose-200/60 blur-lg" />
          <div className="relative w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-rose-600" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-ink tracking-tight mb-2">
          Invalid reset link
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password" className="btn-brand inline-flex">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <>
      {!success ? (
        <>
          <div className="text-center mb-7">
            <div className="relative inline-flex mb-4">
              <div aria-hidden className="absolute inset-0 rounded-2xl bg-brand-200/60 blur-lg" />
              <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-brand-50 to-purple-50 border border-brand-100 flex items-center justify-center">
                <ShieldQuestion className="w-6 h-6 text-brand-600" />
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Set new password
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5">
              Create a strong password for your account.
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
              <label htmlFor="reset-password" className="field-label">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="field-input pl-10 pr-11"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-400 hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reset-confirm" className="field-label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                <input
                  id="reset-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="field-input pl-10"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-brand-50/60 border border-brand-100 p-4">
              <p className="text-sm font-bold text-ink mb-1.5">Password requirements</p>
              <ul className="text-xs text-zinc-500 space-y-1 list-disc list-inside">
                <li>At least 6 characters long</li>
                <li>Mix of letters and numbers recommended</li>
                <li>Avoid common words or patterns</li>
              </ul>
            </div>

            <button type="submit" disabled={loading} className="btn-brand w-full py-3">
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Resetting password…
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="relative inline-flex mb-4">
            <div aria-hidden className="absolute inset-0 rounded-2xl bg-emerald-200/60 blur-lg" />
            <div className="relative w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Password reset!
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            Your password has been successfully reset.
          </p>
          <p className="text-xs text-zinc-400 mt-3">Redirecting to login page…</p>

          <Link href="/login" className="btn-brand inline-flex mt-6">
            Go to Login
          </Link>
        </div>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard>
      <Suspense fallback={<Loading message="Loading…" fullScreen={false} />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
