import { showToast } from "@/lib/utils"

/**
 * Helper functions to handle API errors in a user-friendly way
 * This prevents displaying raw server errors to users and provides consistent error messages
 */

/**
 * Handles API errors in a user-friendly way
 * @param t Translation function
 * @param error The error object
 * @param defaultTitle Default error title key for translation
 * @param defaultMessage Default error message key for translation
 */
export function handleApiError(
  t: (key: string) => string,
  error: unknown,
  defaultTitle = "error",
  defaultMessage = "operation.failed"
) {
  // Log the error for developers
  console.error("API Error:", error)
  
  // Extract error message
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  // Don't show technical error messages to users
  if (errorMessage.includes("Network Error") || errorMessage.includes("Failed to fetch")) {
    showToast.error(t, "connection.error", "server.connection.error")
    return
  }
  
  if (errorMessage.includes("401") || errorMessage.includes("403") || 
      errorMessage.includes("unauthorized") || errorMessage.includes("Unauthorized") ||
      errorMessage.includes("forbidden") || errorMessage.includes("Forbidden")) {
    showToast.error(t, "unauthorized.title", "unauthorized.description")
    return
  }
  
  if (errorMessage.includes("404") || errorMessage.includes("Not found")) {
    showToast.error(t, "error", "profile.not.found")
    return
  }
  
  // Default error message (generic)
  showToast.error(t, defaultTitle, defaultMessage)
}

/**
 * Handles authentication errors
 * @param t Translation function
 * @param error The error object
 */
export function handleAuthError(t: (key: string) => string, error: unknown) {
  console.error("Auth Error:", error)
  
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  if (errorMessage.includes("password") || errorMessage.includes("Password")) {
    showToast.error(t, "login.failed", "password.incorrect")
    return
  }
  
  if (errorMessage.includes("email") || errorMessage.includes("Email")) {
    showToast.error(t, "login.failed", "email.not.found")
    return
  }
  
  showToast.error(t, "login.failed", "login.error.message")
}

/**
 * Handles profile-related errors
 * @param t Translation function
 * @param error The error object
 */
export function handleProfileError(t: (key: string) => string, error: unknown) {
  console.error("Profile Error:", error)
  
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  if (errorMessage.includes("token") || errorMessage.includes("Token")) {
    showToast.error(t, "unauthorized.title", "unauthorized.description")
    return
  }
  
  showToast.error(t, "profile.view.error", "connection.error")
} 