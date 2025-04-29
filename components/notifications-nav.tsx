"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLanguage } from "@/components/language-provider"
import { NotificationCard } from "@/components/notification-card"
import { Badge } from "@/components/ui/badge"

// Sample notifications data
const sampleNotifications = [
  {
    id: "1",
    title: {
      ar: "تم إضافة خبر جديد",
      en: "New article added",
    },
    message: {
      ar: "تم إضافة خبر جديد بعنوان 'بطولة UAEMMAF القادمة'",
      en: "New article added with title 'Upcoming UAEMMAF Championship'",
    },
    type: "info",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "2",
    title: {
      ar: "تم تحديث فعالية",
      en: "Event updated",
    },
    message: {
      ar: "تم تحديث فعالية 'بطولة أبوظبي للجوجيتسو'",
      en: "Event 'Abu Dhabi Jiu-Jitsu Championship' has been updated",
    },
    type: "success",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    title: {
      ar: "تسجيل مستخدم جديد",
      en: "New user registration",
    },
    message: {
      ar: "قام مستخدم جديد بالتسجيل في النظام",
      en: "A new user has registered in the system",
    },
    type: "warning",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "4",
    title: {
      ar: "تحديث النظام",
      en: "System update",
    },
    message: {
      ar: "تم تحديث النظام إلى الإصدار الجديد",
      en: "System has been updated to the new version",
    },
    type: "info",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
]

export function NotificationsNav() {
  const { t, language } = useLanguage()
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#BB2121]">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">{t("notifications")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">{t("notifications")}</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              {t("notification.mark.all.read")}
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={{
                  ...notification,
                  title: language === "ar" ? notification.title.ar : notification.title.en,
                  message: language === "ar" ? notification.message.ar : notification.message.en,
                }}
              />
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">{t("notification.no.notifications")}</div>
          )}
        </div>
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              setOpen(false)
              // Navigate to notifications page
              window.location.href = "/dashboard/notifications"
            }}
          >
            {t("show.more")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
