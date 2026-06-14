'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import {
  ArrowLeft,
  Dna,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Compass,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { analyzeResume, roleKeywords, KeywordConfig } from '@/lib/analyzer';
import { targetCareers } from '@/lib/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CareerKeyword {
  name: string;
  category: string;
  isPrimary?: boolean;
}

const skillRecommendations: Record<string, { course: string; book: string; project: string }> = {
  'React': {
    course: 'React - The Complete Guide (Udemy / Maximilian Schwarzmüller)',
    book: 'Learning React (Alex Banks & Eve Porcello)',
    project: 'SaaS Dashboard featuring state management, dynamic router grids, and real-time updates.'
  },
  'Node.js': {
    course: 'Complete Backend Node.js Bootcamp (Udemy / Jonas Schmedtmann)',
    book: 'Distributed Systems with Node.js (Thomas Hunter II)',
    project: 'E-commerce REST API complete with OAuth2 security, rate limits, and unit testing scripts.'
  },
  'TypeScript': {
    course: 'TypeScript Masterclass (Frontend Masters)',
    book: 'Programming TypeScript (Boris Cherny)',
    project: 'Strongly-typed validation framework packages ready for npm deployment.'
  },
  'System Design': {
    course: 'Systems Design Fundamentals (ByteByteGo / Alex Xu)',
    book: 'Designing Data-Intensive Applications (Martin Kleppmann)',
    project: 'Design diagram schema for a chat architecture supporting 1M+ active users.'
  },
  'AWS': {
    course: 'AWS Certified Solutions Architect (A Cloud Guru)',
    book: 'Amazon Web Services in Action (Michael Wittig)',
    project: 'Deploy a serverless backend container hosted on AWS Lambda behind an API Gateway.'
  },
  'SQL': {
    course: 'Complete SQL Bootcamp (Udemy)',
    book: 'SQL Queries for Mere Mortals (John L. Viescas)',
    project: 'Database query analytics suite indexing 1M+ logs to diagnose loading bottlenecks.'
  },
  'Figma': {
    course: 'Figma UI/UX Masterclass (Udemy)',
    book: 'Refactoring UI (Adam Wathan & Steve Schoger)',
    project: 'Design a high-fidelity checkout funnel casing 12 edge-case responsive panels.'
  },
  'Agile': {
    course: 'Agile Product Owner Bootcamp (Scrum Alliance)',
    book: 'User Stories Applied (Mike Cohn)',
    project: 'Sprint planner board setup in Jira executing epics, story estimations, and retro boards.'
  },
  'Python': {
    course: 'Python for Data Science Bootcamp (Udemy)',
    book: 'Fluent Python (Luciano Ramalho)',
    project: 'Scraper scripts collecting web metrics and storing datasets in structured formats.'
  },
  'LLMs': {
    course: 'Generative AI with Large Language Models (Coursera)',
    book: 'Hands-on Generative AI (Hugging Face)',
    project: 'Local LLM chat container analyzing local document inputs for contextual answers.'
  },
  'RAG': {
    course: 'Advanced RAG pipelines (DeepLearning.AI)',
    book: 'Vector Search Systems (O\'Reilly)',
    project: 'Semantic index mapping user queries against document chunks in vector databases.'
  },
  'Machine Learning': {
    course: 'Machine Learning Specialization (Andrew Ng / Coursera)',
    book: 'Hands-On Machine Learning (Aurélien Géron)',
    project: 'Gradient boosted classifiers predicting customer churn rates using analytics history.'
  },
  'Deep Learning': {
    course: 'Deep Learning Specialization (Coursera)',
    book: 'Deep Learning with Python (François Chollet)',
    project: 'Train a convolutional neural network (CNN) identifying specific dataset categories.'
  },
  'Tableau': {
    course: 'Tableau Desktop Specialist (Tableau)',
    book: 'Practical Tableau (Ryan Sleeper)',
    project: 'Executive dashboard tracking revenue, acquisition costs, and GTM KPIs.'
  },
  'Power BI': {
    course: 'Microsoft Power BI Data Analyst (Coursera)',
    book: 'Analyzing Data with Power BI (Alberto Ferrari)',
    project: 'Finance report modeling tracking margin rates and pipeline forecasts.'
  }
};

