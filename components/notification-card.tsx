"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Info, CheckCircle, AlertTriangle, AlertCircle, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface NotificationProps {
  notification: {
    id: string
    title: string
    message: string
    type: "info" | "success" | "warning" | "error"
    read: boolean
    date: Date
  }
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
}

export function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationProps) {
  const { language } = useLanguage()
  const [isRead, setIsRead] = useState(notification.read)

  const handleMarkAsRead = () => {
    setIsRead(true)
    if (onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id)
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border-b transition-colors hover:bg-muted/50",
        !isRead && "bg-muted/30",
      )}
    >
      <div className="mt-1">{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className={cn("text-sm font-medium", !isRead && "font-semibold")}>{notification.title}</p>
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground">
              {format(notification.date, "PPp", { locale: language === "ar" ? ar : undefined })}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isRead && (
                  <DropdownMenuItem onClick={handleMarkAsRead}>
                    {language === "ar" ? "تعيين كمقروء" : "Mark as read"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete}>{language === "ar" ? "حذف" : "Delete"}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
      </div>
    </div>
  )
}
