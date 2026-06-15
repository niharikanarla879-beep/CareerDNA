'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, Briefcase, GraduationCap, Calendar, Save, Loader2, Sparkles } from 'lucide-react';

export default function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentJob, setCurrentJob] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);

  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load user data into form
  useEffect(() => {
    if (user) {
      const fn = user.firstName || '';
      const ln = user.lastName || '';
      const cj = user.currentJob || '';
      const el = user.educationLevel || '';
      const ey = user.experienceYears || 0;
      setTimeout(() => {
        setFirstName(fn);
        setLastName(ln);
        setCurrentJob(cj);
        setEducationLevel(el);
        setExperienceYears(ey);
      }, 0);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First name and last name are required.');
      setFormLoading(false);
      return;
    }

    try {
      const res = await updateProfile({
        firstName,
        lastName,
        currentJob,
        educationLevel,
        experienceYears,
      });

      if (res.success) {
        setSuccessMsg('Profile details updated successfully!');
        // Clear message after 3 seconds
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Configure your personal and professional profile details</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Card: Summary/Avatar */}
        <div className="glass-panel border-slate-900 rounded-3xl p-6 text-center space-y-4 h-fit">
          <div className="relative mx-auto h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 border border-indigo-500/20 flex items-center justify-center font-extrabold text-3xl text-slate-950 uppercase shadow-lg shadow-indigo-500/15">
            {firstName[0]}
            {lastName[0] || ''}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg capitalize">{firstName} {lastName}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentJob || 'No current role specified'}</p>
          </div>
          <div className="pt-4 border-t border-slate-900/60 text-xs text-slate-500 flex justify-between">
            <span>Email</span>
            <span className="text-slate-300 font-semibold truncate max-w-[150px]">{user.email}</span>
          </div>
        </div>

        {/* Right Panel: Edit Form */}
        <div className="glass-panel border-slate-900 rounded-3xl p-6 md:p-8 md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMsg && (
              <div className="p-3.5 text-xs font-semibold text-green-400 bg-green-500/5 border border-green-500/10 rounded-xl flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="p-3.5 text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-smooth"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-smooth"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Current Professional Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={currentJob}
                  onChange={(e) => setCurrentJob(e.target.value)}
                  placeholder="e.g., Software Dev, Senior Student"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-smooth placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Education Level</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-smooth cursor-pointer"
                  >
                    <option value="">Select Level</option>
                    <option value="High School">High School</option>
                    <option value="Associate's Degree">Associate&apos;s Degree</option>
                    <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                    <option value="Master's Degree">Master&apos;s Degree</option>
                    <option value="Ph.D.">Ph.D.</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Years of Experience</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={experienceYears || ''}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-smooth"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-5 py-3 font-semibold transition-smooth shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
