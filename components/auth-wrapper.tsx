"use client"

import { useAuth } from '@/lib/hooks/useAuth';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BB2121] border-r-transparent"></div>
        <p className="mr-2">جاري التحميل...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // The useAuth hook will handle the redirect
  }

  return <>{children}</>;
} 