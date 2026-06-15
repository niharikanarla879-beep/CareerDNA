'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useResume } from '@/lib/resume-context';
import { targetCareers } from '@/lib/constants';
import {
  ArrowLeft,
  Dna,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Award,
  Briefcase,
  TrendingUp,
  Flame,
  Star,
  Check,
  AlertTriangle
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';

interface CareerMatchDetails {
  id: string;
  name: string;
  matchPercent: number;
  salary: string;
  outlook: string;
  description: string;
  skills: string[];
  certifications: string[];
  projectPrompt: string;
}

const careerDatabase: Record<string, Omit<CareerMatchDetails, 'id' | 'name' | 'matchPercent'>> = {
  swe: {
    salary: '$95,000 - $145,000',
    outlook: '+25% (Much faster than average)',
    description: 'Design, write, test, and deploy modular software applications. Build scalable web architectures, optimize databases, and write automated tests.',
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'Git', 'REST APIs', 'System Design'],
    certifications: ['AWS Certified Solutions Architect', 'Meta Front-End Developer', 'Oracle Certified Java SE Developer'],
    projectPrompt: 'Develop a microservice backend container deployed behind a reverse proxy handling 5,000+ QPS.'
  },
  frontend: {
    salary: '$85,000 - $130,000',
    outlook: '+22% (Faster than average)',
    description: 'Construct responsive, interactive user interfaces for web and mobile apps. Refine page load layouts, styles, and state structures.',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'State Management', 'Web Performance'],
    certifications: ['Meta Front-End Developer', 'UX Design Professional (Google)', 'W3C Frontend Web Developer'],
    projectPrompt: 'Build a premium responsive client dashboard showcasing animations, dynamic grid sorting, and custom charts.'
  },
  backend: {
    salary: '$98,000 - $150,000',
    outlook: '+26% (Much faster than average)',
    description: 'Engineer secured servers, relational and document databases, and application integrations. Scale API request thresholds and optimize caches.',
    skills: ['Node.js', 'Python', 'SQL', 'NoSQL', 'REST APIs', 'System Design', 'Docker', 'AWS'],
    certifications: ['AWS Certified Developer - Associate', 'Google Cloud Certified Professional Cloud Developer', 'MongoDB Certified Developer'],
    projectPrompt: 'Architect an event-driven task queue system with Redis cache fallbacks and unit test coverage.'
  },
  fullstack: {
    salary: '$100,000 - $155,000',
    outlook: '+28% (Much faster than average)',
    description: 'Build end-to-end features spanning server services and web UI components. Manage complete lifecycle deployment pipelines.',
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'REST APIs', 'Git', 'AWS'],
    certifications: ['AWS Certified Solutions Architect', 'Full Stack Web Developer (Microsoft)', 'Meta Front-End Developer'],
    projectPrompt: 'Create a secured SaaS portal linking credit check APIs to MongoDB ledger databases.'
  },
  da: {
    salary: '$70,000 - $105,000',
    outlook: '+18% (Faster than average)',
    description: 'Analyze company data records to extract actionable business patterns. Model business intelligence dashboards and query relational indexes.',
    skills: ['SQL', 'Excel', 'Tableau', 'Power BI', 'Data Analysis', 'Data Visualization', 'Pandas'],
    certifications: ['Google Data Analytics Certificate', 'Microsoft Certified: Power BI Data Analyst', 'Tableau Desktop Specialist'],
    projectPrompt: 'Model an executive KPI dashboard plotting company revenue performance, user churn, and customer acquisition ratios.'
  },
  ds: {
    salary: '$105,000 - $160,000',
    outlook: '+31% (Much faster than average)',
    description: 'Use advanced statistical methods and machine learning models to answer complex business questions. Design experimental A/B testing models.',
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Deep Learning', 'Scikit-Learn', 'Pandas'],
    certifications: ['Google Cloud Professional Data Scientist', 'IBM Data Science Professional', 'SAS Certified Advanced Programmer'],
    projectPrompt: 'Train a regression-based predictive lifetime value model matching historical e-commerce purchasing data.'
  },
  ai: {
    salary: '$115,000 - $180,000',
    outlook: '+35% (Much faster than average)',
    description: 'Deploy generative artificial intelligence models, configure vector semantic databases, and program agentic workflow pipelines.',
    skills: ['Python', 'LLMs', 'Prompt Engineering', 'RAG', 'Vector Databases', 'LangChain', 'MLOps'],
    certifications: ['TensorFlow Developer Certificate', 'AWS Machine Learning Specialty', 'DeepLearning.AI Generative AI Specialty'],
    projectPrompt: 'Program a local document query search assistant matching PDF chunk segments inside a Pinecone semantic index.'
  },
  ml: {
    salary: '$110,000 - $175,000',
    outlook: '+33% (Much faster than average)',
    description: 'Train neural classification systems, deploy automated model checkpoints, and optimize model runtime infrastructure pipelines.',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'MLOps'],
    certifications: ['Google Cloud Professional Machine Learning Engineer', 'AWS Machine Learning Specialty', 'TensorFlow Developer Certificate'],
    projectPrompt: 'Configure a model retraining pipeline targeting real-time credit validation logs.'
  },
  pm: {
    salary: '$92,000 - $140,000',
    outlook: '+15% (Faster than average)',
    description: 'Define product strategy, author PRDs, coordinate user discovery programs, align stakeholders, and manage agile sprint iterations.',
    skills: ['Agile', 'Product Roadmap', 'User Interviews', 'PRDs', 'KPIs', 'Stakeholder Management'],
    certifications: ['Project Management Professional (PMP)', 'Certified Scrum Product Owner (CSPO)', 'Pragmatic Institute Product Certification'],
    projectPrompt: 'Construct a complete product launch GTM strategy mapping milestones, competitor analysis, and metrics thresholds.'
  },
  ux: {
    salary: '$80,000 - $125,000',
    outlook: '+16% (Faster than average)',
    description: 'Conduct user research, design wireframes, craft high-fidelity interactive web mockups, and establish component design systems.',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research', 'Usability Testing', 'Design Systems'],
    certifications: ['Google UX Design Certificate', 'Nielsen Norman Group UX Certification', 'Interaction Design Foundation UX Core'],
    projectPrompt: 'Design a Figma interface system mapping a 3-step checkout funnel for responsive desktop/mobile clients.'
  }
};

