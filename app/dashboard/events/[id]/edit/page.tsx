import type { Metadata } from "next"
import { EventForm } from "@/components/event-form"

export const metadata: Metadata = {
  title: "تعديل فعالية | إدارة الرياضة",
  description: "تعديل فعالية موجودة",
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  // في تطبيق حقيقي، ستقوم بجلب بيانات الفعالية بناءً على المعرف
  const eventData = {
    id: params.id,
    title: "فعالية نموذجية",
    content: "هذا هو وصف الفعالية النموذجية.",
    image: "/placeholder.svg?height=300&width=500",
    date: new Date().toISOString(),
    location: "الملعب الرياضي، وسط المدينة",
    type: "upcoming" as const,
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">تعديل فعالية</h1>
      <EventForm initialData={eventData} />
    </div>
  )
}
