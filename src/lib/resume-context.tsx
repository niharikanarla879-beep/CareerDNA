'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './auth-context';
import { analyzeResume, ResumeAnalysisResult, roleKeywords } from './analyzer';

export interface ResumeHistoryItem {
  id: string;
  timestamp: string;
  filename: string;
  roleId: string;
  result: ResumeAnalysisResult;
  text: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string;
  github: string;
  demo: string;
  strengthScore: number;
}

export interface InterviewSession {
  id: string;
  timestamp: string;
  roleId: string;
  difficulty: string;
  type: string;
  score: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  clarityScore: number;
  problemSolvingScore: number;
  feedbacks: {
    strengths: string[];
    weaknesses: string[];
    missedConcepts: string[];
    improvements: string[];
  };
  transcripts: {
    question: string;
    answer: string;
    score: number;
    feedback: string;
    ideal: string;
    missed: string[];
  }[];
}

export interface AssessmentData {
  taken: boolean;
  riasec: Record<string, number>;
  values: Record<string, number>;
  interests: string[];
  personality: Record<string, number>;
}

export interface DnaScores {
  assessmentScore: number;
  resumeScore: number;
  interviewScore: number;
  projectScore: number;
  certBonus: number;
  roadmapProgressPercent: number;
  finalDnaScore: number;
  jobReadinessScore: number;
  missingSkills: string[];
  estimatedReadyWeeks: number;
}

interface ResumeContextType {
  // Resume controls
  resumeHistory: ResumeHistoryItem[];
  latestResume: ResumeHistoryItem | null;
  loading: boolean;
  addResumeToHistory: (filename: string, roleId: string, text: string, result: ResumeAnalysisResult) => void;
  deleteResumeFromHistory: (id: string) => void;
  targetCareerId: string;
  setTargetCareerId: (roleId: string) => void;
  refreshResumeData: () => void;

  // Assessments
  assessment: AssessmentData | null;
  saveAssessment: (data: Omit<AssessmentData, 'taken'>) => void;

  // Projects
  projects: PortfolioProject[];
  addProject: (project: Omit<PortfolioProject, 'id' | 'strengthScore'>) => void;
  deleteProject: (id: string) => void;

  // Certifications
  certs: string[];
  addCert: (cert: string) => void;
  removeCert: (index: number) => void;

  // Roadmaps Progress
  roadmapProgress: Record<string, boolean>;
  toggleRoadmapStep: (key: string) => void;

  // Interview History
  interviewHistory: InterviewSession[];
  addInterviewSession: (session: InterviewSession) => void;

  // Global Derived Scores
  scores: DnaScores;

