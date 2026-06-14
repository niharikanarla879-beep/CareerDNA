'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { targetCareers } from '@/lib/constants';
import { 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  PlusCircle, 
  Award,
  Layers, 
  FileText,
  User,
  Briefcase,
  BookOpen,
  Wrench,
  Check
} from 'lucide-react';

interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  dates: string;
  description: string;
}

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  dates: string;
}

interface SkillItem {
  id: string;
  name: string;
  category: string;
}

const aiMockContent: Record<string, { summary: string; bullets: string[] }> = {
  swe: {
    summary: 'Highly analytical and detail-oriented Software Engineer with 4+ years of experience designing and deploying scalable microservices architectures. Proficient in TypeScript, Node.js, and SQL databases, with a proven track record of optimizing backend performance and driving CI/CD automations.',
    bullets: [
      'Engineered a robust REST API service utilizing Node.js and PostgreSQL, decreasing query response times by 35% under peak traffic.',
      'Architected a containerized CI/CD pipeline using Docker and GitHub Actions, reducing deployment errors by 22%.',
      'Refactored legacy React state management into modern modular hooks, boosting frontend rendering efficiency by 18%.'
    ]
  },
  frontend: {
    summary: 'Creative and performance-focused Frontend Developer with 3+ years of expertise crafting responsive, high-speed user interfaces. Expert in React.js, Tailwind CSS, and state management frameworks, dedicated to accessibility compliance and optimizing Core Web Vitals.',
    bullets: [
      'Implemented responsive UI templates using React and Tailwind CSS, increasing mobile user conversion rate by 14%.',
      'Optimized image loading assets and dynamic bundling scripts, improving Google Lighthouse performance score from 72 to 94.',
      'Integrated unified state stores with Zustand and Context APIs, simplifying API pipelines and removing redundant render loops.'
    ]
  },
  backend: {
    summary: 'Robust Backend Developer with a deep focus on API architecture, database optimization, and high availability systems. Expert in architecting microservices with Node.js and AWS infrastructure to support millions of user processes.',
    bullets: [
      'Designed and deployed an event-driven message queue using Redis and Node.js to handle 10k+ requests per second with minimal fail rates.',
      'Optimized SQL index models and cache procedures, decreasing query execution latency by 45ms across primary API endpoints.',
      'Secured network communications by deploying OAuth2 protocols, ensuring full GDPR and SOC2 compliance across microservice clusters.'
    ]
  },
  fullstack: {
    summary: 'Versatile Full Stack Developer with end-to-end expertise in modern web development frameworks. Highly skilled in frontend styling (React, TypeScript) and robust backend operations (Node.js, databases, Docker), passionate about building seamless user journeys.',
    bullets: [
      'Developed and launched a customer dashboard web app using React, Node.js, and MongoDB, scaling user adoption to 50k+ active accounts.',
      'Engineered GraphQL endpoints alongside REST APIs, reducing network payloads by 30% for improved mobile connectivity.',
      'Spearheaded technical integrations with Stripe and third-party SaaS APIs, automating client workflows.'
    ]
  },
  da: {
    summary: 'Data-driven Data Analyst skilled in modeling data warehouses, creating interactive dashboard suites, and extracting strategic insights. Expert in writing complex SQL queries, building Power BI pipelines, and communicating indicators to cross-functional stakeholders.',
    bullets: [
      'Uncovered a critical operational bottleneck through audit statistics, saving $12k in monthly supply chain overhead.',
      'Developed automated ETL reporting suites using Python and Snowflake, reducing manual weekly sheet generation time by 15 hours.',
      'Designed a suite of executive dashboards in Tableau, tracking client retention, user growth, and core performance indicators.'
    ]
  },
  ds: {
    summary: 'Insightful Data Scientist with 5+ years of modeling experience applying statistical analysis, machine learning algorithms, and deep neural networks to resolve business challenges. Expert in Python, PyTorch, and cloud-scale data platforms.',
    bullets: [
      'Trained and deployed a gradient-boosted recommendation model that boosted user click-through rate (CTR) by 26%.',
      'Formulated statistical hypothesis frameworks and conducted A/B testing on pricing models, resulting in an estimated 8% revenue uplift.',
      'Processed massive datasets of 10M+ customer profiles using PySpark and AWS S3, training predictive model pipelines.'
    ]
  },
  ai: {
    summary: 'Innovative AI Engineer specialized in prompt engineering, agentic workflow architecture, RAG systems, and integrating Large Language Models. Experienced in designing semantic indexes and using Pinecone vector databases.',
    bullets: [
      'Architected a Retrieval-Augmented Generation (RAG) assistant using LangChain and OpenAI models, boosting customer query accuracy to 91%.',
      'Configured fine-tuning pipelines for custom open-source models (LLaMA-3), reducing API invocation costs by 65%.',
      'Integrated vector search embeddings using Pinecone DB, reducing search execution latency to under 90ms.'
    ]
  },
  ml: {
    summary: 'Advanced Machine Learning Engineer with hands-on experience designing ML pipelines, training models, and engineering feature databases. Expert in PyTorch, Scikit-Learn, and optimizing MLOps workflows for model hosting.',
    bullets: [
      'Trained a computer vision model utilizing PyTorch, achieving a 98.4% validation accuracy on real-time classification feeds.',
      'Constructed automated feature engineering pipelines, accelerating ML model retraining processes by 3x.',
      'Deployed model serving endpoints within Docker containers on AWS ECS, ensuring 99.9% availability for critical classification APIs.'
    ]
  },
  pm: {
    summary: 'Strategic Product Manager with a strong technical background and a record of managing lifecycle scopes from discovery to deployment. Master of agile scrum, wireframing, GTM alignment, and tracking KPI data metrics.',
    bullets: [
      'Orchestrated cross-functional teams of design and engineering to launch a chat feature, driving a 20% engagement lift within 30 days.',
      'Defined product roadmap priorities based on user research surveys, aligning stakeholder expectations across corporate divisions.',
      'Authored comprehensive PRDs and structured agile backlogs, reducing timeline delivery drift from 6 weeks to under 4 days.'
    ]
  },
  ux: {
    summary: 'User-centric UX Designer with 4+ years of experience wireframing high-fidelity mockups, leading usability testing, and establishing clean UI design systems. Dedicated to accessibility compliance and empathetic customer journeys.',
    bullets: [
      'Redesigned the onboarding user flow using Figma, decreasing user drop-off rate by 35% and streamlining user activations.',
      'Conducted 25+ remote usability testing interviews, translating empirical findings into actionable interface iterations.',
      'Built a reusable Figma component system, reducing front-end development implementation loops by 25%.'
    ]
  }
};


