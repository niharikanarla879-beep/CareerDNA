'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './auth-context';
import { ResumeAnalysisResult, roleKeywords, validateResume } from './analyzer';

export interface ResumeHistoryItem {
  id: string;
  timestamp: string;
  filename: string;
  roleId: string;
  result: ResumeAnalysisResult;
  text: string;
  isDemo?: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string;
  github: string;
  demo: string;
  strengthScore: number;
  isGithubVerified?: boolean;
  githubVerificationError?: string;
  isOfflineVerified?: boolean;
  stars?: number;
  forksCount?: number;
  primaryLanguage?: string;
  lastUpdated?: string;
  isFork?: boolean;
  repoAgeDays?: number;
  readmeLength?: number;
  hasSourceFiles?: boolean;
  commitCount?: number;
  isDemo?: boolean;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  credentialIdOrUrl: string;
  expiryDate?: string;
  isVerified: boolean;
  platform: 'Coursera' | 'Udemy' | 'Google' | 'AWS' | 'Microsoft' | 'Cisco' | 'Other';
  weight: number;
  isDemo?: boolean;
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
  isDemo?: boolean;
}

export interface AssessmentData {
  taken: boolean;
  riasec: Record<string, number>;
  values: Record<string, number>;
  interests: string[];
  personality: Record<string, number>;
  isDemo?: boolean;
}

