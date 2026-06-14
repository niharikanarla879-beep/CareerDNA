'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { targetCareers } from '@/lib/constants';
import { 
  ArrowLeft, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Award,
  Play,
  RotateCcw,
  BookOpen,
  UserCheck,
  TrendingUp
} from 'lucide-react';

import { interviewQuestionsDb, QuestionDef } from '@/lib/interview-questions';


export default function InterviewCoach() {
  const { user } = useAuth();
  const { targetCareerId, setTargetCareerId } = useResume();
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [qType, setQType] = useState<'technical' | 'hr' | 'scenario'>('technical');
  const [sessionPhase, setSessionPhase] = useState<'setup' | 'active' | 'summary'>('setup');
  
  // Interview runtime state
  const [activeQuestions, setActiveQuestions] = useState<QuestionDef[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [grades, setGrades] = useState<Record<string, { score: number; feedback: string; ideal: string; missed: string[] }>>({});
  const [sessionAvgScore, setSessionAvgScore] = useState<number>(0);
  
  // History state
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);

  const targetCareer = targetCareerId || 'swe';

  useEffect(() => {
    if (!user) return;

    // Load interview history safely
    try {
      const historyRaw = localStorage.getItem(`careerdna_interview_history_${user.id}`);
      if (historyRaw) {
        const parsed = JSON.parse(historyRaw);
        if (Array.isArray(parsed)) {
          setSessionHistory(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading interview history safely:', e);
    }
  }, [user]);

  const startSession = () => {
    // Load matching questions directly from DB based on role, type, and difficulty
    const roleDb = interviewQuestionsDb[targetCareer] || interviewQuestionsDb['swe'];
    const typeDb = roleDb[qType] || roleDb['technical'];
    const baseQuestions = typeDb[difficulty] || typeDb['intermediate'];

    setActiveQuestions(baseQuestions);
    setCurrentQIndex(0);
    setUserAnswers({});
    setGrades({});
    setSessionAvgScore(0);
    setSessionPhase('active');
  };

  const submitAnswer = (answerText: string) => {
    if (!answerText.trim()) {
      alert('Please write an answer before submitting.');
      return;
    }

    const currentQ = activeQuestions[currentQIndex];
    const ansLower = answerText.toLowerCase();

    // Grade answer based on keyword matches
    const matched: string[] = [];
    const missed: string[] = [];

    currentQ.idealAnswerKeys.forEach(key => {
      if (ansLower.includes(key.toLowerCase())) {
        matched.push(key);
      } else {
        missed.push(key);
      }
    });

    const matchesCount = matched.length;
    const baseScore = currentQ.idealAnswerKeys.length > 0 
      ? (matchesCount / currentQ.idealAnswerKeys.length) * 100 
      : 50;

    // Word count bonus
    const words = answerText.split(/\s+/).filter(w => w.length > 0);
    const wordBonus = Math.min(15, Math.floor(words.length / 5)); // Reward detailed descriptions

    const finalScore = Math.min(100, Math.round(baseScore + wordBonus));

    // Construct grade response
    const feedback = finalScore >= 80 
      ? 'Excellent answer! You hit the core technical requirements and explained the concepts thoroughly.' 
      : finalScore >= 50 
      ? 'Solid response, but missing some key concepts. To optimize this response, try to elaborate on the details below.' 
      : 'Under-developed response. Be sure to reference structural definitions and explain how they operate.';

    const updatedAnswers = { ...userAnswers, [currentQ.id]: answerText };
    setUserAnswers(updatedAnswers);

    const updatedGrades = {
      ...grades,
      [currentQ.id]: {
        score: finalScore,
        feedback,
        ideal: currentQ.suggestedAnswer,
        missed
      }
    };
    setGrades(updatedGrades);
  };

  const nextQuestion = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate overall session average score
      let scoreSum = 0;
      activeQuestions.forEach(q => {
        scoreSum += grades[q.id]?.score || 0;
      });
      const avgScore = Math.round(scoreSum / activeQuestions.length);
      setSessionAvgScore(avgScore);
 
      // Save session result to local storage history safely
      if (user) {
        let history = [];
        try {
          const historyRaw = localStorage.getItem(`careerdna_interview_history_${user.id}`);
          if (historyRaw) {
            const parsed = JSON.parse(historyRaw);
            if (Array.isArray(parsed)) {
              history = parsed;
            }
          }
        } catch (e) {
          console.error('Error parsing interview history:', e);
        }
 
        const sessionResult = {
          id: Math.random().toString(36).substring(2, 11),
          timestamp: new Date().toISOString(),
          roleId: targetCareer,
          difficulty,
          type: qType,
          score: avgScore
        };
        const updatedHistory = [sessionResult, ...history];
        localStorage.setItem(`careerdna_interview_history_${user.id}`, JSON.stringify(updatedHistory));
        setSessionHistory(updatedHistory);
        
        // Dispatch event to update overall DNA Score
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('careerdna_resume_sync'));
      }
 
      setSessionPhase('summary');
    }
  };

  if (!user) return null;

  const currentQuestion = activeQuestions[currentQIndex];
  const activeGrade = currentQuestion ? grades[currentQuestion.id] : null;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Video className="h-6 w-6 text-indigo-400" /> AI Interview Coach
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete mock interviews. Practice technical, HR, and behavioral scenario questions.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* INTERVIEW COACH INTERFACE WORKSPACE */}
        <div className="lg:col-span-8">
          {sessionPhase === 'setup' && (
            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-bold text-white text-base">Configure Mock Interview Session</h3>
                <p className="text-xs text-slate-400">
                  Select your interview targets to customize your questions.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Target Role</label>
                  <select 
                    value={targetCareer}
                    onChange={(e) => setTargetCareerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
                  >
                    {targetCareers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Question Type</label>
                  <select 
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
                  >
                    <option value="technical">Technical Focus</option>
                    <option value="hr">HR / Behavioral</option>
                    <option value="scenario">Scenario-Based Case</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Difficulty Level</label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
                  >
                    <option value="beginner">Beginner (Foundational)</option>
                    <option value="intermediate">Intermediate (L4/L5)</option>
                    <option value="advanced">Advanced (Staff/Architect)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={startSession}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 transition-smooth flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Start Practice Interview
              </button>
            </div>
          )}

          {sessionPhase === 'active' && currentQuestion && (
            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-5">
              {/* Question card header */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-mono">
                  Question {currentQIndex + 1} of {activeQuestions.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 font-mono font-bold uppercase">
                  {difficulty}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900">
                <h3 className="font-bold text-white text-sm leading-relaxed">{currentQuestion.question}</h3>
              </div>

              {/* Answer input/results workspace */}
              {!activeGrade ? (
                <div className="space-y-4">
                  <textarea
                    rows={6}
                    placeholder="Type your structured answer here. Include specific technologies, processes, and trade-offs where applicable..."
                    id={`answer_input_${currentQuestion.id}`}
                    className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-2xl px-4 py-3 text-xs font-semibold text-white outline-none resize-none leading-relaxed"
                  />
                  
                  <button
                    onClick={() => {
                      const input = document.getElementById(`answer_input_${currentQuestion.id}`) as HTMLTextAreaElement;
                      submitAnswer(input.value);
                    }}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-smooth flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Grade My Response
                  </button>
                </div>
              ) : (
                <div className="space-y-5 animate-fade-in">
                  {/* Grade Scorecard */}
                  <div className="grid sm:grid-cols-4 gap-4">
                    <div className="glass-panel border-slate-900 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Grading</span>
                      <span className={`text-xl font-extrabold ${activeGrade.score >= 80 ? 'text-emerald-400' : activeGrade.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {activeGrade.score}/100
                      </span>
                    </div>

                    <div className="sm:col-span-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs flex items-center text-slate-300">
                      {activeGrade.feedback}
                    </div>
                  </div>

                  {/* Ideal answers and keys */}
                  <div className="space-y-3 pt-2">
                    {activeGrade.missed.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Missed Core Concepts
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {activeGrade.missed.map((key, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold text-rose-400">
                              {key}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Ideal Answer Outline
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 border border-slate-900 p-3 rounded-xl text-justify font-serif italic">
                        {activeGrade.ideal}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={nextQuestion}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-smooth flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {currentQIndex < activeQuestions.length - 1 ? 'Next Question' : 'Finish Session'} <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {sessionPhase === 'summary' && (
            <div className="glass-panel border-indigo-500/10 rounded-3xl p-6 text-center space-y-6 flex flex-col items-center justify-center min-h-[350px]">
              <div className="flex flex-col items-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-md">
                  <Award className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="font-bold text-white text-lg">Interview Session Completed</h3>
                <p className="text-xs text-slate-400 leading-normal max-w-sm">
                  Review your results, grades, and suggested responses below. Track your progression scores in the History panel.
                </p>
              </div>

              {/* Score card indicators */}
              <div className="grid sm:grid-cols-2 gap-4 w-full text-left">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Session Score</span>
                  <span className={`text-3xl font-extrabold ${sessionAvgScore >= 80 ? 'text-emerald-400' : sessionAvgScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {sessionAvgScore}%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center text-xs text-slate-300">
                  {sessionAvgScore >= 80 
                    ? 'Excellent preparation! You demonstrated command of technical terminology, structure, and impact goals.' 
                    : sessionAvgScore >= 50 
                    ? 'Solid foundation. Focus on integrating more specific frameworks, trade-offs, and metrics in your answers.' 
                    : 'Significant preparation gaps. Review targeted topics, key syntax configurations, and practice structured explanations.'}
                </div>
              </div>

              {/* Question list review */}
              <div className="w-full text-left space-y-4 pt-4 border-t border-slate-900">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Question-by-Question Scorecard</h4>
                <div className="space-y-3">
                  {activeQuestions.map((q) => {
                    const grade = grades[q.id];
                    if (!grade) return null;
                    return (
                      <div key={q.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 space-y-3 animate-fade-in">
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="font-bold text-slate-200 text-xs leading-relaxed">{q.question}</h5>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                            grade.score >= 80 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : grade.score >= 50 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {grade.score}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{grade.feedback}</p>
                        {grade.missed.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            <span className="text-[9px] text-rose-400 font-bold self-center">Missed keys:</span>
                            {grade.missed.map((m, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-rose-500/10 text-[9px] font-mono text-rose-400">
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="pt-2 border-t border-slate-900/60 space-y-1">
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Ideal Answer Outline:</span>
                          <p className="text-[11px] text-slate-300 italic font-serif leading-relaxed text-justify">{grade.ideal}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setSessionPhase('setup')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 transition-smooth flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Start New Session
              </button>
            </div>
          )}
        </div>

        {/* INTERVIEW HISTORY TRACK PANEL */}
        <div className="lg:col-span-4">
          <div className="glass-panel border-slate-900 rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-400" /> History Tracking
            </h3>
            
            {sessionHistory.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-900 text-center text-xs text-slate-500 font-semibold">
                No mock sessions logged yet.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                {sessionHistory.map((session) => (
                  <div 
                    key={session.id} 
                    className="p-3 rounded-xl bg-slate-950 border border-slate-900 space-y-1.5 text-xs"
                  >
                    <div className="flex justify-between items-center font-bold text-slate-200">
                      <span className="capitalize">{session.type} Practice</span>
                      <span className={`${session.score >= 80 ? 'text-emerald-400' : session.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {session.score}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold font-mono">
                      <span>{targetCareers.find(c => c.id === session.roleId)?.name || session.roleId} ({session.difficulty})</span>
                      <span className="text-[9px] text-slate-500">
                        {new Date(session.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