export default function ResumeBuilder() {
  const { user } = useAuth();
  
  // Resume state
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    portfolio: ''
  });
  const [summary, setSummary] = useState('');
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  
  // Template state
  const [template, setTemplate] = useState<'classic' | 'minimal' | 'glass'>('classic');
  const [targetRole, setTargetRole] = useState('swe');
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'skills' | 'education'>('personal');
  const [aiGenerating, setAiGenerating] = useState(false);
  const resumeContainerRef = useRef<HTMLDivElement>(null);

  // Load saved builder content from local storage
  useEffect(() => {
    if (!user) return;
    
    // Load pre-populated auth details if empty
    setPersonalInfo(prev => ({
      ...prev,
      name: prev.name || `${user.firstName} ${user.lastName}`,
      email: prev.email || user.email
    }));

    try {
      const saved = localStorage.getItem(`careerdna_builder_resume_${user.id}`);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.personalInfo) setPersonalInfo(data.personalInfo);
        if (data.summary) setSummary(data.summary);
        if (data.experience) setExperience(data.experience);
        if (data.education) setEducation(data.education);
        if (data.skills) setSkills(data.skills);
        if (data.template) setTemplate(data.template);
      }
    } catch (e) {
      console.error('Error loading builder resume safely:', e);
    }
  }, [user]);

  // Save changes to local storage
  const saveResume = (updatedData: any) => {
    if (!user) return;
    localStorage.setItem(`careerdna_builder_resume_${user.id}`, JSON.stringify(updatedData));
    // Trigger storage event so score on dashboard updates
    window.dispatchEvent(new Event('storage'));
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    const updated = { ...personalInfo, [field]: value };
    setPersonalInfo(updated);
    saveResume({ personalInfo: updated, summary, experience, education, skills, template });
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSummary(value);
    saveResume({ personalInfo, summary: value, experience, education, skills, template });
  };

  // AI Assist Generators
  const triggerAiSummary = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const content = aiMockContent[targetRole] || aiMockContent['swe'];
      setSummary(content.summary);
      saveResume({ personalInfo, summary: content.summary, experience, education, skills, template });
      setAiGenerating(false);
    }, 800);
  };

  const triggerAiBullets = (index: number) => {
    const content = aiMockContent[targetRole] || aiMockContent['swe'];
    const randomBullet = content.bullets[Math.floor(Math.random() * content.bullets.length)];
    
    const updatedExp = [...experience];
    const prevDesc = updatedExp[index].description;
    updatedExp[index].description = prevDesc 
      ? prevDesc.trim() + '\n- ' + randomBullet
      : '- ' + randomBullet;
      
    setExperience(updatedExp);
    saveResume({ personalInfo, summary, experience: updatedExp, education, skills, template });
  };

  // Experience handlers
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: Math.random().toString(36).substring(2, 9),
      company: '',
      title: '',
      dates: '',
      description: ''
    };
    const updated = [...experience, newItem];
    setExperience(updated);
    saveResume({ personalInfo, summary, experience: updated, education, skills, template });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    const updated = experience.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setExperience(updated);
    saveResume({ personalInfo, summary, experience: updated, education, skills, template });
  };

  const removeExperience = (id: string) => {
    const updated = experience.filter(item => item.id !== id);
    setExperience(updated);
    saveResume({ personalInfo, summary, experience: updated, education, skills, template });
  };

  // Education handlers
  const addEducation = () => {
    const newItem: EducationItem = {
      id: Math.random().toString(36).substring(2, 9),
      school: '',
      degree: '',
      dates: ''
    };
    const updated = [...education, newItem];
    setEducation(updated);
    saveResume({ personalInfo, summary, experience, education: updated, skills, template });
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    const updated = education.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setEducation(updated);
    saveResume({ personalInfo, summary, experience, education: updated, skills, template });
  };

  const removeEducation = (id: string) => {
    const updated = education.filter(item => item.id !== id);
    setEducation(updated);
    saveResume({ personalInfo, summary, experience, education: updated, skills, template });
  };

  // Skills handlers
  const addSkill = () => {
    const newItem: SkillItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      category: 'Technical'
    };
    const updated = [...skills, newItem];
    setSkills(updated);
    saveResume({ personalInfo, summary, experience, education, skills: updated, template });
  };

  const updateSkill = (id: string, field: keyof SkillItem, value: string) => {
    const updated = skills.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setSkills(updated);
    saveResume({ personalInfo, summary, experience, education, skills: updated, template });
  };

  const removeSkill = (id: string) => {
    const updated = skills.filter(item => item.id !== id);
    setSkills(updated);
    saveResume({ personalInfo, summary, experience, education, skills: updated, template });
  };

  // Export functions
  const triggerPrint = () => {
    window.print();
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ personalInfo, summary, experience, education, skills }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${personalInfo.name.replace(/\s+/g, '_')}_resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-400" /> AI Resume Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build and optimize an ATS-compliant resume. Generate descriptions, customize templates, and download formats.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={exportJSON}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-smooth cursor-pointer flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export JSON
          </button>
          <button 
            onClick={triggerPrint}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 transition-smooth cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" /> PDF / Print
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto print:block">
        {/* EDITING SUITE PANEL */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          {/* AI Assistance Options */}
          <div className="glass-panel border-indigo-500/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="h-4.5 w-4.5 text-amber-400" />
              <h3 className="font-bold text-white text-sm">AI Copilot Options</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Target AI Role Mapping</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
                >
                  {targetCareers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={triggerAiSummary}
                disabled={aiGenerating}
                className="w-full py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white transition-smooth flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> 
                {aiGenerating ? 'AI Writing...' : 'Generate Profile Summary'}
              </button>
            </div>
          </div>

          {/* Editor Navigation */}
          <div className="flex bg-slate-950 border border-slate-900 rounded-xl p-1 text-xs">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-2 rounded-lg font-bold transition-smooth cursor-pointer ${activeTab === 'personal' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Contact
            </button>
            <button 
              onClick={() => setActiveTab('experience')}
              className={`flex-1 py-2 rounded-lg font-bold transition-smooth cursor-pointer ${activeTab === 'experience' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Experience
            </button>
            <button 
              onClick={() => setActiveTab('skills')}
              className={`flex-1 py-2 rounded-lg font-bold transition-smooth cursor-pointer ${activeTab === 'skills' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Skills
            </button>
            <button 
              onClick={() => setActiveTab('education')}
              className={`flex-1 py-2 rounded-lg font-bold transition-smooth cursor-pointer ${activeTab === 'education' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Education
            </button>
          </div>

          {/* Editor Form Card */}
          <div className="glass-panel border-slate-900 rounded-2xl p-6 space-y-6">
            {/* TAB 1: PERSONAL INFO */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><User className="h-4.5 w-4.5 text-indigo-400" /> Personal Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none transition-smooth"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Professional Title</label>
                    <input 
                      type="text" 
                      value={personalInfo.title}
                      onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                      placeholder="Lead Software Engineer"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none transition-smooth"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Email</label>
                      <input 
                        type="email" 
                        value={personalInfo.email}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none transition-smooth"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Phone</label>
                      <input 
                        type="text" 
                        value={personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        placeholder="(555) 019-9988"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none transition-smooth"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">GitHub Url</label>
                      <input 
                        type="text" 
                        value={personalInfo.github}
                        onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                        placeholder="github.com/john"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-2 text-xs font-semibold text-white outline-none transition-smooth"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">LinkedIn Url</label>
                      <input 
                        type="text" 
                        value={personalInfo.linkedin}
                        onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/john"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-2 text-xs font-semibold text-white outline-none transition-smooth"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Portfolio Url</label>
                      <input 
                        type="text" 
                        value={personalInfo.portfolio}
                        onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                        placeholder="john.dev"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-2 text-xs font-semibold text-white outline-none transition-smooth"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Professional Summary</label>
                    <textarea 
                      value={summary}
                      onChange={handleSummaryChange}
                      rows={5}
                      placeholder="Write your professional bio or use the AI Assist Summary generation above."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none resize-none transition-smooth leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Briefcase className="h-4.5 w-4.5 text-indigo-400" /> Work Experience</h3>
                  <button 
                    type="button" 
                    onClick={addExperience}
                    className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-smooth flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>

                {experience.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs font-semibold">
                    No work experience records added yet. Click Add to insert.
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[450px] overflow-y-auto pr-1 no-scrollbar">
                    {experience.map((exp, idx) => (
                      <div key={exp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-3 relative">
                        <button 
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-smooth cursor-pointer"
                          aria-label="Remove work experience record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-2 mb-1">
                          <span className="h-5 w-5 rounded bg-slate-900 text-slate-400 text-[10px] font-bold flex items-center justify-center border border-slate-800">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white">Experience Block</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] text-slate-500 font-bold uppercase mb-0.5">Company</label>
                            <input 
                              type="text" 
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Tech Corp"
                              className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-500 font-bold uppercase mb-0.5">Title / Role</label>
                            <input 
                              type="text" 
                              value={exp.title}
                              onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                              placeholder="Software Engineer"
                              className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] text-slate-500 font-bold uppercase mb-0.5">Dates (e.g. 2022 - Present)</label>
                            <input 
                              type="text" 
                              value={exp.dates}
                              onChange={(e) => updateExperience(exp.id, 'dates', e.target.value)}
                              placeholder="2022 - Present"
                              className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => triggerAiBullets(idx)}
                              className="w-full py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white text-[11px] font-bold transition-smooth flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="h-3.5 w-3.5" /> AI Add Bullet
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-500 font-bold uppercase mb-0.5">Job Bullet Points</label>
                          <textarea 
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            rows={4}
                            placeholder="- Engineered a backend microservice using Node.js..."
                            className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SKILLS */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Wrench className="h-4.5 w-4.5 text-indigo-400" /> Technical Skills</h3>
                  <button 
                    type="button" 
                    onClick={addSkill}
                    className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-smooth flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Skill
                  </button>
                </div>

                {skills.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs font-semibold">
                    No skills registered. Click Add to insert.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1 no-scrollbar">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-900">
                        <input 
                          type="text" 
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          placeholder="e.g. React, SQL, Figma"
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-500"
                        />
                        <select 
                          value={skill.category}
                          onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-300 cursor-pointer outline-none focus:border-indigo-500"
                        >
                          <option value="Languages">Languages</option>
                          <option value="Frameworks">Frameworks</option>
                          <option value="Databases">Databases</option>
                          <option value="Tools">Tools</option>
                        </select>
                        <button 
                          type="button" 
                          onClick={() => removeSkill(skill.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          aria-label="Remove skill keyword"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><BookOpen className="h-4.5 w-4.5 text-indigo-400" /> Education Background</h3>
                  <button 
                    type="button" 
                    onClick={addEducation}
                    className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-smooth flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>

                {education.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs font-semibold">
                    No education records added yet. Click Add to insert.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1 no-scrollbar">
                    {education.map((edu) => (
                      <div key={edu.id} className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-3 relative">
                        <button 
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-smooth cursor-pointer"
                          aria-label="Remove education record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <div>
                          <label className="block text-[9px] text-slate-500 font-bold uppercase mb-0.5">School / University</label>
                          <input 
                            type="text" 
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            placeholder="State University"
                            className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] text-slate-500 font-bold uppercase mb-0.5">Degree / Course</label>
                            <input 
                              type="text" 
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="B.S. in Computer Science"
                              className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-500 font-bold uppercase mb-0.5">Graduation Dates</label>
                            <input 
                              type="text" 
                              value={edu.dates}
                              onChange={(e) => updateEducation(edu.id, 'dates', e.target.value)}
                              placeholder="2018 - 2022"
                              className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RESUME LIVE PREVIEW SHEET PANEL */}
        <div className="lg:col-span-7 space-y-6 print:col-span-12">
          {/* Template Selectors */}
          <div className="glass-panel border-slate-900 rounded-2xl p-4 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-2 text-slate-400">
              <Layers className="h-4.5 w-4.5" />
              <span className="text-xs font-bold text-slate-300">Choose Template Theme</span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setTemplate('classic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-smooth cursor-pointer ${template === 'classic' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
              >
                Classic Executive
              </button>
              <button 
                onClick={() => setTemplate('minimal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-smooth cursor-pointer ${template === 'minimal' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
              >
                Modern Minimal
              </button>
              <button 
                onClick={() => setTemplate('glass')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-smooth cursor-pointer ${template === 'glass' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
              >
                Creative Glass
              </button>
            </div>
          </div>

          {/* Resume A4 Layout Card */}
          <div 
            ref={resumeContainerRef}
            id="careerdna-resume-print-sheet"
            className={`w-full min-h-[842px] p-8 md:p-10 shadow-2xl transition-all duration-300 print:shadow-none print:p-0 border ${
              template === 'glass'
                ? 'bg-slate-950/60 backdrop-blur-md border-indigo-500/10 text-slate-100 rounded-3xl'
                : template === 'minimal'
                ? 'bg-white text-slate-900 border-slate-200 rounded-lg font-sans'
                : 'bg-white text-slate-900 border-slate-200 rounded-lg font-serif'
            }`}
          >
            {/* RENDER CLASSIC TEMPLATE */}
            {template === 'classic' && (
              <div className="space-y-6 text-[12px] leading-relaxed">
                {/* Header */}
                <div className="text-center space-y-1.5 pb-4 border-b border-slate-200">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">{personalInfo.name || 'Your Full Name'}</h2>
                  {personalInfo.title && <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase">{personalInfo.title}</p>}
                  <div className="text-[10px] text-slate-500 flex justify-center flex-wrap gap-x-4 gap-y-1 font-sans">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
                    {personalInfo.github && <span>{personalInfo.github}</span>}
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                  </div>
                </div>

                {/* Profile Summary */}
                {summary && (
                  <div className="space-y-1.5">
                    <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5">Professional Summary</h3>
                    <p className="text-slate-700 text-justify">{summary}</p>
                  </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5">Professional Experience</h3>
                    <div className="space-y-3">
                      {experience.map(exp => (
                        <div key={exp.id} className="space-y-1">
                          <div className="flex justify-between items-start font-sans">
                            <span className="font-bold text-slate-800">{exp.company || 'Company'}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">{exp.dates || 'Dates'}</span>
                          </div>
                          {exp.title && <div className="text-[10px] font-bold text-slate-600 font-sans italic">{exp.title}</div>}
                          {exp.description && (
                            <p className="text-slate-700 text-[11px] leading-relaxed whitespace-pre-line text-justify pl-3">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5">Technical & Tool Proficiencies</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {Array.from(new Set(skills.map(s => s.category))).map(cat => (
                        <div key={cat} className="flex gap-2">
                          <span className="font-bold text-slate-800 min-w-[75px] font-sans">{cat}:</span>
                          <span className="text-slate-700">
                            {skills.filter(s => s.category === cat).map(s => s.name || 'Skill').join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5">Education</h3>
                    <div className="space-y-1.5">
                      {education.map(edu => (
                        <div key={edu.id} className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-800">{edu.school || 'University Name'}</span>
                            {edu.degree && <span className="text-slate-600 italic"> — {edu.degree}</span>}
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold font-sans">{edu.dates}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RENDER MODERN MINIMAL TEMPLATE */}
            {template === 'minimal' && (
              <div className="grid grid-cols-12 gap-8 text-[11.5px] leading-relaxed">
                {/* Sidebar Column */}
                <div className="col-span-4 border-r border-slate-100 pr-6 space-y-6">
                  {/* Contact Info */}
                  <div className="space-y-2 font-sans">
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight capitalize">{personalInfo.name || 'Your Name'}</h2>
                    {personalInfo.title && <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">{personalInfo.title}</p>}
                    
                    <div className="space-y-1 text-[10px] text-slate-500 pt-4">
                      {personalInfo.email && <p className="truncate">📧 {personalInfo.email}</p>}
                      {personalInfo.phone && <p>📞 {personalInfo.phone}</p>}
                      {personalInfo.portfolio && <p className="truncate">🔗 {personalInfo.portfolio}</p>}
                      {personalInfo.github && <p className="truncate">💻 {personalInfo.github}</p>}
                      {personalInfo.linkedin && <p className="truncate">👥 {personalInfo.linkedin}</p>}
                    </div>
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-3 font-sans">
                      <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1">Skills</h3>
                      {Array.from(new Set(skills.map(s => s.category))).map(cat => (
                        <div key={cat} className="space-y-1">
                          <span className="font-extrabold text-[9px] text-slate-500 uppercase tracking-wider block">{cat}</span>
                          <p className="text-slate-800 text-[11px]">
                            {skills.filter(s => s.category === cat).map(s => s.name || 'Skill').join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="space-y-3 font-sans">
                      <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1">Education</h3>
                      {education.map(edu => (
                        <div key={edu.id} className="space-y-0.5">
                          <span className="font-bold text-slate-800 block">{edu.school || 'University'}</span>
                          <span className="text-slate-600 text-[10px] block">{edu.degree}</span>
                          <span className="text-slate-400 text-[9px] block font-mono">{edu.dates}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main Content Column */}
                <div className="col-span-8 space-y-6">
                  {/* Summary */}
                  {summary && (
                    <div className="space-y-2">
                      <h3 className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Professional Profile</h3>
                      <p className="text-slate-700 text-justify">{summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {experience.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Experience History</h3>
                      <div className="space-y-4">
                        {experience.map(exp => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-slate-900 font-sans">{exp.title || 'Role'}</span>
                              <span className="text-[9px] text-slate-400 font-mono font-bold shrink-0">{exp.dates}</span>
                            </div>
                            <div className="text-[10px] font-bold text-indigo-600 font-sans">{exp.company}</div>
                            {exp.description && (
                              <p className="text-slate-600 text-justify whitespace-pre-line text-[11px] leading-relaxed pl-1 pt-0.5">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RENDER CREATIVE GLASSMorphic TEMPLATE */}
            {template === 'glass' && (
              <div className="space-y-6 text-[12px] leading-relaxed">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-indigo-500/10 pb-5 gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-extrabold tracking-tight text-white capitalize">{personalInfo.name || 'Your Full Name'}</h2>
                    {personalInfo.title && <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide">{personalInfo.title}</p>}
                  </div>
                  <div className="text-[10px] text-slate-400 space-y-0.5 font-mono text-left md:text-right shrink-0">
                    {personalInfo.email && <p>Email: {personalInfo.email}</p>}
                    {personalInfo.phone && <p>Phone: {personalInfo.phone}</p>}
                    {personalInfo.portfolio && <p>Portfolio: {personalInfo.portfolio}</p>}
                    {personalInfo.github && <p>GitHub: {personalInfo.github}</p>}
                    {personalInfo.linkedin && <p>LinkedIn: {personalInfo.linkedin}</p>}
                  </div>
                </div>

                {/* Profile Summary */}
                {summary && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5"><User className="h-4 w-4" /> Profile Summary</h3>
                    <p className="text-slate-300 text-justify bg-slate-900/20 border border-slate-900 p-4 rounded-xl">{summary}</p>
                  </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> Professional Experience</h3>
                    <div className="space-y-4">
                      {experience.map(exp => (
                        <div key={exp.id} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900/60 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-white text-sm block">{exp.title || 'Job Title'}</span>
                              <span className="text-xs text-indigo-400 font-semibold">{exp.company}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{exp.dates}</span>
                          </div>
                          {exp.description && (
                            <p className="text-slate-300 text-[11.5px] leading-relaxed whitespace-pre-line text-justify pl-1">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills & Education Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Skills block */}
                  {skills.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5"><Wrench className="h-4 w-4" /> Skill Grid</h3>
                      <div className="p-4 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-3">
                        {Array.from(new Set(skills.map(s => s.category))).map(cat => (
                          <div key={cat} className="space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">{cat}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {skills.filter(s => s.category === cat).map(s => (
                                <span key={s.id} className="px-2 py-0.5 rounded-md bg-indigo-500/5 border border-indigo-500/10 text-[10px] font-semibold text-indigo-300">
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education block */}
                  {education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> Education</h3>
                      <div className="p-4 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-3">
                        {education.map(edu => (
                          <div key={edu.id} className="space-y-0.5">
                            <span className="font-bold text-white block text-xs">{edu.school}</span>
                            <span className="text-[11px] text-slate-400 block">{edu.degree}</span>
                            <span className="text-[9px] text-slate-500 font-mono block">{edu.dates}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Inline styles for Print overrides */}
      <style jsx global>{`
        @media print {
          /* Hide sidebar, dashboard bars, buttons, and elements */
          body * {
            visibility: hidden;
          }
          header, aside, main > div > div:first-child, .print\\:hidden, aside *, header *, button, select, label {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Show ONLY the resume sheet, expanded to full page width */
          #careerdna-resume-print-sheet, #careerdna-resume-print-sheet * {
            visibility: visible;
          }
          #careerdna-resume-print-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
          /* Ensure text colors match classic black/white for physical prints */
          #careerdna-resume-print-sheet span, 
          #careerdna-resume-print-sheet p, 
          #careerdna-resume-print-sheet h2, 
          #careerdna-resume-print-sheet h3 {
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}
