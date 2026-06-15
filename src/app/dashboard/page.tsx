'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { targetCareers } from '@/lib/constants';
import { 
  Sparkles, 
  Dna, 
  FileText, 
  Award,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Compass,
  Video,
  AlertTriangle,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function DashboardOverview() {
  const { user, isMockMode } = useAuth();
  const { 
    resumeHistory, 
    latestResume, 
    targetCareerId, 
    setTargetCareerId, 
    assessment,
    projects,
    certs,
    roadmapProgress,
    interviewHistory,
    scores
  } = useResume();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'pitch'>('overview');

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const selectedCareer = useMemo(() => {
    return targetCareers.find(c => c.id === targetCareerId) || targetCareers[0];
  }, [targetCareerId]);

  // Radar chart data compilation
  const radarChartData = useMemo(() => {
    if (!assessment?.taken || !assessment.riasec) return [];
    return Object.entries(assessment.riasec).map(([trait, score]) => ({
      subject: trait,
      A: score,
      fullMark: 100
    }));
  }, [assessment]);

  // Line chart data compilation
  const progressionData = useMemo(() => {
    if (resumeHistory.length === 0) {
      return [{ name: 'Baseline', score: 0 }];
    }
    return [...resumeHistory]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((item, idx) => ({
        name: `Upload ${idx + 1}`,
        score: item.result.score
      }));
  }, [resumeHistory]);

  const strengthsAndWeaknesses = useMemo(() => {
    if (!assessment?.taken || !assessment.personality || !assessment.values) {
      return { strengths: [], weaknesses: [] };
    }
    const p = assessment.personality;
    const v = assessment.values;

    const strs: string[] = [];
    const weaks: string[] = [];

    if (p.Conscientiousness >= 80) strs.push('Highly dependable and conscientiously organized.');
    if (p.Openness >= 80) strs.push('Open explorer ready to learn new frameworks.');
    if (v.Independence >= 80) strs.push('Excels in autonomous decision-making environments.');
    if (p.EmotionalStability >= 80) strs.push('Calm and resilient under tight outage schedules.');

    if (p.Conscientiousness < 50) weaks.push('Prone to missing minor detail validations.');
    if (p.Openness < 50) weaks.push('Hesitant to adopt shifts in cutting-edge tech stacks.');
    if (v.Independence < 50) weaks.push('Requires high-context instruction guidelines.');

    if (strs.length === 0) strs.push('Balanced and adaptable workspace traits.');
    if (weaks.length === 0) weaks.push('No significant behavioral bottlenecks detected.');

    return { strengths: strs.slice(0, 2), weaknesses: weaks.slice(0, 2) };
  }, [assessment]);

  // Determine visual journey stage dynamically
  const journeySteps = useMemo(() => [
    { title: 'DNA Assessment', desc: 'Personality & Values', page: '/dashboard/assessment', done: !!assessment?.taken },
    { title: 'Resume Scan', desc: 'ATS Parsing Audit', page: '/dashboard/resume-analyzer', done: !!latestResume },
    { title: 'Skill Gaps', desc: 'Missing Keyword Audit', page: '/dashboard/skill-gap', done: !!latestResume },
    { title: 'Roadmaps', desc: 'Curated Study Tracks', page: '/dashboard/roadmaps', done: Object.values(roadmapProgress).some(v => v === true) },
    { title: 'Projects', desc: 'Portfolio Logging', page: '/dashboard/projects', done: projects.length > 0 },
    { title: 'Mock Interview', desc: 'Speech Practice sessions', page: '/dashboard/interview-coach', done: interviewHistory.length > 0 },
    { title: 'CareerDNA Score', desc: 'Readiness Score compiled', page: '/dashboard/score-engine', done: scores.finalDnaScore > 0 },
    { title: 'Job Sourcing', desc: 'CareerDNA Sourcing Ready', page: '/dashboard/job-matching', done: scores.finalDnaScore >= 80 }
  ], [assessment, latestResume, roadmapProgress, projects, interviewHistory, scores]);

  const currentJourneyStageIndex = useMemo(() => {
    let lastDoneIndex = -1;
    for (let i = 0; i < journeySteps.length; i++) {
      if (journeySteps[i].done) {
        lastDoneIndex = i;
      } else {
        break;
      }
    }
    return lastDoneIndex + 1; // Highlight the first incomplete step
  }, [journeySteps]);

  const handleTargetCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetCareerId(e.target.value);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden glass-panel border-indigo-500/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-teal-500/5 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Shield className="h-3.5 w-3.5" />
            <span>CareerDNA Readiness & Diagnostic Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="capitalize">{user.firstName}</span>!
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Audit your candidate credentials and track your career progression using the unified CareerDNA intelligence matrix.
          </p>
        </div>

        {/* Selected Career Widget */}
        <div className="glass-panel border-slate-900 bg-slate-950/60 p-4 rounded-2xl w-full md:w-80 shrink-0 relative z-10 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Target Profile</span>
            <span className="text-indigo-400 font-bold font-mono">Synced Target</span>
          </div>
          <select 
            value={targetCareerId}
            onChange={handleTargetCareerChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
          >
            {targetCareers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 font-semibold">{selectedCareer.riasec}</span>
            <span className="text-teal-400 font-bold">{scores.jobReadinessScore}% Job Readiness</span>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-slate-900 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-smooth cursor-pointer ${
            activeTab === 'overview' 
              ? 'border-indigo-500 text-white' 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Candidate Workspace
        </button>
        <button
          onClick={() => setActiveTab('pitch')}
          className={`pb-3 border-b-2 transition-smooth cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pitch' 
              ? 'border-indigo-500 text-white' 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>Redrob Pitch Portal (Judges)</span>
        </button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Visual User Journey Stepper */}
          <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4.5 w-4.5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Visual Candidate Sourcing Journey</h3>
            </div>
            
            {/* Stepper container */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {journeySteps.map((step, idx) => {
                const isActive = idx === currentJourneyStageIndex;
                const isCompleted = step.done;
                
                return (
                  <Link 
                    href={step.page} 
                    key={idx}
                    className={`p-3 rounded-2xl border flex flex-col justify-between h-24 transition-smooth cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-600/5' 
                        : isCompleted
                        ? 'bg-emerald-950/5 border-emerald-900/40'
                        : 'bg-slate-950 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-slate-500 font-bold font-mono">0{idx + 1}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : isActive ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-ping" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-800" />
                      )}
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold ${isActive ? 'text-indigo-400' : isCompleted ? 'text-slate-300' : 'text-slate-400'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">{step.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sandbox Mode Warning Card */}
          {isMockMode && (
            <div className="glass-panel border-amber-500/20 bg-amber-500/5 p-4 rounded-3xl flex gap-3 text-amber-400">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold">Sandbox Mode Active (Local-Only State)</span>
                <p className="text-slate-400 leading-relaxed">
                  Running inside mock environments. Use the <strong>View Demo Profile (Judges)</strong> button on the landing page to load populated test credentials.
                </p>
              </div>
            </div>
          )}

          {/* DNA PROFILE VISUALIZATION (RIASEC RADAR CHART) */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Radar Chart */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-base">RIASEC Vocational DNA Profile</h3>
                  <p className="text-xs text-slate-500">Your core work interests and behavioral alignments</p>
                </div>
                {assessment?.taken && (
                  <Link 
                    href="/dashboard/assessment"
                    className="px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-smooth cursor-pointer"
                  >
                    Retake Decoder
                  </Link>
                )}
              </div>

              <div className="relative w-full h-[250px] flex items-center justify-center">
                {mounted && assessment?.taken ? (
                  <ResponsiveContainer width="99%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                      <Radar
                        name="RIASEC Scores"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.25}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="glass-panel border-indigo-500/10 bg-indigo-500/5 p-6 rounded-2xl max-w-md text-center space-y-4">
                    <Compass className="h-10 w-10 text-indigo-400 mx-auto animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">DNA Decoder Assessment Uncompleted</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Take the 15-question RIASEC assessment to plot your visual vocational radar and unlock matching recommendations.
                      </p>
                    </div>
                    <Link
                      href="/dashboard/assessment"
                      className="inline-flex px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-smooth shadow-md cursor-pointer"
                    >
                      Start DNA Assessment
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Profile overview list panel */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base">Candidate Profile Brief</h3>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Active Target Role:</span>
                    <span className="text-white font-bold">{selectedCareer.name}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">CareerDNA Readiness Score:</span>
                    <span className="text-teal-400 font-bold">{scores.jobReadinessScore}% Match</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Next Skill to Learn:</span>
                    <span className="text-indigo-400 font-bold truncate max-w-[150px]" title={scores.missingSkills[0] || 'All Acquired'}>
                      {scores.missingSkills[0] || 'All Acquired!'}
                    </span>
                  </div>
                </div>
              </div>

              {assessment?.taken ? (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1 text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Core Behavior Strength:
                    </span>
                    <p className="text-slate-400 leading-normal pl-5 text-[11px]">
                      {strengthsAndWeaknesses.strengths[0]}
                    </p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Priority Behavioral Gap:
                    </span>
                    <p className="text-slate-400 leading-normal pl-5 text-[11px]">
                      {strengthsAndWeaknesses.weaknesses[0]}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-normal italic text-center">
                  Complete the assessment to compute behavioral strengths and optimization suggestions.
                </p>
              )}
            </div>
          </div>

          {/* Main Grid: Score Panel & Progression Charts */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Scorecard */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 lg:col-span-2 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-lg">CareerDNA Readiness Score</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Weighted employability rating compiled by CareerDNA</p>
                  </div>
                  <span className="text-3xl font-extrabold text-indigo-400">{scores.finalDnaScore}/100</span>
                </div>

                {/* Composite Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-teal-400 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${scores.finalDnaScore}%` }} 
                    />
                  </div>
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                    {scores.finalDnaScore < 20 
                      ? 'Setup incomplete. Upload your resume and fill the Resume Builder to unlock full diagnostics.' 
                      : scores.finalDnaScore < 60 
                      ? 'Good progress! Optimize your resume, log certifications, and complete skill gaps to reach a target 80+ score.'
                      : 'Exceptional profile strength! You are highly competitive for your target role.'}
                  </p>
                </div>
              </div>

              {/* Sub-scores checklist */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-900/60">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">ATS Score</span>
                  <p className="text-sm font-extrabold text-white">
                    {scores.resumeScore !== null ? `${scores.resumeScore}%` : 'Not Parsed'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Job Readiness</span>
                  <p className="text-sm font-extrabold text-white">
                    {scores.jobReadinessScore !== null ? `${scores.jobReadinessScore}%` : '0%'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Mock Interview</span>
                  <p className="text-sm font-extrabold text-white">
                    {scores.interviewScore !== null ? `${scores.interviewScore}%` : 'Not Taken'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Certs Bonus</span>
                  <p className="text-sm font-extrabold text-white">
                    +{scores.certBonus}%
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic score progression line chart card */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 flex flex-col justify-between space-y-4">
              <div className="w-full">
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-indigo-400" />
                  <span>Score Progression</span>
                </h3>
                <p className="text-xs text-slate-500">History of analyzed resume score adjustments</p>
              </div>

              <div className="relative w-full h-36 pt-2">
                {mounted && progressionData.length > 0 ? (
                  <ResponsiveContainer width="99%" height="100%">
                    <LineChart data={progressionData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '10px' }}
                        itemStyle={{ fontSize: '10px', color: '#818cf8' }}
                      />
                      <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 font-semibold">
                    No uploads analyzed yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CORE INTEGRATION DASHBOARD CARDS */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-xl">Operating System Modules</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Decoders & Diagnostic */}
              <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[210px] hover:border-slate-850 transition-smooth">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-xl rounded-full" />
                <div>
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Compass className="h-5.5 w-5.5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                      assessment?.taken
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {assessment?.taken ? 'Completed' : 'Configure'}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base mt-4">Decoders & Diagnostic</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Take the vocational personality & values survey to map traits and career matching outputs.
                  </p>
                </div>
                <Link 
                  href="/dashboard/assessment"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-smooth cursor-pointer mt-4"
                >
                  Configure Assessment <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Card 2: ATS Resume Auditor */}
              <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[210px] hover:border-slate-850 transition-smooth">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-xl rounded-full" />
                <div>
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <FileText className="h-5.5 w-5.5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                      latestResume
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {latestResume ? `Audited: ${scores.resumeScore}%` : 'Scan'}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base mt-4">ATS Resume Auditor</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Scan your resume against target roles to audit parsing formats and find missing keywords.
                  </p>
                </div>
                <Link 
                  href="/dashboard/resume-analyzer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-smooth cursor-pointer mt-4"
                >
                  Analyze Resume <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Card 3: AI Interview Coach */}
              <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[210px] hover:border-slate-850 transition-smooth">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-xl rounded-full" />
                <div>
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Video className="h-5.5 w-5.5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                      interviewHistory.length > 0
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {interviewHistory.length > 0 ? `Avg: ${scores.interviewScore}%` : 'Practice'}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base mt-4">AI Interview Coach</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Practice speech-activated mock interviews with real-time feedback reviews.
                  </p>
                </div>
                <Link 
                  href="/dashboard/interview-coach"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-smooth cursor-pointer mt-4"
                >
                  Start Coaching Session <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Card 4: Skill Gap Roadmaps */}
              <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[210px] hover:border-slate-850 transition-smooth">
                <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 blur-xl rounded-full" />
                <div>
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                      <Dna className="h-5.5 w-5.5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {scores.missingSkills.length} Gaps
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base mt-4">Skill Gap Roadmaps</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Uncover missing skill segments relative to target roles and map out custom studies.
                  </p>
                </div>
                <Link 
                  href="/dashboard/skill-gap"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-smooth cursor-pointer mt-4"
                >
                  Analyze Gaps <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Card 5: Projects & Certs Tracker */}
              <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[210px] hover:border-slate-850 transition-smooth">
                <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 blur-xl rounded-full" />
                <div>
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                      <Award className="h-5.5 w-5.5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {projects.length} Projs | {certs.length} Certs
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base mt-4">Projects & Certs Tracker</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Log portfolio projects and cert documents to earn score increments.
                  </p>
                </div>
                <Link 
                  href="/dashboard/projects"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 transition-smooth cursor-pointer mt-4"
                >
                  Track Portfolio <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Card 6: DNA Score Engine */}
              <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[210px] hover:border-slate-850 transition-smooth">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-xl rounded-full" />
                <div>
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <TrendingUp className="h-5.5 w-5.5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {scores.finalDnaScore}/100
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base mt-4">DNA Score Engine</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Review detailed breakdowns of all parameters contributing to candidate strength.
                  </p>
                </div>
                <Link 
                  href="/dashboard/score-engine"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-smooth cursor-pointer mt-4"
                >
                  Review Scores <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Pitch Deck (Hack2Skill presentation portal) */}
      {activeTab === 'pitch' && (
        <div className="space-y-8 animate-fade-in">
          {/* Main header block */}
          <div className="glass-panel border-indigo-500/20 bg-indigo-950/5 rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="h-5.5 w-5.5 text-amber-400" />
              <span>CareerDNA Hack2Skill Ideathon Pitch Desk</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              CareerDNA is built to enhance the <strong>Redrob Ecosystem</strong> by acting as its automated talent intelligence layer. It connects vocational evaluations, resume analysis, targeted project roadmaps, and microphone speech metrics into a single unified workspace.
            </p>
          </div>

          {/* Cards Grid covering the 8 requested pitch items */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* 1. Problem Solved */}
            <div className="glass-panel border-slate-900 p-5 rounded-2xl space-y-3 bg-slate-950/40">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-mono">1</span>
                <span>Problem Solved</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                Fragmentation of career tools force job-seekers to use multiple platforms to evaluate their skills, audit resumes, learn, and practice mock interviews. This delays job preparation from weeks to months. CareerDNA resolves this by uniting all these steps in a single data-synced workspace.
              </p>
            </div>

            {/* 2. AI Innovation */}
            <div className="glass-panel border-slate-900 p-5 rounded-2xl space-y-3 bg-slate-950/40">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-mono">2</span>
                <span>AI Innovation</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                A dynamic, closed-loop state system. Candidate actions (RIASEC traits, logged projects, microphone speech clarity parameters) continuously recalculate and update target skill gap recommendations and roadmaps in real-time, eliminating manual audits.
              </p>
            </div>

            {/* 3. User Journey */}
            <div className="glass-panel border-slate-900 p-5 rounded-2xl space-y-3 bg-slate-950/40">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-mono">3</span>
                <span>User Journey Loop</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                A seamless 8-stage loop: Assessment determines interest profiles → ATS Scan audits formatting → Skill Gaps pinpoint missing tech → Roadmaps serve resource links → Projects tracker calculates strength → Interview coach records speech clarity → Redrob Readiness compiles → Job matching triggers.
              </p>
            </div>

            {/* 4. User Benefits */}
            <div className="glass-panel border-slate-900 p-5 rounded-2xl space-y-3 bg-slate-950/40">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-mono">4</span>
                <span>User Benefits</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                Provides instant mock feedback logs detailing pronunciation, confidence, and missing technical concepts. Accelerates job-readiness systematically through clear, prioritized clickable blueprints for YouTube, Udemy, and Coursera.
              </p>
            </div>

            {/* 5. Accessibility */}
            <div className="glass-panel border-slate-900 p-5 rounded-2xl space-y-3 bg-slate-950/40">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-mono">5</span>
                <span>Accessibility</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                Leverages local web speech engines allowing verbal interaction for visually impaired or motor-challenged candidates. Features accessible visual structures, responsive formatting layouts, and dark theme support.
              </p>
            </div>

            {/* 6. Real World Impact */}
            <div className="glass-panel border-slate-900 p-5 rounded-2xl space-y-3 bg-slate-950/40">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-mono">6</span>
                <span>Real World Impact</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                Shortens the traditional job preparation timeline by highlighting exactly what skills and certifications are missing, pruning redundant courses, and providing custom practice projects to build high-performance portfolios.
              </p>
            </div>

            {/* 7. Future Potential */}
            <div className="glass-panel border-slate-900 p-5 rounded-2xl space-y-3 bg-slate-950/40">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-mono">7</span>
                <span>Future Potential</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                Extending backend pipelines to support multi-agent mock interview panel simulations, direct live coding sandboxes, and automated API publishing systems verifying candidate code repositories on GitHub.
              </p>
            </div>

            {/* 8. Redrob Ecosystem Value */}
            <div className="glass-panel border-indigo-950/40 bg-indigo-950/5 p-5 rounded-2xl space-y-3 border-dashed">
              <h4 className="font-bold text-indigo-400 text-sm flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/15 flex items-center justify-center text-xs text-indigo-400 font-mono">8</span>
                <span>Redrob Ecosystem Integration Value</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                CareerDNA operates as the **AI Career Intelligence Layer for Redrob**. By converting candidates&apos; credentials into a structured **Redrob Readiness Score**, it feeds pre-screened talent metrics directly to Redrob recruiters, shortening interview pipeline overheads by 75%.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
