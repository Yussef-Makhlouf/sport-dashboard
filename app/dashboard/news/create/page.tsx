import type { Metadata } from "next"
import { NewsForm } from "@/components/news-form"

export const metadata: Metadata = {
  title: "إنشاء خبر | إدارة الرياضة",
  description: "إنشاء مقال إخباري جديد",
}

export default function CreateNewsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">إنشاء مقال إخباري</h1>
      <NewsForm />
    </div>
  )
}
