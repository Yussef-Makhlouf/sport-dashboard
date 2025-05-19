import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "@/hooks/use-toast"
import Cookies from "js-cookie"
import { API_URL } from "./constants"
import { getAuthToken } from "@/components/login-form"
import { useLanguage } from "@/components/language-provider"

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

// Add function to get token from cookies
export const getTokenFromCookies = () => {
  const userDataStr = Cookies.get('token');
  console.log(userDataStr);
  
  if (userDataStr) {
    console.log("Token from userData:", userDataStr);
    return userDataStr;
  }
  return null;
};

export const fetchWithTokenRefresh = async (
  url: string,
  options: RequestInit = {},
  retryCount = 0,
  t?: (key: string) => string
): Promise<Response> => {
  const userDataStr = Cookies.get('userData');
  const userData = userDataStr ? JSON.parse(userDataStr) : null;

  if (!userData?._id) {
    throw new Error("No user data found");
  }

  // Add authorization header if not present
  const headers = {
    ...options.headers,
    Authorization: `MMA ${getAuthToken()}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data: ApiResponse = await response.json();
    console.log("Response data:", data);
    console.log("Current token:", getTokenFromCookies());

    if (data.message === "Wrong Token - Token not found in user data") {
      // Refresh user data and token
      const refreshResponse = await fetch(`${API_URL}/auth/getUser/${userData._id}`, {
        method: "GET",
        headers: {
          Authorization: `MMA ${getAuthToken()}`,
        },
      });

      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh user data");
      }

      const refreshData = await refreshResponse.json();
      console.log("Refresh data:", refreshData);
      console.log("New token:", refreshData.user.token);
      
      // Update user data in cookies with new token
      Cookies.set('userData', JSON.stringify(refreshData.user));
      // Also update the token cookie
      Cookies.set('token', refreshData.user.token, { expires: 7, secure: true });

      // Retry the original request with new token
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `MMA ${refreshData.user.token}`,
        },
      });

      if (!retryResponse.ok) {
        const retryErrorData = await retryResponse.json();
        if (retryErrorData.message === "UnAuthorized to access this api") {
          toast({
            title: t ? t("unauthorized.title") : "Unauthorized",
            description: t ? t("unauthorized.description") : "You are not authorized to perform this action",
            variant: "destructive",
          });
          throw new Error(t ? t("unauthorized.error") : "Unauthorized");
        }
        throw new Error(retryErrorData.message || "Request failed after token refresh");
      }

      return retryResponse;
    }
    // Check if token was refreshed
    if (data.message === "Token refreshed" && data.userToken) {
      // Update token in cookies
      Cookies.set('token', data.userToken, { expires: 7, secure: true });
      
      // If this was the first attempt, retry the original request with new token
      if (retryCount === 0) {
        return fetchWithTokenRefresh(url, options, retryCount + 1, t);
      }
    }

    if (data.message === "Wrong Token - Token not found in user data") {
      // Refresh user data and token
      const refreshResponse = await fetch(`${API_URL}/auth/getUser/${userData._id}`, {
        method: "GET",
        headers: {
          Authorization: `MMA ${getAuthToken()}`,
        },
      });

      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh user data");
      }

      const refreshData = await refreshResponse.json();
      console.log("Refresh data:", refreshData);
      console.log("New token:", refreshData.user.token);
      
      // Update user data in cookies with new token
      Cookies.set('userData', JSON.stringify(refreshData.user));
      // Also update the token cookie
      Cookies.set('token', refreshData.user.token, { expires: 7, secure: true });

      // Retry the original request with new token
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `MMA ${refreshData.user.token}`,
        },
      });

      if (!retryResponse.ok) {
        const retryErrorData = await retryResponse.json();
        if (retryErrorData.message === "UnAuthorized to access this api") {
          toast({
            title: t ? t("unauthorized.title") : "Unauthorized",
            description: t ? t("unauthorized.description") : "You are not authorized to perform this action",
            variant: "destructive",
          });
          throw new Error(t ? t("unauthorized.error") : "Unauthorized");
        }
        throw new Error(retryErrorData.message || "Request failed after token refresh");
      }

      return retryResponse;
    }
    
    if (!response.ok) {
      // Handle unauthorized error
      if (data.message === "UnAuthorized to access this api") {
        toast({
          title: t ? t("unauthorized.title") : "Unauthorized",
          description: t ? t("unauthorized.description") : "You are not authorized to perform this action",
          variant: "destructive",
        });
        throw new Error(t ? t("unauthorized.error") : "Unauthorized");
      }

      throw new Error(data.message || "Request failed");
    }

    // Create a new response with the parsed data
    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Error in fetchWithTokenRefresh:', error);
    throw error;
  }
};
