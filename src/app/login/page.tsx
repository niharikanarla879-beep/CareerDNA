'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Dna, ShieldAlert, KeyRound, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading, isMockMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Protect route if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setFormLoading(true);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      setFormLoading(false);
      return;
    }

    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        setErrorMsg(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading || (user && !formLoading)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400 mt-4">Checking credentials session...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Glow spots */}
      <div className="glow-spot w-[500px] h-[500px] bg-indigo-600 top-[-250px] left-[-250px]" />
      <div className="glow-spot w-[500px] h-[500px] bg-purple-700 bottom-[-250px] right-[-250px]" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Dna className="h-7 w-7 text-slate-950 stroke-[2.5]" />
            </div>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-400 mt-2">Access your CareerDNA strategist panel</p>
          </div>
        </div>

        {isMockMode && (
          <div className="glass-panel border-amber-500/20 bg-amber-500/5 p-4 rounded-2xl flex gap-3 text-amber-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <div className="text-xs space-y-1">
              <span className="font-bold">Sandbox Mode Enabled</span>
              <p className="text-slate-400 leading-relaxed">
                Supabase keys are missing. You can log in using any previously registered mock account. <strong>Do NOT enter real passwords</strong>, as sandbox profiles are stored in plain text inside browser localStorage.
              </p>
            </div>
          </div>
        )}

        <div className="glass-panel border-slate-900 rounded-3xl p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 text-xs font-semibold text-green-400 bg-green-500/5 border border-green-500/10 rounded-xl">
                {successMsg}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-smooth placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-smooth"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-smooth placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-smooth shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Log In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-bold text-slate-300 hover:text-indigo-400 transition-smooth"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
