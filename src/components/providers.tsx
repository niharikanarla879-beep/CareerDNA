'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { ResumeProvider } from '@/lib/resume-context';
import { ToastProvider } from '@/lib/toast-context';
import { ToastContainer } from '@/components/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ResumeProvider>
          {children}
          <ToastContainer />
        </ResumeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
