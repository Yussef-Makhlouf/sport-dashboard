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
        console.log('No user ID found in cookies');
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('Fetching user data for ID:', userData._id);
      const response = await fetch(`${API_URL}/auth/getUser/${userData._id}`, {
        headers: {
          Authorization: `MMA ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch user data');
      }

      const data = await response.json();
      
      // Check if the response has the expected structure
      if (!data.user) {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid API response structure');
      }

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