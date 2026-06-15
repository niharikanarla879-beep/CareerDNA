'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currentJob?: string;
  educationLevel?: string;
  experienceYears?: number;
}

interface MockUserData {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  currentJob?: string;
  educationLevel?: string;
  experienceYears?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isMockMode: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<Omit<UserProfile, 'id' | 'email'>>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isMockMode = !isSupabaseConfigured;

  // Initialize Auth session
  useEffect(() => {
    async function initAuth() {
      try {
        if (!isMockMode) {
          // Supabase Auth Integration
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user) {
            // Fetch profile data from profile table (or build from user metadata if missing)
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('userId', session.user.id)
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              firstName: profileData?.firstName || session.user.user_metadata?.firstName || 'User',
              lastName: profileData?.lastName || session.user.user_metadata?.lastName || '',
              currentJob: profileData?.currentJob || '',
              educationLevel: profileData?.educationLevel || '',
              experienceYears: profileData?.experienceYears || 0,
            });
          }
        } else {
          // Mock Auth Integration using localStorage
          const loggedInUser = localStorage.getItem('careerdna_user');
          if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    if (!isMockMode) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('userId', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: profileData?.firstName || session.user.user_metadata?.firstName || 'User',
            lastName: profileData?.lastName || session.user.user_metadata?.lastName || '',
            currentJob: profileData?.currentJob || '',
            educationLevel: profileData?.educationLevel || '',
            experienceYears: profileData?.experienceYears || 0,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isMockMode]);

  const login = async (email: string, password: string) => {
    try {
      if (!isMockMode) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } else {
        // Mock Login
        const mockUsersRaw = localStorage.getItem('careerdna_mock_users');
        const mockUsers = mockUsersRaw ? JSON.parse(mockUsersRaw) as MockUserData[] : [];
        const foundUser = mockUsers.find((u: MockUserData) => u.email.toLowerCase() === email.toLowerCase());

        if (!foundUser || foundUser.password !== password) {
          return { success: false, error: 'Invalid email or password.' };
        }

        const userProfile: UserProfile = {
          id: foundUser.id,
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          currentJob: foundUser.currentJob || '',
          educationLevel: foundUser.educationLevel || '',
          experienceYears: foundUser.experienceYears || 0,
        };

        localStorage.setItem('careerdna_user', JSON.stringify(userProfile));
        setUser(userProfile);
        return { success: true };
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      if (!isMockMode) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { firstName, lastName },
          },
        });
        if (error) return { success: false, error: error.message };

        // Attempt profiles table insertion if trigger isn't configured in Supabase
        if (data.user) {
          await supabase.from('profiles').insert({
            userId: data.user.id,
            firstName,
            lastName,
          });
        }
        return { success: true };
      } else {
        // Mock Signup
        const mockUsersRaw = localStorage.getItem('careerdna_mock_users');
        const mockUsers = mockUsersRaw ? JSON.parse(mockUsersRaw) as MockUserData[] : [];
        const userExists = mockUsers.some((u: MockUserData) => u.email.toLowerCase() === email.toLowerCase());

        if (userExists) {
          return { success: false, error: 'User with this email already exists.' };
        }

        const newMockUser = {
          id: Math.random().toString(36).substring(2, 11),
          email,
          password,
          firstName,
          lastName,
          currentJob: '',
          educationLevel: '',
          experienceYears: 0,
        };

        mockUsers.push(newMockUser);
        localStorage.setItem('careerdna_mock_users', JSON.stringify(mockUsers));

        const userProfile: UserProfile = {
          id: newMockUser.id,
          email: newMockUser.email,
          firstName: newMockUser.firstName,
          lastName: newMockUser.lastName,
          currentJob: '',
          educationLevel: '',
          experienceYears: 0,
        };

        localStorage.setItem('careerdna_user', JSON.stringify(userProfile));
        setUser(userProfile);
        return { success: true };
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      if (!isMockMode) {
        const { error } = await supabase.auth.signOut();
        if (error) return { success: false, error: error.message };
      } else {
        localStorage.removeItem('careerdna_user');
      }
      setUser(null);
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      return { success: false, error: errorMsg };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!isMockMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } else {
        // Mock password reset
        const mockUsersRaw = localStorage.getItem('careerdna_mock_users');
        const mockUsers = mockUsersRaw ? JSON.parse(mockUsersRaw) as MockUserData[] : [];
        const exists = mockUsers.some((u: MockUserData) => u.email.toLowerCase() === email.toLowerCase());

        if (!exists) {
          return { success: false, error: 'No account registered with this email address.' };
        }
        return { success: true };
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      return { success: false, error: errorMsg };
    }
  };

  const updateProfile = async (data: Partial<Omit<UserProfile, 'id' | 'email'>>) => {
    try {
      if (!user) return { success: false, error: 'User is not authenticated.' };

      const updatedUserProfile = { ...user, ...data };

      if (!isMockMode) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            userId: user.id,
            firstName: updatedUserProfile.firstName,
            lastName: updatedUserProfile.lastName,
            currentJob: updatedUserProfile.currentJob,
            educationLevel: updatedUserProfile.educationLevel,
            experienceYears: updatedUserProfile.experienceYears,
          });

        if (error) return { success: false, error: error.message };
      } else {
        // Mock Profile Update in Users Store
        const mockUsersRaw = localStorage.getItem('careerdna_mock_users');
        const mockUsers = mockUsersRaw ? JSON.parse(mockUsersRaw) as MockUserData[] : [];
        const updatedUsersList = mockUsers.map((u: MockUserData) => {
          if (u.id === user.id) {
            return { ...u, ...data };
          }
          return u;
        });

        localStorage.setItem('careerdna_mock_users', JSON.stringify(updatedUsersList));
        localStorage.setItem('careerdna_user', JSON.stringify(updatedUserProfile));
      }

      setUser(updatedUserProfile);
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      return { success: false, error: errorMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isMockMode,
        login,
        signup,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
