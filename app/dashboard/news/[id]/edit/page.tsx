"use client"

import type { Metadata } from "next"
import { NewsForm } from "@/components/news-form"
import { API_URL } from "@/lib/constants"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"


interface NewsData {
  _id: string
  title: {
    ar: string
    en: string
  }
  content: {
    ar: string
    en: string
  }
  category: any
  image: any[]
  date: string
  [key: string]: any
}

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/news/getnewsbyid/${params.id}`, {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch news data')
        }
        
        const data = await response.json()
        setNewsData(data.news)
        setError(null)
      } catch (error) {
        console.error('Error fetching news data:', error)
        setError(t("news.not.found.error"))
        setNewsData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsData()
  }, [params.id, t])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("edit.news")}</h1>
        <div>{t("loading")}</div>
      </div>
    )
  }

  if (!newsData) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("edit.news")}</h1>
        <div className="text-red-500">{error || t("news.not.found")}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("edit.news")}</h1>
      <NewsForm initialData={newsData} />
    </div>
  )
}