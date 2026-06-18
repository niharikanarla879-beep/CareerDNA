'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { validateResume } from '@/lib/analyzer';
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
  AlertTriangle,
  HelpCircle,
  Info,
  Clock,
  Check,
  Shield
} from 'lucide-react';

export default function ScoreEnginePage() {
  const { user } = useAuth();
  const { scores, latestResume, certs, projects, assessment, interviewHistory, roadmapProgress } = useResume();

  if (!user) return null;

  const getAuditRawValue = (id: string) => {
    if (typeof window === 'undefined') return 'Loading...';
    const keyMap: Record<string, string> = {
      assessment: `careerdna_assessment_${user.id}`,
      resume: `careerdna_resume_history_${user.id}`,
      projects: `careerdna_projects_${user.id}`,
      certs: `careerdna_certs_${user.id}`,
      interview: `careerdna_interview_history_${user.id}`,
      roadmap: `careerdna_resume_history_${user.id}`
    };
    const key = keyMap[id];
    return localStorage.getItem(key) || 'null (Not created in storage)';
  };

  const auditTraces = React.useMemo(() => {
    const list = [];
    
    // 1. Assessment
    let assessmentComplete = false;
    let assessmentReason = '';
    if (!assessment) {
      assessmentReason = "Failed: No assessment records exist in storage.";
    } else if (!assessment.taken) {
      assessmentReason = "Failed: Assessment 'taken' status flag is false.";
    } else if (assessment.isDemo) {
      assessmentReason = "Failed: Seeded demo assessment detected. Explicit user submission is required.";
    } else {
      assessmentComplete = true;
      assessmentReason = "Passed: Explicit user diagnostic assessment submitted successfully.";
    }
    list.push({
      id: 'assessment',
      name: 'Career Assessment',
      key: `careerdna_assessment_${user.id}`,
      completed: assessmentComplete,
      reason: assessmentReason,
      raw: getAuditRawValue('assessment')
    });

    // 2. ATS Resume
    let resumeComplete = false;
    let resumeReason = '';
    const resumeVal = latestResume ? validateResume(latestResume.text) : null;
    if (!latestResume) {
      resumeReason = "Failed: No resume uploaded in database history.";
    } else if (latestResume.isDemo) {
      resumeReason = "Failed: Seeded demo resume detected. Resume must be explicitly uploaded by user.";
    } else if (!resumeVal || resumeVal.confidence < 50) {
      resumeReason = `Failed: Resume validation confidence score is insufficient (${resumeVal?.confidence || 0}% < 50%).`;
    } else {
      resumeComplete = true;
      resumeReason = `Passed: Valid user-uploaded resume exists with ${resumeVal.confidence}% validation confidence.`;
    }
    list.push({
      id: 'resume',
      name: 'ATS Resume Auditor',
      key: `careerdna_resume_history_${user.id}`,
      completed: resumeComplete,
      reason: resumeReason,
      raw: getAuditRawValue('resume')
    });

    // 3. Projects
    let projectsComplete = false;
    let projectsReason = '';
    const userProjects = projects.filter(p => p.isDemo !== true);
    const verifiedUserProjects = userProjects.filter(p => p.isGithubVerified || p.isOfflineVerified);
    if (projects.length === 0) {
      projectsReason = "Failed: Portfolio projects list is empty.";
    } else if (userProjects.length === 0) {
      projectsReason = "Failed: Only seeded demo projects exist. User must manually add a project.";
    } else if (verifiedUserProjects.length === 0) {
      projectsReason = "Failed: User added project(s), but none have passed verification gates (GitHub/Offline).";
    } else {
      projectsComplete = true;
      projectsReason = `Passed: Manually added verified project exists (${verifiedUserProjects[0].title}).`;
    }
    list.push({
      id: 'projects',
      name: 'Portfolio Projects',
      key: `careerdna_projects_${user.id}`,
      completed: projectsComplete,
      reason: projectsReason,
      raw: getAuditRawValue('projects')
    });

    // 4. Certifications
    let certsComplete = false;
    let certsReason = '';
    const userCerts = certs.filter(c => c.isDemo !== true);
    if (certs.length === 0) {
      certsReason = "Failed: Certifications ledger is empty.";
    } else if (userCerts.length === 0) {
      certsReason = "Failed: Only seeded demo certifications exist in ledger.";
    } else {
      certsComplete = true;
      certsReason = `Passed: Manually logged certification exists (${userCerts[0].name}).`;
    }
    list.push({
      id: 'certs',
      name: 'Certifications Ledger',
      key: `careerdna_certs_${user.id}`,
      completed: certsComplete,
      reason: certsReason,
      raw: getAuditRawValue('certs')
    });

    // 5. Interview
    let interviewComplete = false;
    let interviewReason = '';
    const userInterviews = interviewHistory.filter(s => s.isDemo !== true);
    if (interviewHistory.length === 0) {
      interviewReason = "Failed: No mock speech sessions logged in history.";
    } else if (userInterviews.length === 0) {
      interviewReason = "Failed: Only seeded demo mock sessions exist.";
    } else {
      interviewComplete = true;
      interviewReason = `Passed: User completed a speech mock interview trial successfully.`;
    }
    list.push({
      id: 'interview',
      name: 'AI Interview Coach',
      key: `careerdna_interview_history_${user.id}`,
      completed: interviewComplete,
      reason: interviewReason,
      raw: getAuditRawValue('interview')
    });

    // 6. Roadmap
    let roadmapComplete = false;
    let roadmapReason = '';
    if (!latestResume) {
      roadmapReason = "Failed: No resume exists to generate roadmap from.";
    } else if (latestResume.isDemo) {
      roadmapReason = "Failed: Generated from seeded demo resume. Valid user resume required.";
    } else if (!resumeVal || resumeVal.confidence < 50) {
      roadmapReason = "Failed: Resume is invalid, roadmap cannot be generated.";
    } else {
      roadmapComplete = true;
      roadmapReason = "Passed: Roadmap generated from validated user resume.";
    }
    list.push({
      id: 'roadmap',
      name: 'Skill Gap Roadmap',
      key: `careerdna_resume_history_${user.id}`,
      completed: roadmapComplete,
      reason: roadmapReason,
      raw: getAuditRawValue('roadmap')
    });

    return list;
  }, [assessment, latestResume, projects, certs, interviewHistory, user.id]);

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
          
          {/* Separated Score Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            
            {/* ATS Resume Score Card */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 relative overflow-hidden bg-slate-950/40 flex flex-col justify-between min-h-[200px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Resume Parsing Audit</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">Module 2/6</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">ATS Resume Auditor Score</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculated by analyzing formatting parameters, structure hierarchy, and critical keyword densities in your active uploaded resume.
                </p>
              </div>
              
              <div className="flex items-center gap-6 mt-6 border-t border-slate-900/60 pt-4">
                {/* Score Indicator Ring */}
                <div className="h-20 w-20 relative flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="stroke-slate-900"
                      strokeWidth="2.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`transition-smooth stroke-current text-emerald-400`}
                      strokeWidth="2.8"
                      strokeDasharray={`${latestResume ? scores.resumeScore : 0}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex items-center justify-center">
                    <span className="text-xl font-extrabold text-white font-mono">{latestResume ? scores.resumeScore : 'N/A'}</span>
                    {latestResume && <span className="text-[9px] text-slate-500 font-bold uppercase mt-1">%</span>}
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <span className="text-slate-500 font-bold uppercase">ATS Audit Status</span>
                  <p className="text-white font-bold">
                    {latestResume ? 'Resume Scanned & Active' : 'No Active Resume Uploaded'}
                  </p>
                  <Link href="/dashboard/resume-analyzer" className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-0.5">
                    Go to Resume Auditor <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* CareerDNA Consolidated Score Card */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 relative overflow-hidden bg-slate-950/40 flex flex-col justify-between min-h-[200px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    <Dna className="h-3.5 w-3.5" />
                    <span>Consolidated Rating</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${
                    scores.profileCompletionPercent === 100 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {scores.profileCompletionPercent === 100 ? 'Final Verified Score' : 'Preliminary Score'}
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-white flex items-center gap-1.5">
                  {scores.profileCompletionPercent < 100 ? 'CareerDNA Preliminary Score' : 'CareerDNA Score'}
                  {/* Tooltip Popup */}
                  <div className="relative inline-block cursor-help group">
                    <HelpCircle className="h-4 w-4 text-slate-500 hover:text-white transition-smooth" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-950 border border-slate-850 text-[10px] text-slate-300 font-normal leading-relaxed rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 normal-case">
                      <span className="font-bold text-white block mb-1">Score Calculation Method:</span>
                      Weighted average of completed modules only.
                      <code className="text-indigo-400 block my-1 font-mono">DnaScore = Sum(Module Score * Weight) / Sum(Weights)</code>
                      This normalization ensures pending modules do not act as 0-points penalty, showing active candidate strength immediately. Complete all modules for a fully verified score.
                    </div>
                  </div>
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consolidated candidate competitiveness score. Evaluated across assessments, portfolio projects, certificates, roadmaps, and mock interviews.
                </p>
              </div>

              <div className="flex items-center gap-6 mt-6 border-t border-slate-900/60 pt-4">
                {/* Score Indicator Ring */}
                <div className="h-20 w-20 relative flex items-center justify-center shrink-0">
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
                  <div className="absolute flex items-center justify-center">
                    <span className="text-xl font-extrabold text-white font-mono">{scores.finalDnaScore}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase mt-1">/100</span>
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <span className="text-slate-500 font-bold uppercase">Consolidated Level</span>
                  <p className="text-white font-bold text-sm">
                    {scores.finalDnaScore >= 80 ? 'Highly Competitive' : 'Developing Profile'}
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    Excluded pending modules from drag penalization.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Profile Completion, Confidence & Disclaimer Panel */}
          <div className="glass-panel border-slate-900 rounded-3xl p-5 md:p-6 bg-slate-950/30 space-y-5 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Profile Completion details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Profile Completion Progress</span>
                  <span className="text-white font-bold font-mono">{scores.profileCompletionPercent}% ({scores.completedModulesCount}/6 modules completed)</span>
                </div>
                {/* Completion progress bar */}
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-teal-400 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${scores.profileCompletionPercent}%` }} 
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-500 font-bold uppercase">Confidence Level</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black border ${
                    scores.confidenceLevel === 'VERIFIED'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : scores.confidenceLevel === 'HIGH'
                      ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                      : scores.confidenceLevel === 'MEDIUM'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  }`}>
                    {scores.confidenceLevel === 'VERIFIED' ? 'VERIFIED FINAL' : scores.confidenceLevel}
                  </span>
                </div>
              </div>

              {/* Disclaimer block & dynamic alert message */}
              <div className="flex flex-col justify-center">
                {scores.profileCompletionPercent < 100 ? (
                  <div className="p-3.5 bg-amber-500/[0.02] border border-amber-500/10 rounded-2xl flex gap-2.5 items-start">
                    <Info className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      This is a preliminary score based on completed modules only. Complete additional modules for a more accurate CareerDNA Score.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl flex gap-2.5 items-start">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      All assessments and evaluation gates are completed. Your score is now fully verified.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Modules Completed & Pending Status Lists */}
            <div className="border-t border-slate-900/60 pt-4 grid sm:grid-cols-2 gap-6 text-xs leading-normal">
              
              {/* Completed Modules List */}
              <div className="space-y-2">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Modules Completed ({scores.completedModulesCount}/6)</span>
                {scores.completedModulesCount === 0 ? (
                  <p className="text-slate-500 italic text-[11px]">No modules completed yet.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {[
                      { key: 'assessment', label: 'Career Assessment (25% weight)', completed: assessment?.taken === true },
                      { key: 'resume', label: 'ATS Resume Auditor (20% weight)', completed: latestResume !== null },
                      { key: 'projects', label: 'Verified Projects (15% weight)', completed: projects.length >= 1 },
                      { key: 'certs', label: 'Certifications Ledger (10% weight)', completed: certs.length >= 1 },
                      { key: 'interview', label: 'Interview Simulator (20% weight)', completed: interviewHistory.length >= 1 },
                      { key: 'roadmap', label: 'Skill Gap roadmaps (10% weight)', completed: Object.values(roadmapProgress).some(v => v === true) || scores.roadmapProgressPercent > 0 }
                    ].filter(m => m.completed).map((m, idx) => (
                      <li key={idx} className="flex gap-2 items-center text-slate-300 text-[11px]">
                        <Check className="h-3.5 w-3.5 text-emerald-400 bg-emerald-500/10 p-0.5 rounded-full border border-emerald-500/20 shrink-0" />
                        <span>{m.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Pending Modules List */}
              <div className="space-y-2">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Modules Pending ({6 - scores.completedModulesCount}/6)</span>
                {6 - scores.completedModulesCount === 0 ? (
                  <p className="text-emerald-400 font-bold text-[11px]">All modules completed! Excellent.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {[
                      { key: 'assessment', label: 'Career Assessment (25% weight)', completed: assessment?.taken === true },
                      { key: 'resume', label: 'ATS Resume Auditor (20% weight)', completed: latestResume !== null },
                      { key: 'projects', label: 'Verified Projects (15% weight)', completed: projects.length >= 1 },
                      { key: 'certs', label: 'Certifications Ledger (10% weight)', completed: certs.length >= 1 },
                      { key: 'interview', label: 'Interview Simulator (20% weight)', completed: interviewHistory.length >= 1 },
                      { key: 'roadmap', label: 'Skill Gap roadmaps (10% weight)', completed: Object.values(roadmapProgress).some(v => v === true) || scores.roadmapProgressPercent > 0 }
                    ].filter(m => !m.completed).map((m, idx) => (
                      <li key={idx} className="flex gap-2 items-center text-slate-400 text-[11px]">
                        <Clock className="h-3.5 w-3.5 text-amber-500 bg-amber-500/10 p-0.5 rounded-full border border-amber-500/20 shrink-0" />
                        <span>{m.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>

          {/* Dedicated Judges Explanation Section */}
          <div className="glass-panel border-amber-500/20 bg-amber-500/[0.02] rounded-3xl p-5 md:p-6 space-y-4 relative z-10">
            <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <Shield className="h-4.5 w-4.5" />
              <span>Redrob Pitch Portal: Score Engine Normalization Audit</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Why is the CareerDNA Score high even when some modules are pending?</strong>
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Traditional scores treat uncompleted categories as 0%, which would drag down a candidate's score (e.g. from 81% down to 16% if only the resume is uploaded). This penalizes users for unstarted modules. 
              <br /><br />
              Instead, CareerDNA uses a <strong>dynamic weight normalization algorithm</strong>. It calculates the weighted average of <em>only the completed modules</em>:
            </p>
            <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-2xl font-mono text-[10px] text-slate-300 space-y-2">
              <div className="font-bold text-white uppercase text-[9px] tracking-wider text-slate-500">Telemetry Calculation Math:</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>Completed Weights Sum: <strong>{scores.completedWeightsSum.toFixed(2)}</strong></span>
                <span>Profile Completion: <strong>{scores.profileCompletionPercent}%</strong></span>
                <span>Active Confidence: <strong className="text-amber-400">{scores.confidenceLevel}</strong></span>
              </div>
              <div className="border-t border-slate-900 pt-2 font-bold text-indigo-400 text-xs">
                Score Formula: ({scores.finalDnaScore}) = (Sum of Active Weighted Points) / ({scores.completedWeightsSum.toFixed(2)})
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              This layout guarantees that candidates can see immediate audit signals from their uploaded resumes and assessments, while the "Preliminary Score" badge and "LOW/MEDIUM Confidence" tags clearly communicate profile completion progress to recruiters and judges.
            </p>
          </div>

          {/* Skill Gap Penalty Alert */}
          {scores.skillGapPenalty > 0 && (
            <div className="glass-panel border-rose-500/20 bg-rose-500/5 p-4 rounded-2xl flex items-center justify-between gap-3 animate-fade-in relative z-10">
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
              <span className="text-sm font-extrabold font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 shrink-0">
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

      {/* Dynamic Debug Audit Panel */}
      <div className="glass-panel border-amber-500/20 bg-slate-950/60 rounded-3xl p-6 border-t-4 border-t-amber-500 space-y-4 max-w-6xl mx-auto shadow-2xl relative z-10 mt-8">
        <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">CareerDNA Completion Engine: Debug Audit Panel</h3>
            <p className="text-[10px] text-slate-500 font-medium">Underlying storage keys, validation states, and manual user activity verification flags</p>
          </div>
        </div>

        <div className="space-y-4">
          {auditTraces.map((trace) => (
            <div key={trace.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 flex flex-col md:flex-row justify-between gap-4 text-xs">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{trace.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                    trace.completed 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {trace.completed ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium font-mono">
                  Storage Key: <span className="text-indigo-400">{trace.key}</span>
                </div>
                <div className={`text-[11px] font-bold ${trace.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                  Trace Reason: {trace.reason}
                </div>
              </div>

              {/* Raw JSON Value box */}
              <div className="md:w-96 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Raw Persistent Value</span>
                <div className="bg-slate-900/80 border border-slate-900 rounded-xl p-2.5 font-mono text-[9px] text-slate-400 max-h-[80px] overflow-y-auto overflow-x-hidden leading-normal text-justify">
                  {trace.raw}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
