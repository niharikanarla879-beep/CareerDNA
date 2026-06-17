'use client';

import React, { useState } from 'react';
import { useResume } from '@/lib/resume-context';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Dna, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/toast-context';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PresentationMode({ isOpen, onClose }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { loginDemoUser } = useResume();
  const { showToast } = useToast();
  const router = useRouter();
  const [loadingDemo, setLoadingDemo] = useState(false);

  if (!isOpen) return null;

  const handleLaunchDemo = async () => {
    setLoadingDemo(true);
    try {
      const success = await loginDemoUser();
      if (success) {
        showToast('Demo profile seeded successfully! Redirecting...', 'success');
        onClose();
        router.push('/dashboard');
      } else {
        showToast('Failed to seed demo candidate profile.', 'error');
      }
    } catch {
      showToast('Error seeding demo profile.', 'error');
    } finally {
      setLoadingDemo(false);
    }
  };

  const slides = [
    {
      title: 'Welcome Redrob Judges!',
      subtitle: 'Introducing CareerDNA — The Personalized Career Operating System',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            CareerDNA is a modern web platform designed to analyze, score, and guide developers from their current skills to their dream job. By integrating vocational psychometrics, resume parsers, and speech-based interview simulations, it computes a unified <strong className="text-indigo-400">CareerDNA Score</strong>.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase">For Candidates</span>
              <p className="text-[11px] text-slate-400">Discover vocational fits, analyze resume ATS alignment, practice live audio interviews, and complete customized roadmap paths.</p>
            </div>
            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-teal-400 uppercase">For Recruiters</span>
              <p className="text-[11px] text-slate-400">Evaluate candidates via verified portfolios, speech metrics, and certified roadmaps. Standardize screening with zero manual audits.</p>
            </div>
          </div>
        </div>
      ),
      badge: 'Redrob Hack2Skill'
    },
    {
      title: 'The Value Loop & Integration',
      subtitle: 'Solving Candidate Readiness & Recruiter Discovery',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Recruiting platforms like <strong className="text-teal-400">Redrob</strong> struggle with unverified resume claims. CareerDNA creates a secure candidate validation loop:
          </p>
          <div className="space-y-2.5">
            <div className="flex gap-3 items-start text-xs text-slate-300">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold font-mono text-[10px] shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-white">Vocational Mapping:</strong> Standardized RIASEC interest decoder aligns candidates with real careers.
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs text-slate-300">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold font-mono text-[10px] shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-white">Portfolio Auditing:</strong> Scrapes local certs and compiles weighted project strength logs.
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs text-slate-300">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold font-mono text-[10px] shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-white">Speech Simulation:</strong> Tests tech capabilities using browser audio speech-recognition engines.
              </div>
            </div>
          </div>
        </div>
      ),
      badge: 'Redrob Integration'
    },
    {
      title: 'Technical Implementation Details',
      subtitle: 'Sleek, Offline-Capable, Server-Rendering Safe architecture',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Our app utilizes a premium styling stack and offline-first data persistence optimized for high performance:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex gap-2 items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong className="text-white">Local Parsers:</strong> PDFJS-Dist and Mammoth extract resume text without external database hops.</span>
            </li>
            <li className="flex gap-2 items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong className="text-white">Audio Coach:</strong> Runs speech synthesizers (TTS) and recognition (STT) inside browser streams.</span>
            </li>
            <li className="flex gap-2 items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong className="text-white">Score Engine:</strong> Aggregates metrics out of 100 with penalties for unresolved gap roadmaps.</span>
            </li>
          </ul>
        </div>
      ),
      badge: 'Tech Architecture'
    },
    {
      title: 'Ready to Experience CareerDNA?',
      subtitle: 'Initialize a complete candidate profile instantly',
      content: (
        <div className="space-y-5 flex flex-col items-center justify-center text-center py-2">
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Click the button below to log in as a verified candidate. This will automatically populate the dashboard with 3 projects, certifications, an 84% resume ATS score, and interview evaluations.
          </p>
          <button
            onClick={handleLaunchDemo}
            disabled={loadingDemo}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:from-amber-500/50 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-smooth shadow-lg cursor-pointer transform hover:scale-[1.02]"
          >
            {loadingDemo ? (
              <>Initializing candidate profile...</>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-slate-950 fill-current" /> Initialize & View Dashboard
              </>
            )}
          </button>
        </div>
      ),
      badge: 'Interactive Experience'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative glass-panel border-indigo-500/25 bg-slate-950/95 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-[460px] animate-fade-in-up">
        {/* Glow dots inside modal */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-slate-900 pb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
              <Dna className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/25">
                {slides[currentSlide].badge}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-smooth cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 py-6 relative z-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {slides[currentSlide].subtitle}
          </p>
          <div className="pt-4">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-slate-900 pt-4 relative z-10">
          <div className="flex gap-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-smooth cursor-pointer ${
                  idx === currentSlide ? 'w-5 bg-indigo-400' : 'w-1.5 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 border border-slate-800 text-slate-400 disabled:opacity-30 enabled:hover:text-white enabled:hover:border-slate-600 rounded-lg text-xs font-bold transition-smooth cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back
            </button>
            
            {currentSlide < slides.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-smooth cursor-pointer flex items-center gap-1 shadow-md shadow-indigo-600/10"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-smooth cursor-pointer flex items-center gap-1 shadow-md shadow-emerald-600/10"
              >
                Close Deck
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
