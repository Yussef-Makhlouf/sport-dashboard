"use client"

import { NewsForm } from "@/components/news-form"
import { useLanguage } from "@/components/language-provider"

export default function CreateNewsPage() {
  const { t } = useLanguage()
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("create.news")}</h1>
      <NewsForm />
    </div>
  )
}
