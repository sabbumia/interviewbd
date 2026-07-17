// src/app/signup/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import AuthCard from '@/components/AuthCard';

export default function SignupPage() {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      setStep('verify');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: verificationCode,
          name,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      // Refresh user data to update navbar
      await refreshUser();
      router.push('/profile');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to resend code');
        return;
      }

      alert('Verification code resent to your email');
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
      {step === 'register' ? (
        <>
          <div className="text-center mb-7">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5">Join InterviewBD today — it&apos;s free</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium mb-5 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="signup-name" className="field-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field-input pl-10"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="field-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="field-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-input pl-10 pr-11"
                  placeholder="Minimum 6 characters"
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

            <button type="submit" disabled={loading} className="btn-brand w-full py-3 group">
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Sending verification code…
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Login
            </Link>
          </p>
        </>
      ) : (
        <>
          <div className="text-center mb-7">
            <div className="relative inline-flex mb-4">
              <div aria-hidden className="absolute inset-0 rounded-2xl bg-brand-200/60 blur-lg" />
              <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-brand-50 to-purple-50 border border-brand-100 flex items-center justify-center">
                <MailCheck className="w-6 h-6 text-brand-600" />
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5">We sent a verification code to</p>
            <p className="text-sm font-bold text-brand-600 mt-0.5">{email}</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium mb-5 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label htmlFor="signup-code" className="field-label text-center">Verification Code</label>
              <input
                id="signup-code"
                type="text"
                inputMode="numeric"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="field-input py-3.5 text-center font-display text-2xl font-bold tracking-[0.5em]"
                placeholder="000000"
                required
                maxLength={6}
                pattern="[0-9]{6}"
              />
              <p className="text-xs text-zinc-400 mt-2 text-center">Enter the 6-digit code</p>
            </div>

            <button type="submit" disabled={loading} className="btn-brand w-full py-3">
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Verifying…
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <button
              onClick={handleResendCode}
              disabled={loading}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 disabled:text-zinc-300 transition-colors"
            >
              Resend verification code
            </button>
            <button
              onClick={() => setStep('register')}
              className="flex items-center justify-center gap-1.5 w-full text-sm text-zinc-500 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Change email address
            </button>
          </div>
        </>
      )}
    </AuthCard>
  );
}
