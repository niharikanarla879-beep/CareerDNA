'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useResume, InterviewSession } from '@/lib/resume-context';
import { targetCareers } from '@/lib/constants';
import {
  ArrowLeft,
  Video,
  Sparkles,
  Play,
  Volume2,
  Mic,
  Square,
  TrendingUp,
  Info
} from 'lucide-react';
import { interviewQuestionsDb, QuestionDef } from '@/lib/interview-questions';

interface TranscriptItem {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  ideal: string;
  missed: string[];
  technicalScore: number;
  explanationScore: number;
  clarityScore: number;
  confidenceScore: number;
}

interface SpeechRecognitionEventResult {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  start: () => void;
  stop: () => void;
  abort: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventResult) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
}

const getSpeechErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'not-allowed':
      return 'Microphone permission denied. Please enable microphone permissions in your browser settings, or type your response manually.';
    case 'no-speech':
      return 'No speech detected. Please speak clearly into your microphone, or type your response manually.';
    case 'network':
      return 'Network error: A connection to the speech recognition server could not be established. Please check your internet connection, or type your response manually.';
    case 'aborted':
      return 'Speech recognition aborted. Click "Start Speaking" to try again, or type your response manually.';
    default:
      return `Speech recognition error (${errorCode}). Please check your microphone connection, or type your response manually.`;
  }
};

