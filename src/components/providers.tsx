'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { ResumeProvider } from '@/lib/resume-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ResumeProvider>
        {children}
      </ResumeProvider>
    </AuthProvider>
  );
}
