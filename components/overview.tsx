"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useLanguage } from "@/components/language-provider"

// Sample data - in a real app, this would come from an API
const data = [
  {
    name: "jan",
    news: 12,
    events: 5,
  },
  {
    name: "feb",
    news: 18,
    events: 8,
  },
  {
    name: "mar",
    news: 15,
    events: 10,
  },
  {
    name: "apr",
    news: 22,
    events: 12,
  },
  {
    name: "may",
    news: 28,
    events: 15,
  },
  {
    name: "jun",
    news: 32,
    events: 18,
  },
  {
    name: "jul",
    news: 15,
    events: 9,
  },
]

export function Overview() {
  const { t } = useLanguage()

  // Translate month names
  const translatedData = data.map((item) => ({
    ...item,
    name: t(item.name),
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={translatedData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          formatter={(value, name) => [value, name === "news" ? "الأخبار" : "الفعاليات"]}
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="news" fill="#BB2121" radius={[4, 4, 0, 0]} name="الأخبار" />
        <Bar dataKey="events" fill="#8A8A8A" radius={[4, 4, 0, 0]} name="الفعاليات" />
      </BarChart>
    </ResponsiveContainer>
  )
}
