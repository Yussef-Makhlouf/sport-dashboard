import type { Metadata } from "next"
import { EventForm } from "@/components/event-form"

export const metadata: Metadata = {
  title: "إنشاء فعالية | إدارة الرياضة",
  description: "إنشاء فعالية جديدة",
}

export default function CreateEventPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">إنشاء فعالية</h1>
      <EventForm />
    </div>
  )
}
