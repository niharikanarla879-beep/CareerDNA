'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume, InterviewSession } from '@/lib/resume-context';
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
  Volume2,
  Mic,
  MicOff,
  Square,
  VolumeX,
  TrendingUp,
  Info
} from 'lucide-react';
import { interviewQuestionsDb, QuestionDef } from '@/lib/interview-questions';

export default function InterviewCoach() {
  const { user } = useAuth();
  const { targetCareerId, setTargetCareerId, interviewHistory, addInterviewSession } = useResume();
  
  // Setup states
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [qType, setQType] = useState<string>('technical');
  const [sessionPhase, setSessionPhase] = useState<'setup' | 'active' | 'summary' | 'demo-view'>('setup');
  
  // Interview runtime states
  const [activeQuestions, setActiveQuestions] = useState<QuestionDef[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Evaluation grades & transcripts
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [sessionScoreBreakdown, setSessionScoreBreakdown] = useState({
    communication: 0,
    technical: 0,
    confidence: 0,
    clarity: 0,
    problemSolving: 0,
    overall: 0
  });
  
  // Audio Speech APIs
  const [recognition, setRecognition] = useState<any>(null);
  
  const targetCareer = targetCareerId || 'swe';
  const roleName = targetCareers.find(c => c.id === targetCareer)?.name || 'Target Profile';

  // Initialize Speech Recognition API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        
        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setLiveTranscript(finalTranscript + interimTranscript);
        };
        
        rec.onstart = () => {
          setIsListening(true);
          setLiveTranscript('');
        };
        rec.onend = () => setIsListening(false);
        rec.onerror = (e: any) => {
          console.error('Microphone SpeechRecognition error:', e);
          setIsListening(false);
        };
        
        setRecognition(rec);
      }
    }
  }, []);

  // Timer runner
  useEffect(() => {
    if (sessionPhase === 'active') {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionPhase]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (recognition) {
      stopSpeaking();
      try {
        recognition.start();
      } catch (e) {
        console.error('Failed to start SpeechRecognition:', e);
      }
    } else {
      alert('Speech recognition API is not supported in this browser. Please use Chrome or type your answer.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const startSession = () => {
    const roleDb = interviewQuestionsDb[targetCareer] || interviewQuestionsDb['swe'];
    const typeDb = roleDb[qType === 'technical' ? 'technical' : qType === 'hr' ? 'hr' : 'scenario'] || roleDb['technical'];
    const baseQuestions = typeDb[difficulty] || typeDb['intermediate'];

    setActiveQuestions(baseQuestions);
    setCurrentQIndex(0);
    setTranscripts([]);
    setLiveTranscript('');
    setSessionPhase('active');
    
    // Speak first question
    setTimeout(() => {
      speakText(baseQuestions[0].question);
    }, 500);
  };

  const handleNextOrFinish = (typedAnswer: string) => {
    const answer = typedAnswer || liveTranscript;
    if (!answer.trim()) {
      alert('Please speak or type your response before submitting.');
      return;
    }

    stopListening();
    stopSpeaking();

    const currentQ = activeQuestions[currentQIndex];
    const ansLower = answer.toLowerCase();
    
    // Core technical grading matching keys
    const matched: string[] = [];
    const missed: string[] = [];
    currentQ.idealAnswerKeys.forEach(key => {
      if (ansLower.includes(key.toLowerCase())) {
        matched.push(key);
      } else {
        missed.push(key);
      }
    });

    const keyMatchRatio = currentQ.idealAnswerKeys.length > 0
      ? matched.length / currentQ.idealAnswerKeys.length
      : 0.5;

    // Technical score (out of 100)
    const technicalScore = Math.min(100, Math.round(50 + keyMatchRatio * 50));
    
    // Communication & Clarity metrics based on sentence lengths
    const wordCount = answer.split(/\s+/).filter(w => w.length > 0).length;
    const communicationScore = Math.min(100, Math.round(40 + Math.min(60, wordCount * 1.5)));
    const clarityScore = Math.min(100, Math.round(55 + Math.min(45, (matched.length * 8) + (wordCount > 15 ? 10 : 0))));
    const confidenceScore = Math.round(75 + Math.random() * 20); // Simulating speech speed fluency
    const problemSolvingScore = Math.round(65 + keyMatchRatio * 35);

    const questionScore = Math.round(
      (technicalScore * 0.40) +
      (communicationScore * 0.20) +
      (confidenceScore * 0.15) +
      (clarityScore * 0.15) +
      (problemSolvingScore * 0.10)
    );

    const questionGradeFeedback = questionScore >= 80
      ? 'Excellent delivery! You hit the core technical requirements and explained the concepts thoroughly.'
      : questionScore >= 50
      ? 'Solid response, but missing some key concepts. Try to elaborate on the details below.'
      : 'Under-developed response. Be sure to reference structural definitions and explain how they operate.';

    const newTranscriptItem = {
      question: currentQ.question,
      answer: answer.trim(),
      score: questionScore,
      feedback: questionGradeFeedback,
      ideal: currentQ.suggestedAnswer,
      missed
    };

    const updatedTranscripts = [...transcripts, newTranscriptItem];
    setTranscripts(updatedTranscripts);
    setLiveTranscript('');

    if (currentQIndex < activeQuestions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      // Speak next question
      setTimeout(() => {
        speakText(activeQuestions[nextIdx].question);
      }, 800);
    } else {
      // Calculate overall session average score
      const sumCom = updatedTranscripts.reduce((acc, c) => acc + communicationScore, 0);
      const sumTech = updatedTranscripts.reduce((acc, c) => acc + technicalScore, 0);
      const sumConf = updatedTranscripts.reduce((acc, c) => acc + confidenceScore, 0);
      const sumClarity = updatedTranscripts.reduce((acc, c) => acc + clarityScore, 0);
      const sumSolve = updatedTranscripts.reduce((acc, c) => acc + problemSolvingScore, 0);
      const sumOverall = updatedTranscripts.reduce((acc, c) => acc + c.score, 0);

      const count = updatedTranscripts.length;
      const breakdown = {
        communication: Math.round(sumCom / count),
        technical: Math.round(sumTech / count),
        confidence: Math.round(sumConf / count),
        clarity: Math.round(sumClarity / count),
        problemSolving: Math.round(sumSolve / count),
        overall: Math.round(sumOverall / count)
      };

      setSessionScoreBreakdown(breakdown);

      // Save to global context
      const newSessionResult: InterviewSession = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        roleId: targetCareer,
        difficulty,
        type: qType,
        score: breakdown.overall,
        communicationScore: breakdown.communication,
        technicalScore: breakdown.technical,
        confidenceScore: breakdown.confidence,
        clarityScore: breakdown.clarity,
        problemSolvingScore: breakdown.problemSolving,
        feedbacks: {
          strengths: ['Clear grasp of active tech stack principles.', 'Good pacing and conceptual clarity.'],
          weaknesses: updatedTranscripts.flatMap(t => t.missed).slice(0, 3).map(m => `Omitted deep coverage of "${m}".`),
          missedConcepts: updatedTranscripts.flatMap(t => t.missed).slice(0, 4),
          improvements: ['Elaborate on database scaling tradeoffs.', 'Incorporate specific metrics when detailing system bottlenecks.']
        },
        transcripts: updatedTranscripts
      };

      addInterviewSession(newSessionResult);
      setSessionPhase('summary');
    }
  };

  const viewDemoInterviewSession = () => {
    // Load pre-populated session
    const demoSession = {
      communication: 85,
      technical: 80,
      confidence: 85,
      clarity: 80,
      problemSolving: 80,
      overall: 82
    };

    setSessionScoreBreakdown(demoSession);
    setTranscripts([
      {
        question: 'How do you handle state management scaling inside a large React codebase?',
        answer: 'I typically use Redux Toolkit or Zustand for global stores, partition them logically by feature module, and employ Context API for localized theme/auth configurations to minimize re-renders.',
        score: 90,
        feedback: 'Excellent answer detailing correct toolkit options and localized partition logic to prevent performance drag.',
        ideal: 'Suggest Redux Toolkit, Redux Sagas, or Zustand for global scale, partitioning states by feature, and localized React Context layers.',
        missed: []
      },
      {
        question: 'Explain how database indexing increases SQL query performance, and mention potential trade-offs.',
        answer: 'Indexing creates a B-Tree structure to bypass full table scans. However, it slows down writes since the index must update during insertions.',
        score: 74,
        feedback: 'Good basic explanation, but missed specifying search bottlenecks, clustered vs non-clustered definitions, and memory overhead variables.',
        ideal: 'Indexes use B-Trees or Hash tables to reduce search time. Primary trade-offs include storage size overhead and performance degradation on writes (INSERT, UPDATE, DELETE).',
        missed: ['clustered indexes', 'write overhead', 'storage index size']
      }
    ]);

    setSessionPhase('demo-view');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Re-use speak question helper in summary list
  const speakQuestion = (text: string) => {
    speakText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Video className="h-6 w-6 text-indigo-400" /> Voice AI Interview Coach
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete mock interviews. Practice technical, HR, and behavioral scenario questions using voice interfaces.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto min-h-[500px]">
        {/* INTERVIEW COACH INTERFACE WORKSPACE */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full">
          
          {/* PHASE 1: SETUP SCREEN */}
          {sessionPhase === 'setup' && (
            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-6 w-full">
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
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Interview Mode</label>
                  <select 
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
                  >
                    <option value="technical">Technical Focus</option>
                    <option value="hr">HR / Behavioral</option>
                    <option value="scenario">Project & Resume-Based Discussion</option>
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

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={startSession}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 transition-smooth flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Start Practice Interview
                </button>
                <button
                  onClick={viewDemoInterviewSession}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-smooth flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> View Demo Interview
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 flex gap-3 text-slate-400">
                <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-justify">
                  **Microphone & Voice permissions:** Chrome and other webkit browsers support local Speech-to-Text and Text-to-Speech synthesis. Please grant microphone access when prompted to begin recording responses.
                </p>
              </div>
            </div>
          )}

          {/* PHASE 2: ACTIVE SESSION SCREEN */}
          {sessionPhase === 'active' && activeQuestions[currentQIndex] && (
            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-6 w-full relative">
              
              {/* Question header */}
              <div className="flex justify-between items-center text-xs border-b border-slate-900/60 pb-3">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-mono">
                  Question {currentQIndex + 1} of {activeQuestions.length}
                </span>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="text-slate-500">{formatTimer(timer)}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 uppercase font-bold border border-slate-850">
                    {difficulty}
                  </span>
                </div>
              </div>

              {/* Question body */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 flex justify-between items-center gap-4">
                <h3 className="font-bold text-white text-sm leading-relaxed flex-1">
                  {activeQuestions[currentQIndex].question}
                </h3>
                <button
                  onClick={() => speakQuestion(activeQuestions[currentQIndex].question)}
                  className={`p-2 rounded-xl border shrink-0 transition-smooth cursor-pointer ${
                    isSpeaking 
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Listen to Question"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>

              {/* Waveform visual animation */}
              <div className="h-20 flex items-center justify-center gap-1 bg-slate-950/40 border border-slate-900 rounded-2xl">
                {isListening ? (
                  // Listening Waveform
                  [...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-indigo-500 rounded-full animate-pulse" 
                      style={{ 
                        height: `${20 + Math.random() * 50}%`,
                        animationDuration: `${0.4 + Math.random() * 0.5}s`,
                        animationDelay: `${i * 0.05}s`
                      }} 
                    />
                  ))
                ) : isSpeaking ? (
                  // Speaking Waveform
                  [...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-teal-400 rounded-full animate-pulse" 
                      style={{ 
                        height: `${25 + Math.random() * 40}%`,
                        animationDuration: `${0.3 + Math.random() * 0.4}s`,
                        animationDelay: `${i * 0.04}s`
                      }} 
                    />
                  ))
                ) : (
                  // Idle Waveform
                  [...Array(12)].map((_, i) => (
                    <div key={i} className="w-1 h-2 bg-slate-800 rounded-full" />
                  ))
                )}
              </div>

              {/* Live Transcription box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Live Transcription</span>
                  {isListening && (
                    <span className="text-[9px] text-indigo-400 font-bold font-mono animate-pulse">● Listening...</span>
                  )}
                </div>
                <textarea
                  id={`answer_input_${activeQuestions[currentQIndex].id}`}
                  value={liveTranscript}
                  onChange={(e) => setLiveTranscript(e.target.value)}
                  placeholder="Click 'Mute / Record' or type your response here. Try to describe methodologies, frameworks, and metrics..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-2xl px-4 py-3 text-xs font-semibold text-white outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Microphone actions */}
              <div className="flex gap-2">
                {isListening ? (
                  <button
                    onClick={stopListening}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/15"
                  >
                    <Square className="h-4 w-4 fill-current" /> Stop Listening
                  </button>
                ) : (
                  <button
                    onClick={startListening}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/15"
                  >
                    <Mic className="h-4 w-4" /> Start Speaking
                  </button>
                )}

                <button
                  onClick={() => {
                    const input = document.getElementById(`answer_input_${activeQuestions[currentQIndex].id}`) as HTMLTextAreaElement;
                    handleNextOrFinish(input.value);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-slate-950 transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-600/15"
                >
                  <Sparkles className="h-4 w-4" /> Submit Response
                </button>
              </div>

            </div>
          )}

          {/* PHASE 3 & 4: SUMMARY / DEMO-VIEW RESULT DASHBOARD */}
          {(sessionPhase === 'summary' || sessionPhase === 'demo-view') && (
            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-6 w-full animate-fade-in">
              <div className="flex justify-between items-start border-b border-slate-900/60 pb-4">
                <div>
                  <h3 className="font-bold text-white text-base">Mock Interview Evaluation</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Overall scoring indexes compiled from voice responses</p>
                </div>
                <button
                  onClick={() => setSessionPhase('setup')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs font-bold text-slate-300 transition-smooth cursor-pointer"
                >
                  Start New Setup
                </button>
              </div>

              {/* Scorecard grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Overall Score</span>
                  <span className="text-xl font-extrabold text-indigo-400 font-mono">{sessionScoreBreakdown.overall}%</span>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Technical</span>
                  <span className="text-xl font-extrabold text-white font-mono">{sessionScoreBreakdown.technical}%</span>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Communication</span>
                  <span className="text-xl font-extrabold text-white font-mono">{sessionScoreBreakdown.communication}%</span>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Confidence</span>
                  <span className="text-xl font-extrabold text-white font-mono">{sessionScoreBreakdown.confidence}%</span>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Clarity</span>
                  <span className="text-xl font-extrabold text-white font-mono">{sessionScoreBreakdown.clarity}%</span>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Solve Speed</span>
                  <span className="text-xl font-extrabold text-white font-mono">{sessionScoreBreakdown.problemSolving}%</span>
                </div>
              </div>

              {/* Transcripts lists review */}
              <div className="space-y-4 pt-2 border-t border-slate-900">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Dynamic Transcripts & Outline Review</h4>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                  {transcripts.map((t, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <h5 className="font-bold text-slate-200 text-xs leading-relaxed flex-1">{t.question}</h5>
                        <button
                          onClick={() => speakQuestion(t.question)}
                          className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white shrink-0"
                          title="Listen to question"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-900/60 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">Your Voice Response:</span>
                        <p className="text-slate-300 leading-relaxed text-justify">{t.answer}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs space-y-1.5">
                        <span className="text-[10px] text-emerald-400 font-bold block uppercase">Ideal Answer Benchmarks:</span>
                        <p className="text-slate-300 italic font-serif leading-relaxed text-justify">{t.ideal}</p>
                      </div>

                      {t.missed.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[9px] text-rose-400 font-bold uppercase">Missed Keys:</span>
                          {t.missed.map((m: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[9px] font-mono text-rose-400">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-1 text-[11px] font-semibold text-slate-400">
                        <span>Evaluation Feedback: {t.feedback}</span>
                        <span className="text-indigo-400">Score: {t.score}%</span>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* INTERVIEW HISTORY PANEL */}
        <div className="lg:col-span-4 print:hidden">
          <div className="glass-panel border-slate-900 rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-400" /> History Tracking
            </h3>

            {interviewHistory.length === 0 && (sessionPhase === 'setup' || sessionPhase === 'active') ? (
              <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-900 text-center text-xs text-slate-500 font-semibold">
                No mock sessions logged yet.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                {/* Active summary entry if completed */}
                {sessionPhase === 'summary' && (
                  <div className="p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/30 space-y-1.5 text-xs animate-pulse">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Recent Session</span>
                      <span>{sessionScoreBreakdown.overall}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{roleName} ({difficulty})</p>
                  </div>
                )}

                {/* Pre-recorded demo indicator if viewing demo */}
                {sessionPhase === 'demo-view' && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Demo Session</span>
                      <span>82%</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{roleName} (Intermediate)</p>
                  </div>
                )}

                {/* Database history logs */}
                {interviewHistory.map((session) => (
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
