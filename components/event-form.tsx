"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon, ClockIcon, ImageIcon, MapPinIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

interface EventFormProps {
  initialData?: {
    id?: string
    title_ar?: string
    title_en?: string
    content_ar?: string
    content_en?: string
    image?: string
    date?: string
    time?: string
    location_ar?: string
    location_en?: string
    type?: "upcoming" | "past"
    category?: string
    featured?: boolean
  }
}

export function EventForm({ initialData }: EventFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
  const { t, language, dir } = useLanguage()
  const [activeTab, setActiveTab] = useState<"ar" | "en">(language)

  const formSchema = z.object({
    title_ar: z.string().min(5, {
      message: t("title.ar.min.length.error") || "Arabic title must be at least 5 characters.",
    }),
    title_en: z.string().min(5, {
      message: t("title.en.min.length.error") || "English title must be at least 5 characters.",
    }),
    content_ar: z.string().min(10, {
      message: t("content.ar.min.length.error") || "Arabic content must be at least 10 characters.",
    }),
    content_en: z.string().min(10, {
      message: t("content.en.min.length.error") || "English content must be at least 10 characters.",
    }),
    date: z.date({
      required_error: t("date.required") || "Event date is required.",
    }),
    time: z.string().min(1, {
      message: t("time.required") || "Event time is required.",
    }),
    location_ar: z.string().min(5, {
      message: t("location.ar.min.length.error") || "Arabic location must be at least 5 characters.",
    }),
    location_en: z.string().min(5, {
      message: t("location.en.min.length.error") || "English location must be at least 5 characters.",
    }),
    type: z.enum(["upcoming", "past"]),
    category: z.string().min(1, {
      message: t("category.required") || "Please select a category.",
    }),
    featured: z.boolean().default(false),
    image: z.string().optional(),
  })

  // Update active tab when language changes
  useEffect(() => {
    setActiveTab(language)
  }, [language])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_ar: initialData?.title_ar || "",
      title_en: initialData?.title_en || "",
      content_ar: initialData?.content_ar || "",
      content_en: initialData?.content_en || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      time: initialData?.time || "18:00",
      location_ar: initialData?.location_ar || "",
      location_en: initialData?.location_en || "",
      type: initialData?.type || "upcoming",
      category: initialData?.category || "",
      featured: initialData?.featured || false,
      image: initialData?.image || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // In a real application, you would send the data to an API
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: initialData?.id ? t("update.event") : t("create.event.button"),
        description: initialData?.id
          ? t("success") + ": " + (language === "ar" ? values.title_ar : values.title_en)
          : t("success") + ": " + (language === "ar" ? values.title_ar : values.title_en),
      })

      router.push("/dashboard/events")
    }, 1000)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real application, you would upload the file to a storage service
      // For this demo, we'll just create a local URL
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      form.setValue("image", url)
    }
  }

  const categories = [
    { value: "tournament", label_ar: "بطولة", label_en: "Tournament" },
    { value: "championship", label_ar: "دوري", label_en: "Championship" },
    { value: "seminar", label_ar: "ندوة", label_en: "Seminar" },
    { value: "training", label_ar: "تدريب", label_en: "Training" },
    { value: "exhibition", label_ar: "معرض", label_en: "Exhibition" },
    { value: "conference", label_ar: "مؤتمر", label_en: "Conference" },
    { value: "other", label_ar: "أخرى", label_en: "Other" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "ar" | "en")}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ar" onClick={() => setActiveTab("ar")}>
                العربية
              </TabsTrigger>
              <TabsTrigger value="en" onClick={() => setActiveTab("en")}>
                English
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "ar" | "en")}>
              <TabsContent value="ar" className="mt-0 space-y-6">
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("event.title")}</FormLabel>
                      <FormControl>
                        <Input dir="rtl" placeholder="أدخل عنوان الفعالية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("content")}</FormLabel>
                      <FormControl>
                        <Textarea dir="rtl" placeholder="أدخل وصف الفعالية" className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("event.location")}</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input ring-offset-background">
                          <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            dir="rtl"
                            placeholder="أدخل موقع الفعالية"
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="en" className="mt-0 space-y-6">
                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("event.title")}</FormLabel>
                      <FormControl>
                        <Input dir="ltr" placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("content")}</FormLabel>
                      <FormControl>
                        <Textarea
                          dir="ltr"
                          placeholder="Enter event description"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("event.location")}</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input ring-offset-background">
                          <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            dir="ltr"
                            placeholder="Enter event location"
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("event.date")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full font-normal",
                              !field.value && "text-muted-foreground",
                              language === "ar" ? "text-right pr-3" : "text-left pl-3",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: language === "ar" ? ar : undefined })
                            ) : (
                              <span>{t("pick.a.date")}</span>
                            )}
                            <CalendarIcon
                              className={cn("h-4 w-4 opacity-50", language === "ar" ? "mr-auto" : "ml-auto")}
                            />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={language === "ar" ? ar : undefined}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("event.time")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center rounded-md border border-input ring-offset-background">
                        <ClockIcon
                          className={cn("h-4 w-4 text-muted-foreground", language === "ar" ? "mr-2" : "ml-2")}
                        />
                        <Input
                          type="time"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("event.category")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("select.option")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {language === "ar" ? category.label_ar : category.label_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("event.type")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("select.event.type")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upcoming">{t("upcoming")}</SelectItem>
                        <SelectItem value="past">{t("past")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{t("event.featured")}</FormLabel>
                    <FormDescription>
                      {language === "ar"
                        ? "عرض هذه الفعالية في قسم الفعاليات المميزة"
                        : "Display this event in the featured section"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("image")}</FormLabel>
                <FormControl>
                  <div className="mt-2 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById("event-image-upload")?.click()}
                      >
                        <ImageIcon className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
                        {imagePreview ? t("change.image") : t("upload.image")}
                      </Button>
                      <Input
                        id="event-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>

                    {imagePreview && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt={language === "ar" ? "معاينة" : "Preview"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {!imagePreview && (
                      <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed">
                        <span className="text-sm text-muted-foreground">{t("no.image.uploaded")}</span>
                      </div>
                    )}

                    <FormDescription>
                      {language === "ar"
                        ? "يفضل استخدام صورة بأبعاد 16:9 وبدقة عالية"
                        : "Preferably use a 16:9 aspect ratio image with high resolution"}
                    </FormDescription>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Button type="submit" className="bg-[#BB2121] hover:bg-[#C20000]" disabled={isLoading}>
            {isLoading ? t("saving") : initialData?.id ? t("update.event") : t("create.event.button")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/events")}>
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
