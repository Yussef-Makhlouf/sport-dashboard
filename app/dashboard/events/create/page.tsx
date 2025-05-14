"use client"

import { EventForm } from "@/components/event-form"
import { useLanguage } from "@/components/language-provider"

export default function CreateEventPage() {
  const { t } = useLanguage()
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("create.event")}</h1>
      <EventForm />
    </div>
  )
}
