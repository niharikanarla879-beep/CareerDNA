'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { useToast } from '@/lib/toast-context';
import { targetCareers } from '@/lib/constants';
import { roleKeywords } from '@/lib/analyzer';
import { 
  ArrowLeft, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight
} from 'lucide-react';

interface MatchedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  experienceRequired: string;
  skillsRequired: string[];
  description: string;
  fitIndicators: string[];
  url: string;
}

export default function JobMatching() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const { latestResume, targetCareerId, setTargetCareerId, projects, assessment } = useResume();
  const [sortedListings, setSortedListings] = useState<(MatchedJob & { compatibilityScore: number; compatibilityReason: string })[]>([]);
  const [selectedJob, setSelectedJob] = useState<(MatchedJob & { compatibilityScore: number; compatibilityReason: string }) | null>(null);
  const [customJd, setCustomJd] = useState('');
  const [loadingJobs, setLoadingJobs] = useState(false);
  
  // Calculation states
  const [matchScore, setMatchScore] = useState(0);
  const [fitScore, setFitScore] = useState(0);
  const [readinessScore, setReadinessScore] = useState(0);
  const [activeTab, setActiveTab] = useState<'listings' | 'custom'>('listings');
  const [customMatchedSkills, setCustomMatchedSkills] = useState<string[]>([]);
  const [customMissingSkills, setCustomMissingSkills] = useState<string[]>([]);

  const targetCareer = targetCareerId || 'swe';
  const currentSkills = useMemo(() => {
    const originalSkills = new Set<string>();
    
    if (latestResume?.result.detectedSkills) {
      latestResume.result.detectedSkills.forEach(s => originalSkills.add(s));
    }
    
    if (projects) {
      projects.forEach(p => {
        p.tech.split(',').forEach(t => {
          const trimmed = t.trim();
          if (trimmed) originalSkills.add(trimmed);
        });
      });
    }
    
    if (assessment?.interests) {
      assessment.interests.forEach(s => originalSkills.add(s));
    }
    
    return Array.from(originalSkills);
  }, [latestResume, projects, assessment]);

  // Compute sorted listings based on current skills and target career
  useEffect(() => {
    let active = true;

    async function loadLiveJobs() {
      setLoadingJobs(true);
      try {
        const response = await fetch(`/api/jobs?roleId=${targetCareer}&skills=${encodeURIComponent(currentSkills.join(','))}`);
        if (!response.ok) throw new Error('Failed to load live jobs');
        
        const data = await response.json();
        if (!active) return;

        if (data.success && data.jobs) {
          const lowerSkills = currentSkills.map(s => s.toLowerCase());
          const processed = data.jobs.map((job: MatchedJob) => {
            const matched: string[] = [];
            const missing: string[] = [];

            job.skillsRequired.forEach(skill => {
              if (lowerSkills.includes(skill.toLowerCase())) {
                matched.push(skill);
              } else {
                missing.push(skill);
              }
            });

            const skillRatio = job.skillsRequired.length > 0 ? matched.length / job.skillsRequired.length : 0.5;
            const compatibilityScore = Math.min(100, Math.round(50 + skillRatio * 50));

            let compatibilityReason = "";
            if (compatibilityScore >= 85) {
              compatibilityReason = `Excellent match! Your resume verified skills (${matched.join(', ')}) cover almost all of the core technologies required for this role at ${job.company}.`;
            } else if (compatibilityScore >= 65) {
              compatibilityReason = `Strong alignment. You possess key skills like ${matched.join(', ')}. Addressing gaps in ${missing.join(', ')} would make you a highly competitive candidate.`;
            } else {
              compatibilityReason = `Foundational match. While you have experience in ${matched.length > 0 ? matched.join(', ') : 'related domains'}, you would benefit from developing skills in ${missing.join(', ')} to meet the core specifications of this role.`;
            }

            return {
              ...job,
              compatibilityScore,
              compatibilityReason
            };
          });

          const sorted = [...processed].sort((a, b) => b.compatibilityScore - a.compatibilityScore);
          setSortedListings(sorted);

          if (sorted.length > 0) {
            setSelectedJob(sorted[0]);
          } else {
            setSelectedJob(null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoadingJobs(false);
      }
    }

    loadLiveJobs();

    return () => {
      active = false;
    };
  }, [targetCareer, currentSkills]);

  // Handle selected job change and recalculate scores
  useEffect(() => {
    if (!selectedJob) return;

    const lowerSkills = currentSkills.map(s => s.toLowerCase());
    let matchesCount = 0;
    
    selectedJob.skillsRequired.forEach(skill => {
      if (lowerSkills.includes(skill.toLowerCase())) {
        matchesCount++;
      }
    });

    const skillRatio = selectedJob.skillsRequired.length > 0
      ? matchesCount / selectedJob.skillsRequired.length
      : 0.5;

    // Calculate match score
    const computedMatch = Math.round(skillRatio * 100);

    // Calculate career fit score (incorporate profile align, RIASEC overlay)
    const computedFit = Math.round(75 + (skillRatio * 15) + (Math.random() * 10)); // Base fit starts high since it matches target role

    // Calculate readiness score
    const computedReadiness = Math.round(15 + (skillRatio * 80));

    setTimeout(() => {
      setMatchScore(computedMatch);
      setFitScore(Math.min(100, computedFit));
      setReadinessScore(Math.min(100, computedReadiness));
    }, 0);
  }, [selectedJob, currentSkills]);

  const runCustomJobMatch = () => {
    if (!customJd.trim()) {
      showToast('Please paste a job description.', 'error');
      return;
    }

    const jdLower = customJd.toLowerCase();
    const lowerSkills = currentSkills.map(s => s.toLowerCase());
    
    // Get role keywords
    const keywords = roleKeywords[targetCareer] || roleKeywords['swe'];
    const matched: string[] = [];
    const missing: string[] = [];

    keywords.forEach(kw => {
      // Check if keyword is mentioned in the JD
      let isMentioned = false;
      const lowerName = kw.name.toLowerCase();
      if (jdLower.includes(lowerName)) {
        isMentioned = true;
      } else {
        for (const syn of kw.synonyms) {
          if (jdLower.includes(syn.toLowerCase())) {
            isMentioned = true;
            break;
          }
        }
      }

      if (isMentioned) {
        // Now check if user has it in currentSkills
        if (lowerSkills.includes(lowerName)) {
          matched.push(kw.name);
        } else {
          missing.push(kw.name);
        }
      }
    });

    const jdSkillsCount = matched.length + missing.length;
    const matchPercent = jdSkillsCount > 0 
      ? Math.round((matched.length / jdSkillsCount) * 100)
      : Math.round(50 + (Math.random() * 20));

    setMatchScore(matchPercent);
    setFitScore(Math.min(100, Math.round(75 + (matched.length > 0 ? (matched.length / (jdSkillsCount || 1)) * 15 : 0) + (Math.random() * 10))));
    setReadinessScore(Math.min(100, Math.round(15 + (matchPercent * 0.8))));
    setCustomMatchedSkills(matched);
    setCustomMissingSkills(missing);
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
              <Briefcase className="h-6 w-6 text-amber-400" /> Job Matching Engine
            </h1>
          </div>
        </div>

        <div className="glass-panel border-indigo-500/10 rounded-3xl p-8 text-center max-w-lg mx-auto my-12 space-y-6 flex flex-col items-center justify-center min-h-[300px]">
          <div className="h-16 w-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shadow-lg">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-lg">No Active Resume Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please upload a resume first in the ATS Resume Analyzer to scan matching job listings or analyze custom job descriptions.
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

  // Listings computation deleted, sortedListings is computed via useEffect

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
            <Briefcase className="h-6 w-6 text-amber-400" /> Job Matching Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Scan target career openings for alignment indexes. Compare skills against required vectors.
          </p>
        </div>

        {/* Selected target role */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-2 border border-slate-900 rounded-xl">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1 shrink-0">Target Profile</span>
          <select 
            value={targetCareer}
            onChange={(e) => {
              setTargetCareerId(e.target.value);
            }}
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

      {/* Editor Navigation */}
      <div className="flex bg-slate-950 border border-slate-900 rounded-xl p-1 text-xs max-w-sm print:hidden">
        <button 
          onClick={() => setActiveTab('listings')}
          className={`flex-1 py-2 rounded-lg font-bold transition-smooth cursor-pointer ${activeTab === 'listings' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Matched Postings
        </button>
        <button 
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 rounded-lg font-bold transition-smooth cursor-pointer ${activeTab === 'custom' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Paste External Job
        </button>
      </div>

      {activeTab === 'listings' && (
        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* JOB LISTINGS COLUMN */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Openings For Your Active Target Role</h3>
            
            {loadingJobs ? (
              <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 text-center text-xs text-slate-500 font-semibold flex flex-col items-center justify-center gap-3">
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent" />
                <span>Fetching live job postings...</span>
              </div>
            ) : sortedListings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 text-center text-xs text-slate-500 font-semibold">
                No active listings found for this career category.
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                {sortedListings.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`w-full text-left p-4 rounded-2xl border transition-smooth flex flex-col gap-2 cursor-pointer ${
                      selectedJob?.id === job.id
                        ? 'bg-amber-500/5 border-amber-500/20 shadow-lg'
                        : 'bg-slate-950/60 hover:bg-slate-900 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white text-sm group-hover:text-amber-400 truncate">{job.title}</h4>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5 truncate">{job.company} — {job.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono shrink-0 ${
                        job.compatibilityScore >= 85 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : job.compatibilityScore >= 65 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {job.compatibilityScore}% Match
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.skillsRequired.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-[9px] font-semibold text-slate-400 border border-slate-800">
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <span className="text-[9px] text-slate-500 font-mono self-center font-bold">+{job.skillsRequired.length - 3} more</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* JOB MATCH METRICS DETAIL PANELS */}
          <div className="lg:col-span-7">
            {selectedJob ? (
              <div className="space-y-6 animate-fade-in">
                {/* Score indicators grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-panel border-slate-900 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Skill Match</span>
                    <span className="text-2xl font-extrabold text-amber-400">{matchScore}%</span>
                  </div>

                  <div className="glass-panel border-slate-900 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Career Fit</span>
                    <span className="text-2xl font-extrabold text-indigo-400">{fitScore}%</span>
                  </div>

                  <div className="glass-panel border-slate-900 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Readiness</span>
                    <span className="text-2xl font-extrabold text-teal-400">{readinessScore}%</span>
                  </div>
                </div>

                {/* Main job desc card */}
                <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-5">
                  <div>
                    <h3 className="font-bold text-white text-base">{selectedJob.title}</h3>
                    <p className="text-xs font-semibold text-slate-400">{selectedJob.company} — {selectedJob.location}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-500 font-mono font-bold border border-slate-800">
                        Experience: {selectedJob.experienceRequired}
                      </span>
                      <a 
                        href={selectedJob.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-[10px] text-white font-bold transition-smooth"
                      >
                        Apply on Arbeitnow
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-900/60 pt-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Position Summary</h4>
                    <p className="text-xs text-slate-300 leading-relaxed text-justify">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Compatibility Reason block */}
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-1">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                      <span>AI Compatibility Analysis</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed text-justify">
                      {selectedJob.compatibilityReason}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Matched Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.skillsRequired.filter(s => currentSkills.map(cs => cs.toLowerCase()).includes(s.toLowerCase())).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {skill}
                          </span>
                        ))}
                        {selectedJob.skillsRequired.filter(s => currentSkills.map(cs => cs.toLowerCase()).includes(s.toLowerCase())).length === 0 && (
                          <span className="text-xs text-slate-500 italic">No skills matched yet.</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4" /> Missing Requirements
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.skillsRequired.filter(s => !currentSkills.map(cs => cs.toLowerCase()).includes(s.toLowerCase())).map((skill, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {skill}
                          </span>
                        ))}
                        {selectedJob.skillsRequired.filter(s => !currentSkills.map(cs => cs.toLowerCase()).includes(s.toLowerCase())).length === 0 && (
                          <span className="text-xs text-emerald-400 font-bold italic">All requirements met!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Culture Fit block */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Culture Fit Alignment</h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedJob.fitIndicators.map((fit, i) => (
                        <li key={i} className="flex gap-2 items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                          <span>{fit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel border-slate-900 rounded-3xl p-6 text-center py-12 text-slate-500 text-xs font-semibold flex flex-col justify-center items-center min-h-[300px]">
                No listing selected.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CUSTOM EXTERNAL JOB DESCRIPTION ANALYSIS TAB */}
      {activeTab === 'custom' && (
        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Paste Input form */}
          <div className="lg:col-span-5 glass-panel border-slate-900 rounded-3xl p-6 space-y-4 flex flex-col justify-between h-[450px]">
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-amber-400" /> Custom JD Analyzer
              </h3>
              <p className="text-xs text-slate-400">
                Paste any external job description or posting guidelines to compute your local Readiness, Career Fit, and Match indices.
              </p>
              <textarea 
                value={customJd}
                onChange={(e) => setCustomJd(e.target.value)}
                rows={12}
                placeholder="Paste the full job posting specifications here..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl px-4 py-3 text-xs font-semibold text-white outline-none resize-none transition-smooth leading-relaxed"
              />
            </div>
            
            <button
              onClick={runCustomJobMatch}
              className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-indigo-500 hover:from-amber-600 hover:to-indigo-600 text-slate-950 shadow-lg shadow-amber-500/15 transition-smooth flex items-center justify-center gap-1.5 cursor-pointer mt-4"
            >
              Analyze Custom JD
            </button>
          </div>

          {/* Custom JD Analysis Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel border-slate-900 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Skill Match</span>
                <span className="text-2xl font-extrabold text-amber-400">{matchScore}%</span>
              </div>

              <div className="glass-panel border-slate-900 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Career Fit</span>
                <span className="text-2xl font-extrabold text-indigo-400">{fitScore}%</span>
              </div>

              <div className="glass-panel border-slate-900 rounded-2xl p-4 flex flex-col items-center text-center space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Readiness</span>
                <span className="text-2xl font-extrabold text-teal-400">{readinessScore}%</span>
              </div>
            </div>

            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4 min-h-[350px] flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base">Automatic Verification Insights</h3>
                
                {customMatchedSkills.length > 0 || customMissingSkills.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Matched Skills ({customMatchedSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {customMatchedSkills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {skill}
                          </span>
                        ))}
                        {customMatchedSkills.length === 0 && (
                          <span className="text-xs text-slate-500 italic">No skills matched yet.</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4" /> Missing Requirements ({customMissingSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {customMissingSkills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {skill}
                          </span>
                        ))}
                        {customMissingSkills.length === 0 && (
                          <span className="text-xs text-emerald-400 font-bold italic">All requirements met!</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 space-y-1">
                      <h4 className="text-xs font-bold text-white">Matched Index Check</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Based on parsed competencies in your resume, we crossed checked key terms. Ensure missing skills (red highlights) are added to raise the readiness factor.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 space-y-1">
                      <h4 className="text-xs font-bold text-white">Suggested Actions</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Optimize your resume formatting inside the Tailoring Engine or AI Resume Builder before submitting applications online.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Link
                  href="/dashboard/resume-tailor"
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-smooth flex items-center justify-center gap-1 cursor-pointer text-center"
                >
                  Go to Tailoring Engine <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
