'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { 
  Sparkles, 
  Dna, 
  FileText, 
  Briefcase, 
  Map, 
  GitFork, 
  Award,
  ArrowRight,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  ShieldAlert
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { targetCareers } from '@/lib/constants';
import { roleKeywords } from '@/lib/analyzer';
import { useResume } from '@/lib/resume-context';

export default function DashboardOverview() {
  const { user, isMockMode } = useAuth();
  const { resumeHistory, latestResume, targetCareerId, setTargetCareerId } = useResume();
  const [mounted, setMounted] = useState(false);
  
  // Derived state from context
  const atsScore = latestResume ? latestResume.result.score : null;
  const skillsScore = latestResume ? latestResume.result.skillsCoverage : null;
  const latestSkillsList = useMemo(() => {
    return latestResume ? (latestResume.result.detectedSkills || []) : [];
  }, [latestResume]);

  const selectedCareer = useMemo(() => {
    return targetCareers.find(c => c.id === targetCareerId) || targetCareers[0];
  }, [targetCareerId]);

  const [builderScore, setBuilderScore] = useState<number | null>(null);
  const [tailorScore, setTailorScore] = useState<number | null>(null);
  
  // Ledger and milestone data
  const [certs, setCerts] = useState<string[]>([]);
  const [newCert, setNewCert] = useState('');
  const [activeMilestone, setActiveMilestone] = useState<any>(null);
  const [roadmapPercent, setRoadmapPercent] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Load Builder resume status safely
    const builderRaw = localStorage.getItem(`careerdna_builder_resume_${user.id}`);
    let builderStatus = 0;
    if (builderRaw) {
      try {
        const builder = JSON.parse(builderRaw);
        let fieldsCount = 0;
        if (builder.personalInfo?.name) fieldsCount += 20;
        if (builder.summary) fieldsCount += 20;
        if (builder.experience?.length > 0) fieldsCount += 20;
        if (builder.skills?.length > 0) fieldsCount += 20;
        if (builder.education?.length > 0) fieldsCount += 20;
        builderStatus = fieldsCount;
      } catch (e) {
        console.error('Error parsing builder resume data safely:', e);
      }
    }
    setBuilderScore(builderStatus);

    // Load Tailor history status safely
    const tailorRaw = localStorage.getItem(`careerdna_tailor_history_${user.id}`);
    let latestTailor: number | null = null;
    if (tailorRaw) {
      try {
        const tailorList = JSON.parse(tailorRaw);
        if (Array.isArray(tailorList) && tailorList.length > 0) {
          const sortedTailor = [...tailorList].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          latestTailor = sortedTailor[0].matchPercent;
        }
      } catch (e) {
        console.error('Error parsing tailor history data safely:', e);
      }
    }
    setTailorScore(latestTailor);

    // Load Certifications Ledger safely
    const certsRaw = localStorage.getItem(`careerdna_certs_${user.id}`);
    let currentCerts: string[] = [];
    if (certsRaw) {
      try {
        currentCerts = JSON.parse(certsRaw);
        if (!Array.isArray(currentCerts)) currentCerts = [];
      } catch (e) {
        console.error('Error parsing certs data safely:', e);
      }
    }
    setCerts(currentCerts);

    // Load Roadmap Milestone Card Details
    let difficulty: 'foundational' | 'intermediate' | 'advanced' = 'foundational';
    if (atsScore !== null && atsScore >= 80) {
      difficulty = 'advanced';
    } else if (atsScore !== null && atsScore >= 50) {
      difficulty = 'intermediate';
    }

    const defaultRoadmapMilestones = [
      {
        phase: '30-day',
        title: 'Core Fundamentals & Syntax',
        course: 'Comprehensive Syntax Course (Udemy)',
        certification: 'FreeCodeCamp Core Certifications',
        project: 'Responsive Landing Layout Showcase'
      },
      {
        phase: '90-day',
        title: 'Advanced Frameworks & UI Architecture',
        course: 'Advanced Component & Lifecycle Modules',
        certification: 'Meta Certified Professional Track',
        project: 'Multi-screen SaaS Dashboard Framework'
      },
      {
        phase: '180-day',
        title: 'System Deployment & Orchestration',
        course: 'Distributed Systems & Database Indices',
        certification: 'AWS Solutions Architect Associate',
        project: 'Containerized microservice deployed behind reverse proxy'
      }
    ];

    let completed: Record<string, boolean> = {};
    const savedCompletion = localStorage.getItem(`careerdna_roadmaps_completion_${user.id}`);
    if (savedCompletion) {
      try {
        completed = JSON.parse(savedCompletion);
      } catch (e) {
        console.error('Error parsing roadmap completion data safely:', e);
      }
    }

    let milestoneIdx = 0;
    for (let i = 0; i < 3; i++) {
      const courseKey = `${targetCareerId}_${difficulty}_${i}_course`;
      const certKey = `${targetCareerId}_${difficulty}_${i}_cert`;
      const projectKey = `${targetCareerId}_${difficulty}_${i}_project`;

      if (completed[courseKey] && completed[certKey] && completed[projectKey]) {
        milestoneIdx = i + 1;
      } else {
        break;
      }
    }

    if (milestoneIdx >= 3) {
      setActiveMilestone({
        phase: 'Completed',
        title: 'All Blueprints Completed!',
        isFinished: true
      });
      setRoadmapPercent(100);
    } else {
      const activeM = defaultRoadmapMilestones[milestoneIdx];
      const courseKey = `${targetCareerId}_${difficulty}_${milestoneIdx}_course`;
      const certKey = `${targetCareerId}_${difficulty}_${milestoneIdx}_cert`;
      const projectKey = `${targetCareerId}_${difficulty}_${milestoneIdx}_project`;

      setActiveMilestone({
        ...activeM,
        courseDone: !!completed[courseKey],
        certDone: !!completed[certKey],
        projectDone: !!completed[projectKey],
        courseKey,
        certKey,
        projectKey,
        isFinished: false
      });

      let totalDone = 0;
      for (let i = 0; i < 3; i++) {
        if (completed[`${targetCareerId}_${difficulty}_${i}_course`]) totalDone++;
        if (completed[`${targetCareerId}_${difficulty}_${i}_cert`]) totalDone++;
        if (completed[`${targetCareerId}_${difficulty}_${i}_project`]) totalDone++;
      }
      setRoadmapPercent(Math.round((totalDone / 9) * 100));
    }
  }, [user, atsScore, targetCareerId, certs.length]);

  // Memoized score progression graph points
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

  // Memoized consolidated core score
  const dnaScore = useMemo(() => {
    const scoreAtsPart = (atsScore || 0) * 0.35;
    const scoreSkillsPart = (skillsScore || 0) * 0.35;
    const scoreBuilderPart = (builderScore || 0) * 0.20;
    const scoreCertsPart = Math.min(10, certs.length * 2);
    return Math.min(100, Math.round(scoreAtsPart + scoreSkillsPart + scoreBuilderPart + scoreCertsPart));
  }, [atsScore, skillsScore, builderScore, certs]);

  // Memoized skill categorization breakdown chart mapping
  const skillChartData = useMemo(() => {
    const reqKeywords = roleKeywords[targetCareerId] || roleKeywords['swe'];
    const lowerSkillsList = latestSkillsList.map(s => s.toLowerCase());
    const catMap: Record<string, { verified: number; gap: number }> = {};
    
    reqKeywords.forEach(kw => {
      const isMatched = lowerSkillsList.includes(kw.name.toLowerCase());
      if (!catMap[kw.category]) {
        catMap[kw.category] = { verified: 0, gap: 0 };
      }
      if (isMatched) catMap[kw.category].verified++;
      else catMap[kw.category].gap++;
    });

    return Object.entries(catMap).map(([category, s]) => ({
      category,
      Verified: s.verified,
      Gap: s.gap
    }));
  }, [targetCareerId, latestSkillsList]);

  const handleTargetCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetCareerId(e.target.value);
  };

  const addCert = () => {
    if (!newCert.trim() || !user) return;
    const updated = [...certs, newCert.trim()];
    setCerts(updated);
    localStorage.setItem(`careerdna_certs_${user.id}`, JSON.stringify(updated));
    setNewCert('');
  };

  const removeCert = (index: number) => {
    if (!user) return;
    const updated = certs.filter((_, i) => i !== index);
    setCerts(updated);
    localStorage.setItem(`careerdna_certs_${user.id}`, JSON.stringify(updated));
  };

  const toggleMilestoneStep = (key: string) => {
    if (!user) return;
    const savedCompletion = localStorage.getItem(`careerdna_roadmaps_completion_${user.id}`);
    let completed: Record<string, boolean> = {};
    if (savedCompletion) {
      try {
        completed = JSON.parse(savedCompletion);
      } catch (e) {}
    }
    
    const updated = {
      ...completed,
      [key]: !completed[key]
    };
    localStorage.setItem(`careerdna_roadmaps_completion_${user.id}`, JSON.stringify(updated));
    
    setActiveMilestone((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        courseDone: key === prev.courseKey ? !prev.courseDone : prev.courseDone,
        certDone: key === prev.certKey ? !prev.certDone : prev.certDone,
        projectDone: key === prev.projectKey ? !prev.projectDone : prev.projectDone,
      };
    });

    let totalDone = 0;
    let difficulty: 'foundational' | 'intermediate' | 'advanced' = 'foundational';
    if (atsScore !== null && atsScore >= 80) difficulty = 'advanced';
    else if (atsScore !== null && atsScore >= 50) difficulty = 'intermediate';

    for (let i = 0; i < 3; i++) {
      if (updated[`${targetCareerId}_${difficulty}_${i}_course`]) totalDone++;
      if (updated[`${targetCareerId}_${difficulty}_${i}_cert`]) totalDone++;
      if (updated[`${targetCareerId}_${difficulty}_${i}_project`]) totalDone++;
    }
    setRoadmapPercent(Math.round((totalDone / 9) * 100));
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden glass-panel border-indigo-500/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-teal-500/5 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Profile Decoder Active</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="capitalize">{user.firstName}</span>!
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            You're tracking toward your target career. Review your automated score diagnostics and module milestones.
          </p>
        </div>

        {/* Selected Career Widget */}
        <div className="glass-panel border-slate-900 bg-slate-950/60 p-4 rounded-2xl w-full md:w-80 shrink-0 relative z-10 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Target Profile</span>
            <span className="text-indigo-400 font-bold">Active Match</span>
          </div>
          <select 
            value={selectedCareer.id}
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
            <span className="text-teal-400 font-bold">{selectedCareer.match}% match</span>
          </div>
        </div>
      </div>

      {/* Sandbox Mode Warning Card */}
      {isMockMode && (
        <div className="glass-panel border-amber-500/20 bg-amber-500/5 p-4 rounded-3xl flex gap-3 text-amber-400">
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold">Local Sandbox Mode Active</span>
            <p className="text-slate-400 leading-relaxed">
              All resume analysis, roadmap progress, certifications ledger, and coach history are stored <strong>only in this browser</strong>. Switching browsers, clearing cookies, or using Incognito mode will erase your data. <strong>Do not upload real credentials or sensitive passwords.</strong>
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Score Panel & Progression Charts */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Scorecard */}
        <div className="glass-panel border-slate-900 rounded-3xl p-6 lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-lg">Consolidated CareerDNA Score</h3>
                <p className="text-xs text-slate-500 mt-0.5">Weighted metric combination of core profiles</p>
              </div>
              <span className="text-3xl font-extrabold text-indigo-400">{dnaScore}/100</span>
            </div>

            {/* Composite Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-teal-400 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${dnaScore}%` }} 
                />
              </div>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                {dnaScore < 20 
                  ? 'Setup incomplete. Upload your resume and fill the Resume Builder to unlock full diagnostics.' 
                  : dnaScore < 60 
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
                {atsScore !== null ? `${atsScore}%` : 'Not Parsed'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Skills Coverage</span>
              <p className="text-sm font-extrabold text-white">
                {skillsScore !== null ? `${skillsScore}%` : '0%'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Resume Builder</span>
              <p className="text-sm font-extrabold text-white">
                {builderScore !== null && builderScore > 0 ? `${builderScore}% Filled` : 'Unconfigured'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Certs Bonus</span>
              <p className="text-sm font-extrabold text-white">
                +{Math.min(10, certs.length * 2)}%
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

      {/* MIDDLE SECTION: SKILL CATEGORIES BAR CHART AND CERTIFICATIONS/ROADMAP */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Category breakdown bar chart (1 column) */}
        <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              <Dna className="h-4.5 w-4.5 text-indigo-400" />
              <span>Skills Category Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500">Verified competencies vs target role gaps</p>
          </div>

          <div className="relative w-full h-48 pt-1">
            {mounted && skillChartData.length > 0 ? (
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={skillChartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '10px' }}
                    itemStyle={{ fontSize: '10px' }}
                  />
                  <Bar dataKey="Verified" fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Gap" fill="#f43f5e" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 font-semibold">
                Waiting for profile parsed data...
              </div>
            )}
          </div>
        </div>

        {/* Certifications Ledger (1 column) */}
        <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-indigo-400" />
              <span>Certifications Ledger</span>
            </h3>
            <p className="text-xs text-slate-500">Add completed certifications to increase consolidated score</p>
            
            {/* Cert input */}
            <div className="flex gap-2 print:hidden">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="AWS Developer, PMP..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                aria-label="New certification name"
              />
              <button
                onClick={addCert}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-smooth flex items-center justify-center cursor-pointer"
                aria-label="Add certification to ledger"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Certs list */}
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 pt-1">
              {certs.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-center text-[10px] text-slate-500 font-semibold">
                  No certifications ledger registered.
                </div>
              ) : (
                certs.map((cert, index) => (
                  <div key={index} className="flex flex-row justify-between items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-900 text-xs">
                    <span className="text-slate-200 font-bold break-words min-w-0 flex-1">{cert}</span>
                    <button
                      onClick={() => removeCert(index)}
                      className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer shrink-0"
                      aria-label={`Remove certification ${cert}`}
                      title="Remove certification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-2 font-mono">
            * Consolidates +2% score weight per certification (Max +10%).
          </div>
        </div>

        {/* Roadmap Learning Milestones Checklist (1 column) */}
        <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                <Map className="h-4.5 w-4.5 text-indigo-400" />
                <span>Roadmap Progress</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {roadmapPercent}%
              </span>
            </div>
            
            {activeMilestone ? (
              activeMilestone.isFinished ? (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center text-xs text-emerald-400 font-bold">
                  All learning milestones completed!
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block font-mono">
                      Next Step: {activeMilestone.phase}
                    </span>
                    <h4 className="font-bold text-slate-200 text-xs mt-0.5 truncate">{activeMilestone.title}</h4>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 pt-1.5">
                    {/* Course */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => toggleMilestoneStep(activeMilestone.courseKey)}
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
                          activeMilestone.courseDone 
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                            : 'border-slate-800 hover:border-indigo-500/60'
                        }`}
                      >
                        {activeMilestone.courseDone && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>
                      <span className={`text-[11px] truncate ${activeMilestone.courseDone ? 'text-slate-500 line-through' : 'text-slate-300 font-semibold'}`}>
                        Course: {activeMilestone.course}
                      </span>
                    </div>

                    {/* Cert */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => toggleMilestoneStep(activeMilestone.certKey)}
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
                          activeMilestone.certDone 
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                            : 'border-slate-800 hover:border-indigo-500/60'
                        }`}
                      >
                        {activeMilestone.certDone && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>
                      <span className={`text-[11px] truncate ${activeMilestone.certDone ? 'text-slate-500 line-through' : 'text-slate-300 font-semibold'}`}>
                        Cert: {activeMilestone.certification}
                      </span>
                    </div>

                    {/* Project */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => toggleMilestoneStep(activeMilestone.projectKey)}
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
                          activeMilestone.projectDone 
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                            : 'border-slate-800 hover:border-indigo-500/60'
                        }`}
                      >
                        {activeMilestone.projectDone && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>
                      <span className={`text-[11px] truncate ${activeMilestone.projectDone ? 'text-slate-500 line-through' : 'text-slate-300 font-semibold'}`}>
                        Project: {activeMilestone.project}
                      </span>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-center text-xs text-slate-500 font-semibold">
                Configuring milestones...
              </div>
            )}
          </div>

          <Link
            href="/dashboard/roadmaps"
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-center text-[10px] font-bold text-white transition-smooth flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Full Timelines</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Modules Grid Section */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-white text-xl">Core Modules</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ATS Analyzer */}
          <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FileText className="h-5.5 w-5.5" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                  atsScore !== null 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  {atsScore !== null ? 'Analyzed' : 'Configure'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base mt-4">ATS Resume Analyzer</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Scan your resume against target roles to audit parsing capabilities, formatting, and missing keywords.
              </p>
            </div>
            <Link 
              href="/dashboard/resume-analyzer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-smooth cursor-pointer mt-4"
            >
              Analyze Resume <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* AI Resume Builder */}
          <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="h-5.5 w-5.5" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                  builderScore !== null && builderScore > 0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  {builderScore !== null && builderScore > 0 ? 'Active' : 'Start'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base mt-4">AI Resume Builder</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Construct professional ATS-optimized resumes using multiple templates, editor panels, and AI bullet point generation.
              </p>
            </div>
            <Link 
              href="/dashboard/resume-builder"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-smooth cursor-pointer mt-4"
            >
              Build Resume <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Tailoring Engine */}
          <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <GitFork className="h-5.5 w-5.5" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                  tailorScore !== null 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  {tailorScore !== null ? 'Tailored' : 'Tailor'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base mt-4">Resume Tailor</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Paste any job description and generate optimized text modifications, highlighting matches and filling keyword gaps.
              </p>
            </div>
            <Link 
              href="/dashboard/resume-tailor"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 transition-smooth cursor-pointer mt-4"
            >
              Tailor Content <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Skill Gap Analyzer */}
          <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Dna className="h-5.5 w-5.5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  Analyze
                </span>
              </div>
              <h4 className="font-bold text-white text-base mt-4">Skill Gap Analyzer</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Uncover missing skill segments relative to your target profile. Generate course tracks and project recommendations.
              </p>
            </div>
            <Link 
              href="/dashboard/skill-gap"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-smooth cursor-pointer mt-4"
            >
              Analyze Gaps <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Job Matcher */}
          <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Briefcase className="h-5.5 w-5.5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  Browse
                </span>
              </div>
              <h4 className="font-bold text-white text-base mt-4">Job Matcher</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Scan job postings for matching indices, calculating Career Fit and Readiness ratings based on active profiles.
              </p>
            </div>
            <Link 
              href="/dashboard/job-matching"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-smooth cursor-pointer mt-4"
            >
              Match Jobs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Learning Roadmaps */}
          <div className="glass-panel border-slate-900 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Map className="h-5.5 w-5.5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  Learn
                </span>
              </div>
              <h4 className="font-bold text-white text-base mt-4">Learning Roadmaps</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Track professional milestone timelines containing curated study syllabi, certifications, and portfolio projects.
              </p>
            </div>
            <Link 
              href="/dashboard/roadmaps"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-smooth cursor-pointer mt-4"
            >
              Start Learning <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