export interface DnaScores {
  assessmentScore: number;
  resumeScore: number;
  interviewScore: number;
  projectScore: number;
  certBonus: number;
  certsScore: number;
  roadmapProgressPercent: number;
  finalDnaScore: number;
  jobReadinessScore: number;
  baselineJobReadinessScore: number;
  missingSkills: string[];
  estimatedReadyWeeks: number;
  skillGapPenalty: number;
  completedModulesCount: number;
  totalModules: number;
  completedWeightsSum: number;
  isLocked: boolean;
  pendingModules: string[];
  profileCompletionPercent: number;
  confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERIFIED';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  iconName: string;
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
  addProject: (project: Omit<PortfolioProject, 'id' | 'strengthScore' | 'isGithubVerified' | 'githubVerificationError' | 'isOfflineVerified'>) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: string) => void;

  // Certifications
  certs: CertificationItem[];
  addCert: (cert: { name: string; issuer: string; credentialIdOrUrl: string; expiryDate?: string }) => void;
  removeCert: (index: number) => void;

  // Roadmaps Progress
  roadmapProgress: Record<string, boolean>;
  toggleRoadmapStep: (key: string) => void;

  // Interview History
  interviewHistory: InterviewSession[];
  addInterviewSession: (session: InterviewSession) => void;

  // Bookmarks
  bookmarkedCareers: string[];
  toggleBookmarkCareer: (roleId: string) => void;

  // Achievements
  achievements: AchievementBadge[];

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
  const [certs, setCerts] = useState<CertificationItem[]>([]);
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, boolean>>({});
  const [interviewHistory, setInterviewHistory] = useState<InterviewSession[]>([]);
  const [bookmarkedCareers, setBookmarkedCareers] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Sync logic
  const loadAllData = useCallback(() => {
    if (!user) {
      setResumeHistory([]);
      setLatestResume(null);
      setTargetCareerIdState('swe');
      setAssessment(null);
      setProjects([]);
      setCerts([]);
      setRoadmapProgress({});
      setInterviewHistory([]);
      setBookmarkedCareers([]);
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
      const parsedCerts = safeJsonParse<any[]>(certsRaw, [], certsKey);
      const structuredCerts: CertificationItem[] = parsedCerts.map((c: any) => {
        if (typeof c === 'string') {
          const name = c;
          let platform: CertificationItem['platform'] = 'Other';
          let weight = 0.50;
          const lowerStr = name.toLowerCase();
          
          if (lowerStr.includes('aws') || lowerStr.includes('amazon web services')) {
            platform = 'AWS'; weight = 1.0;
          } else if (lowerStr.includes('google') || lowerStr.includes('gcp')) {
            platform = 'Google'; weight = 1.0;
          } else if (lowerStr.includes('microsoft') || lowerStr.includes('azure')) {
            platform = 'Microsoft'; weight = 1.0;
          } else if (lowerStr.includes('cisco')) {
            platform = 'Cisco'; weight = 1.0;
          } else if (lowerStr.includes('coursera')) {
            platform = 'Coursera'; weight = 0.75;
          } else if (lowerStr.includes('udemy')) {
            platform = 'Udemy'; weight = 0.75;
          }
          
          return {
            name,
            issuer: platform !== 'Other' ? platform : 'Self/Online Course',
            credentialIdOrUrl: 'Legacy Value',
            isVerified: platform !== 'Other',
            platform,
            weight,
            isDemo: true
          };
        }
        return c as CertificationItem;
      });
      setCerts(structuredCerts);

      // 6. Roadmap progress
      const roadmapKey = `careerdna_roadmaps_completion_${user.id}`;
      const roadmapRaw = localStorage.getItem(roadmapKey);
      setRoadmapProgress(safeJsonParse<Record<string, boolean>>(roadmapRaw, {}, roadmapKey));

      // 7. Interview history
      const interviewKey = `careerdna_interview_history_${user.id}`;
      const interviewRaw = localStorage.getItem(interviewKey);
      setInterviewHistory(safeJsonParse<InterviewSession[]>(interviewRaw, [], interviewKey));

      // 8. Bookmarks
      const bookmarksKey = `careerdna_bookmarks_${user.id}`;
      const bookmarksRaw = localStorage.getItem(bookmarksKey);
      setBookmarkedCareers(safeJsonParse<string[]>(bookmarksRaw, [], bookmarksKey));

    } catch (err) {
      console.error('Error loading CareerDNA user profile values:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAllData();
    }, 0);

    const handleStorageChange = () => {
      loadAllData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('careerdna_resume_sync', handleStorageChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('careerdna_resume_sync', handleStorageChange);
    };
  }, [loadAllData]);

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
    if (project.isGithubVerified === false) {
      return 0;
    }
    
    let score = 0;
    if (project.title.trim().length > 3) score += 20;
    if (project.description.trim().length > 30) score += 30;
    if (project.tech.trim().split(',').filter(t => t.trim().length > 0).length >= 3) score += 20;
    if (project.github.trim().toLowerCase().includes('github.com')) score += 15;
    if (project.demo.trim().length > 5) score += 15;
    
    if (project.isFork) {
      score = Math.round(score * 0.5);
    }
    
    return score;
  };

  const addProject = async (project: Omit<PortfolioProject, 'id' | 'strengthScore' | 'isGithubVerified' | 'githubVerificationError' | 'isOfflineVerified'>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not logged in' };

    const normalizedNewRepo = project.github.trim().toLowerCase().replace(/\/$/, '');
    const isDuplicate = projects.some(p => p.github.trim().toLowerCase().replace(/\/$/, '') === normalizedNewRepo);
    if (isDuplicate) {
      return { success: false, error: 'Duplicate repository URL detected. This project is already in your portfolio.' };
    }

    let isGithubVerified = false;
    let isOfflineVerified = false;
    let githubVerificationError = '';
    let stars = 0;
    let forksCount = 0;
    let primaryLanguage = 'N/A';
    let lastUpdated = '';
    let isFork = false;
    let repoAgeDays = 0;
    let readmeLength = 0;
    let hasSourceFiles = false;
    let commitCount = 0;

    const match = project.github.match(/github\.com\/([a-zA-Z0-9-_\.]+)\/([a-zA-Z0-9-_\.]+)/i);
    if (match) {
      const owner = match[1];
      const repo = match[2].replace(/\/$/, '').replace(/\.git$/, '');

      try {
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (repoRes.status === 404) {
          githubVerificationError = 'Repository not found. Ensure it is public and the URL is correct.';
        } else if (!repoRes.ok) {
          throw new Error('API Rate Limit or Network Issue');
        } else {
          const repoData = await repoRes.json();
          stars = repoData.stargazers_count;
          forksCount = repoData.forks_count;
          primaryLanguage = repoData.language || 'N/A';
          lastUpdated = repoData.updated_at;
          isFork = !!repoData.fork;
          
          const created = new Date(repoData.created_at);
          const ageMs = Date.now() - created.getTime();
          repoAgeDays = ageMs / (1000 * 60 * 60 * 24);

          const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=3`);
          if (commitsRes.ok) {
            const commitsData = await commitsRes.json();
            commitCount = Array.isArray(commitsData) ? commitsData.length : 0;
          }

          const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
          if (contentsRes.ok) {
            const contentsData = await contentsRes.json();
            if (Array.isArray(contentsData)) {
              const readmeFile = contentsData.find(f => f.name.toLowerCase().startsWith('readme'));
              if (readmeFile) {
                readmeLength = readmeFile.size;
              }
              
              const sourceExtensions = ['.js', '.ts', '.tsx', '.jsx', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.rb', '.php', '.cs', '.html', '.css'];
              const hasRootSource = contentsData.some(f => f.type === 'file' && sourceExtensions.some(ext => f.name.toLowerCase().endsWith(ext)));
              if (hasRootSource) {
                hasSourceFiles = true;
              } else {
                const subDirs = contentsData.filter(f => f.type === 'dir' && ['src', 'lib', 'app', 'components'].includes(f.name.toLowerCase()));
                for (const dir of subDirs) {
                  const subRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${dir.name}`);
                  if (subRes.ok) {
                    const subData = await subRes.json();
                    if (Array.isArray(subData)) {
                      const hasSubSource = subData.some(f => f.type === 'file' && sourceExtensions.some(ext => f.name.toLowerCase().endsWith(ext)));
                      if (hasSubSource) {
                        hasSourceFiles = true;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }

          const ageValid = repoAgeDays > 1;
          const readmeValid = readmeLength > 100;
          const commitsValid = commitCount >= 3;

          if (ageValid && readmeValid && commitsValid && hasSourceFiles) {
            isGithubVerified = true;
          } else {
            const reasons: string[] = [];
            if (!ageValid) reasons.push('repository age <= 1 day');
            if (!readmeValid) reasons.push('README size <= 100 characters');
            if (!commitsValid) reasons.push('less than 3 commits');
            if (!hasSourceFiles) reasons.push('no source code files found');
            githubVerificationError = 'Constraints failed: ' + reasons.join(', ');
          }
        }
      } catch (err) {
        isGithubVerified = true;
        isOfflineVerified = true;
        stars = 5;
        forksCount = 1;
        primaryLanguage = 'TypeScript';
        isFork = false;
        repoAgeDays = 10;
        readmeLength = 500;
        hasSourceFiles = true;
        commitCount = 5;
      }
    } else {
      githubVerificationError = 'Invalid GitHub URL format.';
    }

    try {
      const key = `careerdna_projects_${user.id}`;
      const strengthScore = calculateProjectStrength({
        ...project,
        isGithubVerified,
        githubVerificationError,
        isOfflineVerified,
        stars,
        forksCount,
        primaryLanguage,
        lastUpdated,
        isFork,
        repoAgeDays,
        readmeLength,
        hasSourceFiles,
        commitCount
      });

      const newProj: PortfolioProject = {
        id: Math.random().toString(36).substring(2, 11),
        ...project,
        strengthScore,
        isGithubVerified,
        githubVerificationError,
        isOfflineVerified,
        stars,
        forksCount,
        primaryLanguage,
        lastUpdated,
        isFork,
        repoAgeDays,
        readmeLength,
        hasSourceFiles,
        commitCount
      };

      const updated = [...projects, newProj];
      localStorage.setItem(key, JSON.stringify(updated));
      setProjects(updated);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));

      if (!isGithubVerified) {
        return { success: true, error: githubVerificationError || 'Repository verification failed.' };
      }
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Storage operation failed.' };
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

  const addCert = (certInput: { name: string; issuer: string; credentialIdOrUrl: string; expiryDate?: string }) => {
    if (!user) return;
    try {
      const key = `careerdna_certs_${user.id}`;
      
      const isDuplicate = certs.some(c => 
        c.name.toLowerCase() === certInput.name.toLowerCase() &&
        c.issuer.toLowerCase() === certInput.issuer.toLowerCase() &&
        c.credentialIdOrUrl.toLowerCase() === certInput.credentialIdOrUrl.toLowerCase()
      );
      if (isDuplicate) {
        return;
      }

      const nameAndIssuer = `${certInput.name} ${certInput.issuer}`.toLowerCase();
      let platform: CertificationItem['platform'] = 'Other';
      let weight = 0.50;

      if (nameAndIssuer.includes('aws') || nameAndIssuer.includes('amazon web services')) {
        platform = 'AWS';
        weight = 1.0;
      } else if (nameAndIssuer.includes('google') || nameAndIssuer.includes('gcp')) {
        platform = 'Google';
        weight = 1.0;
      } else if (nameAndIssuer.includes('microsoft') || nameAndIssuer.includes('azure')) {
        platform = 'Microsoft';
        weight = 1.0;
      } else if (nameAndIssuer.includes('cisco') || nameAndIssuer.includes('ccna')) {
        platform = 'Cisco';
        weight = 1.0;
      } else if (nameAndIssuer.includes('coursera')) {
        platform = 'Coursera';
        weight = 0.75;
      } else if (nameAndIssuer.includes('udemy')) {
        platform = 'Udemy';
        weight = 0.75;
      }

      const isVerified = platform !== 'Other' && !!certInput.credentialIdOrUrl.trim();
      
      const newCert: CertificationItem = {
        name: certInput.name.trim(),
        issuer: certInput.issuer.trim(),
        credentialIdOrUrl: certInput.credentialIdOrUrl.trim(),
        expiryDate: certInput.expiryDate ? certInput.expiryDate.trim() : undefined,
        isVerified,
        platform,
        weight
      };

      const updated = [...certs, newCert];
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

  const toggleBookmarkCareer = (roleId: string) => {
    if (!user) return;
    try {
      const key = `careerdna_bookmarks_${user.id}`;
      setBookmarkedCareers(prev => {
        const updated = prev.includes(roleId)
          ? prev.filter(id => id !== roleId)
          : [...prev, roleId];
        localStorage.setItem(key, JSON.stringify(updated));
        return updated;
      });
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
        personality: { Openness: 85, Conscientiousness: 90, Extraversion: 70, Agreeableness: 75, EmotionalStability: 80 },
        isDemo: true
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
          strengthScore: 92,
          isGithubVerified: true,
          isDemo: true
        },
        {
          id: 'demo-p2',
          title: 'Agri Crop Trading Marketplace',
          description: 'A responsive agricultural trade matching app allowing farmers to trade crops with local wholesalers directly.',
          tech: 'React, Node.js, Express, Mongoose, MongoDB, CSS3',
          github: 'https://github.com/demo/agri-marketplace',
          demo: 'https://agri-marketplace.vercel.app',
          strengthScore: 88,
          isGithubVerified: true,
          isDemo: true
        },
        {
          id: 'demo-p3',
          title: 'CareerDNA Assessment Hub',
          description: 'Personalized career operating system implementing interactive assessments, interview speech engines, and roadmaps.',
          tech: 'Next.js, Recharts, Tailwind CSS, LocalStorage API',
          github: 'https://github.com/demo/careerdna',
          demo: 'https://careerdna-h2s.vercel.app',
          strengthScore: 95,
          isGithubVerified: true,
          isDemo: true
        }
      ];
      localStorage.setItem(`careerdna_projects_${demoId}`, JSON.stringify(mockProjects));

      // Inject Certifications
      const mockCerts: CertificationItem[] = [
        {
          name: 'AWS Certified Solutions Architect - Associate',
          issuer: 'AWS',
          credentialIdOrUrl: 'demo-aws-123',
          isVerified: true,
          platform: 'AWS',
          weight: 1.0,
          isDemo: true
        },
        {
          name: 'Google IT Automation with Python Professional Certificate',
          issuer: 'Google',
          credentialIdOrUrl: 'demo-google-123',
          isVerified: true,
          platform: 'Google',
          weight: 1.0,
          isDemo: true
        },
        {
          name: 'Meta Front-End Developer Professional Certificate',
          issuer: 'Coursera',
          credentialIdOrUrl: 'demo-meta-123',
          isVerified: true,
          platform: 'Coursera',
          weight: 0.75,
          isDemo: true
        }
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
        },
        isDemo: true
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
        ],
        isDemo: true
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

    // 5. Certifications Score (based on weights. 5 fully verified industry certs = 100%)
    let totalCertPoints = 0;
    certs.forEach(c => {
      const isExpired = c.expiryDate ? new Date(c.expiryDate) < new Date() : false;
      const effectiveWeight = isExpired ? c.weight * 0.5 : c.weight;
      totalCertPoints += effectiveWeight;
    });
    const certsScore = Math.min(100, Math.round(totalCertPoints * 20));
    const certBonus = Math.min(10, Math.round(totalCertPoints * 2));

    // 6. Compute initial missing skills (before roadmap resolution) to assess active gaps
    const lowerResumeSkills = latestResume ? latestResume.result.detectedSkills?.map(s => s.toLowerCase()) || [] : [];
    const lowerProjectTech = projects.flatMap(p => p.tech.toLowerCase().split(',').map(s => s.trim()));
    const lowerAssessmentInterests = assessment ? assessment.interests.map(s => s.toLowerCase()) : [];
    
    const baseCompetencies = new Set([
      ...lowerResumeSkills,
      ...lowerProjectTech,
      ...lowerAssessmentInterests
    ]);

    const requiredKeywords = roleKeywords[targetCareerId] || roleKeywords['swe'];
    const originallyMissing: string[] = [];

    requiredKeywords.forEach(kw => {
      const kwName = kw.name.toLowerCase();
      let match = baseCompetencies.has(kwName);
      if (!match) {
        for (const syn of kw.synonyms) {
          if (baseCompetencies.has(syn.toLowerCase())) {
            match = true;
            break;
          }
        }
      }
      if (!match) {
        originallyMissing.push(kw.name);
      }
    });

    // 7. Dynamic Roadmap Progress & Completed Skills override
    let completedMilestoneItems = 0;
    const totalMilestoneItems = originallyMissing.length * 3;
    const resolvedSkills: string[] = [];

    originallyMissing.forEach(skillName => {
      const isCourseDone = roadmapProgress[`${skillName}_course`] === true;
      const isCertDone = roadmapProgress[`${skillName}_cert`] === true;
      const isProjectDone = roadmapProgress[`${skillName}_project`] === true;

      let doneCount = 0;
      if (isCourseDone) doneCount++;
      if (isCertDone) doneCount++;
      if (isProjectDone) doneCount++;

      completedMilestoneItems += doneCount;

      // Resolve the gap if they completed at least 2 out of 3 stages
      if (doneCount >= 2) {
        resolvedSkills.push(skillName.toLowerCase());
      }
    });

    const roadmapProgressPercent = totalMilestoneItems > 0
      ? Math.round((completedMilestoneItems / totalMilestoneItems) * 100)
      : 100;

    // 8. Re-evaluate competencies & missing skills with completed roadmaps
    const combinedCompetencies = new Set([
      ...baseCompetencies,
      ...resolvedSkills
    ]);

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

    // 9. Weighted DNA Score Calculation (Dynamic Completed Modules Only)
    const modules = [
      { 
        id: 'assessment', 
        name: 'Career Assessment', 
        completed: assessment !== null && assessment.taken === true && assessment.isDemo !== true, 
        score: assessmentScore, 
        weight: 0.25 
      },
      { 
        id: 'resume', 
        name: 'ATS Resume', 
        completed: latestResume !== null && latestResume.isDemo !== true && validateResume(latestResume.text).confidence >= 50, 
        score: resumeScore, 
        weight: 0.20 
      },
      { 
        id: 'projects', 
        name: 'Projects', 
        completed: projects.length >= 1 && projects.some(p => p.isDemo !== true && (p.isGithubVerified === true || p.isOfflineVerified === true)), 
        score: projectScore, 
        weight: 0.15 
      },
      { 
        id: 'certs', 
        name: 'Certifications', 
        completed: certs.length >= 1 && certs.some(c => c.isDemo !== true), 
        score: certsScore, 
        weight: 0.10 
      },
      { 
        id: 'interview', 
        name: 'Interview Coach', 
        completed: interviewHistory.length >= 1 && interviewHistory.some(s => s.isDemo !== true), 
        score: interviewScore, 
        weight: 0.20 
      },
      { 
        id: 'roadmap', 
        name: 'Skill Completion', 
        completed: latestResume !== null && latestResume.isDemo !== true && validateResume(latestResume.text).confidence >= 50, 
        score: roadmapProgressPercent, 
        weight: 0.10 
      }
    ];

    const completedModules = modules.filter(m => m.completed);
    const completedModulesCount = completedModules.length;
    const totalModules = modules.length;
    const pendingModules = modules.filter(m => !m.completed).map(m => m.name);

    let finalDnaScore = 0;
    let completedWeightsSum = 0;

    if (completedModulesCount > 0) {
      let weightedSum = 0;
      completedModules.forEach(m => {
        weightedSum += m.score * m.weight;
        completedWeightsSum += m.weight;
      });
      finalDnaScore = Math.round((weightedSum / completedWeightsSum));
    }

    const profileCompletionPercent = Math.round((completedModulesCount / totalModules) * 100);
    
    let confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERIFIED' = 'LOW';
    if (completedModulesCount === 6) {
      confidenceLevel = 'VERIFIED';
    } else if (profileCompletionPercent >= 67) {
      confidenceLevel = 'HIGH';
    } else if (profileCompletionPercent >= 34) {
      confidenceLevel = 'MEDIUM';
    } else {
      confidenceLevel = 'LOW';
    }

    const skillGapPenalty = missing.length * 2;

    const baselineMatches = originallyMissing.length === requiredKeywords.length
      ? 0
      : requiredKeywords.length - originallyMissing.length;

    const baselineJobReadinessScore = requiredKeywords.length > 0
      ? Math.round((baselineMatches / requiredKeywords.length) * 100)
      : 50;

    return {
      assessmentScore,
      resumeScore,
      interviewScore,
      projectScore,
      certBonus,
      certsScore,
      roadmapProgressPercent,
      finalDnaScore,
      jobReadinessScore,
      baselineJobReadinessScore,
      missingSkills: missing,
      estimatedReadyWeeks,
      skillGapPenalty,
      completedModulesCount,
      totalModules,
      completedWeightsSum,
      isLocked: false,
      pendingModules,
      profileCompletionPercent,
      confidenceLevel
    };
  }, [assessment, latestResume, interviewHistory, projects, certs, roadmapProgress, targetCareerId]);

  const refreshResumeData = () => {
    loadAllData();
  };

  // Achievements calculation (placed after scores declaration to resolve block scope ordering)
  const achievements = useMemo((): AchievementBadge[] => {
    const list: AchievementBadge[] = [
      {
        id: 'decoder',
        title: 'DNA Decoder Graduate',
        description: 'Complete the 15-question RIASEC assessment.',
        unlocked: assessment?.taken === true,
        iconName: 'Compass'
      },
      {
        id: 'resume',
        title: 'ATS Certified Resume',
        description: 'Analyze a resume scoring 80 points or higher.',
        unlocked: latestResume ? latestResume.result.score >= 80 : false,
        iconName: 'FileText'
      },
      {
        id: 'portfolio',
        title: 'Elite Portfolio Builder',
        description: 'Register 3 or more developer projects.',
        unlocked: projects.length >= 3,
        iconName: 'Code'
      },
      {
        id: 'certified',
        title: 'Industry Certified',
        description: 'Log at least one cloud or developer credential.',
        unlocked: certs.length > 0,
        iconName: 'Award'
      },
      {
        id: 'interview',
        title: 'Polished Presenter',
        description: 'Complete a speech simulator mock interview trial.',
        unlocked: interviewHistory.length > 0,
        iconName: 'Mic'
      },
      {
        id: 'readiness',
        title: 'Verified Job Ready',
        description: 'Reach a unified CareerDNA Score of 80 points or more.',
        unlocked: scores.finalDnaScore >= 80,
        iconName: 'Zap'
      }
    ];
    return list;
  }, [assessment, latestResume, projects, certs, interviewHistory, scores.finalDnaScore]);

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

        bookmarkedCareers,
        toggleBookmarkCareer,
        achievements,

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
