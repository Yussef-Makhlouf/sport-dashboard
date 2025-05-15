"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/constants';
import { getAuthToken } from '@/components/login-form';
import { toast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const verifyAuth = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `MMA ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Auth verification error:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      toast({
        title: "خطأ في المصادقة",
        description: "يرجى تسجيل الدخول مرة أخرى",
        variant: "destructive",
      });
      router.push('/login');
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  return { isAuthenticated, isLoading, verifyAuth };
}; 