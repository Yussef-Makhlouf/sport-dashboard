"use client"

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/constants';
import { getAuthToken } from '@/components/login-form';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  userName: string;
  email: string;
  role: string;
  image?: {
    secure_url: string;
    public_id: string;
  };
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userDataStr = Cookies.get('userData');
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      
      if (!userData?._id) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/auth/getUser/${userData._id}`, {
        headers: {
          Authorization: `MMA ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { user, isLoading, refetch: fetchUserData };
}; 