export default function SkillGap() {
  const { user } = useAuth();
  const { latestResume, targetCareerId, setTargetCareerId } = useResume();
  const [selectedGapSkill, setSelectedGapSkill] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
  }, [targetCareer, currentSkills]);  // Compute skill matches and gaps categorized by priority
  const { matchedSkills, missingSkills, foundationalGaps, professionalGaps, strategicGaps } = useMemo(() => {
    const required = roleKeywords[targetCareer] || roleKeywords['swe'];
    const matched: CareerKeyword[] = [];
    const missing: CareerKeyword[] = [];
    const foundational: CareerKeyword[] = [];
    const professional: CareerKeyword[] = [];
    const strategic: CareerKeyword[] = [];

    const lowerCurrent = currentSkills.map(s => s.toLowerCase());

    required.forEach(kw => {
      const nameMatch = lowerCurrent.includes(kw.name.toLowerCase());
      if (nameMatch) {
        matched.push(kw as any);
      } else {
        missing.push(kw as any);
        const nameLower = kw.name.toLowerCase();
        const catLower = kw.category.toLowerCase();
        
        // Check if advanced/strategic keyword category
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
          foundational.push(kw as any);
        } else if (isAdvancedCategory) {
          strategic.push(kw as any);
        } else {
          professional.push(kw as any);
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

  // Compute selected gap skill priority badge styling dynamically
  const selectedSkillPriority = useMemo(() => {
    if (!selectedGapSkill) return null;
    const isFoundational = foundationalGaps.some(s => s.name === selectedGapSkill);
    if (isFoundational) return { text: 'High Priority (Foundational)', style: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' };
    const isStrategic = strategicGaps.some(s => s.name === selectedGapSkill);
    if (isStrategic) return { text: 'Medium Priority (Strategic)', style: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' };
    return { text: 'Standard Priority (Professional)', style: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
  }, [selectedGapSkill, foundationalGaps, strategicGaps]);
  // Sync selected gap skill
  useEffect(() => {
    if (missingSkills.length > 0) {
      setSelectedGapSkill(missingSkills[0].name);
    } else {
      setSelectedGapSkill(null);
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

  const activeRecommendation = selectedGapSkill
    ? skillRecommendations[selectedGapSkill] || {
      course: `Complete ${selectedGapSkill} Development (Coursera / Udemy courses)`,
      book: `${selectedGapSkill} Handbooks & Technical Docs`,
      project: `Build a portfolio project demonstrating your core integration of ${selectedGapSkill} tools.`
    }
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
            Contrast your extracted skills against core industry vectors. Create learning schedules to address gaps.
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

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* SKILL ALIGNMENT GRID */}
        <div className="lg:col-span-7 space-y-6">
          {/* Competency Breakdown Chart Card */}
          <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <span>Competency Breakdown by Category</span>
            </h3>
            <p className="text-xs text-slate-400">
              Verified skills versus required capability gaps per technology vector.
            </p>
            <div className="relative w-full h-[220px] pt-2">
              {mounted && chartData.length > 0 ? (
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                      itemStyle={{ fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Bar dataKey="Verified" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Gap" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-xs text-slate-500 font-semibold">
                  Preparing dynamic charts...
                </div>
              )}
            </div>
          </div>

          {/* Matched Skills Card */}
          <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>Verified Skills ({matchedSkills.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              These verified competencies match the requirements of a {targetCareers.find(c => c.id === targetCareer)?.name}.
            </p>

            {matchedSkills.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-center text-xs text-slate-500 font-semibold">
                No verified matching skills. Upload a resume to automatically parse them.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {matchedSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Missing Skills Gaps Card */}
          <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              <span>Target Role Gaps ({missingSkills.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select any missing skill to display a customized learning blueprint. Gaps are categorized by career priority.
            </p>

            {missingSkills.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center text-xs text-emerald-400 font-bold">
                Amazing! 100% skill coverage achieved for this career path.
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {/* Foundational Gaps */}
                {foundationalGaps.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">Foundational Gaps (Beginner)</span>
                    <div className="flex flex-wrap gap-2">
                      {foundationalGaps.map((skill, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedGapSkill(skill.name)}
                          className={`px-3 py-1 rounded-xl border text-xs font-bold transition-smooth flex items-center gap-1 cursor-pointer ${selectedGapSkill === skill.name
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:border-rose-400/55'
                            }`}
                        >
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          <span>{skill.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional Gaps */}
                {professionalGaps.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Professional Gaps (Intermediate)</span>
                    <div className="flex flex-wrap gap-2">
                      {professionalGaps.map((skill, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedGapSkill(skill.name)}
                          className={`px-3 py-1 rounded-xl border text-xs font-bold transition-smooth flex items-center gap-1 cursor-pointer ${selectedGapSkill === skill.name
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-400/55'
                            }`}
                        >
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          <span>{skill.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategic Gaps */}
                {strategicGaps.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Strategic Gaps (Advanced)</span>
                    <div className="flex flex-wrap gap-2">
                      {strategicGaps.map((skill, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedGapSkill(skill.name)}
                          className={`px-3 py-1 rounded-xl border text-xs font-bold transition-smooth flex items-center gap-1 cursor-pointer ${selectedGapSkill === skill.name
                              ? 'bg-indigo-500 text-white border-indigo-500'
                              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:border-indigo-400/55'
                            }`}
                        >
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          <span>{skill.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* LEARNING RECOMMENDATIONS BLUEPRINTS */}
        <div className="lg:col-span-5">
          {selectedGapSkill && activeRecommendation ? (
            <div className="glass-panel border-indigo-500/10 rounded-3xl p-6 space-y-6 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />

              <div className="space-y-1.5 relative z-10">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5" /> Learning Roadmap
                </span>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <span>Upgrade: {selectedGapSkill}</span>
                </h3>
              </div>

              {/* Roadmap points */}
              <div className="space-y-4 relative z-10 pt-2">
                <div className="space-y-1.5">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-indigo-400" /> Recommended Tutorial / Course
                  </div>
                  <p className="text-xs font-bold text-slate-200 pl-5 leading-relaxed">
                    {activeRecommendation.course}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-indigo-400" /> Essential Book Reference
                  </div>
                  <p className="text-xs font-bold text-slate-200 pl-5 leading-relaxed">
                    {activeRecommendation.book}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400" /> Hands-on Portfolio Project
                  </div>
                  <p className="text-xs font-bold text-slate-200 pl-5 leading-relaxed">
                    {activeRecommendation.project}
                  </p>
                </div>
              </div>

              {selectedSkillPriority && (
                <div className="pt-4 border-t border-slate-900/60 relative z-10 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Upgrade Priority</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${selectedSkillPriority.style}`}>
                    {selectedSkillPriority.text}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel border-slate-900 rounded-3xl p-6 text-center py-12 text-slate-500 text-xs font-semibold flex flex-col items-center justify-center space-y-3 min-h-[300px]">
              <Compass className="h-10 w-10 text-slate-600 animate-spin" style={{ animationDuration: '6s' }} />
              <p>100% skill alignment. Select alternative career profiles to analyze different learning tracks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
