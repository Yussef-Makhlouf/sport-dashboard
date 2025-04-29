"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

const formSchema = z.object({
  title_ar: z.string().min(5, {
    message: "يجب أن يكون العنوان 5 أحرف على الأقل.",
  }),
  title_en: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content_ar: z.string().min(10, {
    message: "يجب أن يكون المحتوى 10 أحرف على الأقل.",
  }),
  content_en: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  category: z.string().min(1, {
    message: "يرجى اختيار تصنيف.",
  }),
  featured: z.boolean().default(false),
  image: z.string().optional(),
})

interface NewsFormProps {
  initialData?: {
    id?: string
    title_ar?: string
    title_en?: string
    content_ar?: string
    content_en?: string
    image?: string
    category?: string
    featured?: boolean
  }
}

export function NewsForm({ initialData }: NewsFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
  const { t, language, dir } = useLanguage()
  const currentDate = new Date()
  const [activeTab, setActiveTab] = useState<"ar" | "en">(language)

  // Update active tab when language changes
  React.useEffect(() => {
    setActiveTab(language)
  }, [language])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_ar: initialData?.title_ar || "",
      title_en: initialData?.title_en || "",
      content_ar: initialData?.content_ar || "",
      content_en: initialData?.content_en || "",
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
        title: initialData?.id ? t("update.news") : t("create.news.button"),
        description: initialData?.id
          ? t("success") + ": " + (language === "ar" ? values.title_ar : values.title_en)
          : t("success") + ": " + (language === "ar" ? values.title_ar : values.title_en),
      })

      router.push("/dashboard/news")
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
    { value: "mma", label_ar: "فنون قتالية مختلطة", label_en: "Mixed Martial Arts" },
    { value: "jiu-jitsu", label_ar: "جوجيتسو", label_en: "Jiu-Jitsu" },
    { value: "boxing", label_ar: "ملاكمة", label_en: "Boxing" },
    { value: "wrestling", label_ar: "مصارعة", label_en: "Wrestling" },
    { value: "muay-thai", label_ar: "مواي تاي", label_en: "Muay Thai" },
    { value: "karate", label_ar: "كاراتيه", label_en: "Karate" },
    { value: "taekwondo", label_ar: "تايكوندو", label_en: "Taekwondo" },
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

          <div className="text-sm text-muted-foreground">
            {t("publication.date")}: {format(currentDate, "PPP", { locale: language === "ar" ? ar : undefined })}
          </div>
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
                      <FormLabel>{t("news.title")}</FormLabel>
                      <FormControl>
                        <Input dir="rtl" placeholder="أدخل عنوان الخبر" {...field} />
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
                        <Textarea dir="rtl" placeholder="أدخل محتوى الخبر" className="min-h-[200px]" {...field} />
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
                      <FormLabel>{t("news.title")}</FormLabel>
                      <FormControl>
                        <Input dir="ltr" placeholder="Enter news title" {...field} />
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
                        <Textarea dir="ltr" placeholder="Enter news content" className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("news.category")}</FormLabel>
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
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{t("news.featured")}</FormLabel>
                    <FormDescription>
                      {language === "ar"
                        ? "عرض هذا الخبر في قسم الأخبار المميزة"
                        : "Display this news in the featured section"}
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
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        <ImageIcon className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
                        {imagePreview ? t("change.image") : t("upload.image")}
                      </Button>
                      <Input
                        id="image-upload"
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
            {isLoading ? t("saving") : initialData?.id ? t("update.news") : t("create.news.button")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/news")}>
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
