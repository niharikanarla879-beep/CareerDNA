'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import {
  ArrowLeft,
  Dna,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  ExternalLink,
  Flame,
  ChevronRight
} from 'lucide-react';
import { targetCareers } from '@/lib/constants';
import { roleKeywords } from '@/lib/analyzer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ResourceLink {
  label: string;
  url: string;
}

interface SkillPathway {
  whyItMatters: string;
  priorityScore: number; // Out of 100
  estimatedHours: number;
  readinessImpact: number; // percentage boost
  beginnerProject: string;
  intermediateProject: string;
  advancedProject: string;
  resources: {
    youtube: ResourceLink;
    coursera: ResourceLink;
    udemy: ResourceLink;
    freecodecamp: ResourceLink;
    roadmap: ResourceLink;
    geeksforgeeks: ResourceLink;
    documentation: ResourceLink;
  };
}

const comprehensiveSkillPathways: Record<string, SkillPathway> = {
  'React': {
    whyItMatters: 'React is the dominant frontend framework powering single-page applications. It handles visual interfaces and dynamic client state.',
    priorityScore: 95,
    estimatedHours: 40,
    readinessImpact: 12,
    beginnerProject: 'Interactive Todo list with filter tabs and local storage backups.',
    intermediateProject: 'SaaS Dashboard showcasing responsive grid tiles, custom SVG maps, and state updates.',
    advancedProject: 'Collaboration canvas editor workspace utilizing websockets and optimistic state models.',
    resources: {
      youtube: { label: 'React Tutorial for Beginners (Programming with Mosh)', url: 'https://www.youtube.com/watch?v=SqcY0GlE17s' },
      coursera: { label: 'Front-End Developer Professional Certificate (Meta)', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
      udemy: { label: 'React - The Complete Guide (Maximilian Schwarzmüller)', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' },
      freecodecamp: { label: 'Learn React - Full Course for Beginners', url: 'https://www.freecodecamp.org/news/free-react-course-2024/' },
      roadmap: { label: 'React Roadmap Guide', url: 'https://roadmap.sh/react' },
      geeksforgeeks: { label: 'ReactJS Tutorials Checklist', url: 'https://www.geeksforgeeks.org/reactjs-tutorials/' },
      documentation: { label: 'Official React Documentation', url: 'https://react.dev' }
    }
  },
  'Node.js': {
    whyItMatters: 'Node.js enables JavaScript execution on servers. It powers backend REST APIs, web socket networks, and database query streams.',
    priorityScore: 92,
    estimatedHours: 45,
    readinessImpact: 10,
    beginnerProject: 'CLI script managing local JSON database operations.',
    intermediateProject: 'E-commerce API with rate limits, token security, and schema validations.',
    advancedProject: 'Microservices gateway with JWT auth proxying to localized service nodes.',
    resources: {
      youtube: { label: 'Node.js Tutorial for Beginners (Mosh)', url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4' },
      coursera: { label: 'Server-side Development with NodeJS (HKUST)', url: 'https://www.coursera.org/learn/server-side-nodejs' },
      udemy: { label: 'Node.js, Express, MongoDB Bootcamp (Jonas Schmedtmann)', url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/' },
      freecodecamp: { label: 'Learn Node.js and Express - Course', url: 'https://www.freecodecamp.org/news/free-node-js-course/' },
      roadmap: { label: 'Backend Developer Roadmap', url: 'https://roadmap.sh/backend' },
      geeksforgeeks: { label: 'Node.js Tutorial Guide', url: 'https://www.geeksforgeeks.org/nodejs/' },
      documentation: { label: 'Official Node.js Docs', url: 'https://nodejs.org/en/docs/' }
    }
  },
  'TypeScript': {
    whyItMatters: 'TypeScript adds typed definitions to JavaScript, eliminating compile bugs, standardizing parameters, and aiding team refactors.',
    priorityScore: 88,
    estimatedHours: 25,
    readinessImpact: 8,
    beginnerProject: 'Typed mathematical algorithms and validation check libraries.',
    intermediateProject: 'Strictly-typed state manager for task boards.',
    advancedProject: 'ORM schema compiler generating typed queries for PostgreSQL.',
    resources: {
      youtube: { label: 'TypeScript Tutorial for Beginners (Mosh)', url: 'https://www.youtube.com/watch?v=d56mG7DezGs' },
      coursera: { label: 'TypeScript for Web Development', url: 'https://www.coursera.org/projects/typescript-web-development' },
      udemy: { label: 'Understanding TypeScript (Maximilian Schwarzmüller)', url: 'https://www.udemy.com/course/understanding-typescript/' },
      freecodecamp: { label: 'TypeScript Course for Beginners', url: 'https://www.freecodecamp.org/news/learn-typescript-complete-course/' },
      roadmap: { label: 'TypeScript Roadmap Guide', url: 'https://roadmap.sh/typescript' },
      geeksforgeeks: { label: 'TypeScript Tutorial Index', url: 'https://www.geeksforgeeks.org/typescript/' },
      documentation: { label: 'Official TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' }
    }
  },
  'SQL': {
    whyItMatters: 'SQL is the global language for query databases. Essential for retrieving company metrics, joins, and indexing schemas.',
    priorityScore: 90,
    estimatedHours: 30,
    readinessImpact: 10,
    beginnerProject: 'Local SQLite database managing employee directories.',
    intermediateProject: 'Complex store queries implementing joins, aggregates, and subqueries.',
    advancedProject: 'Optimized index table structuring resolving 1M+ query bottlenecks.',
    resources: {
      youtube: { label: 'SQL Tutorial for Beginners (Mosh)', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      coursera: { label: 'SQL for Data Science (UC Davis)', url: 'https://www.coursera.org/learn/sql-for-data-science' },
      udemy: { label: 'The Complete SQL Bootcamp (Jose Portilla)', url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/' },
      freecodecamp: { label: 'SQL and Databases - Complete Course', url: 'https://www.freecodecamp.org/news/sql-and-databases-full-course/' },
      roadmap: { label: 'PostgreSQL Roadmap Guide', url: 'https://roadmap.sh/postgresql' },
      geeksforgeeks: { label: 'SQL Tutorial Handbook', url: 'https://www.geeksforgeeks.org/sql-tutorial/' },
      documentation: { label: 'PostgreSQL Official Docs', url: 'https://www.postgresql.org/docs/' }
    }
  },
  'AWS': {
    whyItMatters: 'Amazon Web Services is the largest cloud provider. Required for deploying SaaS servers, databases, and microservices.',
    priorityScore: 85,
    estimatedHours: 50,
    readinessImpact: 10,
    beginnerProject: 'Host a static portfolio page on S3 behind CloudFront.',
    intermediateProject: 'Deploy an Express backend on EC2 with RDS database layers.',
    advancedProject: 'Serverless backend stack on Lambda using API Gateway and DynamoDB.',
    resources: {
      youtube: { label: 'AWS Certified Cloud Practitioner Course (FreeCodeCamp)', url: 'https://www.youtube.com/watch?v=SOTamWGuqXs' },
      coursera: { label: 'AWS Cloud Solutions Architect Specialization', url: 'https://www.coursera.org/specializations/aws-cloud-solutions-architect' },
      udemy: { label: 'AWS Certified Solutions Architect Associate (Stephane Maarek)', url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/' },
      freecodecamp: { label: 'AWS Solutions Architect SAA-C03 Course', url: 'https://www.freecodecamp.org/news/aws-certified-solutions-architect-associate-study-course/' },
      roadmap: { label: 'AWS Cloud Roadmap', url: 'https://roadmap.sh/aws' },
      geeksforgeeks: { label: 'AWS Tutorial Guide', url: 'https://www.geeksforgeeks.org/aws-tutorial/' },
      documentation: { label: 'Official AWS Documentation', url: 'https://docs.aws.amazon.com/' }
    }
  },
  'Docker': {
    whyItMatters: 'Docker containerizes code blocks so applications deploy identically across developer sandboxes and live cloud hosts.',
    priorityScore: 80,
    estimatedHours: 20,
    readinessImpact: 8,
    beginnerProject: 'Containerize a basic Node.js backend using a Dockerfile.',
    intermediateProject: 'Multi-container network compiling web nodes and database assets with Docker Compose.',
    advancedProject: 'Production compose setup featuring load balancers, database replica slots, and config vaults.',
    resources: {
      youtube: { label: 'Docker Tutorial for Beginners (Programming with Mosh)', url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI' },
      coursera: { label: 'Docker for Beginners (Coursera Project)', url: 'https://www.coursera.org/projects/docker-beginners' },
      udemy: { label: 'Docker and Kubernetes: The Complete Guide (Stephen Grider)', url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/' },
      freecodecamp: { label: 'Docker Course for Beginners', url: 'https://www.freecodecamp.org/news/learn-docker-complete-course/' },
      roadmap: { label: 'Docker Roadmap Checklist', url: 'https://roadmap.sh/docker' },
      geeksforgeeks: { label: 'Docker Tutorial Index', url: 'https://www.geeksforgeeks.org/docker/' },
      documentation: { label: 'Official Docker Reference Docs', url: 'https://docs.docker.com/' }
    }
  },
  'System Design': {
    whyItMatters: 'System Design covers the architecture of scalable distributed systems. Needed to build robust databases and prevent latency outages.',
    priorityScore: 90,
    estimatedHours: 60,
    readinessImpact: 14,
    beginnerProject: 'Design diagram schema mapping three-tier web application servers.',
    intermediateProject: 'Architect a chat system layout supporting 10,000 active users with load balancers.',
    advancedProject: 'Design a distributed video streaming platform handling millions of daily uploads and cache distributions.',
    resources: {
      youtube: { label: 'System Design for Beginners (ByteByteGo)', url: 'https://www.youtube.com/watch?v=i53Gi_K397I' },
      coursera: { label: 'Software Design and Architecture (Alberta)', url: 'https://www.coursera.org/specializations/software-design-architecture' },
      udemy: { label: 'Pragmatic System Design (Udemy)', url: 'https://www.udemy.com/course/pragmatic-system-design/' },
      freecodecamp: { label: 'System Design Course for Developers', url: 'https://www.freecodecamp.org/news/systems-design-course/' },
      roadmap: { label: 'System Design Roadmap', url: 'https://roadmap.sh/system-design' },
      geeksforgeeks: { label: 'System Design Tutorial Guide', url: 'https://www.geeksforgeeks.org/system-design-tutorial/' },
      documentation: { label: 'System Design Primer Repository', url: 'https://github.com/donnemartin/system-design-primer' }
    }
  },
  'Python': {
    whyItMatters: 'Python is the core language for Data Science, Machine Learning, and AI. Its syntax is clean and optimized for data libraries.',
    priorityScore: 95,
    estimatedHours: 30,
    readinessImpact: 12,
    beginnerProject: 'CLI math calculators and structured text parsing scripts.',
    intermediateProject: 'Local directory file manager storing parsed data inside SQL tables.',
    advancedProject: 'REST API wrapper service compiling custom machine learning model classifications.',
    resources: {
      youtube: { label: 'Python Tutorial for Beginners (Mosh)', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
      coursera: { label: 'Python for Everybody Specialization (Michigan)', url: 'https://www.coursera.org/specializations/python' },
      udemy: { label: '100 Days of Code: Complete Python Bootcamp (Angela Yu)', url: 'https://www.udemy.com/course/100-days-of-code/' },
      freecodecamp: { label: 'Learn Python - Full Course for Beginners', url: 'https://www.freecodecamp.org/news/learn-python-full-course/' },
      roadmap: { label: 'Python Developer Roadmap', url: 'https://roadmap.sh/python' },
      geeksforgeeks: { label: 'Python Programming Language Guide', url: 'https://www.geeksforgeeks.org/python-programming-language/' },
      documentation: { label: 'Official Python Documentation', url: 'https://docs.python.org/3/' }
    }
  },
  'LLMs': {
    whyItMatters: 'Large Language Models power AI agents. Crucial to understand fine-tuning, embeddings, and prompt structures.',
    priorityScore: 90,
    estimatedHours: 35,
    readinessImpact: 10,
    beginnerProject: 'API interface wrapper calling OpenAI model checkpoints.',
    intermediateProject: 'Prompt testing sandbox evaluating accuracy variations across models.',
    advancedProject: 'Fine-tuned LLM classifier deploying custom dataset criteria.',
    resources: {
      youtube: { label: 'Generative AI with Large Language Models Course (DeepLearning)', url: 'https://www.youtube.com/watch?v=U3dGsnE7l3c' },
      coursera: { label: 'Generative AI with LLMs (DeepLearning.AI)', url: 'https://www.coursera.org/learn/generative-ai-with-llms' },
      udemy: { label: 'Generative AI & LLM Bootcamp (Udemy)', url: 'https://www.udemy.com/course/generative-ai-llm-bootcamp/' },
      freecodecamp: { label: 'LangChain and LLM Course for Beginners', url: 'https://www.freecodecamp.org/news/langchain-llms-course/' },
      roadmap: { label: 'AI Engineer Roadmap', url: 'https://roadmap.sh/ai-engineer' },
      geeksforgeeks: { label: 'Large Language Models (LLM) Reference', url: 'https://www.geeksforgeeks.org/large-language-models-llms/' },
      documentation: { label: 'HuggingFace Transformers Docs', url: 'https://huggingface.co/docs/transformers/index' }
    }
  },
  'Figma': {
    whyItMatters: 'Figma is the industry standard UI/UX design tool. Essential for wireframing, collaborative prototyping, and design system component building.',
    priorityScore: 92,
    estimatedHours: 25,
    readinessImpact: 12,
    beginnerProject: 'Basic mockup screens mapping profile headers.',
    intermediateProject: 'High-fidelity mobile UI checkout screens using Figma auto-layouts and components.',
    advancedProject: 'Interactive prototype mapping responsive sidebar grids with dark/light themes.',
    resources: {
      youtube: { label: 'Figma UI/UX Design Tutorial (FreeCodeCamp)', url: 'https://www.youtube.com/watch?v=c9Wg6RY_TgpU' },
      coursera: { label: 'Google UX Design Professional Certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design' },
      udemy: { label: 'Figma UI/UX Masterclass (Udemy)', url: 'https://www.udemy.com/course/figma-uiux-masterclass/' },
      freecodecamp: { label: 'Learn Figma for Beginners Course', url: 'https://www.freecodecamp.org/news/learn-figma-full-course/' },
      roadmap: { label: 'UX Design Roadmap Guide', url: 'https://roadmap.sh/ux' },
      geeksforgeeks: { label: 'Figma Interface Design Reference', url: 'https://www.geeksforgeeks.org/figma/' },
      documentation: { label: 'Official Figma Help Center', url: 'https://help.figma.com/hc/en-us' }
    }
  }
};

export default function SkillGap() {
  const { user } = useAuth();
  const { latestResume, targetCareerId, setTargetCareerId, scores } = useResume();
  const [selectedGapSkill, setSelectedGapSkill] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentSkills = useMemo(() => {
    return latestResume ? (latestResume.result.detectedSkills || []) : [];
  }, [latestResume]);

  const targetCareer = targetCareerId || 'swe';

  // Compute category statistics for the bar chart
  const chartData = useMemo(() => {
    const categoriesMap: Record<string, { verified: number; gap: number }> = {};
    const requiredSkillsForChart = roleKeywords[targetCareer] || roleKeywords['swe'];
    const lowerCurrentForChart = currentSkills.map(s => s.toLowerCase());

    requiredSkillsForChart.forEach(kw => {
      const isMatched = lowerCurrentForChart.includes(kw.name.toLowerCase());
      const cat = kw.category;
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = { verified: 0, gap: 0 };
      }
      if (isMatched) {
        categoriesMap[cat].verified += 1;
      } else {
        categoriesMap[cat].gap += 1;
      }
    });

    return Object.entries(categoriesMap).map(([category, stats]) => ({
      category,
      Verified: stats.verified,
      Gap: stats.gap
    }));
  }, [targetCareer, currentSkills]);

  // Match and Gaps list computations
  const { matchedSkills, missingSkills, foundationalGaps, professionalGaps, strategicGaps } = useMemo(() => {
    const required = roleKeywords[targetCareer] || roleKeywords['swe'];
    const matched: any[] = [];
    const missing: any[] = [];
    const foundational: any[] = [];
    const professional: any[] = [];
    const strategic: any[] = [];

    const lowerCurrent = currentSkills.map(s => s.toLowerCase());

    required.forEach(kw => {
      const nameMatch = lowerCurrent.includes(kw.name.toLowerCase());
      if (nameMatch) {
        matched.push(kw);
      } else {
        missing.push(kw);
        const nameLower = kw.name.toLowerCase();
        const catLower = kw.category.toLowerCase();
        
        const isAdvancedCategory = catLower.includes('architecture') || 
                                   catLower.includes('devops') || 
                                   catLower.includes('ops') || 
                                   catLower.includes('cloud') || 
                                   catLower.includes('system design') ||
                                   nameLower === 'aws' || 
                                   nameLower === 'kubernetes' || 
                                   nameLower === 'docker' || 
                                   nameLower === 'ci/cd' || 
                                   nameLower === 'langchain' || 
                                   nameLower === 'rag' || 
                                   nameLower === 'mlops' ||
                                   nameLower === 'system design' ||
                                   nameLower === 'microservices';

        if (kw.isPrimary) {
          foundational.push(kw);
        } else if (isAdvancedCategory) {
          strategic.push(kw);
        } else {
          professional.push(kw);
        }
      }
    });

    return { 
      matchedSkills: matched, 
      missingSkills: missing,
      foundationalGaps: foundational, 
      professionalGaps: professional, 
      strategicGaps: strategic 
    };
  }, [targetCareer, currentSkills]);

  // Sync selected gap skill
  useEffect(() => {
    if (missingSkills.length > 0) {
      setSelectedGapSkill(missingSkills[0].name);
    } else {
      setSelectedGapSkill(null);
    }
  }, [missingSkills]);

  const handleCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetCareerId(e.target.value);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20';
    if (score >= 50) return 'text-amber-400 border-amber-500/20';
    return 'text-rose-400 border-rose-500/20';
  };

  if (!user) return null;

  if (!latestResume) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Dna className="h-6 w-6 text-rose-400 animate-pulse" /> Skill Gap Analyzer
            </h1>
          </div>
        </div>

        <div className="glass-panel border-rose-500/10 rounded-3xl p-8 text-center max-w-lg mx-auto my-12 space-y-6 flex flex-col items-center justify-center min-h-[300px]">
          <div className="h-16 w-16 rounded-2xl bg-rose-500/5 border border-rose-500/15 flex items-center justify-center text-rose-400 shadow-lg">
            <AlertTriangle className="h-8 w-8 text-rose-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-lg">No Active Resume Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please upload a resume first in the ATS Resume Analyzer to run a gap analysis and discover tailored learning recommendations.
            </p>
          </div>
          <Link
            href="/dashboard/resume-analyzer"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 transition-smooth"
          >
            Go to Resume Analyzer
          </Link>
        </div>
      </div>
    );
  }

  // Active pathway metadata resolver
  const activePathway = selectedGapSkill
    ? comprehensiveSkillPathways[selectedGapSkill] || {
      whyItMatters: `It is a core technical requirement and a target skill listed in the guidelines for ${targetCareers.find(c => c.id === targetCareer)?.name}.`,
      priorityScore: 75,
      estimatedHours: 25,
      readinessImpact: 6,
      beginnerProject: `Create a simple local codebase utilizing ${selectedGapSkill} syntax functions.`,
      intermediateProject: `Build an integration app utilizing ${selectedGapSkill} tools.`,
      advancedProject: `Compile a production ready workflow featuring ${selectedGapSkill} scalability modules.`,
      resources: {
        youtube: { label: `Complete ${selectedGapSkill} Playlists`, url: 'https://youtube.com' },
        coursera: { label: `${selectedGapSkill} Foundations course`, url: 'https://coursera.org' },
        udemy: { label: `${selectedGapSkill} Complete Masterclass`, url: 'https://udemy.com' },
        freecodecamp: { label: `Learn ${selectedGapSkill} - Full Course`, url: 'https://freecodecamp.org' },
        roadmap: { label: `${selectedGapSkill} Roadmap Guide`, url: 'https://roadmap.sh' },
        geeksforgeeks: { label: `${selectedGapSkill} Tutorials Handbook`, url: 'https://geeksforgeeks.org' },
        documentation: { label: `Official ${selectedGapSkill} Documentation`, url: 'https://google.com' }
      }
    }
    : null;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Dna className="h-6 w-6 text-rose-400 animate-pulse" /> Skill Gap Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze matching tech stack parameters, evaluate Job Readiness indices, and access direct clickable learning pathways.
          </p>
        </div>

        {/* Selected target role */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-2 border border-slate-900 rounded-xl">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1 shrink-0">Target Profile</span>
          <select
            value={targetCareer}
            onChange={handleCareerChange}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
          >
            {targetCareers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview stats panel: Job Readiness Meter */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-panel border-slate-900 rounded-2xl p-4 flex items-center justify-between bg-slate-950/40">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Job Readiness Score</span>
            <p className="text-lg font-extrabold text-white mt-0.5">{scores.jobReadinessScore}%</p>
          </div>
          <div className="h-2 w-24 bg-slate-900 rounded-full overflow-hidden">
            <div className="bg-teal-400 h-full" style={{ width: `${scores.jobReadinessScore}%` }} />
          </div>
        </div>

        <div className="glass-panel border-slate-900 rounded-2xl p-4 flex items-center justify-between bg-slate-950/40">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Missing Technologies</span>
            <p className="text-lg font-extrabold text-rose-400 mt-0.5">{scores.missingSkills.length} Required</p>
          </div>
          <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0" />
        </div>

        <div className="glass-panel border-slate-900 rounded-2xl p-4 flex items-center justify-between bg-slate-950/40">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Timeline to Job-Ready</span>
            <p className="text-lg font-extrabold text-indigo-400 mt-0.5">~{scores.estimatedReadyWeeks} Weeks</p>
          </div>
          <Clock className="h-6 w-6 text-indigo-400 shrink-0" />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* LEFT COLUMN: CHARTS, VERIFIED SKILLS, & GAP TAG CHIPS */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Competency Chart */}
          <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4 bg-slate-950/40">
            <h3 className="font-bold text-white text-base">Competency Categories Chart</h3>
            <div className="relative w-full h-[180px] pt-1">
              {mounted && chartData.length > 0 ? (
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '10px' }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '10px' }}
                      itemStyle={{ fontSize: '10px' }}
                    />
                    <Bar dataKey="Verified" fill="#10b981" />
                    <Bar dataKey="Gap" fill="#f43f5e" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500 font-semibold">
                  Loading chart graphics...
                </div>
              )}
            </div>
          </div>

          {/* Verified skills */}
          <div className="glass-panel border-slate-900 rounded-3xl p-5 space-y-3">
            <h3 className="font-bold text-white text-sm">Your Verified Skills ({matchedSkills.length})</h3>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((s, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {s.name}
                </span>
              ))}
              {matchedSkills.length === 0 && (
                <span className="text-xs text-slate-500 italic">No matching skills detected in your profile.</span>
              )}
            </div>
          </div>

          {/* Tag Gaps tags */}
          <div className="glass-panel border-slate-900 rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Gaps to Optimize ({missingSkills.length})</h3>
            
            {missingSkills.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center text-xs text-emerald-400 font-bold">
                100% skill matching achieved!
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {/* Foundational */}
                {foundationalGaps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Beginner (Foundational)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {foundationalGaps.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedGapSkill(s.name)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-smooth ${
                            selectedGapSkill === s.name 
                              ? 'bg-rose-500 border-rose-500 text-white shadow-md' 
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:border-rose-400/60'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional */}
                {professionalGaps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Intermediate (Professional)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {professionalGaps.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedGapSkill(s.name)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-smooth ${
                            selectedGapSkill === s.name 
                              ? 'bg-amber-500 border-amber-500 text-white shadow-md' 
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:border-amber-400/60'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategic */}
                {strategicGaps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Advanced (Strategic)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {strategicGaps.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedGapSkill(s.name)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-smooth ${
                            selectedGapSkill === s.name 
                              ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' 
                              : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:border-indigo-400/60'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: ACTION RECOMMENDATION BLUEPRINT MAPS */}
        <div className="lg:col-span-6">
          {selectedGapSkill && activePathway ? (
            <div className="glass-panel border-indigo-500/10 rounded-3xl p-6 space-y-5 animate-fade-in relative overflow-hidden bg-slate-950/40">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
              
              {/* Header metadata */}
              <div className="space-y-1 border-b border-slate-900 pb-3 relative z-10">
                <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Gap Solution Checklist
                </span>
                <h3 className="font-extrabold text-white text-base">Technology: {selectedGapSkill}</h3>
                <p className="text-xs text-slate-400 leading-relaxed text-justify">{activePathway.whyItMatters}</p>
              </div>

              {/* Priority & Impact Stats */}
              <div className="grid grid-cols-3 gap-3 pt-1 relative z-10">
                <div className="bg-slate-950/60 border border-slate-900 p-2.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Priority</span>
                  <span className="text-xs font-extrabold text-white mt-1 block font-mono">{activePathway.priorityScore}/100</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-900 p-2.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Syllabus Time</span>
                  <span className="text-xs font-extrabold text-white mt-1 block font-mono">{activePathway.estimatedHours} Hrs</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-900 p-2.5 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Readiness Up</span>
                  <span className="text-xs font-extrabold text-teal-400 mt-1 block font-mono">+{activePathway.readinessImpact}%</span>
                </div>
              </div>

              {/* Direct clickable resources list */}
              <div className="space-y-3 relative z-10 pt-2">
                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Curated Clickable Resources</h4>
                <div className="space-y-2">
                  {[
                    { type: 'YouTube Playlist', val: activePathway.resources.youtube },
                    { type: 'Coursera Syllabus', val: activePathway.resources.coursera },
                    { type: 'Udemy Course', val: activePathway.resources.udemy },
                    { type: 'FreeCodeCamp Core', val: activePathway.resources.freecodecamp },
                    { type: 'Roadmap.sh Blueprint', val: activePathway.resources.roadmap },
                    { type: 'GeeksforGeeks Guide', val: activePathway.resources.geeksforgeeks },
                    { type: 'Official Documentation', val: activePathway.resources.documentation }
                  ].map((res, i) => (
                    <a 
                      key={i}
                      href={res.val.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-900 hover:border-indigo-500/40 text-xs flex justify-between items-center group transition-smooth"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-[9px] text-indigo-400 font-bold block font-mono uppercase leading-none">{res.type}</span>
                        <span className="text-slate-300 font-bold block truncate mt-1 text-[11px] group-hover:text-white transition-smooth">{res.val.label}</span>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-smooth" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Curated project prompts */}
              <div className="space-y-3 pt-3 border-t border-slate-900 relative z-10">
                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Recommended Practice Project Milestones</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-1">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Beginner Stage Project</span>
                    <p className="text-slate-300 leading-relaxed text-justify">{activePathway.beginnerProject}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-1">
                    <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest font-mono">Intermediate Stage Project</span>
                    <p className="text-slate-300 leading-relaxed text-justify">{activePathway.intermediateProject}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-1">
                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Advanced Stage Project</span>
                    <p className="text-slate-300 leading-relaxed text-justify">{activePathway.advancedProject}</p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel border-slate-900 rounded-3xl p-6 text-center py-12 text-slate-500 text-xs font-semibold flex flex-col items-center justify-center space-y-3 min-h-[300px]">
              <Compass className="h-10 w-10 text-slate-600 animate-spin" style={{ animationDuration: '6s' }} />
              <p>All tech gaps resolved for this profile! Switch Target Career to inspect other pathways.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
