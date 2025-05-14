"use client";

import { API_URL } from "@/lib/constants";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Type definitions
export interface UserData {
  _id: string;
  userName: string;
  email: string;
  role: string;
  isActive: boolean;
}

// Function to check if the user is authenticated
export const isAuthenticated = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check for token in cookies
  const token = Cookies.get('token');
  
  return !!token; // Return true if token exists
};

// Function to get the current user data
export const getUserData = (): UserData | null => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  // Get user data from cookies
  const userDataString = Cookies.get('userData');
  
  if (!userDataString) {
    return null;
  }
  
  try {
    return JSON.parse(userDataString);
  } catch (e) {
    return null;
  }
};

// React hook for authentication status
export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      setIsLoading(true);
      
      // First check if token exists
      const token = Cookies.get('token');
      
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      // Get user data from cookies
      const userDataString = Cookies.get('userData');
      
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          setUser(userData);
          setIsLoggedIn(true);
        } catch (e) {
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        // Try to verify token with the server
        try {
          const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              const userData = {
                _id: data.user._id,
                userName: data.user.userName,
                email: data.user.email,
                role: data.user.role,
                isActive: data.user.isActive,
              };
              
              // Save user data to cookies
              Cookies.set('userData', JSON.stringify(userData), { expires: 7, secure: true });
              
              setUser(userData);
              setIsLoggedIn(true);
            } else {
              setUser(null);
              setIsLoggedIn(false);
              // Clear invalid token
              Cookies.remove('token');
              Cookies.remove('userData');
            }
          } else {
            setUser(null);
            setIsLoggedIn(false);
            // Clear invalid token
            Cookies.remove('token');
            Cookies.remove('userData');
          }
        } catch (error) {
          setUser(null);
          setIsLoggedIn(false);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Function to log out
  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('userData');
    setUser(null);
    setIsLoggedIn(false);
    router.push('/login');
  };

  return { user, isLoggedIn, isLoading, logout };
};

// Authentication middleware component
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading && !isLoggedIn) {
        router.push('/login');
      }
    }, [isLoggedIn, isLoading, router]);
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isLoggedIn) {
      return null; // Will redirect in the useEffect
    }
    
    return <Component {...props} />;
  };
} 