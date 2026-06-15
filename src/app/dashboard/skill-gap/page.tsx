'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import {
  ArrowLeft,
  Dna,
  AlertTriangle,
  Compass,
  Clock,
  ExternalLink
} from 'lucide-react';
import { targetCareers } from '@/lib/constants';
import { roleKeywords } from '@/lib/analyzer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { generatePathwayForSkill } from '@/lib/skill-resources';

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case 'YouTube':
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </span>
      );
    case 'Coursera':
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-extrabold text-[11px] shrink-0 border border-blue-500/20 font-mono">
          CO
        </span>
      );
    case 'Udemy':
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 font-extrabold text-[11px] shrink-0 border border-purple-500/20 font-mono">
          UD
        </span>
      );
    case 'freeCodeCamp':
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-extrabold text-[11px] shrink-0 border border-emerald-500/20 font-mono">
          FC
        </span>
      );
    case 'Roadmap.sh':
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 border border-amber-500/20">
          <Compass className="w-4 h-4" />
        </span>
      );
    case 'GeeksforGeeks':
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-500/10 text-green-400 font-extrabold text-[11px] shrink-0 border border-green-500/20 font-mono">
          GF
        </span>
      );
    default:
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-500/10 text-slate-400 shrink-0 border border-slate-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </span>
      );
  }
};

interface SkillKeyword {
  name: string;
  category: string;
  isPrimary: boolean;
  synonyms: string[];
}

