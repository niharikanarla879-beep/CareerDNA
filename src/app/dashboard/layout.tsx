'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { PresentationMode } from '@/components/presentation-mode';
import {
  Dna,
  LayoutDashboard,
  User as UserIcon,
  FileText,
  Video,
  Map,
  GitFork,
  LogOut,
  Menu,
  X,
  Loader2,
  HelpCircle,
  Sparkles,
  Briefcase,
  Award,
  MessageSquare,
  TrendingUp,
  Compass
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);

  // Protected route enforcement
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400 mt-4">Restoring your workspace session...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Don't show layout while redirecting
  }

  const menuItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      disabled: false,
    },
    {
      name: 'DNA Decoder',
      href: '/dashboard/assessment',
      icon: Dna,
      disabled: false,
    },
    {
      name: 'Career Explorer',
      href: '/dashboard/career-explorer',
      icon: Compass,
      disabled: false,
    },
    {
      name: 'Complete Career Report',
      href: '/dashboard/report',
      icon: FileText,
      disabled: false,
    },
    {
      name: 'My Profile',
      href: '/dashboard/profile',
      icon: UserIcon,
      disabled: false,
    },
    {
      name: 'ATS Resume Analyzer',
      href: '/dashboard/resume-analyzer',
      icon: FileText,
      disabled: false,
    },
    {
      name: 'AI Resume Builder',
      href: '/dashboard/resume-builder',
      icon: Sparkles,
      disabled: false,
    },
    {
      name: 'Resume Tailor',
      href: '/dashboard/resume-tailor',
      icon: GitFork,
      disabled: false,
    },
    {
      name: 'Projects & Certs',
      href: '/dashboard/projects',
      icon: Award,
      disabled: false,
    },
    {
      name: 'Skill Gap Analyzer',
      href: '/dashboard/skill-gap',
      icon: Dna,
      disabled: false,
    },
    {
      name: 'Job Matcher',
      href: '/dashboard/job-matching',
      icon: Briefcase,
      disabled: false,
    },
    {
      name: 'Learning Roadmaps',
      href: '/dashboard/roadmaps',
      icon: Map,
      disabled: false,
    },
    {
      name: 'AI Interview Coach',
      href: '/dashboard/interview-coach',
      icon: Video,
      disabled: false,
    },
    {
      name: 'AI Career Mentor',
      href: '/dashboard/counselor',
      icon: MessageSquare,
      disabled: false,
    },
    {
      name: 'DNA Score Engine',
      href: '/dashboard/score-engine',
      icon: TrendingUp,
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Glow elements */}
      <div className="glow-spot w-[400px] h-[400px] bg-indigo-600/10 top-0 left-0" />
      <div className="glow-spot w-[400px] h-[400px] bg-teal-500/10 bottom-0 right-0" />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-900 bg-slate-950/80 backdrop-blur-md relative z-20">
        <div className="h-20 px-6 border-b border-slate-900/60 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/15">
            <Dna className="h-5.5 w-5.5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CareerDNA
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.disabled) {
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 text-xs font-semibold select-none group relative"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-600 border border-slate-900 font-mono">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-smooth cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900/60 bg-slate-950/40 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-extrabold text-sm text-white capitalize shadow-inner">
              {user.firstName[0]}
              {user.lastName[0] || ''}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 truncate capitalize">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-smooth cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <aside className="relative flex flex-col w-64 bg-slate-950 border-r border-slate-900 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dna className="h-6 w-6 text-indigo-400" />
                <span className="font-bold text-lg text-white">CareerDNA</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.disabled) {
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-2.5 text-slate-600 text-xs font-semibold select-none"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4.5 w-4.5" />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-600 font-mono">
                        Soon
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-smooth ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-900 pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-white">
                  {user.firstName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-200 truncate capitalize">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-smooth"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-20 border-b border-slate-900/60 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-400 hover:text-slate-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-white tracking-tight capitalize">
              {pathname === '/dashboard' 
                ? 'Dashboard Overview' 
                : pathname === '/dashboard/assessment'
                ? 'DNA Decoder Assessment'
                : pathname === '/dashboard/projects'
                ? 'Projects & Certs Tracker'
                : pathname === '/dashboard/counselor'
                ? 'AI Career Mentor'
                : pathname === '/dashboard/score-engine'
                ? 'DNA Score Engine'
                : pathname === '/dashboard/resume-analyzer' 
                ? 'ATS Resume Analyzer' 
                : pathname === '/dashboard/resume-builder'
                ? 'AI Resume Builder'
                : pathname === '/dashboard/resume-tailor'
                ? 'Resume Tailoring'
                : pathname === '/dashboard/skill-gap'
                ? 'Skill Gap Analyzer'
                : pathname === '/dashboard/job-matching'
                ? 'Job Matcher'
                : pathname === '/dashboard/roadmaps'
                ? 'Learning Roadmaps'
                : pathname === '/dashboard/interview-coach'
                ? 'AI Interview Coach'
                : 'Edit Profile'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPresentationOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/25 hover:border-indigo-500/50 text-indigo-300 hover:text-white text-xs font-bold transition-smooth cursor-pointer shadow-lg shadow-indigo-500/5 shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
              <span>Judge Presentation</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
              <Dna className="h-4 w-4" />
              <span>CareerDNA Platform</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-slate-400 cursor-help shrink-0" title="Need help?">
              <HelpCircle className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 relative z-10">
          {/* Professional space optimization */}
          {children}
        </main>
      </div>

      {/* Presentation Deck Modal */}
      <PresentationMode 
        isOpen={presentationOpen} 
        onClose={() => setPresentationOpen(false)} 
      />
    </div>
  );
}
