'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { Dna, ShieldAlert, KeyRound, Mail, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { user, signup, loading, isMockMode } = useAuth();
  const { loginDemoUser } = useResume();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

    if (!firstName || !lastName || !email || !password) {
      setErrorMsg('Please fill in all the details.');
      setFormLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      setFormLoading(false);
      return;
    }

    try {
      const res = await signup(email, password, firstName, lastName);
      if (res.success) {
        setSuccessMsg('Registration successful! Launching dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        setErrorMsg(res.error || 'Failed to register account.');
      }
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || 'An unexpected error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLaunchDemo = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setFormLoading(true);
    try {
      const success = await loginDemoUser();
      if (success) {
        setSuccessMsg('Demo candidate mode activated! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        setErrorMsg('Failed to initialize demo candidate mode.');
      }
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to initialize demo candidate mode.');
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
      <div className="glow-spot w-[500px] h-[500px] bg-indigo-600 top-[-250px] right-[-250px]" />
      <div className="glow-spot w-[500px] h-[500px] bg-teal-600 bottom-[-250px] left-[-250px]" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Dna className="h-7 w-7 text-slate-950 stroke-[2.5]" />
            </div>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
            <p className="text-sm text-slate-400 mt-2">Initialize your CareerDNA profile</p>
          </div>
        </div>

        {isMockMode && (
          <div className="glass-panel border-amber-500/20 bg-amber-500/5 p-4 rounded-2xl flex gap-3 text-amber-400">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold">Sandbox Registration Active</span>
              <p className="text-slate-400 leading-relaxed">
                Supabase keys are missing. This account will be created locally in your browser&apos;s sandboxed storage.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-smooth placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-smooth placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>
            </div>

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
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
                  <Loader2 className="h-4 w-4 animate-spin" /> Setting up...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-900"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-600 font-bold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-900"></div>
          </div>

          <button
            type="button"
            onClick={handleLaunchDemo}
            disabled={formLoading}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:from-amber-500/50 disabled:to-amber-600/50 text-slate-950 font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-smooth shadow-lg cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-slate-950" /> Launch Demo Candidate Mode
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-slate-300 hover:text-indigo-400 transition-smooth"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