export default function InterviewCoach() {
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
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [sessionScoreBreakdown, setSessionScoreBreakdown] = useState({
    communication: 0,
    technical: 0,
    confidence: 0,
    clarity: 0,
    problemSolving: 0,
    overall: 0
  });
  
  // Audio Speech APIs
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  
  const isSpeechSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const win = window as Window & typeof globalThis & { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance };
    return !!win.SpeechRecognition || !!win.webkitSpeechRecognition;
  }, []);
  
  const targetCareer = targetCareerId || 'swe';
  const roleName = targetCareers.find(c => c.id === targetCareer)?.name || 'Target Profile';

  // Timer runner
  useEffect(() => {
    if (sessionPhase === 'active') {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => setTimer(0), 0);
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
    stopSpeaking();
    setMicError(null);
    
    if (typeof window === 'undefined') return;

    const SpeechRecognition = 
      (window as Window & typeof globalThis & { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
      (window as Window & typeof globalThis & { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError('Speech recognition is not supported in this browser. Please use a modern version of Google Chrome or Microsoft Edge.');
      return;
    }

    // Request microphone permissions properly
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // Stop the tracks of the requested stream immediately to release the microphone lock
        stream.getTracks().forEach(track => track.stop());

        try {
          if (recognitionRef.current) {
            recognitionRef.current.abort();
          }

          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';

          rec.onstart = () => {
            setIsListening(true);
            setLiveTranscript('');
            setMicError(null);
          };

          rec.onresult = (event: SpeechRecognitionEventResult) => {
            let interimTranscript = '';
            let finalTranscript = '';
            // Loop from 0 instead of event.resultIndex to correctly build continuous transcript
            for (let i = 0; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            setLiveTranscript(finalTranscript + interimTranscript);
          };

          rec.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.warn('Speech recognition warning status:', event.error);
            const msg = getSpeechErrorMessage(event.error);
            setMicError(msg);
            setIsListening(false);
          };

          rec.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = rec;
          rec.start();
        } catch (e) {
          console.warn('Failed to initialize speech recognition:', e);
          setMicError('Could not start speech recognition. Please check your microphone connection.');
          setIsListening(false);
        }
      })
      .catch((err) => {
        console.warn('Microphone permission check failed:', err);
        setMicError('Microphone permission denied. Please enable microphone permissions in your browser settings, or type your response manually.');
        setIsListening(false);
      });
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Failed to stop recognition:', e);
      }
    }
    setIsListening(false);
  };

  const startSession = () => {
    const roleDb = interviewQuestionsDb[targetCareer] || interviewQuestionsDb['swe'];
    const typeDb = roleDb[qType === 'technical' ? 'technical' : qType === 'hr' ? 'hr' : 'scenario'] || roleDb['technical'];
    const baseQuestions = typeDb[difficulty] || typeDb['intermediate'];

    // Fisher-Yates Shuffle
    const shuffled = [...baseQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select subset of 5 questions if pool >= 5, otherwise all
    const selectedQuestions = shuffled.length >= 5 ? shuffled.slice(0, 5) : shuffled;

    setActiveQuestions(selectedQuestions);
    setCurrentQIndex(0);
    setTranscripts([]);
    setLiveTranscript('');
    setSessionPhase('active');
    
    // Speak first question
    setTimeout(() => {
      speakText(selectedQuestions[0].question);
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

    // Technical correctness (40%)
    const technicalScore = Math.min(100, Math.round(30 + keyMatchRatio * 70));
    
    // Explanation quality (20%)
    const wordCount = answer.split(/\s+/).filter(w => w.length > 0).length;
    const explanationScore = Math.min(100, Math.round(30 + (keyMatchRatio * 40) + Math.min(30, (wordCount / 40) * 30)));
    
    // Communication clarity (20%)
    const fillerWords = ['like', 'um', 'uh', 'actually', 'basically', 'so', 'literally'];
    let fillerCount = 0;
    ansLower.split(/\s+/).forEach(w => {
      if (fillerWords.includes(w.replace(/[^a-zA-Z]/g, ''))) {
        fillerCount++;
      }
    });
    const clarityScore = Math.max(30, Math.min(100, Math.round(75 + Math.min(25, wordCount > 10 ? 25 : wordCount * 2.5) - (fillerCount * 8))));
    
    // Confidence score (20%)
    const confidenceScore = Math.max(30, Math.min(100, Math.round(70 + Math.min(30, (wordCount / 30) * 30) - (fillerCount * 6))));

    const questionScore = Math.round(
      (technicalScore * 0.40) +
      (explanationScore * 0.20) +
      (clarityScore * 0.20) +
      (confidenceScore * 0.20)
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
      missed,
      technicalScore,
      explanationScore,
      clarityScore,
      confidenceScore
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
      const count = updatedTranscripts.length || 1;
      const sumTech = updatedTranscripts.reduce((acc, c) => acc + c.technicalScore, 0);
      const sumExpl = updatedTranscripts.reduce((acc, c) => acc + c.explanationScore, 0);
      const sumClar = updatedTranscripts.reduce((acc, c) => acc + c.clarityScore, 0);
      const sumConf = updatedTranscripts.reduce((acc, c) => acc + c.confidenceScore, 0);
      const sumOverall = updatedTranscripts.reduce((acc, c) => acc + c.score, 0);

      const breakdown = {
        communication: Math.round(sumClar / count),
        technical: Math.round(sumTech / count),
        confidence: Math.round(sumConf / count),
        clarity: Math.round(sumClar / count),
        problemSolving: Math.round(sumExpl / count),
        overall: Math.round(sumOverall / count)
      };

      setSessionScoreBreakdown(breakdown);

      // Dynamic feedback generation
      const allMissed = updatedTranscripts.flatMap(t => t.missed);
      const allMatched = updatedTranscripts.flatMap(t => {
        const q = activeQuestions[updatedTranscripts.indexOf(t)];
        if (!q) return [];
        return q.idealAnswerKeys.filter(key => !t.missed.includes(key));
      });

      const uniqueMatched = Array.from(new Set(allMatched));
      const uniqueMissed = Array.from(new Set(allMissed));

      const strengthsList = [];
      if (uniqueMatched.length > 0) {
        strengthsList.push(`Demonstrated understanding of core concepts: ${uniqueMatched.slice(0, 3).join(', ')}.`);
      } else {
        strengthsList.push('Answered basic conceptual queries directly.');
      }
      if (breakdown.confidence >= 75) {
        strengthsList.push('Delivered response with confidence and smooth verbal flow.');
      } else {
        strengthsList.push('Kept answers clear and focused.');
      }

      const weaknessesList = uniqueMissed.slice(0, 3).map(m => `Omitted deep coverage of "${m}".`);
      if (weaknessesList.length === 0) {
        weaknessesList.push('No major conceptual omissions detected.');
      }

      const improvementsList = [];
      if (uniqueMissed.length > 0) {
        improvementsList.push(`Study and study definitions for: ${uniqueMissed.slice(0, 3).join(', ')}.`);
      }
      if (breakdown.confidence < 75) {
        improvementsList.push('Try to minimize filler words like "like", "um", "so" to improve confidence index.');
      }
      improvementsList.push('Use the STAR method (Situation, Task, Action, Result) to structure behavioral scenario responses.');

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
          strengths: strengthsList,
          weaknesses: weaknessesList,
          missedConcepts: uniqueMissed.slice(0, 4),
          improvements: improvementsList
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
        missed: [],
        technicalScore: 92,
        explanationScore: 90,
        clarityScore: 88,
        confidenceScore: 90
      },
      {
        question: 'Explain how database indexing increases SQL query performance, and mention potential trade-offs.',
        answer: 'Indexing creates a B-Tree structure to bypass full table scans. However, it slows down writes since the index must update during insertions.',
        score: 74,
        feedback: 'Good basic explanation, but missed specifying search bottlenecks, clustered vs non-clustered definitions, and memory overhead variables.',
        ideal: 'Indexes use B-Trees or Hash tables to reduce search time. Primary trade-offs include storage size overhead and performance degradation on writes (INSERT, UPDATE, DELETE).',
        missed: ['clustered indexes', 'write overhead', 'storage index size'],
        technicalScore: 75,
        explanationScore: 72,
        clarityScore: 78,
        confidenceScore: 70
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
                    onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
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
                        height: `${20 + ((i * 13) % 51)}%`,
                        animationDuration: `${0.4 + ((i * 7) % 6) * 0.1}s`,
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
                        height: `${25 + ((i * 17) % 41)}%`,
                        animationDuration: `${0.3 + ((i * 3) % 5) * 0.1}s`,
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
                {micError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                    {micError}
                  </div>
                )}
                
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
                {!isSpeechSupported ? (
                  <div className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-900 text-slate-400 flex items-center gap-2 justify-center">
                    <Info className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>Speech recognition unavailable. Fallback to manual typing mode is enabled.</span>
                  </div>
                ) : isListening ? (
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
                {(sessionPhase === 'summary' ? interviewHistory.slice(1) : interviewHistory).map((session) => (
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