  // Hack2Skill Demo Trigger
  loginDemoUser: () => Promise<boolean>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

function safeJsonParse<T>(item: string | null, fallback: T, keyToRemove?: string): T {
  if (!item) return fallback;
  try {
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Failed to parse JSON for key "${keyToRemove || 'unknown'}":`, e);
    if (keyToRemove && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(keyToRemove);
      } catch (err) {
        console.error(`Failed to remove corrupt key "${keyToRemove}":`, err);
      }
    }
    return fallback;
  }
}

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const { user, login } = useAuth();
  
  // States
  const [resumeHistory, setResumeHistory] = useState<ResumeHistoryItem[]>([]);
  const [latestResume, setLatestResume] = useState<ResumeHistoryItem | null>(null);
  const [targetCareerId, setTargetCareerIdState] = useState<string>('swe');
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [certs, setCerts] = useState<string[]>([]);
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, boolean>>({});
  const [interviewHistory, setInterviewHistory] = useState<InterviewSession[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Sync logic
  const loadAllData = () => {
    if (!user) {
      setResumeHistory([]);
      setLatestResume(null);
      setTargetCareerIdState('swe');
      setAssessment(null);
      setProjects([]);
      setCerts([]);
      setRoadmapProgress({});
      setInterviewHistory([]);
      setLoading(false);
      return;
    }

    try {
      // 1. Resume History
      const historyKey = `careerdna_resume_history_${user.id}`;
      const historyRaw = localStorage.getItem(historyKey);
      const history = safeJsonParse<ResumeHistoryItem[]>(historyRaw, [], historyKey);
      setResumeHistory(history);
      if (history.length > 0) {
        const sorted = [...history].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setLatestResume(sorted[0]);
      } else {
        setLatestResume(null);
      }

      // 2. Target Career ID
      const careerKey = `careerdna_target_career_${user.id}`;
      const savedCareerId = localStorage.getItem(careerKey);
      setTargetCareerIdState(savedCareerId || 'swe');

      // 3. Assessment
      const assessmentKey = `careerdna_assessment_${user.id}`;
      const assessmentRaw = localStorage.getItem(assessmentKey);
      const parsedAssessment = safeJsonParse<AssessmentData | null>(assessmentRaw, null, assessmentKey);
      setAssessment(parsedAssessment);

      // 4. Projects
      const projectsKey = `careerdna_projects_${user.id}`;
      const projectsRaw = localStorage.getItem(projectsKey);
      setProjects(safeJsonParse<PortfolioProject[]>(projectsRaw, [], projectsKey));

      // 5. Certifications
      const certsKey = `careerdna_certs_${user.id}`;
      const certsRaw = localStorage.getItem(certsKey);
      setCerts(safeJsonParse<string[]>(certsRaw, [], certsKey));

      // 6. Roadmap progress
      const roadmapKey = `careerdna_roadmaps_completion_${user.id}`;
      const roadmapRaw = localStorage.getItem(roadmapKey);
      setRoadmapProgress(safeJsonParse<Record<string, boolean>>(roadmapRaw, {}, roadmapKey));

      // 7. Interview history
      const interviewKey = `careerdna_interview_history_${user.id}`;
      const interviewRaw = localStorage.getItem(interviewKey);
      setInterviewHistory(safeJsonParse<InterviewSession[]>(interviewRaw, [], interviewKey));

    } catch (err) {
      console.error('Error loading CareerDNA user profile values:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();

    const handleStorageChange = () => {
      loadAllData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('careerdna_resume_sync', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('careerdna_resume_sync', handleStorageChange);
    };
  }, [user]);

  // Actions
  const addResumeToHistory = (
    filename: string,
    roleId: string,
    text: string,
    result: ResumeAnalysisResult
  ) => {
    if (!user) return;
    try {
      const historyKey = `careerdna_resume_history_${user.id}`;
      const historyRaw = localStorage.getItem(historyKey);
      const history = safeJsonParse<ResumeHistoryItem[]>(historyRaw, [], historyKey);
      
      const newHistoryItem: ResumeHistoryItem = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        filename,
        roleId,
        result,
        text
      };

      const updatedHistory = [newHistoryItem, ...history];
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      localStorage.setItem(`careerdna_target_career_${user.id}`, roleId);
      
      setResumeHistory(updatedHistory);
      setLatestResume(newHistoryItem);
      setTargetCareerIdState(roleId);

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteResumeFromHistory = (id: string) => {
    if (!user) return;
    try {
      const historyKey = `careerdna_resume_history_${user.id}`;
      const historyRaw = localStorage.getItem(historyKey);
      const history = safeJsonParse<ResumeHistoryItem[]>(historyRaw, [], historyKey);
      
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem(historyKey, JSON.stringify(updated));
      
      setResumeHistory(updated);
      if (updated.length > 0) {
        const sorted = [...updated].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLatestResume(sorted[0]);
      } else {
        setLatestResume(null);
      }

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const setTargetCareerId = (roleId: string) => {
    if (!user) return;
    try {
      localStorage.setItem(`careerdna_target_career_${user.id}`, roleId);
      setTargetCareerIdState(roleId);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const saveAssessment = (data: Omit<AssessmentData, 'taken'>) => {
    if (!user) return;
    try {
      const fullData: AssessmentData = { taken: true, ...data };
      localStorage.setItem(`careerdna_assessment_${user.id}`, JSON.stringify(fullData));
      setAssessment(fullData);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const calculateProjectStrength = (project: Omit<PortfolioProject, 'id' | 'strengthScore'>): number => {
    let score = 0;
    if (project.title.trim().length > 3) score += 20;
    if (project.description.trim().length > 30) score += 30;
    if (project.tech.trim().split(',').filter(t => t.trim().length > 0).length >= 3) score += 20;
    if (project.github.trim().toLowerCase().includes('github.com')) score += 15;
    if (project.demo.trim().length > 5) score += 15;
    return score;
  };

  const addProject = (project: Omit<PortfolioProject, 'id' | 'strengthScore'>) => {
    if (!user) return;
    try {
      const key = `careerdna_projects_${user.id}`;
      const strengthScore = calculateProjectStrength(project);
      const newProj: PortfolioProject = {
        id: Math.random().toString(36).substring(2, 11),
        ...project,
        strengthScore
      };
      const updated = [...projects, newProj];
      localStorage.setItem(key, JSON.stringify(updated));
      setProjects(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProject = (id: string) => {
    if (!user) return;
    try {
      const key = `careerdna_projects_${user.id}`;
      const updated = projects.filter(p => p.id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
      setProjects(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const addCert = (cert: string) => {
    if (!user) return;
    try {
      const key = `careerdna_certs_${user.id}`;
      const updated = [...certs, cert.trim()];
      localStorage.setItem(key, JSON.stringify(updated));
      setCerts(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const removeCert = (index: number) => {
    if (!user) return;
    try {
      const key = `careerdna_certs_${user.id}`;
      const updated = certs.filter((_, i) => i !== index);
      localStorage.setItem(key, JSON.stringify(updated));
      setCerts(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleRoadmapStep = (key: string) => {
    if (!user) return;
    try {
      const rKey = `careerdna_roadmaps_completion_${user.id}`;
      const updated = {
        ...roadmapProgress,
        [key]: !roadmapProgress[key]
      };
      localStorage.setItem(rKey, JSON.stringify(updated));
      setRoadmapProgress(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const addInterviewSession = (session: InterviewSession) => {
    if (!user) return;
    try {
      const key = `careerdna_interview_history_${user.id}`;
      const updated = [session, ...interviewHistory];
      localStorage.setItem(key, JSON.stringify(updated));
      setInterviewHistory(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const loginDemoUser = async (): Promise<boolean> => {
    try {
      // Mock Sign up / login for Demo user
      const demoId = 'demo-h2s-candidate';
      const demoEmail = 'demo.candidate@careerdna.io';
      const demoProfile = {
        id: demoId,
        email: demoEmail,
        firstName: 'Demo',
        lastName: 'Candidate',
        currentJob: 'Associate Developer',
        educationLevel: 'Bachelor of Science in Computer Science',
        experienceYears: 2
      };

      // Set user directly in localStorage to bypass standard screens
      localStorage.setItem('careerdna_user', JSON.stringify(demoProfile));

      // Inject Mock assessment
      const mockAssessment: AssessmentData = {
        taken: true,
        riasec: { Realistic: 70, Investigative: 90, Artistic: 50, Social: 60, Enterprising: 75, Conventional: 80 },
        values: { Achievement: 90, Independence: 85, Recognition: 70, Relationships: 80, Support: 75, WorkingConditions: 85 },
        interests: ['Software Architecture', 'Web Systems', 'Artificial Intelligence', 'Interactive Design'],
        personality: { Openness: 85, Conscientiousness: 90, Extraversion: 70, Agreeableness: 75, EmotionalStability: 80 }
      };
      localStorage.setItem(`careerdna_assessment_${demoId}`, JSON.stringify(mockAssessment));

      // Inject Mock Projects
      const mockProjects: PortfolioProject[] = [
        {
          id: 'demo-p1',
          title: 'InsightX AI Research Engine',
          description: 'An advanced automated literature review search engine featuring PG/SQLite database wrappers and memory fallbacks.',
          tech: 'TypeScript, React, Next.js, Node.js, Express, SQL, Redis',
          github: 'https://github.com/demo/insightx',
          demo: 'https://insightx-demo.vercel.app',
          strengthScore: 92
        },
        {
          id: 'demo-p2',
          title: 'Agri Crop Trading Marketplace',
          description: 'A responsive agricultural trade matching app allowing farmers to trade crops with local wholesalers directly.',
          tech: 'React, Node.js, Express, Mongoose, MongoDB, CSS3',
          github: 'https://github.com/demo/agri-marketplace',
          demo: 'https://agri-marketplace.vercel.app',
          strengthScore: 88
        },
        {
          id: 'demo-p3',
          title: 'CareerDNA Assessment Hub',
          description: 'Personalized career operating system implementing interactive assessments, interview speech engines, and roadmaps.',
          tech: 'Next.js, Recharts, Tailwind CSS, LocalStorage API',
          github: 'https://github.com/demo/careerdna',
          demo: 'https://careerdna-h2s.vercel.app',
          strengthScore: 95
        }
      ];
      localStorage.setItem(`careerdna_projects_${demoId}`, JSON.stringify(mockProjects));

      // Inject Certifications
      const mockCerts = [
        'AWS Certified Solutions Architect - Associate',
        'Google IT Automation with Python Professional Certificate',
        'Meta Front-End Developer Professional Certificate'
      ];
      localStorage.setItem(`careerdna_certs_${demoId}`, JSON.stringify(mockCerts));

      // Inject Target Career
      localStorage.setItem(`careerdna_target_career_${demoId}`, 'swe');

      // Inject Resume History (ATS Score: 84)
      const mockResumeHistoryItem: ResumeHistoryItem = {
        id: 'demo-resume-1',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        filename: 'Demo_Candidate_Resume.pdf',
        roleId: 'swe',
        text: 'DEMO CANDIDATE PROFILE\nSoftware Engineer with experience in React, Node.js, TypeScript, SQL, Git, REST APIs. Worked on cloud SaaS structures and automated unit tests. Active portfolio contains InsightX search engine and crop trading systems. Bachelor in Computer Science.',
        result: {
          score: 84,
          keywordMatch: 80,
          formatting: 90,
          experience: 80,
          skillsCoverage: 85,
          education: 90,
          foundKeywords: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Git', 'REST APIs', 'SQL', 'NoSQL', 'System Design'],
          missingKeywords: ['Docker', 'AWS', 'CI/CD', 'GraphQL', 'Kubernetes'],
          missingSkillsHigh: ['Docker', 'AWS', 'CI/CD'],
          missingSkillsMedium: ['GraphQL', 'Kubernetes', 'Unit Testing'],
          detectedSkills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Git', 'REST APIs', 'SQL', 'NoSQL', 'System Design'],
          strengths: [
            'Work experience section is present and structured chronologically.',
            'Structured Skills/Competencies section is clearly defined.',
            'Professional online profile links (e.g. GitHub or LinkedIn) are present.',
            'Optimal word count (between 400 and 800 words), avoiding verbosity.'
          ],
          weaknesses: [
            'Missing Docker containerization patterns from recent projects.',
            'Lacks explicit CI/CD workflow details.',
            'AWS deployment configurations are missing.'
          ],
          suggestions: [
            { category: 'Content', text: 'Integrate Docker container structures in your project descriptions to demonstrate DevOps capability.', impact: 'High' },
            { category: 'Formatting', text: 'Structure your education headers specifically to bypass parsing filter checkpoints.', impact: 'Medium' }
          ]
        }
      };
      localStorage.setItem(`careerdna_resume_history_${demoId}`, JSON.stringify([mockResumeHistoryItem]));

      // Inject Roadmap progress (Phase 1 checks complete)
      const mockRoadmapProgress = {
        'swe_intermediate_0_course': true,
        'swe_intermediate_0_cert': true,
        'swe_intermediate_0_project': true,
        'swe_intermediate_1_course': true,
        'swe_intermediate_1_cert': false,
        'swe_intermediate_1_project': false
      };
      localStorage.setItem(`careerdna_roadmaps_completion_${demoId}`, JSON.stringify(mockRoadmapProgress));

      // Inject Interview history
      const mockInterviewSession: InterviewSession = {
        id: 'demo-session-1',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        roleId: 'swe',
        difficulty: 'intermediate',
        type: 'technical',
        score: 82,
        communicationScore: 85,
        technicalScore: 80,
        confidenceScore: 85,
        clarityScore: 80,
        problemSolvingScore: 80,
        feedbacks: {
          strengths: ['Clear grasp of React rendering cycles.', 'Good understanding of REST conventions.'],
          weaknesses: ['Vague definition of index optimization in SQL queries.', 'Omitted Docker volume configs.'],
          missedConcepts: ['SQL indexes', 'Docker volumes'],
          improvements: ['Elaborate on database bottlenecks.', 'Incorporate specific metrics when detailing system scalability.']
        },
        transcripts: [
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
        ]
      };
      localStorage.setItem(`careerdna_interview_history_${demoId}`, JSON.stringify([mockInterviewSession]));

      // Log in as mock user profile
      localStorage.setItem('careerdna_mock_users', JSON.stringify([{
        id: demoId,
        email: demoEmail,
        password: 'demo',
        firstName: 'Demo',
        lastName: 'Candidate',
        currentJob: 'Associate Developer',
        educationLevel: 'Bachelor of Science in Computer Science',
        experienceYears: 2
      }]));

      // Trigger standard login reload hook
      await login(demoEmail, 'demo');

      // Sync state and notify listeners
      loadAllData();
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));

      return true;
    } catch (e) {
      console.error('Failed to log in demo candidate profile:', e);
      return false;
    }
  };

  // Memoized consolidated score engine metrics calculations
  const scores = useMemo((): DnaScores => {
    // 1. Assessment Score
    const assessmentScore = assessment?.taken ? 100 : 0;

    // 2. Resume Score
    const resumeScore = latestResume ? latestResume.result.score : 0;

    // 3. Interview Score
    let interviewScore = 0;
    if (interviewHistory.length > 0) {
      const sum = interviewHistory.reduce((acc, curr) => acc + curr.score, 0);
      interviewScore = Math.round(sum / interviewHistory.length);
    }

    // 4. Project Score
    let projectScore = 0;
    if (projects.length > 0) {
      const sum = projects.reduce((acc, curr) => acc + curr.strengthScore, 0);
      projectScore = Math.round(sum / projects.length);
    }

    // 5. Cert Bonus (Max 10)
    const certBonus = Math.min(10, certs.length * 2);

    // 6. Roadmap Progress Percent
    let roadmapProgressPercent = 0;
    let completedSteps = 0;
    const activeKeywords = roleKeywords[targetCareerId] || roleKeywords['swe'];
    let difficulty: 'foundational' | 'intermediate' | 'advanced' = 'foundational';
    if (resumeScore >= 80) difficulty = 'advanced';
    else if (resumeScore >= 50) difficulty = 'intermediate';

    for (let i = 0; i < 3; i++) {
      if (roadmapProgress[`${targetCareerId}_${difficulty}_${i}_course`]) completedSteps++;
      if (roadmapProgress[`${targetCareerId}_${difficulty}_${i}_cert`]) completedSteps++;
      if (roadmapProgress[`${targetCareerId}_${difficulty}_${i}_project`]) completedSteps++;
    }
    roadmapProgressPercent = Math.round((completedSteps / 9) * 100);

    // 7. Weighted Composite DNA Score
    // Assessment (20%), Resume (25%), Interview (20%), Projects (15%), Roadmap (10%), Certifications (10%)
    const finalDnaScore = Math.min(100, Math.round(
      (assessmentScore * 0.20) +
      (resumeScore * 0.25) +
      (interviewScore * 0.20) +
      (projectScore * 0.15) +
      (roadmapProgressPercent * 0.10) +
      (certBonus * 10) // Since certBonus is max 10, certBonus * 10 * 0.10 = certBonus
    ));

    // 8. Job Readiness score calculations
    const lowerResumeSkills = latestResume ? latestResume.result.detectedSkills?.map(s => s.toLowerCase()) || [] : [];
    const lowerProjectTech = projects.flatMap(p => p.tech.toLowerCase().split(',').map(s => s.trim()));
    const lowerAssessmentInterests = assessment ? assessment.interests.map(s => s.toLowerCase()) : [];
    
    const combinedCompetencies = new Set([
      ...lowerResumeSkills,
      ...lowerProjectTech,
      ...lowerAssessmentInterests
    ]);

    const requiredKeywords = roleKeywords[targetCareerId] || roleKeywords['swe'];
    let matches = 0;
    const missing: string[] = [];

    requiredKeywords.forEach(kw => {
      const kwName = kw.name.toLowerCase();
      let match = combinedCompetencies.has(kwName);
      if (!match) {
        for (const syn of kw.synonyms) {
          if (combinedCompetencies.has(syn.toLowerCase())) {
            match = true;
            break;
          }
        }
      }
      if (match) {
        matches++;
      } else {
        missing.push(kw.name);
      }
    });

    const jobReadinessScore = requiredKeywords.length > 0 
      ? Math.round((matches / requiredKeywords.length) * 100) 
      : 50;

    const estimatedReadyWeeks = Math.ceil((100 - jobReadinessScore) / 10) * 2;

    return {
      assessmentScore,
      resumeScore,
      interviewScore,
      projectScore,
      certBonus,
      roadmapProgressPercent,
      finalDnaScore,
      jobReadinessScore,
      missingSkills: missing,
      estimatedReadyWeeks
    };
  }, [assessment, latestResume, interviewHistory, projects, certs, roadmapProgress, targetCareerId]);

  const refreshResumeData = () => {
    loadAllData();
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeHistory,
        latestResume,
        loading,
        addResumeToHistory,
        deleteResumeFromHistory,
        targetCareerId,
        setTargetCareerId,
        refreshResumeData,

        assessment,
        saveAssessment,

        projects,
        addProject,
        deleteProject,

        certs,
        addCert,
        removeCert,

        roadmapProgress,
        toggleRoadmapStep,

        interviewHistory,
        addInterviewSession,

        scores,
        loginDemoUser
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
