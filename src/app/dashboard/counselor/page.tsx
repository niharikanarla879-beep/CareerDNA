'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { targetCareers } from '@/lib/constants';
import {
  ArrowLeft,
  Loader2,
  Send,
  MessageSquare,
  Bot,
  User as UserIcon,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface ProfileContextData {
  profile?: {
    firstName?: string;
    lastName?: string;
    currentJob?: string;
    educationLevel?: string;
    experienceYears?: string | number;
  };
  assessment?: unknown;
  resumeScore?: number;
  missingSkills?: string[];
  roadmapProgressPercent?: number;
  projectsCount?: number;
  certsCount?: number;
  interviewScore?: number;
  targetRole?: string;
}

function generateFallbackCounselorResponse(messages: ChatMessage[], context: ProfileContextData): string {
  const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
  const {
    profile,
    resumeScore,
    missingSkills = [],
    roadmapProgressPercent = 0,
    projectsCount = 0,
    certsCount = 0,
    interviewScore,
    targetRole = 'Software Engineer'
  } = context || {};

  const name = profile?.firstName || 'Candidate';
  const role = targetRole;

  if (lastUserMsg.includes('ready') || lastUserMsg.includes('job readiness') || lastUserMsg.includes('job-ready') || lastUserMsg.includes('readiness')) {
    const remaining = missingSkills.length;
    return `Hello **${name}**! Let's check your job readiness for a **${role}** role.
    
Currently:
- Your learning roadmap is **${roadmapProgressPercent}%** complete.
- You have **${remaining}** missing skill gap(s) remaining: **${missingSkills.join(', ') || 'None'}**.
- You have completed **${projectsCount}** projects and **${certsCount}** certifications.
    
To become fully competitive, I recommend finishing your remaining roadmap milestones to resolve outstanding skill gaps. This will immediately improve your Job Readiness score!`;
  }

  if (lastUserMsg.includes('learn') || lastUserMsg.includes('skill') || lastUserMsg.includes('gap') || lastUserMsg.includes('roadmap') || lastUserMsg.includes('milestone')) {
    if (missingSkills.length > 0) {
      const primarySkill = missingSkills[0];
      return `Based on your profile gaps for a **${role}** role, your highest priority skill to learn next is **${primarySkill}**.
      
I suggest opening the **${primarySkill}** Learning Roadmap and completing the recommended courses. Once you finish the learning modules and mark them complete:
1. Your skill gap for **${primarySkill}** will be resolved.
2. Your Job Readiness score will increase.
3. Your composite DNA score will improve as the skill gap penalty is removed.`;
    } else {
      return `Excellent work, **${name}**! You have resolved all critical skill gaps for your target role. You should focus on polishing your resume, mock interview practice, or adding more advanced certifications.`;
    }
  }

  if (lastUserMsg.includes('project') || lastUserMsg.includes('portfolio') || lastUserMsg.includes('github')) {
    const skillList = missingSkills.length > 0 ? missingSkills : ['React', 'Node.js', 'System Design'];
    return `Building portfolio projects is key to proving your hands-on capability, **${name}**.
    
You have **${projectsCount}** project(s) listed. To target the **${role}** role, try building an interactive full-stack project utilizing **${skillList.slice(0, 2).join(' or ')}**.
    
Ensure your projects:
- Have a clean README with architecture diagrams.
- Are hosted live on Vercel, Netlify, or AWS.
- Highlight performance metrics (e.g. 'reduced load time by 30%').`;
  }

  if (lastUserMsg.includes('resume') || lastUserMsg.includes('ats') || lastUserMsg.includes('score')) {
    return `Your resume ATS audit score is **${resumeScore || 0}/100**.
    
To raise this score:
1. Integrate missing keywords like **${missingSkills.slice(0, 3).join(', ') || 'relevant industry stacks'}** in your experience section.
2. Rewrite job descriptions using strong action verbs (e.g. *engineered*, *implemented*) followed by quantified achievements.
3. Ensure clean formatting using one of our resume builder templates (Classic, Minimal, or Glass).`;
  }

  if (lastUserMsg.includes('cert') || lastUserMsg.includes('credential') || lastUserMsg.includes('degree')) {
    return `Credentials and certifications help validate your skillset. You currently have **${certsCount}** certification(s).
    
For a **${role}** career path, targeting certifications like AWS Certified Cloud Practitioner, Microsoft Certified, or specialized developer certificates will strengthen your profile.`;
  }

  if (lastUserMsg.includes('interview') || lastUserMsg.includes('coach') || lastUserMsg.includes('practice')) {
    return `Preparing for interviews is critical, **${name}**.
    
Your current mock interview score is **${interviewScore ? `${interviewScore}/100` : 'not recorded yet'}**.
    
Here is a checklist for success:
- Use the **STAR method** (Situation, Task, Action, Result) for all technical and situational scenarios.
- Speak clearly and aim to minimize filler words.
- Head to our **AI Interview Coach** page to practice real-time speech-to-text behavioral questions!`;
  }

  return `Hello **${name}**! As your CareerDNA AI Counselor, I'm here to support your journey to becoming a job-ready **${role}**.
  
Currently, your composite DNA score is **${resumeScore ? resumeScore : 50}/100**.
What would you like to focus on next? We can dive into:
- **Skill gaps** and roadmap milestones (Missing: **${missingSkills.join(', ') || 'None'}**)
- **Projects** and portfolio development
- **Resume optimization** and ATS scores
- **Mock interview prep** and speech feedback`;
}

export default function CounselorPage() {
  const { user } = useAuth();
  const { targetCareerId, projects, certs, scores, assessment } = useResume();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeRoleName = useMemo(() => {
    return targetCareers.find(c => c.id === targetCareerId)?.name || 'Target Profile';
  }, [targetCareerId]);

  // Initial messages
  useEffect(() => {
    if (!user) return;
    
    const isDemo = user.id === 'demo-h2s-candidate';
    const timer = setTimeout(() => {
      if (isDemo) {
        setMessages([
          {
            sender: 'ai',
            text: `Hello Demo Candidate! I am your AI Career Mentor. I have evaluated your career target as a **Software Engineer**.\n\nHere is my quick diagnostics brief of your profile:\n- **Composite DNA Score**: ${scores.finalDnaScore}/100\n- **Job Readiness Meter**: ${scores.jobReadinessScore}%\n- **Resume ATS Auditor Score**: ${scores.resumeScore}/100\n- **Completed Certifications**: ${certs.length}\n- **Mock Projects strength**: ${projects.length} loaded (Avg strength: ${scores.projectScore}%)\n\nWhat would you like to discuss today? You can select any prompt below for detailed guidance.`,
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
          }
        ]);
      } else {
        setMessages([
          {
            sender: 'ai',
            text: `Hello ${user.firstName}! I am your CareerDNA AI Counselor. I analyze your assessments, resumes, portfolio projects, and interview scores to map out your readiness.\n\nYour active career target is currently set to: **${activeRoleName}**.\n\nFeel free to ask me anything about your skill gaps, portfolio projects, certifications, or career transition strategy!`,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [user, activeRoleName, scores, certs.length, projects.length]);

  // Scroll to bottom helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add User Message
    const newUserMsg: ChatMessage = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputText('');

    // Trigger typing simulation
    setIsTyping(true);

    const context = {
      profile: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        currentJob: user?.currentJob,
        educationLevel: user?.educationLevel,
        experienceYears: user?.experienceYears
      },
      assessment,
      resumeScore: scores.resumeScore,
      missingSkills: scores.missingSkills,
      roadmapProgressPercent: scores.roadmapProgressPercent,
      projectsCount: projects.length,
      certsCount: certs.length,
      interviewScore: scores.interviewScore,
      targetRole: activeRoleName
    };

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'counselor_chat',
          messages: updatedMessages.map(m => ({
            sender: m.sender,
            text: m.text
          })),
          context
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch mentor response');
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toISOString()
      }]);

      if (data.isOfflineMode) {
        setIsOffline(true);
      } else {
        setIsOffline(false);
      }
    } catch (e) {
      console.warn('AI chat failed, applying client-side fallback:', e);
      setIsOffline(true);
      
      const fallbackText = generateFallbackCounselorResponse(updatedMessages, context);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

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
            <Bot className="h-6 w-6 text-indigo-400" /> AI Career Mentor
            {isOffline && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse shadow-sm shadow-amber-500/5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                Offline AI Mode
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Get personalized strategy recommendations based on your CareerDNA profile scores, resume keyword analysis, and portfolio gaps.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto h-[600px]">
        {/* LEFT COLUMN: INTERACTIVE CHAT PANEL */}
        <div className="lg:col-span-8 flex flex-col justify-between glass-panel border-slate-900 rounded-3xl p-6 h-full relative overflow-hidden bg-slate-950/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
          
          {/* Chat message list */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.sender === 'user' 
                    ? 'bg-slate-900 border-slate-800 text-slate-200' 
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-sm shadow-indigo-500/10'
                }`}>
                  {msg.sender === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none'
                    : 'bg-slate-900/60 border-slate-900 text-slate-300 rounded-tl-none whitespace-pre-line text-justify'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-xs text-slate-500 font-semibold animate-pulse pl-1">
                <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" /> Mentor is compiling guidance strategy...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt chips and input form */}
          <div className="space-y-4 pt-4 border-t border-slate-900/60 relative z-10">
            {/* Quick action prompts */}
            <div className="flex flex-wrap gap-2">
              {[
                { text: 'Am I job ready?', icon: TrendingUp },
                { text: 'What should I learn next?', icon: BookOpen },
                { text: 'What projects should I build?', icon: Bot },
                { text: 'Which certification should I target?', icon: Award }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.text)}
                  className="px-3 py-1.5 rounded-full border border-slate-850 hover:border-indigo-500 bg-slate-950/60 hover:bg-indigo-500/5 text-[10px] font-bold text-slate-300 hover:text-white transition-smooth flex items-center gap-1 cursor-pointer"
                >
                  <chip.icon className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{chip.text}</span>
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask your AI Career Mentor a custom query..."
                className="flex-1 bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-smooth"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-smooth flex items-center justify-center cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                <Send className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RECAP & CAREER WIDGET */}
        <div className="lg:col-span-4 space-y-6 h-full flex flex-col">
          <div className="glass-panel border-slate-900 rounded-3xl p-5 space-y-4 flex-1">
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-indigo-400" /> System State Synced
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Your mentor parses active metrics to synthesize contextual advice. Ensure you keep your profile details up-to-date.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 space-y-1">
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Composite DNA Score</span>
                <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                  <span>{scores.finalDnaScore}/100</span>
                  <span className="text-indigo-400">{scores.finalDnaScore >= 80 ? 'Highly Competitive' : 'Developing'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 space-y-1">
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Active Skill Gaps</span>
                <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                  <span>{scores.missingSkills.length} Tech stacks missing</span>
                  <span className="text-rose-400">-{scores.missingSkills.length * 12} Pen. pts</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 space-y-1">
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Job Readiness Score</span>
                <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                  <span>{scores.jobReadinessScore}%</span>
                  <span className="text-teal-400">Ready in ~{scores.estimatedReadyWeeks} wks</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900 space-y-2">
              <Link 
                href="/dashboard/score-engine"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold rounded-xl text-center text-xs transition-smooth flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Review score engine</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
