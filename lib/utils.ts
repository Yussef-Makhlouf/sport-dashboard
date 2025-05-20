import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "@/hooks/use-toast"
import Cookies from "js-cookie"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Toast utility functions
export const showToast = {
  loading: (t: any, title = "loading", description = "please.wait") => {
    return toast({
      title: t(title),
      description: t(description),
      duration: 3000,
    })
  },
  success: (t: any, title = "success", description = "operation.success", duration = 3000) => {
    return toast({
      title: t(title),
      description: t(description),
      duration: duration,
    })
  },
  error: (t: any, title = "error", description = "operation.failed", errorMessage?: string, duration = 5000) => {
    return toast({
      title: t(title),
      description: errorMessage || t(description),
      variant: "destructive",
      duration: duration,
    })
  },
  info: (t: any, title: string, description: string, duration = 3000) => {
    return toast({
      title: t(title),
      description: t(description),
      duration: duration,
    })
  },
  custom: (props: any) => {
    return toast(props)
  }
}

interface ApiResponse {
  message?: string;
  userToken?: string;
  [key: string]: any;
}

export async function fetchWithTokenRefresh(
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<Response> {
  const token = Cookies.get('token');
  
  // Add authorization header if token exists
  const headers = {
    ...options.headers,
    Authorization: `MMA ${token}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data: ApiResponse = await response.json();

    // Check if token was refreshed
    if (data.message === "Token refreshed" && data.userToken) {
      // Update token in cookies
      Cookies.set('token', data.userToken, { expires: 7, secure: true });
      
      // If this was the first attempt, retry the original request with new token
      if (retryCount === 0) {
        return fetchWithTokenRefresh(url, options, retryCount + 1);
      }
    }

    // Create a new response with the parsed data
    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
