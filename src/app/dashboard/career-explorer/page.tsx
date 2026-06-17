'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useResume } from '@/lib/resume-context';
import { 
  ArrowLeft, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Columns, 
  DollarSign, 
  TrendingUp, 
  Info, 
  X, 
  Compass
} from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface CareerExplorerDetails {
  id: string;
  name: string;
  salary: string;
  outlook: string;
  description: string;
  skills: string[];
  certifications: string[];
  riasec: string;
}

const detailedCareerDb: Record<string, CareerExplorerDetails> = {
  swe: {
    id: 'swe',
    name: 'Software Engineer',
    salary: '$95,000 - $145,000',
    outlook: '+25% (Much faster than average)',
    description: 'Design, write, test, and deploy modular software applications. Build scalable web architectures, optimize databases, and write automated tests.',
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'Git', 'REST APIs', 'System Design'],
    certifications: ['AWS Certified Solutions Architect', 'Meta Front-End Developer', 'Oracle Certified Java SE Developer'],
    riasec: 'Investigative, Realistic'
  },
  frontend: {
    id: 'frontend',
    name: 'Frontend Developer',
    salary: '$85,000 - $130,000',
    outlook: '+22% (Faster than average)',
    description: 'Construct responsive, interactive user interfaces for web and mobile apps. Refine page load layouts, styles, and state structures.',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'State Management', 'Web Performance'],
    certifications: ['Meta Front-End Developer', 'UX Design Professional (Google)', 'W3C Frontend Web Developer'],
    riasec: 'Artistic, Realistic'
  },
  backend: {
    id: 'backend',
    name: 'Backend Developer',
    salary: '$98,000 - $150,000',
    outlook: '+26% (Much faster than average)',
    description: 'Engineer secured servers, relational and document databases, and application integrations. Scale API request thresholds and optimize caches.',
    skills: ['Node.js', 'Python', 'SQL', 'NoSQL', 'REST APIs', 'System Design', 'Docker', 'AWS'],
    certifications: ['AWS Certified Developer - Associate', 'Google Cloud Certified Professional Cloud Developer', 'MongoDB Certified Developer'],
    riasec: 'Investigative, Realistic'
  },
  fullstack: {
    id: 'fullstack',
    name: 'Full Stack Developer',
    salary: '$100,000 - $155,000',
    outlook: '+28% (Much faster than average)',
    description: 'Build end-to-end features spanning server services and web UI components. Manage complete lifecycle deployment pipelines.',
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'REST APIs', 'Git', 'AWS'],
    certifications: ['AWS Certified Solutions Architect', 'Full Stack Web Developer (Microsoft)', 'Meta Front-End Developer'],
    riasec: 'Realistic, Investigative'
  },
  da: {
    id: 'da',
    name: 'Data Analyst',
    salary: '$70,000 - $105,000',
    outlook: '+18% (Faster than average)',
    description: 'Analyze company data records to extract actionable business patterns. Model business intelligence dashboards and query relational indexes.',
    skills: ['SQL', 'Excel', 'Tableau', 'Power BI', 'Data Analysis', 'Data Visualization', 'Pandas'],
    certifications: ['Google Data Analytics Certificate', 'Microsoft Certified: Power BI Data Analyst', 'Tableau Desktop Specialist'],
    riasec: 'Conventional, Investigative'
  },
  ds: {
    id: 'ds',
    name: 'Data Scientist',
    salary: '$105,000 - $160,000',
    outlook: '+31% (Much faster than average)',
    description: 'Use advanced statistical methods and machine learning models to answer complex business questions. Design experimental A/B testing models.',
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Deep Learning', 'Scikit-Learn', 'Pandas'],
    certifications: ['Google Cloud Professional Data Scientist', 'IBM Data Science Professional', 'SAS Certified Advanced Programmer'],
    riasec: 'Investigative, Conventional'
  },
  ai: {
    id: 'ai',
    name: 'AI Engineer',
    salary: '$115,000 - $180,000',
    outlook: '+35% (Much faster than average)',
    description: 'Deploy generative artificial intelligence models, configure vector semantic databases, and program agentic workflow pipelines.',
    skills: ['Python', 'LLMs', 'Prompt Engineering', 'RAG', 'Vector Databases', 'LangChain', 'MLOps'],
    certifications: ['TensorFlow Developer Certificate', 'AWS Machine Learning Specialty', 'DeepLearning.AI Generative AI Specialty'],
    riasec: 'Investigative, Artistic'
  },
  ml: {
    id: 'ml',
    name: 'Machine Learning Engineer',
    salary: '$110,000 - $175,000',
    outlook: '+33% (Much faster than average)',
    description: 'Train neural classification systems, deploy automated model checkpoints, and optimize model runtime infrastructure pipelines.',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'MLOps'],
    certifications: ['Google Cloud Professional Machine Learning Engineer', 'AWS Machine Learning Specialty', 'TensorFlow Developer Certificate'],
    riasec: 'Investigative, Realistic'
  },
  pm: {
    id: 'pm',
    name: 'Product Manager',
    salary: '$92,000 - $140,000',
    outlook: '+15% (Faster than average)',
    description: 'Define product strategy, author PRDs, coordinate user discovery programs, align stakeholders, and manage agile sprint iterations.',
    skills: ['Agile', 'Product Roadmap', 'User Interviews', 'PRDs', 'KPIs', 'Stakeholder Management'],
    certifications: ['Project Management Professional (PMP)', 'Certified Scrum Product Owner (CSPO)', 'Pragmatic Institute Product Certification'],
    riasec: 'Enterprising, Social'
  },
  ux: {
    id: 'ux',
    name: 'UX Designer',
    salary: '$80,000 - $125,000',
    outlook: '+16% (Faster than average)',
    description: 'Conduct user research, design wireframes, craft high-fidelity interactive web mockups, and establish component design systems.',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research', 'Usability Testing', 'Design Systems'],
    certifications: ['Google UX Design Certificate', 'Nielsen Norman Group UX Certification', 'Interaction Design Foundation UX Core'],
    riasec: 'Artistic, Investigative'
  }
};

