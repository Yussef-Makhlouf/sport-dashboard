"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Edit, Trash, Eye, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

interface NewsCardProps {
  news: {
    id: string
    title: string
    content: string
    image: string
    publishedAt: Date
    category: string
    featured?: boolean
    status: "draft" | "published" | "archived"
  }
  onDelete?: (id: string) => void
  variant?: "default" | "compact"
}

export function NewsCard({ news, onDelete, variant = "default" }: NewsCardProps) {
  const { t, language } = useLanguage()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      if (onDelete) {
        onDelete(news.id)
      }
      setIsDeleting(false)
    }, 500)
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, { ar: string; en: string }> = {
      mma: { ar: "فنون قتالية مختلطة", en: "Mixed Martial Arts" },
      "jiu-jitsu": { ar: "جوجيتسو", en: "Jiu-Jitsu" },
      boxing: { ar: "ملاكمة", en: "Boxing" },
      wrestling: { ar: "مصارعة", en: "Wrestling" },
      "muay-thai": { ar: "مواي تاي", en: "Muay Thai" },
      karate: { ar: "كاراتيه", en: "Karate" },
      taekwondo: { ar: "تايكوندو", en: "Taekwondo" },
      other: { ar: "أخرى", en: "Other" },
    }

    return categories[category] ? (language === "ar" ? categories[category].ar : categories[category].en) : category
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">{t("news.save.draft")}</Badge>
      case "published":
        return (
          <Badge variant="success" className="bg-green-500">
            {t("news.publish")}
          </Badge>
        )
      case "archived":
        return <Badge variant="secondary">{t("news.unpublish")}</Badge>
      default:
        return null
    }
  }

  if (variant === "compact") {
    return (
      <Card className={cn("overflow-hidden transition-all hover:shadow-md", news.featured && "border-[#BB2121]")}>
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 w-full md:h-auto md:w-1/3">
            <Image
              src={news.image || "/placeholder.svg?height=300&width=500"}
              alt={news.title}
              fill
              className="object-cover"
            />
            {news.featured && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-[#BB2121]">{t("news.featured")}</Badge>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{getCategoryLabel(news.category)}</Badge>
                {getStatusBadge(news.status)}
              </div>
              <CardTitle className="line-clamp-2 text-lg">{news.title}</CardTitle>
              <CardDescription>
                {format(news.publishedAt, "PPP", { locale: language === "ar" ? ar : undefined })}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="line-clamp-2 text-sm text-muted-foreground">{news.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/news/${news.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t("view")}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/news/${news.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("edit")}
                  </Link>
                </Button>
              </div>
              <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                <Trash className="mr-2 h-4 w-4" />
                {t("delete")}
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", news.featured && "border-[#BB2121]")}>
      <div className="relative aspect-video w-full">
        <Image
          src={news.image || "/placeholder.svg?height=300&width=500"}
          alt={news.title}
          fill
          className="object-cover"
        />
        {news.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-[#BB2121]">{t("news.featured")}</Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{getCategoryLabel(news.category)}</Badge>
          {getStatusBadge(news.status)}
        </div>
        <CardTitle className="line-clamp-2">{news.title}</CardTitle>
        <CardDescription>
          {format(news.publishedAt, "PPP", { locale: language === "ar" ? ar : undefined })}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground">{news.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button asChild variant="outline">
          <Link href={`/dashboard/news/${news.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            {t("view")}
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/news/${news.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                {t("edit")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash className="mr-2 h-4 w-4" />
              {t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
