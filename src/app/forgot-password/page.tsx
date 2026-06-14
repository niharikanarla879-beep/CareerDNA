'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Dna, ShieldAlert, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword, isMockMode } = useAuth();
  const [email, setEmail] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setFormLoading(true);

    if (!email) {
      setErrorMsg('Please enter your email address.');
      setFormLoading(false);
      return;
    }

    try {
      const res = await resetPassword(email);
      if (res.success) {
        setSuccessMsg(
          isMockMode
            ? 'Mock Password recovery link sent successfully (sandbox bypass)!'
            : 'Password recovery email sent! Please check your inbox for instructions.'
        );
      } else {
        setErrorMsg(res.error || 'Failed to submit password recovery request.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

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
            <h1 className="text-3xl font-extrabold tracking-tight">Recover Password</h1>
            <p className="text-sm text-slate-400 mt-2">Recover access to your account profile</p>
          </div>
        </div>

        {isMockMode && (
          <div className="glass-panel border-amber-500/20 bg-amber-500/5 p-4 rounded-2xl flex gap-3 text-amber-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <div className="text-xs space-y-1">
              <span className="font-bold">Sandbox Mode</span>
              <p className="text-slate-400 leading-relaxed">
                Supabase is not configured. The engine will check if the user is registered in localStorage and simulate recovery.
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

            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-smooth shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Send Recovery Link <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 flex items-center justify-center">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-smooth flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
