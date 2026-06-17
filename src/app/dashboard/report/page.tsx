'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { targetCareers } from '@/lib/constants';
import { 
  ArrowLeft, 
  Printer, 
  Dna, 
  FileText, 
  Award, 
  CheckCircle2, 
  Compass, 
  Clock, 
  Video, 
  GitFork,
  AlertTriangle
} from 'lucide-react';

export default function CompleteReportPage() {
  const { user } = useAuth();
  const { 
    latestResume, 
    assessment, 
    projects, 
    certs, 
    interviewHistory,
    targetCareerId,
    scores 
  } = useResume();

  const [mounted, setMounted] = useState(false);
  const [reportId, setReportId] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setReportId(Math.floor(100000 + Math.random() * 900000));
  }, []);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Clock className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-sm mt-4">Generating report ledger...</p>
      </div>
    );
  }

  const selectedCareer = targetCareers.find(c => c.id === targetCareerId) || targetCareers[0];

  // Helper to calculate project counts & metrics
  const resumeScore = latestResume?.result.score || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 print:bg-white print:text-slate-950 print:p-0">
      
      {/* HEADER CONTROL BAR */}
      <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-slate-900 pb-5 mb-8 print-hide">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" /> Complete Career Report
          </h1>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-smooth shadow-lg shadow-indigo-600/10 cursor-pointer"
        >
          <Printer className="h-4 w-4" /> Print / Export PDF Report
        </button>
      </div>

      {/* REPORT CONTENT CANVAS */}
      <div className="max-w-4xl mx-auto bg-slate-950/45 border border-slate-900 rounded-3xl p-6 sm:p-10 space-y-8 print:bg-white print:border-0 print:p-0 print:rounded-none">
        
        {/* REPORT MAIN HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-900/80 pb-6 print:border-slate-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400">
              <Dna className="h-7 w-7 text-indigo-400 stroke-[2.5]" />
              <span className="font-extrabold text-xl tracking-tight text-white print:text-slate-950">CareerDNA</span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Official Competency Transcript</p>
          </div>
          
          <div className="text-left sm:text-right text-xs text-slate-400 space-y-1 font-mono print:text-slate-600">
            <div><strong className="text-slate-200 print:text-slate-950">Candidate:</strong> {user.firstName} {user.lastName}</div>
            <div><strong className="text-slate-200 print:text-slate-950">Target Job:</strong> {selectedCareer.name}</div>
            <div><strong className="text-slate-200 print:text-slate-950">Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        {/* SECTION 1: GLOBAL SCORES OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel border-indigo-500/10 bg-indigo-500/5 p-6 rounded-2xl text-center flex flex-col justify-between items-center print:border-slate-300 print:bg-transparent">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Overall CareerDNA Rating</span>
            <div className="my-3 font-mono font-extrabold text-5xl text-indigo-400 print:text-indigo-600">{scores.finalDnaScore} <span className="text-xs text-slate-500">/ 100</span></div>
            <p className="text-[10px] text-slate-400 leading-normal">Composite rating of assessments, verified projects, ATS validations, and interview transcripts.</p>
          </div>

          <div className="glass-panel border-slate-900 bg-slate-950/20 p-6 rounded-2xl text-center flex flex-col justify-between items-center print:border-slate-300">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">ATS Resume Audit Score</span>
            <div className="my-3 font-mono font-extrabold text-5xl text-teal-400 print:text-teal-600">{resumeScore || 'N/A'} <span className="text-xs text-slate-500">/ 100</span></div>
            <p className="text-[10px] text-slate-400 leading-normal">Score calculated based on syntax checks, chronological consistency, and keyword coverage metrics.</p>
          </div>

          <div className="glass-panel border-slate-900 bg-slate-950/20 p-6 rounded-2xl text-center flex flex-col justify-between items-center print:border-slate-300">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Job Readiness Alignment</span>
            <div className="my-3 font-mono font-extrabold text-5xl text-purple-400 print:text-purple-600">{scores.jobReadinessScore}%</div>
            <p className="text-[10px] text-slate-400 leading-normal">Calculated keyword mapping matching targets vs current skill profiles, adjusting for roadmap progress.</p>
          </div>
        </div>

        {/* SECTION 2: VOCATIONAL INTERESTS (RIASEC PROFILE) */}
        <div className="space-y-4 border-t border-slate-900/60 pt-6 print:border-slate-300">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 print:text-slate-950">
            <Compass className="h-4 w-4 text-indigo-400" />
            <span>Vocational Profile (RIASEC)</span>
          </h3>
          {assessment?.taken ? (
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {Object.entries(assessment.riasec).map(([trait, value]) => (
                <div key={trait} className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl text-center print:border-slate-300">
                  <div className="text-[10px] font-bold text-slate-400 capitalize">{trait}</div>
                  <div className="text-base font-extrabold text-indigo-400 font-mono mt-1 print:text-indigo-600">{value}%</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Vocational DNA profile has not been generated. Complete the DNA Decoder quiz to seed these interests.</p>
          )}
        </div>

        {/* SECTION 3: ATS RESUME REPORT SUGGESTIONS */}
        <div className="space-y-4 border-t border-slate-900/60 pt-6 print:border-slate-300">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 print:text-slate-950">
            <FileText className="h-4 w-4 text-teal-400" />
            <span>ATS Resume Auditor Insights</span>
          </h3>
          {latestResume ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audit Strengths</span>
                <ul className="space-y-2">
                  {(latestResume.result.strengths || []).slice(0, 3).map((str, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs text-slate-300 print:text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audit Weaknesses & Gaps</span>
                <ul className="space-y-2">
                  {(latestResume.result.weaknesses || []).slice(0, 3).map((weak, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs text-slate-300 print:text-slate-800">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No resume upload history exists. Please complete an ATS analysis to compile these logs.</p>
          )}
        </div>

        {/* SECTION 4: AI INTERVIEW PERFORMANCE SUMMARY */}
        <div className="space-y-4 border-t border-slate-900/60 pt-6 print:border-slate-300">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 print:text-slate-950">
            <Video className="h-4 w-4 text-purple-400" />
            <span>Speech Assessment & Mock Trials</span>
          </h3>
          {interviewHistory.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-slate-900/20 border border-slate-800 rounded-xl text-center print:border-slate-300">
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Technical Ability</div>
                  <div className="text-sm font-bold text-purple-400 print:text-purple-600 mt-1">{interviewHistory[0].technicalScore}%</div>
                </div>
                <div className="p-3 bg-slate-900/20 border border-slate-800 rounded-xl text-center print:border-slate-300">
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Communication</div>
                  <div className="text-sm font-bold text-purple-400 print:text-purple-600 mt-1">{interviewHistory[0].communicationScore}%</div>
                </div>
                <div className="p-3 bg-slate-900/20 border border-slate-800 rounded-xl text-center print:border-slate-300">
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Speech Confidence</div>
                  <div className="text-sm font-bold text-purple-400 print:text-purple-600 mt-1">{interviewHistory[0].confidenceScore}%</div>
                </div>
                <div className="p-3 bg-slate-900/20 border border-slate-800 rounded-xl text-center print:border-slate-300">
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Explanation Clarity</div>
                  <div className="text-sm font-bold text-purple-400 print:text-purple-600 mt-1">{interviewHistory[0].clarityScore}%</div>
                </div>
                <div className="p-3 bg-slate-900/20 border border-slate-800 rounded-xl text-center print:border-slate-300">
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Problem Solving</div>
                  <div className="text-sm font-bold text-purple-400 print:text-purple-600 mt-1">{interviewHistory[0].problemSolvingScore}%</div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-2.5 print:border-slate-300 print:bg-transparent">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Simulator Feedback Highlights</span>
                <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-300 print:text-slate-800">
                  <div>
                    <strong className="text-white print:text-slate-950 block mb-1">Key Strengths:</strong>
                    <ul className="list-disc pl-4 space-y-1">
                      {interviewHistory[0].feedbacks.strengths.slice(0, 2).map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-white print:text-slate-950 block mb-1">Areas for Growth:</strong>
                    <ul className="list-disc pl-4 space-y-1">
                      {interviewHistory[0].feedbacks.improvements.slice(0, 2).map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No mock interview trials have been recorded yet.</p>
          )}
        </div>

        {/* SECTION 5: PORTFOLIO & CERTIFICATIONS */}
        <div className="space-y-4 border-t border-slate-900/60 pt-6 print:border-slate-300">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 print:text-slate-950">
            <Award className="h-4 w-4 text-teal-400" />
            <span>Verified Portfolio & Certifications Ledger</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Projects Log ({projects.length})</span>
              {projects.length > 0 ? (
                <ul className="space-y-2">
                  {projects.map((proj) => (
                    <li key={proj.id} className="p-3 bg-slate-900/20 border border-slate-800 rounded-xl flex justify-between items-center text-xs print:border-slate-300">
                      <div>
                        <div className="font-bold text-slate-200 print:text-slate-950">{proj.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">{proj.tech}</div>
                      </div>
                      <span className="font-mono font-bold text-teal-400 shrink-0">Strength: {proj.strengthScore}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">No portfolio projects logged.</p>
              )}
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Certifications Ledger ({certs.length})</span>
              {certs.length > 0 ? (
                <ul className="space-y-2">
                  {certs.map((cert, idx) => (
                    <li key={idx} className="p-3 bg-slate-900/20 border border-slate-800 rounded-xl text-xs print:border-slate-300 font-medium text-slate-300 print:text-slate-800 flex items-center gap-2">
                      <Award className="h-4 w-4 text-teal-400 shrink-0" />
                      <span>{typeof cert === 'string' ? cert : `${cert.name} (${cert.issuer})`}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">No credentials logged in the ledger.</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 6: SKILL COMPETENCY & ROADMAP LOG */}
        <div className="space-y-4 border-t border-slate-900/60 pt-6 print:border-slate-300">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 print:text-slate-950">
            <GitFork className="h-4 w-4 text-indigo-400" />
            <span>Target Competencies & Skill Gaps</span>
          </h3>
          <div className="space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed print:text-slate-600">
              Below is the comprehensive coverage of required skills for the <strong className="text-white print:text-slate-950">{selectedCareer.name}</strong> role. Gaps are automatically resolved as milestones are completed in candidate learning roadmaps.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {latestResume?.result.detectedSkills?.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 print:border-slate-300 print:text-emerald-700">
                  {skill} (Verified)
                </span>
              ))}
              {scores.missingSkills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 print:border-slate-300 print:text-rose-700">
                  {skill} (Gap Target)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* REPORT FOOTER SIGNATURE */}
        <div className="border-t border-slate-900 pt-6 flex justify-between items-center text-[10px] text-slate-500 font-mono print:border-slate-300">
          <div>Report Identifier: CareerDNA-TR-{reportId || 'PENDING'}</div>
          <div>Page 1 of 1</div>
        </div>

      </div>
    </div>
  );
}
