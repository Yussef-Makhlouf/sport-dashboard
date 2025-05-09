import type { Metadata } from "next"
import { NewsForm } from "@/components/news-form"
import { API_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "تعديل خبر | إدارة الرياضة",
  description: "تعديل مقال إخباري موجود",
}

async function getNewsData(id: string) {
  try {
    const response = await fetch(`${API_URL}/news/getnewsbyid/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch news data')
    }
    
    const data = await response.json()
    return data.news
  } catch (error) {
    console.error('Error fetching news data:', error)
    return null
  }
}

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const newsData = await getNewsData(params.id)

  if (!newsData) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">تعديل مقال إخباري</h1>
        <div className="text-red-500">لم يتم العثور على المقال الإخباري</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">تعديل مقال إخباري</h1>
      <NewsForm initialData={newsData} />
    </div>
  )
}