export default function AssessmentPage() {
  const { assessment, saveAssessment } = useResume();

  const [step, setStep] = useState<number>(0);
  
  // Quiz values
  const [riasecAnswers, setRiasecAnswers] = useState<Record<string, number>>({
    R1: 3, R2: 3,
    I1: 3, I2: 3,
    A1: 3, A2: 3,
    S1: 3, S2: 3,
    E1: 3, E2: 3,
    C1: 3, C2: 3
  });

  const [valueAnswers, setValueAnswers] = useState<Record<string, number>>({
    Achievement: 3,
    Independence: 3,
    Recognition: 3,
    Relationships: 3,
    Support: 3,
    WorkingConditions: 3
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const [personalityAnswers, setPersonalityAnswers] = useState<Record<string, number>>({
    Openness: 3,
    Conscientiousness: 3,
    Extraversion: 3,
    Agreeableness: 3,
    EmotionalStability: 3
  });

  // Steps Configuration
  const totalSteps = 5;

  const handleRiasecChange = (key: string, value: number) => {
    setRiasecAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleValueChange = (key: string, value: number) => {
    setValueAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handlePersonalityChange = (key: string, value: number) => {
    setPersonalityAnswers(prev => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const processAssessment = () => {
    // 1. Calculate RIASEC Raw scores (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
    const riasecScores = {
      Realistic: Math.round(((riasecAnswers.R1 + riasecAnswers.R2) / 10) * 100),
      Investigative: Math.round(((riasecAnswers.I1 + riasecAnswers.I2) / 10) * 100),
      Artistic: Math.round(((riasecAnswers.A1 + riasecAnswers.A2) / 10) * 100),
      Social: Math.round(((riasecAnswers.S1 + riasecAnswers.S2) / 10) * 100),
      Enterprising: Math.round(((riasecAnswers.E1 + riasecAnswers.E2) / 10) * 100),
      Conventional: Math.round(((riasecAnswers.C1 + riasecAnswers.C2) / 10) * 100)
    };

    // 2. Scale Personality to 100%
    const personalityScores = {
      Openness: Math.round((personalityAnswers.Openness / 5) * 100),
      Conscientiousness: Math.round((personalityAnswers.Conscientiousness / 5) * 100),
      Extraversion: Math.round((personalityAnswers.Extraversion / 5) * 100),
      Agreeableness: Math.round((personalityAnswers.Agreeableness / 5) * 100),
      EmotionalStability: Math.round((personalityAnswers.EmotionalStability / 5) * 100)
    };

    // 3. Scale Work Values to 100%
    const workValuesScores = {
      Achievement: Math.round((valueAnswers.Achievement / 5) * 100),
      Independence: Math.round((valueAnswers.Independence / 5) * 100),
      Recognition: Math.round((valueAnswers.Recognition / 5) * 100),
      Relationships: Math.round((valueAnswers.Relationships / 5) * 100),
      Support: Math.round((valueAnswers.Support / 5) * 100),
      WorkingConditions: Math.round((valueAnswers.WorkingConditions / 5) * 100)
    };

    saveAssessment({
      riasec: riasecScores,
      values: workValuesScores,
      interests: selectedInterests.length > 0 ? selectedInterests : ['Web development', 'AI pipelines'],
      personality: personalityScores
    });

    setStep(totalSteps); // Jump to Results
  };

  // Top matching career compiler logic
  const compiledCareerMatches = useMemo((): CareerMatchDetails[] => {
    if (!assessment?.taken) return [];

    const scores = assessment.riasec;
    
    return targetCareers.map(career => {
      // Basic matching weight: calculate distance of user RIASEC traits to career traits
      let fitScore = 65; // Base compatibility
      
      const careerTraits = career.riasec.split(',').map(s => s.trim());
      
      let traitSum = 0;
      careerTraits.forEach(trait => {
        traitSum += scores[trait] || 50;
      });

      const averageTraitScore = traitSum / careerTraits.length;
      fitScore = Math.round(55 + (averageTraitScore * 0.45));

      // Limit bounds
      fitScore = Math.min(99, Math.max(45, fitScore));

      const details = careerDatabase[career.id] || {
        salary: '$80,000 - $120,000',
        outlook: '+12%',
        description: 'Analyze operational parameters and build technical features.',
        skills: ['JavaScript', 'Git'],
        certifications: ['Google IT Professional'],
        projectPrompt: 'Build a dashboard logging operational parameters.'
      };

      return {
        id: career.id,
        name: career.name,
        matchPercent: fitScore,
        ...details
      };
    }).sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 5);
  }, [assessment]);

  // Radar data format helper
  const radarChartData = useMemo(() => {
    if (!assessment?.taken) return [];
    return Object.entries(assessment.riasec).map(([trait, score]) => ({
      subject: trait,
      A: score,
      fullMark: 100
    }));
  }, [assessment]);

  const strengthsAndWeaknesses = useMemo(() => {
    if (!assessment?.taken) return { strengths: [], weaknesses: [] };
    const p = assessment.personality;
    const v = assessment.values;

    const strs: string[] = [];
    const weaks: string[] = [];

    if (p.Conscientiousness >= 80) strs.push('High conscientiousness: highly dependable, organized, and focused on clean deliverables.');
    else if (p.Conscientiousness < 50) weaks.push('Low conscientious focus: prone to missed details; focus on setting calendar sprints.');

    if (p.Openness >= 80) strs.push('Curious, open-minded explorer: ready to learn new frameworks and pivot technologies.');
    else if (p.Openness < 50) weaks.push('Conventional workflow preference: hesitant to embrace shifts in tools. Expand tech research.');

    if (v.Independence >= 80) strs.push('Self-sufficient logic operator: excels in autonomous settings without constant micro-management.');
    else if (v.Independence < 50) weaks.push('Requires high-context instruction. Practice breaking down tasks independently.');

    if (p.EmotionalStability >= 80) strs.push('Calm and stable under pressure: excels at resolving bugs on tight schedules.');
    else if (p.EmotionalStability < 50) weaks.push('Prone to stress burnout during server outages. Practice resilience strategies.');

    return { strengths: strs.slice(0, 3), weaknesses: weaks.length > 0 ? weaks.slice(0, 2) : ['No significant behavioral blockers detected. Ensure you build coding routine habits.'] };
  }, [assessment]);

  const allInterests = [
    'Web Architecture', 'Machine Learning Modeling', 'Data Visualization Systems', 'Product Strategy GTM',
    'Responsive Interface Styling', 'Database Design Indexing', 'API Gateway Security', 'UX Wireframes & Funnels',
    'Agile Project Planning', 'Distributed Event Networks', 'Cloud Serverless Infrastructure', 'Behavioral User Discovery'
  ];

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
            <Dna className="h-6 w-6 text-indigo-400 animate-pulse" /> DNA Decoder Assessment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Map your vocational profile (RIASEC), core business values, and personality parameters to find compatible careers.
          </p>
        </div>
      </div>

      {/* RENDER ACTIVE STEP WINDOW */}
      {(!assessment?.taken || step < totalSteps) ? (
        <div className="glass-panel border-slate-900 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto space-y-6">
          
          {/* Progress Indicators */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-900/60">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Step {step + 1} of {totalSteps} — {
                step === 0 ? 'RIASEC Interest Check' :
                step === 1 ? 'Vocational Work Values' :
                step === 2 ? 'Personality Survey' :
                step === 3 ? 'General Focus Areas' :
                'Confirm Analysis'
              }
            </span>
            <div className="flex gap-1">
              {[...Array(totalSteps)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-6 rounded-full transition-smooth ${
                    i <= step ? 'bg-indigo-500' : 'bg-slate-900'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* STEP 1: RIASEC */}
          {step === 0 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-400">
                Rate the statements below based on how much they reflect your interests (1: Disagree, 5: Strongly Agree).
              </p>
              
              <div className="space-y-4">
                {[
                  { id: 'R1', label: 'Realistic: I like building, assembly setups, or manual operations.' },
                  { id: 'I1', label: 'Investigative: I enjoy analyzing database code, running models, or reading documentation.' },
                  { id: 'A1', label: 'Artistic: I enjoy creating visual assets, designing CSS schemes, or writing content.' },
                  { id: 'S1', label: 'Social: I like pairing up for bug reviews, explaining algorithms, or tutoring classmates.' },
                  { id: 'E1', label: 'Enterprising: I like organizing task boards, pitching specs to clients, or leading hackathon teams.' },
                  { id: 'C1', label: 'Conventional: I appreciate database index schedules, files layout audits, and structured checklists.' }
                ].map((q) => (
                  <div key={q.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{q.label}</span>
                      <span className="text-indigo-400 font-bold font-mono">{riasecAnswers[q.id]}/5</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={riasecAnswers[q.id]}
                      onChange={(e) => handleRiasecChange(q.id, parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: VALUES */}
          {step === 1 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-400">
                How important are these work environment conditions for your daily workflow? (1: Unimportant, 5: Extremely Important)
              </p>

              <div className="space-y-4">
                {[
                  { id: 'Achievement', label: 'Achievement: Having a sense of accomplishments and project completion.' },
                  { id: 'Independence', label: 'Independence: Making decisions and managing tasks on my own.' },
                  { id: 'Recognition', label: 'Recognition: Getting credit, visibility, and professional advancement.' },
                  { label: 'Relationships: Team values, friendly workspace, and pairing.', id: 'Relationships' },
                  { label: 'Support: Responsive leadership, instructions, and tools support.', id: 'Support' },
                  { id: 'WorkingConditions', label: 'Working Conditions: Job security, hybrid/remote balance, and competitive pay.' }
                ].map((q) => (
                  <div key={q.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{q.label}</span>
                      <span className="text-indigo-400 font-bold font-mono">{valueAnswers[q.id]}/5</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={valueAnswers[q.id]}
                      onChange={(e) => handleValueChange(q.id, parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PERSONALITY */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-400">
                Rate these personality traits based on how accurately they describe your standard working style.
              </p>

              <div className="space-y-4">
                {[
                  { id: 'Openness', label: 'Openness: I am curious about cutting-edge frameworks, libraries, and experimental ideas.' },
                  { id: 'Conscientiousness', label: 'Conscientiousness: I write clean, well-tested code and organize backlog sprint folders.' },
                  { id: 'Extraversion', label: 'Extraversion: I speak comfortably during retro sprints and client demo briefs.' },
                  { id: 'Agreeableness', label: 'Agreeableness: I listen to reviewer recommendations and help resolve team friction.' },
                  { id: 'EmotionalStability', label: 'Emotional Stability: I remain focused and logic-driven under high-stress bugs or outages.' }
                ].map((q) => (
                  <div key={q.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{q.label}</span>
                      <span className="text-indigo-400 font-bold font-mono">{personalityAnswers[q.id]}/5</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={personalityAnswers[q.id]}
                      onChange={(e) => handlePersonalityChange(q.id, parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: GENERAL INTERESTS */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-400">
                Select your preferred domain interests. These focus areas guide the matching engine recommendations.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {allInterests.map((interest, idx) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-smooth flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-md' 
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span>{interest}</span>
                      {isSelected ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                      ) : (
                        <div className="h-4.5 w-4.5 rounded-full border border-slate-800 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRM */}
          {step === 4 && (
            <div className="text-center py-6 space-y-6 flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="h-8 w-8 text-amber-300" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-white text-lg">Ready to Compile CareerDNA Profile?</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We will evaluate your answers against target standards to identify matching career options and behavior parameters.
                </p>
              </div>
            </div>
          )}

          {/* Action Footer Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-900/60">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-smooth flex items-center gap-1 cursor-pointer ${
                step === 0 
                  ? 'border-slate-900 text-slate-700 cursor-not-allowed' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white'
              }`}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            {step < totalSteps - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-smooth flex items-center gap-1 cursor-pointer"
              >
                Next Step <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={processAssessment}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-600/15 transition-smooth flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-300" /> Decode Profile
              </button>
            )}
          </div>

        </div>
      ) : (
        /* ASSESSMENT RESULTS PAGE VISUALS */
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
            {/* LEFT COLUMN: RIASEC RADAR CHART & BEHAVIOR STATS */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Radar Chart */}
              <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-base">RIASEC Dimension Match</h3>
                    <p className="text-xs text-slate-500">Your core vocational interest alignment</p>
                  </div>
                  <button 
                    onClick={() => setStep(0)}
                    className="px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-smooth cursor-pointer"
                  >
                    Retake Test
                  </button>
                </div>

                <div className="relative w-full h-[220px] pt-1">
                  <ResponsiveContainer width="99%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                      <Radar
                        name="RIASEC Scores"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.25}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="space-y-4">
                <div className="glass-panel border-emerald-950/20 bg-emerald-950/5 p-5 rounded-2xl space-y-3">
                  <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Assessment Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {strengthsAndWeaknesses.strengths.map((s, idx) => (
                      <li key={idx} className="flex gap-2 items-start leading-normal">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel border-rose-950/20 bg-rose-950/5 p-5 rounded-2xl space-y-3">
                  <h4 className="font-bold text-rose-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Behavior Gaps
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {strengthsAndWeaknesses.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex gap-2 items-start leading-normal">
                        <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: CAREER MATCH RECOMMENDATIONS */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5">
                  <Briefcase className="h-5 w-5 text-indigo-400" /> Top Compatible Career Matches
                </h3>
                <p className="text-xs text-slate-400">
                  Based on RIASEC weights and work value preferences. Click matching cards to review specific specs.
                </p>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                {compiledCareerMatches.map((career) => (
                  <div 
                    key={career.id}
                    className="glass-panel border-slate-900 hover:border-slate-800 bg-slate-950/40 p-5 rounded-2xl space-y-4 relative overflow-hidden group transition-smooth"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
                    
                    {/* Title & compatibility */}
                    <div className="flex justify-between items-start gap-4 relative z-10">
                      <div>
                        <h4 className="font-bold text-white text-base group-hover:text-indigo-400 transition-smooth">{career.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-semibold">
                          <span className="flex items-center gap-1 text-[11px]"><Flame className="h-3.5 w-3.5 text-amber-500" /> {career.salary}</span>
                          <span className="flex items-center gap-1 text-[11px]"><TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> {career.outlook}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                        {career.matchPercent}% Match
                      </span>
                    </div>

                    {/* Desc */}
                    <p className="text-xs text-slate-300 leading-relaxed text-justify relative z-10">
                      {career.description}
                    </p>

                    {/* Skills list */}
                    <div className="space-y-2 relative z-10">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Required Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {career.skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Project & Cert */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-900/60 relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1"><Award className="h-3.5 w-3.5" /> Certifications</span>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{career.certifications[0]}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Suggested Project</span>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed truncate" title={career.projectPrompt}>{career.projectPrompt}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