export default function CareerExplorer() {
  const { bookmarkedCareers, toggleBookmarkCareer, setTargetCareerId } = useResume();
  const { showToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [comparedCareers, setComparedCareers] = useState<string[]>([]);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  // Filter Target Careers
  const filteredCareers = useMemo(() => {
    return Object.values(detailedCareerDb).filter((career) => {
      // Filter by bookmarks
      if (showOnlyBookmarked && !bookmarkedCareers.includes(career.id)) {
        return false;
      }
      
      // Filter by search terms
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = career.name.toLowerCase().includes(query);
        const matchesSkills = career.skills.some(skill => skill.toLowerCase().includes(query));
        const matchesTraits = career.riasec.toLowerCase().includes(query);
        return matchesName || matchesSkills || matchesTraits;
      }
      
      return true;
    });
  }, [searchQuery, showOnlyBookmarked, bookmarkedCareers]);

  const toggleComparison = (id: string) => {
    setComparedCareers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 careers at once.', 'info');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleBookmarkClick = (id: string, name: string) => {
    toggleBookmarkCareer(id);
    const isBookmarked = bookmarkedCareers.includes(id);
    showToast(
      isBookmarked ? `${name} removed from bookmarks.` : `${name} bookmarked successfully!`,
      isBookmarked ? 'info' : 'success'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Compass className="h-6 w-6 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} /> Career Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Research industry standard targets, compare requirements, and bookmark targets for active sync.
          </p>
        </div>
      </div>

      {/* FILTER SEARCH & COMPARE CONFIG ROW */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-panel border-slate-900 rounded-2xl p-4 bg-slate-950/40">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, interest, or skill (e.g. React, SQL)..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-10 pr-4 text-xs outline-none transition-smooth placeholder:text-slate-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={() => setShowOnlyBookmarked(prev => !prev)}
            className={`px-3 py-2 border rounded-xl text-xs font-bold transition-smooth cursor-pointer flex items-center gap-1.5 ${
              showOnlyBookmarked
                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Show Bookmarks ({bookmarkedCareers.length})</span>
          </button>
          
          {comparedCareers.length > 0 && (
            <button
              onClick={() => setComparedCareers([])}
              className="px-3 py-2 border border-rose-950 text-rose-400 hover:bg-rose-500/5 hover:text-rose-300 rounded-xl text-xs font-bold transition-smooth flex items-center gap-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" /> Clear Comparison ({comparedCareers.length})
            </button>
          )}
        </div>
      </div>

      {/* COMPARISON SLATE VIEW */}
      {comparedCareers.length > 0 && (
        <div className="glass-panel border-indigo-500/20 bg-indigo-500/[0.02] p-6 rounded-3xl space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <Columns className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Side-by-Side Career Comparison</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparedCareers.map((compId) => {
              const item = detailedCareerDb[compId];
              if (!item) return null;
              return (
                <div key={compId} className="glass-panel border-slate-900 bg-slate-950/80 p-5 rounded-2xl space-y-4 relative">
                  <button
                    onClick={() => toggleComparison(compId)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white p-0.5 rounded cursor-pointer"
                    title="Remove from comparison"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div>
                    <h4 className="font-extrabold text-white text-base truncate max-w-[200px]">{item.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{item.riasec} interests</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[60px] line-clamp-3">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <div className="flex items-center gap-2 text-xs">
                      <DollarSign className="h-4 w-4 text-teal-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Salary Range</span>
                        <strong className="text-teal-400">{item.salary}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="h-4 w-4 text-indigo-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Outlook</span>
                        <strong className="text-indigo-400 text-[11px]">{item.outlook}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <span className="text-[9px] text-slate-500 uppercase font-mono block">Required Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {item.skills.map((skill, index) => (
                        <span key={index} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-300 font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <span className="text-[9px] text-slate-500 uppercase font-mono block">Top Certifications</span>
                    <div className="flex flex-wrap gap-1">
                      {item.certifications.map((cert, index) => (
                        <span key={index} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-400">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TARGET CAREERS CATALOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((career) => {
          const isBookmarked = bookmarkedCareers.includes(career.id);
          const isCompared = comparedCareers.includes(career.id);

          return (
            <div
              key={career.id}
              className="glass-panel border-slate-900 bg-slate-950/40 p-5 rounded-3xl flex flex-col justify-between gap-5 transition-smooth relative overflow-hidden group hover:border-indigo-500/20"
            >
              {/* Card headers */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-base truncate max-w-[200px]">
                      {career.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                      {career.riasec} interests
                    </span>
                  </div>
                  
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleBookmarkClick(career.id, career.name)}
                      className={`p-1.5 rounded-lg border transition-smooth cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark career'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {career.description}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-900">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-500 uppercase font-mono block">Median Salary</span>
                    <strong className="text-teal-400 font-bold">{career.salary.split(' - ')[0]}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-500 uppercase font-mono block">Outlook Rate</span>
                    <strong className="text-indigo-400 font-bold">{career.outlook.split(' ')[0]}</strong>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 border-t border-slate-900 pt-3 text-xs">
                <button
                  onClick={() => toggleComparison(career.id)}
                  className={`flex-1 py-1.5 border rounded-xl font-bold transition-smooth cursor-pointer flex items-center justify-center gap-1 ${
                    isCompared
                      ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-600/5'
                      : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                </button>

                <Link
                  href="/dashboard"
                  onClick={() => {
                    // Set career target in context
                    setTargetCareerId(career.id);
                    showToast(`Target career updated to ${career.name}.`, 'success');
                  }}
                  className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-center transition-smooth cursor-pointer shadow-md"
                >
                  Set Target
                </Link>
              </div>
            </div>
          );
        })}

        {filteredCareers.length === 0 && (
          <div className="col-span-full glass-panel border-slate-900 rounded-3xl p-10 text-center space-y-4">
            <Info className="h-10 w-10 text-indigo-400 mx-auto" />
            <div>
              <h4 className="text-sm font-bold text-white">No Careers Found Matching Search</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No target roles matched your active keyword filter. Reset the filter search queries to scan target careers catalog.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setShowOnlyBookmarked(false);
              }}
              className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-smooth cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
