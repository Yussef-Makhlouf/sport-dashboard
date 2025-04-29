"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Edit, Trash, Eye, MoreHorizontal, Calendar, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: {
    id: string
    title: string
    content: string
    image: string
    date: Date
    time: string
    location: string
    category: string
    type: "upcoming" | "past"
    featured?: boolean
    status: "draft" | "published" | "archived"
  }
  onDelete?: (id: string) => void
  variant?: "default" | "compact"
}

export function EventCard({ event, onDelete, variant = "default" }: EventCardProps) {
  const { t, language } = useLanguage()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      if (onDelete) {
        onDelete(event.id)
      }
      setIsDeleting(false)
    }, 500)
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, { ar: string; en: string }> = {
      tournament: { ar: "بطولة", en: "Tournament" },
      championship: { ar: "دوري", en: "Championship" },
      seminar: { ar: "ندوة", en: "Seminar" },
      training: { ar: "تدريب", en: "Training" },
      exhibition: { ar: "معرض", en: "Exhibition" },
      conference: { ar: "مؤتمر", en: "Conference" },
      other: { ar: "أخرى", en: "Other" },
    }

    return categories[category] ? (language === "ar" ? categories[category].ar : categories[category].en) : category
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">{t("event.save.draft")}</Badge>
      case "published":
        return (
          <Badge variant="success" className="bg-green-500">
            {t("event.publish")}
          </Badge>
        )
      case "archived":
        return <Badge variant="secondary">{t("event.unpublish")}</Badge>
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "upcoming":
        return <Badge className="bg-blue-500">{t("upcoming")}</Badge>
      case "past":
        return <Badge variant="secondary">{t("past")}</Badge>
      default:
        return null
    }
  }

  if (variant === "compact") {
    return (
      <Card className={cn("overflow-hidden transition-all hover:shadow-md", event.featured && "border-[#BB2121]")}>
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 w-full md:h-auto md:w-1/3">
            <Image
              src={event.image || "/placeholder.svg?height=300&width=500"}
              alt={event.title}
              fill
              className="object-cover"
            />
            {event.featured && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-[#BB2121]">{t("event.featured")}</Badge>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="outline">{getCategoryLabel(event.category)}</Badge>
                {getTypeBadge(event.type)}
                {getStatusBadge(event.status)}
              </div>
              <CardTitle className="line-clamp-2 text-lg">{event.title}</CardTitle>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(event.date, "PPP", { locale: language === "ar" ? ar : undefined })}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-between p-4">
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/events/${event.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t("view")}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/events/${event.id}/edit`}>
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
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", event.featured && "border-[#BB2121]")}>
      <div className="relative aspect-video w-full">
        <Image
          src={event.image || "/placeholder.svg?height=300&width=500"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {event.featured && <Badge className="bg-[#BB2121]">{t("event.featured")}</Badge>}
          {getTypeBadge(event.type)}
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{getCategoryLabel(event.category)}</Badge>
          {getStatusBadge(event.status)}
        </div>
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {format(event.date, "PPP", { locale: language === "ar" ? ar : undefined })}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {event.time}
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {event.location}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground">{event.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button asChild variant="outline">
          <Link href={`/dashboard/events/${event.id}`}>
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
              <Link href={`/dashboard/events/${event.id}/edit`}>
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
