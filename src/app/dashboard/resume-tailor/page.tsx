'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { 
  ArrowLeft, 
  GitFork, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Layers,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { roleKeywords } from '@/lib/analyzer';

// Helper to check if a word or phrase matches in text
function matchWordOrPhrase(text: string, term: string): boolean {
  if (/\s|[^a-zA-Z0-9]/.test(term)) {
    return text.includes(term.toLowerCase());
  }
  const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp('\\b' + escaped + '\\b', 'i');
  return regex.test(text);
}

// Function to extract keywords dynamically from JD
function extractKeywordsFromJd(jdText: string): string[] {
  const lowerJd = jdText.toLowerCase();
  const found = new Set<string>();

  // Gather all unique keyword configurations across all roles
  const allConfigs = Object.values(roleKeywords).flat();

  allConfigs.forEach(config => {
    let matched = false;
    if (matchWordOrPhrase(lowerJd, config.name)) {
      matched = true;
    } else {
      // Check synonyms
      for (const syn of config.synonyms) {
        if (matchWordOrPhrase(lowerJd, syn)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      found.add(config.name);
    }
  });

  return Array.from(found);
}

interface TailorHistoryItem {
  id: string;
  timestamp: string;
  jobTitle: string;
  matchPercent: number;
  roleFitConfidence: number;
  optimizedText: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  scoreBreakdown: {
    skills: number;
    experience: number;
    projects: number;
    certifications: number;
    education: number;
  };
}

export default function ResumeTailor() {
  const { user } = useAuth();
  
  // States
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tailoringPhase, setTailoringPhase] = useState<'input' | 'analyzing' | 'results'>('input');
  const [tailorHistory, setTailorHistory] = useState<TailorHistoryItem[]>([]);
  
  // Results states
  const [matchPercent, setMatchPercent] = useState(0);
  const [roleFitConfidence, setRoleFitConfidence] = useState(0);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [optimizedResumeText, setOptimizedResumeText] = useState('');
  const [scoreBreakdown, setScoreBreakdown] = useState<{
    skills: number;
    experience: number;
    projects: number;
    certifications: number;
    education: number;
  }>({ skills: 0, experience: 0, projects: 0, certifications: 0, education: 0 });

  const { latestResume, resumeHistory, targetCareerId, projects, certs } = useResume();

  // Load history to populate options
  useEffect(() => {
    if (resumeHistory.length > 0 && !resumeText) {
      const text = resumeHistory[0].text;
      setTimeout(() => setResumeText(text), 0);
    }
  }, [resumeHistory, resumeText]);

  // Load tailor history safely
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        try {
          const historyRaw = localStorage.getItem(`careerdna_tailor_history_${user.id}`);
          if (historyRaw) {
            const parsed = JSON.parse(historyRaw);
            if (Array.isArray(parsed)) {
              setTailorHistory(parsed as TailorHistoryItem[]);
            }
          }
        } catch (e) {
          console.error('Error loading tailor history safely:', e);
        }
      }, 0);
    }
  }, [user]);

  // Keep scores in sync with projects and certs changes instantly
  useEffect(() => {
    if (tailoringPhase === 'results') {
      const projScore = projects.length > 0
        ? Math.round(projects.reduce((acc, curr) => acc + curr.strengthScore, 0) / projects.length)
        : 0;
      
      const certScore = Math.min(100, certs.length * 20);
      
      setTimeout(() => {
        setScoreBreakdown(prev => {
          // Only trigger updates if scores actually changed to avoid infinite loop
          if (prev.projects === projScore && prev.certifications === certScore) {
            return prev;
          }

          const updatedBreakdown = {
            ...prev,
            projects: projScore,
            certifications: certScore
          };
          
          // Recalculate final match percent based on the same weights
          // Weights: skills (50%), projects (20%), experience (15%), certifications (7%), education (8%)
          const baseScore = (updatedBreakdown.skills * 0.50) +
                            (updatedBreakdown.projects * 0.20) +
                            (updatedBreakdown.experience * 0.15) +
                            (updatedBreakdown.certifications * 0.07) +
                            (updatedBreakdown.education * 0.08);
                            
          // Calculate penalty dynamically
          const resumeLower = resumeText.toLowerCase();
          const allConfigs = Object.values(roleKeywords).flat();
          
          let criticalSkills: string[] = [];
          const currentRole = targetCareerId || 'swe';
          if (currentRole === 'ai' || currentRole === 'ml') {
            criticalSkills = ['TensorFlow', 'PyTorch', 'Scikit-Learn'];
          } else if (['swe', 'frontend', 'backend', 'fullstack'].includes(currentRole)) {
            criticalSkills = ['React', 'Node.js', 'APIs', 'Git'];
          } else if (currentRole === 'da') {
            criticalSkills = ['SQL', 'Excel', 'Tableau', 'Power BI'];
          }

          let criticalMatchedCount = 0;
          criticalSkills.forEach(skill => {
            let skillFound = false;
            if (matchWordOrPhrase(resumeLower, skill)) {
              skillFound = true;
            } else {
              const config = allConfigs.find(c => c.name.toLowerCase() === skill.toLowerCase());
              if (config) {
                for (const syn of config.synonyms) {
                  if (matchWordOrPhrase(resumeLower, syn)) {
                    skillFound = true;
                    break;
                  }
                }
              }
            }
            if (skillFound) {
              criticalMatchedCount++;
            }
          });

          const criticalMissingCount = criticalSkills.length - criticalMatchedCount;
          const penalty = criticalMissingCount * 12;
          
          const finalMatchPercent = Math.max(0, Math.min(100, Math.round(baseScore - penalty)));
          setMatchPercent(finalMatchPercent);
          
          // Recalculate role fit confidence
          let confidence = 0;
          const targetKeywordsCount = matchedKeywords.length + missingKeywords.length;
          const keywordRate = targetKeywordsCount > 0 ? (matchedKeywords.length / targetKeywordsCount) : 0;
          const expRate = updatedBreakdown.experience / 100;
          
          if (criticalSkills.length > 0) {
            const criticalRate = criticalMatchedCount / criticalSkills.length;
            confidence = Math.round((criticalRate * 60) + (keywordRate * 25) + (expRate * 15));
          } else {
            confidence = Math.round((keywordRate * 70) + (expRate * 30));
          }
          confidence = Math.max(0, Math.min(100, confidence));
          setRoleFitConfidence(confidence);
          
          return updatedBreakdown;
        });
      }, 0);
    }
  }, [projects, certs, tailoringPhase, resumeText, targetCareerId, matchedKeywords, missingKeywords]);

  const handleSelectHistoryResume = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = resumeHistory.find(item => item.id === e.target.value);
    if (selected) {
      setResumeText(selected.text);
    }
  };

  const runTailoring = () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Please provide both your resume text and target job description.');
      return;
    }

    setTailoringPhase('analyzing');
    
    setTimeout(() => {
      // Find keywords inside job description dynamically
      const finalJdKeywords = extractKeywordsFromJd(jobDescription);

      // Default to a small set if JD doesn't contain standard keywords
      const fallbackKeywords = ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Git'];
      const targetKeywords = finalJdKeywords.length > 0 
        ? finalJdKeywords 
        : fallbackKeywords;

      const matched: string[] = [];
      const missing: string[] = [];
      const resumeLower = resumeText.toLowerCase();

      // Get all keyword configs list for checking synonyms
      const allConfigs = Object.values(roleKeywords).flat();

      targetKeywords.forEach(kw => {
        // Find matching config to check synonyms as well
        const config = allConfigs.find(c => c.name.toLowerCase() === kw.toLowerCase());
        
        let hasSkill = false;
        if (matchWordOrPhrase(resumeLower, kw)) {
          hasSkill = true;
        } else if (config) {
          for (const syn of config.synonyms) {
            if (matchWordOrPhrase(resumeLower, syn)) {
              hasSkill = true;
              break;
            }
          }
        }

        if (hasSkill) {
          matched.push(kw);
        } else {
          missing.push(kw);
        }
      });

      // 1. Skills score (50% weight)
      const skillsScore = targetKeywords.length > 0 
        ? Math.round((matched.length / targetKeywords.length) * 100)
        : 100;

      // 2. Experience score (15% weight)
      let experienceScore = 10;
      const hasExpSection = /experience|employment|work history|career history|position/i.test(resumeText);
      if (hasExpSection) experienceScore += 40;
      
      const verbs = ['led', 'managed', 'engineered', 'developed', 'built', 'optimized', 'designed', 'created', 'implemented', 'spearheaded', 'launched', 'analyzed', 'reported'];
      let verbCount = 0;
      verbs.forEach(v => {
        if (new RegExp('\\b' + v + '\\b', 'i').test(resumeLower)) {
          verbCount++;
        }
      });
      experienceScore += Math.min(30, verbCount * 10);

      const hasTimeline = /\b(19\d{2}|20\d{2})\b/.test(resumeLower);
      if (hasTimeline) experienceScore += 20;
      experienceScore = Math.min(100, experienceScore);

      // 3. Projects score (20% weight)
      let projectsScore = 0;
      if (projects.length > 0) {
        const sum = projects.reduce((acc, curr) => acc + curr.strengthScore, 0);
        projectsScore = Math.round(sum / projects.length);
      }

      // 4. Certifications score (7% weight)
      const certificationsScore = Math.min(100, certs.length * 20);

      // 5. Education score (8% weight)
      let educationScore = 20;
      const hasEdu = /education|degree|university|college|academic/i.test(resumeText);
      if (hasEdu) educationScore += 50;
      const hasDegrees = /bachelor|master|phd|bs|ms|b\.s\.|m\.s\.|computer science|engineering|major/i.test(resumeText);
      if (hasDegrees) educationScore += 30;
      educationScore = Math.min(100, educationScore);

      // Critical Missing Skills Penalties
      let criticalSkills: string[] = [];
      const currentRole = targetCareerId || 'swe';
      if (currentRole === 'ai' || currentRole === 'ml') {
        criticalSkills = ['TensorFlow', 'PyTorch', 'Scikit-Learn'];
      } else if (['swe', 'frontend', 'backend', 'fullstack'].includes(currentRole)) {
        criticalSkills = ['React', 'Node.js', 'APIs', 'Git'];
      } else if (currentRole === 'da') {
        criticalSkills = ['SQL', 'Excel', 'Tableau', 'Power BI'];
      }

      let criticalMatchedCount = 0;
      criticalSkills.forEach(skill => {
        let skillFound = false;
        if (matchWordOrPhrase(resumeLower, skill)) {
          skillFound = true;
        } else {
          const config = allConfigs.find(c => c.name.toLowerCase() === skill.toLowerCase());
          if (config) {
            for (const syn of config.synonyms) {
              if (matchWordOrPhrase(resumeLower, syn)) {
                skillFound = true;
                break;
              }
            }
          }
        }
        if (skillFound) {
          criticalMatchedCount++;
        }
      });

      const criticalMissingCount = criticalSkills.length - criticalMatchedCount;
      const penalty = criticalMissingCount * 12;

      // Base weighted score
      const baseScore = (skillsScore * 0.50) +
                        (projectsScore * 0.20) +
                        (experienceScore * 0.15) +
                        (certificationsScore * 0.07) +
                        (educationScore * 0.08);

      const finalMatchPercent = Math.max(0, Math.min(100, Math.round(baseScore - penalty)));

      // Role-fit confidence metric
      let confidence = 0;
      if (criticalSkills.length > 0) {
        const criticalRate = criticalMatchedCount / criticalSkills.length;
        const keywordRate = targetKeywords.length > 0 ? (matched.length / targetKeywords.length) : 0;
        const expRate = experienceScore / 100;
        confidence = Math.round((criticalRate * 60) + (keywordRate * 25) + (expRate * 15));
      } else {
        const keywordRate = targetKeywords.length > 0 ? (matched.length / targetKeywords.length) : 0;
        const expRate = experienceScore / 100;
        confidence = Math.round((keywordRate * 70) + (expRate * 30));
      }
      confidence = Math.max(0, Math.min(100, confidence));

      const breakdown = {
        skills: skillsScore,
        experience: experienceScore,
        projects: projectsScore,
        certifications: certificationsScore,
        education: educationScore
      };

      setMatchPercent(finalMatchPercent);
      setRoleFitConfidence(confidence);
      setScoreBreakdown(breakdown);
      setMatchedKeywords(matched);
      setMissingKeywords(missing);

      // Generate optimized resume text with integrated missing keywords
      let optimizedText = resumeText;
      if (missing.length > 0) {
        // Find Experience or Skills section to integrate keywords
        const skillsIndex = resumeText.search(/skills|technologies/i);
        if (skillsIndex !== -1) {
          // Splice in missing keywords nicely
          const skillInsert = `\n- Tailored Skills Added: ${missing.join(', ')}`;
          optimizedText = resumeText.slice(0, skillsIndex + 7) + skillInsert + resumeText.slice(skillsIndex + 7);
        } else {
          optimizedText = `// ATS Optimized Skills Added: ${missing.join(', ')}\n\n` + resumeText;
        }
      }
      setOptimizedResumeText(optimizedText);

      // Save tailored history item safely
      if (user) {
        let tailorList: TailorHistoryItem[] = [];
        try {
          const historyRaw = localStorage.getItem(`careerdna_tailor_history_${user.id}`);
          if (historyRaw) {
            const parsed = JSON.parse(historyRaw) as TailorHistoryItem[];
            if (Array.isArray(parsed)) {
              tailorList = parsed;
            }
          }
        } catch (e) {
          console.error('Error parsing tailor history:', e);
        }

        const newTailorItem = {
          id: Math.random().toString(36).substring(2, 11),
          timestamp: new Date().toISOString(),
          jobTitle: jobDescription.slice(0, 40) + '...',
          matchPercent: finalMatchPercent,
          roleFitConfidence: confidence,
          optimizedText: optimizedText,
          matchedKeywords: matched,
          missingKeywords: missing,
          scoreBreakdown: breakdown
        };
        const updated = [newTailorItem, ...tailorList];
        localStorage.setItem(`careerdna_tailor_history_${user.id}`, JSON.stringify(updated));
        setTailorHistory(updated);
        
        // Dispatch event to update overall DNA Score
        window.dispatchEvent(new Event('storage'));
      }

      setTailoringPhase('results');
    }, 1200);
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
              <GitFork className="h-6 w-6 text-teal-400" /> Resume Tailoring Engine
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
              Please upload a resume first in the ATS Resume Analyzer to access the tailoring comparisons engine.
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

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar */}
      <div>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <GitFork className="h-6 w-6 text-teal-400" /> Resume Tailoring Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Contrast your resume against specific job descriptions to audit compliance score rates and fill keyword gaps.
        </p>
      </div>

      {/* PHASE 1: INPUT PANELS */}
      {tailoringPhase === 'input' && (
        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Main Inputs (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Resume Source Selection */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-teal-400" /> Your Resume
                </h3>
                {resumeHistory.length > 0 && (
                  <select
                    onChange={handleSelectHistoryResume}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-300 outline-none cursor-pointer focus:border-teal-500 transition-smooth"
                  >
                    <option value="">Load From History...</option>
                    {resumeHistory.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.filename} ({item.result.score}%)
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <textarea 
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={12}
                placeholder="Paste your raw resume text here, or load a saved resume from the dropdown options..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-2xl px-4 py-3 text-xs font-semibold text-white outline-none resize-none transition-smooth leading-relaxed"
              />
            </div>

            {/* Job Description Target Input */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <Layers className="h-4.5 w-4.5 text-teal-400" /> Target Job Description
                </h3>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  placeholder="Paste the full job description or job posting text here..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-2xl px-4 py-3 text-xs font-semibold text-white outline-none resize-none transition-smooth leading-relaxed"
                />
              </div>

              <button
                onClick={runTailoring}
                className="w-full py-3 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-smooth flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Sparkles className="h-4 w-4" /> Run Tailor Comparison
              </button>
            </div>
          </div>

          {/* History Sidebar Panel (4 columns) */}
          <div className="lg:col-span-4">
            <div className="glass-panel border-slate-900 rounded-3xl p-5 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-teal-400" /> Tailoring History
              </h3>
              {tailorHistory.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-900 text-center text-xs text-slate-500 font-semibold">
                  No past tailoring sessions found.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1 no-scrollbar">
                  {tailorHistory.map((item, idx) => (
                    <div 
                      key={item.id || idx} 
                      className="p-3 rounded-xl bg-slate-950 border border-slate-900 space-y-1.5 text-xs hover:border-teal-500/30 transition-smooth cursor-pointer"
                      onClick={() => {
                        setOptimizedResumeText(item.optimizedText);
                        setMatchPercent(item.matchPercent);
                        setRoleFitConfidence(item.roleFitConfidence !== undefined ? item.roleFitConfidence : item.matchPercent);
                        setMatchedKeywords(item.matchedKeywords || []);
                        setMissingKeywords(item.missingKeywords || []);
                        setScoreBreakdown(item.scoreBreakdown || {
                          skills: item.matchPercent,
                          experience: 70,
                          projects: 75,
                          certifications: 50,
                          education: 80
                        });
                        setTailoringPhase('results');
                      }}
                    >
                      <div className="flex justify-between items-center font-bold text-slate-200">
                        <span className="truncate max-w-[70%]">{item.jobTitle}</span>
                        <span className={`${item.matchPercent >= 80 ? 'text-emerald-400' : item.matchPercent >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {item.matchPercent}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold font-mono">
                        <span>Tailored Optimization</span>
                        <span>
                          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: COMPARISON LOADING */}
      {tailoringPhase === 'analyzing' && (
        <div className="glass-panel border-slate-950/20 bg-slate-950/40 rounded-3xl p-12 max-w-sm mx-auto text-center space-y-6 flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full" />
          <div className="space-y-1.5">
            <h3 className="font-bold text-white text-base">Aligning Core Keywords</h3>
            <p className="text-xs text-slate-400">Comparing profile terms against job benchmarks...</p>
          </div>
        </div>
      )}

      {/* PHASE 3: TAILORED RESULTS */}
      {tailoringPhase === 'results' && (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
          {/* Overview scorecard grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-panel border-slate-900 rounded-2xl p-5 flex flex-col space-y-4">
              <div className="flex flex-col items-center text-center space-y-2 pb-3 border-b border-slate-900/60">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Job Match Index</span>
                <span className={`text-4xl font-extrabold ${matchPercent >= 80 ? 'text-emerald-400' : matchPercent >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {matchPercent}%
                </span>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${matchPercent >= 80 ? 'bg-emerald-500' : matchPercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: `${matchPercent}%` }} 
                  />
                </div>
              </div>

              {/* Role-Fit Confidence */}
              <div className="flex flex-col items-center text-center space-y-1.5 pb-2 border-b border-slate-900/60">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Role-Fit Confidence</span>
                <span className={`text-2xl font-extrabold ${roleFitConfidence >= 75 ? 'text-emerald-400' : roleFitConfidence >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {roleFitConfidence}%
                </span>
                <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${roleFitConfidence >= 75 ? 'bg-emerald-500' : roleFitConfidence >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: `${roleFitConfidence}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">ATS Score Breakdown</span>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300">
                    <span>Skills Match (50%)</span>
                    <span>{scoreBreakdown.skills}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${scoreBreakdown.skills}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300">
                    <span>Projects Match (20%)</span>
                    <span>{scoreBreakdown.projects}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${scoreBreakdown.projects}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300">
                    <span>Work Experience (15%)</span>
                    <span>{scoreBreakdown.experience}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${scoreBreakdown.experience}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300">
                    <span>Education Relevance (8%)</span>
                    <span>{scoreBreakdown.education}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${scoreBreakdown.education}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300">
                    <span>Certifications (7%)</span>
                    <span>{scoreBreakdown.certifications}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${scoreBreakdown.certifications}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel border-slate-900 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Matched Keywords ({matchedKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1 no-scrollbar pt-1">
                {matchedKeywords.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No matching keywords.</span>
                ) : (
                  matchedKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                      {kw}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="glass-panel border-slate-900 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="h-4 w-4" /> Gaps Identified ({missingKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1 no-scrollbar pt-1">
                {missingKeywords.length === 0 ? (
                  <span className="text-xs text-slate-400 font-semibold italic">Complete keyword coverage!</span>
                ) : (
                  missingKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-400">
                      {kw}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Detailed Optimizations view */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-teal-400" /> ATS Optimized Text
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                Review your optimized resume. We have seamlessly injected matching skills and keywords to align with the job specifications.
              </p>
              <textarea 
                value={optimizedResumeText}
                readOnly
                rows={12}
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-300 outline-none resize-none leading-relaxed select-all"
              />
            </div>

            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base">Key Optimization Suggestions</h3>
                <div className="space-y-3">
                  {missingKeywords.length > 0 ? (
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/25 space-y-2">
                      <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4" /> Inject missing terms
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        To pass primary automated screening, integrate terms like {missingKeywords.slice(0, 3).map(k => `"${k}"`).join(', ')} directly into your experience bullet points.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/25 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Perfect keyword match
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Your resume contains 100% of the core competencies highlighted in this job description.
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 space-y-2">
                    <h4 className="text-xs font-bold text-white">Adjust Formatting Parameters</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Ensure your resume avoids columns, tables, or non-traditional icons when submitting online to ensure perfect parsing accuracy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-900/40">
                <button
                  onClick={() => setTailoringPhase('input')}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-smooth cursor-pointer"
                >
                  Tailor Another
                </button>
                <Link
                  href="/dashboard/resume-analyzer"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-smooth flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  Test on ATS Auditor <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
