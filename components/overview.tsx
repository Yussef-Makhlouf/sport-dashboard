"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"

interface ChartDataItem {
  name: string
  news: number
}

interface ApiMonthStat {
  month: string
  count: number
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    year: number
    stats: ApiMonthStat[]
    chartData: {
      labels: string[]
      datasets: {
        label: string
        data: number[]
        backgroundColor: string
        borderColor: string
        borderWidth: number
      }[]
    }
  }
}

export function Overview() {
  const { t } = useLanguage()
  const [chartData, setChartData] = useState<ChartDataItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://mmaf.onrender.com/news/getNewsCharts")
        const apiData: ApiResponse = await response.json()
        if (apiData.success) {
          const transformedData = apiData.data.stats.map((item) => ({
            name: item.month, // Assuming API returns month names that can be used directly or translated if needed
            news: item.count,
          }))
          setChartData(transformedData)
        } else {
          console.error("Failed to fetch chart data:", apiData.message)
          // Optionally, set some default/fallback data or show an error message
        }
      } catch (error) {
        console.error("Error fetching chart data:", error)
        // Optionally, set some default/fallback data or show an error message
      }
    }

    fetchData()
  }, [])

  // Translate month names if they are keys to be translated by i18n
  // If API already returns translated month names, this step might not be needed or adjusted.
  const translatedData = chartData.map((item) => ({
    ...item,
    // name: t(item.name), //  Commented out as API provides Arabic month names. Enable if API provides keys like 'jan', 'feb' etc.
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={translatedData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          formatter={(value, name) => {
            // The name prop from <Bar /> component will be "عدد الأخبار"
            // We can directly use it or customize further if needed.
            return [value, name]
          }}
          labelFormatter={(label) => `${label}`}
        />
        {/* The API provides "label": "عدد الأخبار" which can be used as the name */}
        {/* Also, the color #c0392b can be used from apiData.data.chartData.datasets[0].backgroundColor */}
        <Bar dataKey="news" fill="#c0392b" radius={[4, 4, 0, 0]} name="عدد الأخبار" />
      </BarChart>
    </ResponsiveContainer>
  )
}