export default function SkillGap() {
  const { user } = useAuth();
  const { latestResume, targetCareerId, setTargetCareerId, scores } = useResume();
  const [selectedGapSkill, setSelectedGapSkill] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const currentSkills = useMemo(() => {
    return latestResume ? (latestResume.result.detectedSkills || []) : [];
  }, [latestResume]);

  const targetCareer = targetCareerId || 'swe';

  // Compute category statistics for the bar chart
  const chartData = useMemo(() => {
    const categoriesMap: Record<string, { verified: number; gap: number }> = {};
    const requiredSkillsForChart = roleKeywords[targetCareer] || roleKeywords['swe'];
    const lowerCurrentForChart = currentSkills.map(s => s.toLowerCase());

    requiredSkillsForChart.forEach(kw => {
      const isMatched = lowerCurrentForChart.includes(kw.name.toLowerCase());
      const cat = kw.category;
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = { verified: 0, gap: 0 };
      }
      if (isMatched) {
        categoriesMap[cat].verified += 1;
      } else {
        categoriesMap[cat].gap += 1;
      }
    });

    return Object.entries(categoriesMap).map(([category, stats]) => ({
      category,
      Verified: stats.verified,
      Gap: stats.gap
    }));
  }, [targetCareer, currentSkills]);

  // Match and Gaps list computations
  const { matchedSkills, missingSkills, foundationalGaps, professionalGaps, strategicGaps } = useMemo(() => {
    const required = (roleKeywords[targetCareer] || roleKeywords['swe']) as SkillKeyword[];
    const matched: SkillKeyword[] = [];
    const missing: SkillKeyword[] = [];
    const foundational: SkillKeyword[] = [];
    const professional: SkillKeyword[] = [];
    const strategic: SkillKeyword[] = [];

    const lowerCurrent = currentSkills.map(s => s.toLowerCase());

    required.forEach(kw => {
      const nameMatch = lowerCurrent.includes(kw.name.toLowerCase());
      if (nameMatch) {
        matched.push(kw);
      } else {
        missing.push(kw);
        const nameLower = kw.name.toLowerCase();
        const catLower = kw.category.toLowerCase();
        
        const isAdvancedCategory = catLower.includes('architecture') || 
                                   catLower.includes('devops') || 
                                   catLower.includes('ops') || 
                                   catLower.includes('cloud') || 
                                   catLower.includes('system design') ||
                                   nameLower === 'aws' || 
                                   nameLower === 'kubernetes' || 
                                   nameLower === 'docker' || 
                                   nameLower === 'ci/cd' || 
                                   nameLower === 'langchain' || 
                                   nameLower === 'rag' || 
                                   nameLower === 'mlops' ||
                                   nameLower === 'system design' ||
                                   nameLower === 'microservices';

        if (kw.isPrimary) {
          foundational.push(kw);
        } else if (isAdvancedCategory) {
          strategic.push(kw);
        } else {
          professional.push(kw);
        }
      }
    });

    return { 
      matchedSkills: matched, 
      missingSkills: missing,
      foundationalGaps: foundational, 
      professionalGaps: professional, 
      strategicGaps: strategic 
    };
  }, [targetCareer, currentSkills]);

  // Sync selected gap skill
  useEffect(() => {
    if (missingSkills.length > 0) {
      const firstSkillName = missingSkills[0].name;
      setTimeout(() => setSelectedGapSkill(firstSkillName), 0);
    } else {
      setTimeout(() => setSelectedGapSkill(null), 0);
    }
  }, [missingSkills]);

  const handleCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetCareerId(e.target.value);
  };



  if (!user) return null;

  if (!latestResume) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Dna className="h-6 w-6 text-rose-400 animate-pulse" /> Skill Gap Analyzer
            </h1>
          </div>
        </div>

        <div className="glass-panel border-rose-500/10 rounded-3xl p-8 text-center max-w-lg mx-auto my-12 space-y-6 flex flex-col items-center justify-center min-h-[300px]">
          <div className="h-16 w-16 rounded-2xl bg-rose-500/5 border border-rose-500/15 flex items-center justify-center text-rose-400 shadow-lg">
            <AlertTriangle className="h-8 w-8 text-rose-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-lg">No Active Resume Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please upload a resume first in the ATS Resume Analyzer to run a gap analysis and discover tailored learning recommendations.
            </p>
          </div>
          <Link
            href="/dashboard/resume-analyzer"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 transition-smooth"
          >
            Go to Resume Analyzer
          </Link>
        </div>
      </div>
    );
  }

  // Active pathway metadata resolver
  const activePathway = selectedGapSkill
    ? generatePathwayForSkill(selectedGapSkill)
    : null;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Dna className="h-6 w-6 text-rose-400 animate-pulse" /> Skill Gap Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze matching tech stack parameters, evaluate Job Readiness indices, and access direct clickable learning pathways.
          </p>
        </div>

        {/* Selected target role */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-2 border border-slate-900 rounded-xl">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1 shrink-0">Target Profile</span>
          <select
            value={targetCareer}
            onChange={handleCareerChange}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
          >
            {targetCareers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview stats panel: Job Readiness Meter */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-panel border-slate-900 rounded-2xl p-4 flex items-center justify-between bg-slate-950/40">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Job Readiness Score</span>
            <p className="text-lg font-extrabold text-white mt-0.5">{scores.jobReadinessScore}%</p>
          </div>
          <div className="h-2 w-24 bg-slate-900 rounded-full overflow-hidden">
            <div className="bg-teal-400 h-full" style={{ width: `${scores.jobReadinessScore}%` }} />
          </div>
        </div>

        <div className="glass-panel border-slate-900 rounded-2xl p-4 flex items-center justify-between bg-slate-950/40">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Missing Technologies</span>
            <p className="text-lg font-extrabold text-rose-400 mt-0.5">{scores.missingSkills.length} Required</p>
          </div>
          <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0" />
        </div>

        <div className="glass-panel border-slate-900 rounded-2xl p-4 flex items-center justify-between bg-slate-950/40">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Timeline to Job-Ready</span>
            <p className="text-lg font-extrabold text-indigo-400 mt-0.5">~{scores.estimatedReadyWeeks} Weeks</p>
          </div>
          <Clock className="h-6 w-6 text-indigo-400 shrink-0" />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* LEFT COLUMN: CHARTS, VERIFIED SKILLS, & GAP TAG CHIPS */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Competency Chart */}
          <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4 bg-slate-950/40">
            <h3 className="font-bold text-white text-base">Competency Categories Chart</h3>
            <div className="relative w-full h-[180px] pt-1">
              {mounted && chartData.length > 0 ? (
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '10px' }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '10px' }}
                      itemStyle={{ fontSize: '10px' }}
                    />
                    <Bar dataKey="Verified" fill="#10b981" />
                    <Bar dataKey="Gap" fill="#f43f5e" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500 font-semibold">
                  Loading chart graphics...
                </div>
              )}
            </div>
          </div>

          {/* Verified skills */}
          <div className="glass-panel border-slate-900 rounded-3xl p-5 space-y-3">
            <h3 className="font-bold text-white text-sm">Your Verified Skills ({matchedSkills.length})</h3>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((s, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {s.name}
                </span>
              ))}
              {matchedSkills.length === 0 && (
                <span className="text-xs text-slate-500 italic">No matching skills detected in your profile.</span>
              )}
            </div>
          </div>

          {/* Tag Gaps tags */}
          <div className="glass-panel border-slate-900 rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Gaps to Optimize ({missingSkills.length})</h3>
            
            {missingSkills.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center text-xs text-emerald-400 font-bold">
                100% skill matching achieved!
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {/* Foundational */}
                {foundationalGaps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Beginner (Foundational)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {foundationalGaps.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedGapSkill(s.name)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-smooth ${
                            selectedGapSkill === s.name 
                              ? 'bg-rose-500 border-rose-500 text-white shadow-md' 
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:border-rose-400/60'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional */}
                {professionalGaps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Intermediate (Professional)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {professionalGaps.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedGapSkill(s.name)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-smooth ${
                            selectedGapSkill === s.name 
                              ? 'bg-amber-500 border-amber-500 text-white shadow-md' 
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:border-amber-400/60'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategic */}
                {strategicGaps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Advanced (Strategic)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {strategicGaps.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedGapSkill(s.name)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-smooth ${
                            selectedGapSkill === s.name 
                              ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' 
                              : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:border-indigo-400/60'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: ACTION RECOMMENDATION BLUEPRINT MAPS */}
        <div className="lg:col-span-6">
          {selectedGapSkill && activePathway ? (
            <div className="glass-panel border-indigo-500/10 rounded-3xl p-6 space-y-5 animate-fade-in relative overflow-hidden bg-slate-950/40">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
              
              {/* Header metadata */}
              <div className="space-y-1 border-b border-slate-900 pb-3 relative z-10">
                <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Gap Solution Checklist
                </span>
                <h3 className="font-extrabold text-white text-base">Technology: {selectedGapSkill}</h3>
                <p className="text-xs text-slate-400 leading-relaxed text-justify">{activePathway.whyItMatters}</p>
              </div>

              {/* Priority & Impact Stats */}
              <div className="grid grid-cols-3 gap-3 pt-1 relative z-10">
                <div className="bg-slate-950/60 border border-slate-900 p-2.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Priority</span>
                  <span className="text-xs font-extrabold text-white mt-1 block font-mono">{activePathway.priorityScore}/100</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-900 p-2.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Syllabus Time</span>
                  <span className="text-xs font-extrabold text-white mt-1 block font-mono">{activePathway.estimatedHours} Hrs</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-900 p-2.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Readiness Up</span>
                  <span className="text-xs font-extrabold text-teal-400 mt-1 block font-mono">+{activePathway.readinessImpact}%</span>
                </div>
              </div>

              {/* Direct clickable resources list */}
              <div className="space-y-3 relative z-10 pt-2">
                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Curated Clickable Resources</h4>
                <div className="space-y-2.5">
                  {activePathway.resources.map((res, i) => (
                    <a 
                      key={i}
                      href={res.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-900 hover:border-indigo-500/40 text-xs flex gap-3.5 items-center group transition-smooth"
                    >
                      {getProviderIcon(res.provider)}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] text-indigo-400 font-extrabold font-mono uppercase tracking-wider leading-none">{res.provider}</span>
                            <span className="text-slate-600 font-mono text-[9px]">•</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              res.isFree ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {res.isFree ? 'FREE' : 'PAID'}
                            </span>
                            <span className="text-slate-600 font-mono text-[9px]">•</span>
                            <span className={`text-[9px] font-bold ${
                              res.difficulty === 'Beginner' ? 'text-emerald-400' :
                              res.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'
                            }`}>
                              {res.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 shrink-0">
                            <span>★</span>
                            <span>{res.qualityScore.toFixed(1)}</span>
                          </div>
                        </div>
                        <span className="text-slate-200 font-bold block leading-snug group-hover:text-white transition-smooth text-[11px] truncate">
                          {res.title}
                        </span>
                        {res.duration && (
                          <div className="text-[9px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-600" />
                            <span>Estimated Duration: {res.duration}</span>
                          </div>
                        )}
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-smooth" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Curated project prompts */}
              <div className="space-y-3 pt-3 border-t border-slate-900 relative z-10">
                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Recommended Practice Project Milestones</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-1">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Beginner Stage Project</span>
                    <p className="text-slate-300 leading-relaxed text-justify">{activePathway.beginnerProject}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-1">
                    <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest font-mono">Intermediate Stage Project</span>
                    <p className="text-slate-300 leading-relaxed text-justify">{activePathway.intermediateProject}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-1">
                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Advanced Stage Project</span>
                    <p className="text-slate-300 leading-relaxed text-justify">{activePathway.advancedProject}</p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel border-slate-900 rounded-3xl p-6 text-center py-12 text-slate-500 text-xs font-semibold flex flex-col items-center justify-center space-y-3 min-h-[300px]">
              <Compass className="h-10 w-10 text-slate-600 animate-spin" style={{ animationDuration: '6s' }} />
              <p>All tech gaps resolved for this profile! Switch Target Career to inspect other pathways.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
