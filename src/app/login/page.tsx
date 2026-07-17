// src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import AuthCard from '@/components/AuthCard';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Refresh user data to update navbar
      await refreshUser();
      router.push('/');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Loading message="Redirecting…" />;
  }

  return (
    <AuthCard>
      <div className="text-center mb-7">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 mt-1.5">Login to continue your preparation</p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium mb-5 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="field-label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input pl-10"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="field-label mb-0">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input pl-10 pr-11"
              placeholder="Enter your password"
              required
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

        <button type="submit" disabled={loading} className="btn-brand w-full py-3 group">
          {loading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              Logging in…
            </>
          ) : (
            <>
              Login
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          Sign up
        </Link>
      </p>

      <p className="mt-6 pt-5 border-t border-zinc-100 text-xs text-center text-zinc-400 leading-relaxed">
        By continuing, you agree to InterviewBD&apos;s Terms of Service and Privacy Policy.
      </p>
    </AuthCard>
  );
}
