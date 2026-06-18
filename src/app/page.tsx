'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResume } from '@/lib/resume-context';
import { useToast } from '@/lib/toast-context';
import { 
  Dna, 
  FileText, 
  Video, 
  Map, 
  Sparkles, 
  Award, 
  GitFork, 
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const { loginDemoUser } = useResume();
  const { showToast } = useToast();
  const router = useRouter();

  const handleAccessDashboard = () => {
    if (typeof window !== 'undefined' && localStorage.getItem('careerdna_user')) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Decorative Glow Elements */}
      <div className="glow-spot w-[600px] h-[600px] bg-indigo-600 top-[-200px] left-[-200px]" />
      <div className="glow-spot w-[500px] h-[500px] bg-teal-500 top-[20%] right-[-100px]" />
      <div className="glow-spot w-[600px] h-[600px] bg-purple-700 bottom-[-200px] left-[20%]" />

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Dna className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              CareerDNA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-indigo-400 transition-smooth">Features</a>
            <a href="#about" className="hover:text-indigo-400 transition-smooth font-mono text-xs bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-amber-400 rounded-full">Hack2Skill Submission</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold hover:text-indigo-400 transition-smooth px-4 py-2">
              Log In
            </Link>
            <Link 
              href="/register" 
              className="relative group overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-indigo-400 to-teal-300 hover:from-indigo-500 hover:to-teal-400 transition-smooth shadow-lg shadow-indigo-400/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen AI Career Strategy Engine</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Decode Your <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-300 bg-clip-text text-transparent">
                Professional DNA
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed">
              Stop guessing your career path. CareerDNA maps your personality, skills, projects, and certifications into a comprehensive job-readiness profile, providing actionable AI roadmaps and mock interviews to secure your dream role.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={handleAccessDashboard}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 hover:from-indigo-600 hover:to-teal-500 text-slate-950 px-8 py-4 font-bold shadow-lg shadow-indigo-500/15 transition-smooth cursor-pointer"
              >
                <ArrowRight className="h-4 w-4 stroke-[3] text-slate-950" /> Access Candidate Dashboard
              </button>
              <Link 
                href="/register" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 font-semibold shadow-lg shadow-indigo-600/20 transition-smooth"
              >
                Start Assessment <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-900/60 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-xs text-slate-500 font-medium">Match Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-400">100+</p>
                <p className="text-xs text-slate-500 font-medium">Career Profiles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-400">10k+</p>
                <p className="text-xs text-slate-500 font-medium">Active Learners</p>
              </div>
            </div>
          </div>

          {/* Interactive UI Card Mockup */}
          <div className="flex-1 relative w-full max-w-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-teal-500/10 rounded-3xl filter blur-xl" />
            <div className="relative glass-panel rounded-3xl p-6 shadow-2xl border-slate-800/80">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-900">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="px-3 py-1 rounded bg-slate-900 text-slate-500 text-xs font-mono">dashboard_preview.ts</div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">Niharika Narla</h3>
                    <p className="text-xs text-slate-400">Target Role: Software Engineer</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-2 border-indigo-500/30 flex items-center justify-center text-xs font-extrabold text-indigo-400 bg-indigo-950/20 shadow-inner">
                    84%
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">CareerDNA Composite Score</span>
                    <span className="text-indigo-400">84/100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-900 space-y-1">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">ATS Resume</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">84/100</span>
                      <span className="text-xs text-green-400 font-medium">Good</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-900 space-y-1">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Interview Coach</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">82%</span>
                      <span className="text-xs text-teal-400 font-medium">Strong</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/10 border border-indigo-900/30">
                  <div className="flex gap-3">
                    <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">AI Career Insight</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Your Github portfolio strength pushes you past 88% of developers. Add AWS practitioner certification to increase resume match scoring by +12 points.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-28 border-t border-slate-900/80">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              An All-in-One Engine for Career Optimization
            </h2>
            <p className="text-slate-400">
              Unlock modular toolsets designed to analyze your current baseline and guide you step-by-step to your target career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Assessment */}
            <div className="glass-panel p-8 rounded-3xl transition-smooth space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Dna className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Decoders & Diagnostic</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Take standard RIASEC tests, evaluate your work priorities values, and map your baseline interests.
              </p>
            </div>

            {/* ATS Analyzer */}
            <div className="glass-panel p-8 rounded-3xl transition-smooth space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. ATS Resume Auditor</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Analyze your resume structure, keyword placements, formatting anomalies, and find missing hard and soft skills.
              </p>
            </div>

            {/* Mock Interviews */}
            <div className="glass-panel p-8 rounded-3xl transition-smooth space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. AI Interview Coach</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Practice custom mock interviews with role-specific HR, Technical, and Behavioral questions and get scores in real-time.
              </p>
            </div>

            {/* Roadmaps */}
            <div className="glass-panel p-8 rounded-3xl transition-smooth space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">4. Skill Gap Roadmaps</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Bridge skill gaps using AI generated learning paths complete with milestones, resource recommendations, and progress tracking.
              </p>
            </div>

            {/* Trackers */}
            <div className="glass-panel p-8 rounded-3xl transition-smooth space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <GitFork className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">5. Projects & Certs Tracker</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track your portfolios, evaluate project strength scores via Github repository data, and calculate certificate values.
              </p>
            </div>

            {/* Scores */}
            <div className="glass-panel p-8 rounded-3xl transition-smooth space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">6. DNA Score Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Compile a comprehensive weighted score of your portfolio, resume, skills, and interviews out of 100 points.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-slate-900 flex items-center justify-center">
              <Dna className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="font-semibold text-slate-400">CareerDNA</span>
          </div>
          <p>© 2026 CareerDNA. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
