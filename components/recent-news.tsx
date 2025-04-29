"use client"

import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/components/language-provider"
import { arEG } from "date-fns/locale"

// Sample data - in a real app, this would come from an API
const recentNews = [
  {
    id: "1",
    title: "الفريق يفوز بالبطولة",
    publishedAt: new Date("2023-06-15"),
    author: {
      name: "أحمد محمد",
      avatar: "/placeholder.svg",
      initials: "أم",
    },
  },
  {
    id: "2",
    title: "التعاقد مع لاعب جديد",
    publishedAt: new Date("2023-06-12"),
    author: {
      name: "سارة علي",
      avatar: "/placeholder.svg",
      initials: "سع",
    },
  },
  {
    id: "3",
    title: "اكتمال تجديد الملعب",
    publishedAt: new Date("2023-06-10"),
    author: {
      name: "محمد خالد",
      avatar: "/placeholder.svg",
      initials: "مخ",
    },
  },
  {
    id: "4",
    title: "مقابلة مع المدرب",
    publishedAt: new Date("2023-06-08"),
    author: {
      name: "ليلى أحمد",
      avatar: "/placeholder.svg",
      initials: "لأ",
    },
  },
  {
    id: "5",
    title: "تذاكر الموسم متاحة الآن",
    publishedAt: new Date("2023-06-05"),
    author: {
      name: "عمر حسن",
      avatar: "/placeholder.svg",
      initials: "عح",
    },
  },
]

export function RecentNews() {
  const { language, t } = useLanguage()

  return (
    <div className="space-y-8">
      {recentNews.map((item) => (
        <div key={item.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
            <AvatarFallback>{item.author.initials}</AvatarFallback>
          </Avatar>
          <div className="mr-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              {t("by")} {item.author.name} {t("on")}{" "}
              {format(item.publishedAt, "d MMMM yyyy", { locale: language === "ar" ? arEG : undefined })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
