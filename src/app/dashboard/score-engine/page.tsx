'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import {
  ArrowLeft,
  Award,
  Sparkles,
  Dna,
  FileText,
  Video,
  Code,
  Map,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function ScoreEnginePage() {
  const { user } = useAuth();
  const { scores, latestResume, certs, projects, assessment, interviewHistory, roadmapProgress } = useResume();

  if (!user) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };



  // Compile detailed actions list to raise score
  const scoreActionItems = [];
  
  if (!assessment?.taken) {
    scoreActionItems.push({
      title: 'Complete DNA Decoder Assessment',
      desc: 'Complete RIASEC questions, work values survey, and personality parameters to verify baseline.',
      bonus: '+15 points',
      link: '/dashboard/assessment'
    });
  }
  if (!latestResume) {
    scoreActionItems.push({
      title: 'Audit and Parse Your Resume',
      desc: 'Upload a PDF/Word resume to parse skills, format structure, and keyword density.',
      bonus: '+20 points',
      link: '/dashboard/resume-analyzer'
    });
  } else if (scores.resumeScore < 80) {
    scoreActionItems.push({
      title: 'Optimize Resume Gaps',
      desc: 'Review and fix the suggested formatting and content keywords gaps to boost ATS score.',
      bonus: `+${Math.round((80 - scores.resumeScore) * 0.20)} points`,
      link: '/dashboard/resume-analyzer'
    });
  }
  if (interviewHistory.length === 0) {
    scoreActionItems.push({
      title: 'Perform Mock Practice Interview',
      desc: 'Practice dynamic voice technical, HR, and behavioral questions with evaluation.',
      bonus: '+20 points',
      link: '/dashboard/interview-coach'
    });
  } else if (scores.interviewScore < 80) {
    scoreActionItems.push({
      title: 'Improve Mock Interview Score',
      desc: 'Complete additional sessions matching ideal keywords outlines to raise average scores.',
      bonus: `+${Math.round((80 - scores.interviewScore) * 0.20)} points`,
      link: '/dashboard/interview-coach'
    });
  }
  if (projects.length === 0) {
    scoreActionItems.push({
      title: 'Register Portfolio Projects',
      desc: 'Add projects containing technologies, descriptions, and GitHub links to verify portfolio.',
      bonus: '+15 points',
      link: '/dashboard/projects'
    });
  } else if (scores.projectScore < 85) {
    scoreActionItems.push({
      title: 'Improve Project Portfolio Strength',
      desc: 'Provide GitHub repository links and live website URLs for logged projects to secure max points.',
      bonus: `+${Math.round((85 - scores.projectScore) * 0.15)} points`,
      link: '/dashboard/projects'
    });
  }
  if (certs.length < 5) {
    scoreActionItems.push({
      title: 'Log Certified Credentials',
      desc: 'Certifications add directly to your score ledger. Each certification adds +3 points (up to 5 certifications).',
      bonus: `+${(5 - certs.length) * 3} points`,
      link: '/dashboard/projects'
    });
  }
  if (scores.roadmapProgressPercent < 100) {
    scoreActionItems.push({
      title: 'Checkmark Roadmap Learning Progress',
      desc: 'Complete phase course study, cert targets, and projects inside learning roadmaps.',
      bonus: `+${Math.round((100 - scores.roadmapProgressPercent) * 0.15)} points`,
      link: '/dashboard/roadmaps'
    });
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-400" /> DNA Score Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review detailed breakdown parameters contributing to your consolidated CareerDNA Score.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* LEFT COLUMN: OVERALL GAUGE & DETAILED BREAKDOWN CARD */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Composite score card */}
          <div className="glass-panel border-slate-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-slate-950/40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
            
            <div className="space-y-4 flex-1 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Score Audit Log</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Consolidated DNA Score</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                This composite score evaluates your candidate competitiveness. Currently **{scores.completedModulesCount} of {scores.totalModules} modules** are completed. Pending modules are excluded from the weighting.
              </p>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-teal-400 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${scores.finalDnaScore}%` }} 
                />
              </div>
            </div>

            {/* Score Ring */}
            <div className="h-32 w-32 relative flex items-center justify-center shrink-0 z-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-900"
                  strokeWidth="2.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`transition-smooth stroke-current ${getScoreColor(scores.finalDnaScore)}`}
                  strokeWidth="2.8"
                  strokeDasharray={`${scores.finalDnaScore}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white font-mono">{scores.finalDnaScore}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">/ 100</span>
              </div>
            </div>

          </div>

          {/* Skill Gap Penalty Alert */}
          {scores.skillGapPenalty > 0 && (
            <div className="glass-panel border-rose-500/20 bg-rose-500/5 p-4 rounded-2xl flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Missing Skill Gap Penalty</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Deduction of <span className="text-rose-400 font-bold">-2 points</span> for each of the {scores.missingSkills.length} remaining missing skills.
                  </p>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 shrink-0 font-bold">
                -{scores.skillGapPenalty} pts
              </span>
            </div>
          )}

          {/* Breakdown cards grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Detailed Parameter Breakdown</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Assessment */}
              <div className="glass-panel border-slate-900 bg-slate-950/40 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Dna className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Diagnostic Assessment</h4>
                    <span className="text-[10px] text-slate-500">Weight: 25%</span>
                  </div>
                </div>
                <span className={`text-sm font-bold font-mono ${assessment?.taken ? getScoreColor(scores.assessmentScore) : 'text-slate-500'}`}>
                  {assessment?.taken ? `${scores.assessmentScore}%` : 'Pending'}
                </span>
              </div>

              {/* Resume */}
              <div className="glass-panel border-slate-900 bg-slate-950/40 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Resume ATS Score</h4>
                    <span className="text-[10px] text-slate-500">Weight: 20%</span>
                  </div>
                </div>
                <span className={`text-sm font-bold font-mono ${latestResume ? getScoreColor(scores.resumeScore) : 'text-slate-500'}`}>
                  {latestResume ? `${scores.resumeScore}%` : 'Pending'}
                </span>
              </div>

              {/* Interviews */}
              <div className="glass-panel border-slate-900 bg-slate-950/40 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">AI Mock Interview</h4>
                    <span className="text-[10px] text-slate-500">Weight: 20%</span>
                  </div>
                </div>
                <span className={`text-sm font-bold font-mono ${interviewHistory.length > 0 ? getScoreColor(scores.interviewScore) : 'text-slate-500'}`}>
                  {interviewHistory.length > 0 ? `${scores.interviewScore}%` : 'Pending'}
                </span>
              </div>

              {/* Projects */}
              <div className="glass-panel border-slate-900 bg-slate-950/40 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Portfolio Projects</h4>
                    <span className="text-[10px] text-slate-500">Weight: 15%</span>
                  </div>
                </div>
                <span className={`text-sm font-bold font-mono ${projects.length > 0 ? getScoreColor(scores.projectScore) : 'text-slate-500'}`}>
                  {projects.length > 0 ? `${scores.projectScore}%` : 'Pending'}
                </span>
              </div>

              {/* Roadmap */}
              <div className="glass-panel border-slate-900 bg-slate-950/40 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                    <Map className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Roadmap Milestones</h4>
                    <span className="text-[10px] text-slate-500">Weight: 10%</span>
                  </div>
                </div>
                <span className={`text-sm font-bold font-mono ${(Object.values(roadmapProgress).some(v => v === true) || scores.roadmapProgressPercent > 0) ? getScoreColor(scores.roadmapProgressPercent) : 'text-slate-500'}`}>
                  {(Object.values(roadmapProgress).some(v => v === true) || scores.roadmapProgressPercent > 0) ? `${scores.roadmapProgressPercent}%` : 'Pending'}
                </span>
              </div>

              {/* Certifications */}
              <div className="glass-panel border-slate-900 bg-slate-950/40 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Certifications Ledger</h4>
                    <span className="text-[10px] text-slate-500">Weight: 10%</span>
                  </div>
                </div>
                <span className={`text-sm font-bold font-mono ${certs.length > 0 ? getScoreColor(scores.certsScore) : 'text-slate-500'}`}>
                  {certs.length > 0 ? `${scores.certsScore}%` : 'Pending'}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: STRATEGY CHECKLIST TO INCREASE SCORE */}
        <div className="lg:col-span-4">
          <div className="glass-panel border-slate-900 rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-400" /> Improvement Checklist
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete these actions to increase your composite score and become highly competitive.
            </p>

            <div className="space-y-3 pt-2">
              {scoreActionItems.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center text-xs text-emerald-400 font-bold">
                  All optimization actions completed! You are fully prepared.
                </div>
              ) : (
                scoreActionItems.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 flex justify-between gap-2 text-xs relative overflow-hidden group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-bold text-slate-200 group-hover:text-indigo-400 transition-smooth truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed text-justify line-clamp-2">{item.desc}</p>
                      <Link 
                        href={item.link}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-smooth inline-flex items-center gap-0.5 pt-1"
                      >
                        Action <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                    <span className="px-1.5 py-0.5 h-fit rounded text-[8px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                      {item.bonus}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
