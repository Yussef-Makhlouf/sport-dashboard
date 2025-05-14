"use client"

import { useState, useEffect } from "react"
import { MembersTable } from "@/components/members-table"
import { useLanguage } from "@/components/language-provider"

export default function MembersPage() {
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)

  // Add error boundary/handling
  useEffect(() => {
    // Reset any previous errors when component mounts
    setError(null)

    // Add a global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global error in members page:", event.error)
      setError("An unexpected error occurred. Please try refreshing the page.")
      // Prevent the default error handling
      event.preventDefault()
    }

    // Register the error handler
    window.addEventListener('error', handleError)

    // Clean up
    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [])

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">{t("error.occurred")}</h2>
          <p className="text-red-700">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            {t("refresh.page")}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <MembersTable />
    </div>
  )
}
