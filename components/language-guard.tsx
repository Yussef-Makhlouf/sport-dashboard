"use client"

import { useLanguage } from "./language-provider"
import { ReactNode } from "react"

export function LanguageGuard({ children }: { children: ReactNode }) {
  const { isLoaded } = useLanguage()

  // لا تعرض أي شيء حتى يتم تحميل اللغة بشكل كامل
  if (!isLoaded) {
    return null
  }

  return <>{children}</>
} 