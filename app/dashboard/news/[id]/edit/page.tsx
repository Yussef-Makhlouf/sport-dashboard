import type { Metadata } from "next"
import { NewsForm } from "@/components/news-form"

export const metadata: Metadata = {
  title: "تعديل خبر | إدارة الرياضة",
  description: "تعديل مقال إخباري موجود",
}

export default function EditNewsPage({ params }: { params: { id: string } }) {
  // في تطبيق حقيقي، ستقوم بجلب بيانات المقال الإخباري بناءً على المعرف
  const newsData = {
    id: params.id,
    title: "مقال إخباري نموذجي",
    content: "هذا هو محتوى المقال الإخباري النموذجي.",
    image: "/placeholder.svg?height=300&width=500",
    publishedAt: new Date().toISOString(),
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">تعديل مقال إخباري</h1>
      <NewsForm initialData={newsData} />
    </div>
  )
}
