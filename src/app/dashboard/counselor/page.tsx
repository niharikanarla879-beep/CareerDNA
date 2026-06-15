'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { targetCareers } from '@/lib/constants';
import {
  ArrowLeft,
  Sparkles,
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

export default function CounselorPage() {
  const { user } = useAuth();
  const { latestResume, targetCareerId, projects, certs, scores, assessment } = useResume();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeRoleName = useMemo(() => {
    return targetCareers.find(c => c.id === targetCareerId)?.name || 'Target Profile';
  }, [targetCareerId]);

  // Initial messages
  useEffect(() => {
    if (!user) return;
    
    const isDemo = user.id === 'demo-h2s-candidate';
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
  }, [user, activeRoleName, scores, certs.length, projects.length]);

  // Scroll to bottom helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Local AI counselor response engine
  const generateCounselorResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    // Check if assessment completed
    const assessmentTaken = assessment?.taken;

    // 1. "am i job ready?" / "readiness"
    if (q.includes('job ready') || q.includes('readiness') || q.includes('am i ready')) {
      if (scores.jobReadinessScore >= 85) {
        return `Your current Job Readiness is at an exceptional **${scores.jobReadinessScore}%**. You possess the core frameworks, methodologies, and online credentials requested for **${activeRoleName}**.\n\n**My Recommendation:**\n1. Target senior listings or high-growth startups.\n2. Keep your GitHub links fresh.\n3. Practice advanced mock interview questions in the coach to solidify your communication logs.`;
      }
      
      const missingList = scores.missingSkills.slice(0, 3).join(', ');
      return `Your Job Readiness for a **${activeRoleName}** is currently **${scores.jobReadinessScore}%**. I estimate you are approximately **${scores.estimatedReadyWeeks} weeks** away from becoming highly competitive.\n\n**Key Competency Gaps:**\n- You are currently missing: *${missingList || 'foundational tools'}*.\n\n**Action Blueprint:**\n1. Go to the **Skill Gap Analyzer** and review learning blueprints for these skills.\n2. Add at least one project containing these tech stacks to boost your portfolio score by +15 points.`;
    }

    // 2. "what should i learn next?" / "learn next" / "what skills am i missing?"
    if (q.includes('learn next') || q.includes('what to learn') || q.includes('skills am i missing') || q.includes('missing skills')) {
      if (scores.missingSkills.length === 0) {
        return `Fantastic! You have 100% required skills coverage matching our target matrix for a **${activeRoleName}**!\n\n**Next Best Step:** Focus on mock interviews, or certifications like AWS Certified Developer to add score bonuses, or try pivoting target profiles to expand your horizontal knowledge.`;
      }
      const nextSkill = scores.missingSkills[0];
      const whyItMatters = nextSkill === 'React' ? 'It is the primary frontend framework powering modern user interfaces and components.' :
                          nextSkill === 'Node.js' ? 'It is critical for server-side REST API development and back-end integration scaling.' :
                          nextSkill === 'AWS' ? 'Cloud architecture knowledge is expected for automated server deployments.' :
                          nextSkill === 'Docker' ? 'Container infrastructure allows microservices to run consistently on server nodes.' :
                          `It is a key framework requested in 80%+ of listings targeting ${activeRoleName}.`;

      return `The next skill you should prioritize learning is: **${nextSkill}**.\n\n**Why it is important:** ${whyItMatters}\n\n**Expected Impact:** Completing this skill gap and logging a project using it will increase your **Job Readiness Meter by +${Math.round(100 / (scores.missingSkills.length + 2))}%**.\n\n**Where to start:** Go to the **Learning Roadmaps** page. I have loaded curated tutorials, books, and beginner/intermediate projects for *${nextSkill}*!`;
    }

    // 3. "what projects should i build?" / "what project" / "projects"
    if (q.includes('project') || q.includes('portfolio') || q.includes('projects should i build')) {
      const nextSkill = scores.missingSkills[0] || 'React/Node.js';
      const projSuggestions = nextSkill === 'React' ? 'SaaS Analytics dashboard with dynamic charts and widgets.' :
                              nextSkill === 'Node.js' ? 'A RESTful API supporting JWT authorization and rate limits.' :
                              nextSkill === 'AWS' || nextSkill === 'Docker' ? 'A containerized application deployed behind a reverse proxy.' :
                              nextSkill === 'SQL' ? 'A database indexing dashboard querying millions of rows.' :
                              `A web application integrating ${nextSkill} functions.`;

      return `Based on your target role (**${activeRoleName}**), I suggest building: **"${projSuggestions}"**.\n\n**Action Checklist:**\n1. Create a public repository on GitHub.\n2. Write a detailed README file describing system diagrams and setup steps.\n3. Add it inside the **Projects Tracker** along with the Repository link and Live deployment URL. This will increase your composite **DNA Portfolio Score to ${Math.min(100, scores.projectScore + 15)}%**.`;
    }

    // 4. "which certification" / "certification" / "cert"
    if (q.includes('certification') || q.includes('cert') || q.includes('credential')) {
      const suggestedCert = activeRoleName.includes('Software') || activeRoleName.includes('Backend') 
        ? 'AWS Certified Solutions Architect - Associate' 
        : activeRoleName.includes('Data') 
        ? 'Microsoft Certified: Power BI Data Analyst' 
        : activeRoleName.includes('UX') 
        ? 'Google UX Design Professional Certificate' 
        : 'Project Management Professional (PMP)';

      return `For a **${activeRoleName}**, I highly recommend targeting the: **"${suggestedCert}"**.\n\n**Why this certification?** It validates hands-on proficiency and adds weight to resume screening bots.\n\n**Score Impact:** Logging this credential inside the **Projects & Certs Tracker** will increase your consolidated score by **+2%** (Cert Bonus ledger).`;
    }

    // 5. General fallback response
    return `Interesting question. To help you succeed as a **${activeRoleName}**, I recommend reviewing:
1. **ATS Resume Auditor**: Scan your resume text to verify formatting.
2. **Skill Gap Analyzer**: Uncover missing technologies.
3. **AI Interview Coach**: Practice dynamic HR/Technical follow-up sessions.

Let me know if you would like me to detail one of these steps!`;
  };

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
          context: {
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
          }
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
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: `**System Notice**: ${e.message || 'Error communicating with AI counselor. Please verify that GEMINI_API_KEY is defined in your .env.local file and restart the development server.'}`,
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
