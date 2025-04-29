"use client"

import { format } from "date-fns"
import { MapPin } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { arEG } from "date-fns/locale"

// Sample data - in a real app, this would come from an API
const upcomingEvents = [
  {
    id: "1",
    title: "نهائيات البطولة",
    date: new Date("2023-08-15"),
    location: "الملعب الرئيسي، وسط المدينة",
  },
  {
    id: "2",
    title: "بطولة خيرية",
    date: new Date("2023-09-02"),
    location: "ملعب المجتمع، الجانب الغربي",
  },
  {
    id: "3",
    title: "معسكر تدريبي للشباب",
    date: new Date("2023-09-10"),
    location: "مركز التدريب، الجانب الشرقي",
  },
]

export function UpcomingEvents() {
  const { language, t } = useLanguage()

  return (
    <div className="space-y-4">
      {upcomingEvents.map((event) => (
        <div key={event.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">{event.title}</h4>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="ml-1 h-3 w-3" />
              {event.location}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {format(event.date, "d MMMM yyyy", { locale: language === "ar" ? arEG : undefined })}
          </div>
        </div>
      ))}
    </div>
  )
}
