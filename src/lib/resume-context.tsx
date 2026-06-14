'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { analyzeResume, ResumeAnalysisResult } from './analyzer';

export interface ResumeHistoryItem {
  id: string;
  timestamp: string;
  filename: string;
  roleId: string;
  result: ResumeAnalysisResult;
  text: string;
}

interface ResumeContextType {
  resumeHistory: ResumeHistoryItem[];
  latestResume: ResumeHistoryItem | null;
  loading: boolean;
  addResumeToHistory: (filename: string, roleId: string, text: string, result: ResumeAnalysisResult) => void;
  deleteResumeFromHistory: (id: string) => void;
  targetCareerId: string;
  setTargetCareerId: (roleId: string) => void;
  refreshResumeData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Safe JSON parser helper with fallback recovery
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
  const { user } = useAuth();
  const [resumeHistory, setResumeHistory] = useState<ResumeHistoryItem[]>([]);
  const [latestResume, setLatestResume] = useState<ResumeHistoryItem | null>(null);
  const [targetCareerId, setTargetCareerIdState] = useState<string>('swe');
  const [loading, setLoading] = useState(true);

  const loadResumeData = () => {
    if (!user) {
      setResumeHistory([]);
      setLatestResume(null);
      setTargetCareerIdState('swe');
      setLoading(false);
      return;
    }

    try {
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

      const careerKey = `careerdna_target_career_${user.id}`;
      const savedCareerId = localStorage.getItem(careerKey);
      if (savedCareerId) {
        setTargetCareerIdState(savedCareerId);
      } else {
        setTargetCareerIdState('swe');
      }
    } catch (error) {
      console.error('Error loading resume history from localStorage:', error);
      setResumeHistory([]);
      setLatestResume(null);
      setTargetCareerIdState('swe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumeData();

    const handleStorageChange = (e: StorageEvent) => {
      if (!user) return;
      if (
        e.key === `careerdna_resume_history_${user.id}` || 
        e.key === `careerdna_target_career_${user.id}`
      ) {
        loadResumeData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    const handleCustomSync = () => {
      loadResumeData();
    };
    window.addEventListener('careerdna_resume_sync', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('careerdna_resume_sync', handleCustomSync);
    };
  }, [user]);

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
      
      setResumeHistory(updatedHistory);
      setLatestResume(newHistoryItem);
      
      // Update target career too when user analyzes a resume
      localStorage.setItem(`careerdna_target_career_${user.id}`, roleId);
      setTargetCareerIdState(roleId);
      
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (error) {
      console.error('Error saving resume history to localStorage:', error);
    }
  };

  const deleteResumeFromHistory = (id: string) => {
    if (!user) return;

    try {
      const historyKey = `careerdna_resume_history_${user.id}`;
      const historyRaw = localStorage.getItem(historyKey);
      const history = safeJsonParse<ResumeHistoryItem[]>(historyRaw, [], historyKey);
      
      const updatedHistory = history.filter(item => item.id !== id);
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      
      setResumeHistory(updatedHistory);
      if (updatedHistory.length > 0) {
        const sorted = [...updatedHistory].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setLatestResume(sorted[0]);
      } else {
        setLatestResume(null);
      }
      
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (error) {
      console.error('Error deleting resume from history:', error);
    }
  };

  const setTargetCareerId = (roleId: string) => {
    if (!user) return;

    try {
      const careerKey = `careerdna_target_career_${user.id}`;
      localStorage.setItem(careerKey, roleId);
      setTargetCareerIdState(roleId);
      
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('careerdna_resume_sync'));
    } catch (error) {
      console.error('Error saving target career:', error);
    }
  };

  const refreshResumeData = () => {
    loadResumeData();
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
        refreshResumeData
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
