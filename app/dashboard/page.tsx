"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentNews } from "@/components/recent-news"
import { UpcomingEvents } from "@/components/upcoming-events"
import { API_URL } from "@/lib/constants"
import { useLanguage } from "@/components/language-provider"

interface DashboardData {
  message: string
  members: number
  news: number
  users: number
  monthlyNews: {
    count: number
    percentageChange: number
    month?: string
    year?: number
  }
}

interface MonthlyNewsData {
  message: string
  data: {
    count: number
    month: string
    year: number
  }
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, monthlyNewsResponse] = await Promise.all([
          fetch(`${API_URL}/auth/getDashboard`),
          fetch(`${API_URL}/news/getNewsByMonth`)
        ])
        
        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        
        const dashboardResult = await dashboardResponse.json()
        console.log('Dashboard data:', dashboardResult)
        
        // Handle monthly news data
        if (monthlyNewsResponse.ok) {
          const monthlyNewsResult: MonthlyNewsData = await monthlyNewsResponse.json()
          console.log('Monthly news data:', monthlyNewsResult)
          
          // Update dashboard data with monthly news information
          setDashboardData({
            ...dashboardResult,
            monthlyNews: {
              count: monthlyNewsResult.data.count,
              percentageChange: dashboardResult.monthlyNews?.percentageChange || 0,
              month: monthlyNewsResult.data.month,
              year: monthlyNewsResult.data.year
            }
          })
        } else {
          setDashboardData(dashboardResult)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setDashboardData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h1>
        <div>{t("loading")}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total.news")}</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.news || 0}</div>
            
          </CardContent>
        </Card>
     
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("members")}</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.members || 0}</div>
         
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("active.users")}</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"  
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.users || 0}</div>
            <p className="text-xs text-muted-foreground">+2 {t("since.last.login")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("latest.news")}</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.monthlyNews?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.monthlyNews?.percentageChange && dashboardData?.monthlyNews?.percentageChange > 0 ? '+' : ''}
             
            </p>
            {dashboardData?.monthlyNews && (
              <p className="text-xs text-muted-foreground mt-1">
                {t("month")}: {dashboardData?.monthlyNews?.month || '-'} {dashboardData?.monthlyNews?.year || '-'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("content.overview")}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("recent.news")}</CardTitle>
            <CardDescription>{t("recent.news.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentNews />
          </CardContent>
        </Card>
      </div>
   
    </div>
  )
}
