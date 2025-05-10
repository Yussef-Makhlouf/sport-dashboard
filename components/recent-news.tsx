"use client"

import { useEffect, useState } from "react"
import { API_URL } from "@/lib/constants"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

interface NewsItem {
  _id: string
  title: {
    ar: string
    en: string
  }
  content: {
    ar: string
    en: string
  }
  image: Array<{
    secure_url: string
    public_id: string
  }>
  date: string
}

export function RecentNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_URL}/news/getallnews`)
        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }
        const data = await response.json()
        // Get only the last 10 news items
        setNews(data.news.slice(0, 3))
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return <div>جاري التحميل...</div>
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item._id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {item.image[0] && (
                <img
                  src={item.image[0].secure_url}
                  alt={item.title[language]}
                  className="h-20 w-20 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold line-clamp-2">
                  {item.title[language]}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(item.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
