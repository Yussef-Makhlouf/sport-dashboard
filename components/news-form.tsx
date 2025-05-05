// "use client"

// import React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { format } from "date-fns"
// import { ar } from "date-fns/locale"
// import { ImageIcon } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { cn } from "@/lib/utils"
// import { toast } from "@/components/ui/use-toast"
// import { useLanguage } from "@/components/language-provider"

// const formSchema = z.object({
//   title_ar: z.string().min(5, {
//     message: "يجب أن يكون العنوان 5 أحرف على الأقل.",
//   }),
//   title_en: z.string().min(5, {
//     message: "Title must be at least 5 characters.",
//   }),
//   content_ar: z.string().min(10, {
//     message: "يجب أن يكون المحتوى 10 أحرف على الأقل.",
//   }),
//   content_en: z.string().min(10, {
//     message: "Content must be at least 10 characters.",
//   }),
//   category: z.string().min(1, {
//     message: "يرجى اختيار تصنيف.",
//   }),
//   featured: z.boolean().default(false),
//   image: z.string().optional(),
// })

// interface NewsFormProps {
//   initialData?: {
//     id?: string
//     title_ar?: string
//     title_en?: string
//     content_ar?: string
//     content_en?: string
//     image?: string
//     category?: string
//     featured?: boolean
//   }
// }

// export function NewsForm({ initialData }: NewsFormProps = {}) {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
//   const { t, language, dir } = useLanguage()
//   const currentDate = new Date()
//   const [activeTab, setActiveTab] = useState<"ar" | "en">(language)

//   // Update active tab when language changes
//   React.useEffect(() => {
//     setActiveTab(language)
//   }, [language])

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title_ar: initialData?.title_ar || "",
//       title_en: initialData?.title_en || "",
//       content_ar: initialData?.content_ar || "",
//       content_en: initialData?.content_en || "",
//       category: initialData?.category || "",
//       featured: initialData?.featured || false,
//       image: initialData?.image || "",
//     },
//   })

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsLoading(true)

//     // In a real application, you would send the data to an API
//     setTimeout(() => {
//       setIsLoading(false)

//       toast({
//         title: initialData?.id ? t("update.news") : t("create.news.button"),
//         description: initialData?.id
//           ? t("success") + ": " + (language === "ar" ? values.title_ar : values.title_en)
//           : t("success") + ": " + (language === "ar" ? values.title_ar : values.title_en),
//       })

//       router.push("/dashboard/news")
//     }, 1000)
//   }

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       // In a real application, you would upload the file to a storage service
//       // For this demo, we'll just create a local URL
//       const url = URL.createObjectURL(file)
//       setImagePreview(url)
//       form.setValue("image", url)
//     }
//   }

//   const categories = [
//     { value: "mma", label_ar: "فنون قتالية مختلطة", label_en: "Mixed Martial Arts" },
//     { value: "jiu-jitsu", label_ar: "جوجيتسو", label_en: "Jiu-Jitsu" },
//     { value: "boxing", label_ar: "ملاكمة", label_en: "Boxing" },
//     { value: "wrestling", label_ar: "مصارعة", label_en: "Wrestling" },
//     { value: "muay-thai", label_ar: "مواي تاي", label_en: "Muay Thai" },
//     { value: "karate", label_ar: "كاراتيه", label_en: "Karate" },
//     { value: "taekwondo", label_ar: "تايكوندو", label_en: "Taekwondo" },
//     { value: "other", label_ar: "أخرى", label_en: "Other" },
//   ]

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <Tabs
//             value={activeTab}
//             onValueChange={(value) => setActiveTab(value as "ar" | "en")}
//             className="w-full md:w-auto"
//           >
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="ar" onClick={() => setActiveTab("ar")}>
//                 العربية
//               </TabsTrigger>
//               <TabsTrigger value="en" onClick={() => setActiveTab("en")}>
//                 English
//               </TabsTrigger>
//             </TabsList>
//           </Tabs>

//           <div className="text-sm text-muted-foreground">
//             {t("publication.date")}: {format(currentDate, "PPP", { locale: language === "ar" ? ar : undefined })}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div className="space-y-6">
//             <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "ar" | "en")}>
//               <TabsContent value="ar" className="mt-0 space-y-6">
//                 <FormField
//                   control={form.control}
//                   name="title_ar"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t("news.title")}</FormLabel>
//                       <FormControl>
//                         <Input dir="rtl" placeholder="أدخل عنوان الخبر" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="content_ar"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t("content")}</FormLabel>
//                       <FormControl>
//                         <Textarea dir="rtl" placeholder="أدخل محتوى الخبر" className="min-h-[200px]" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </TabsContent>

//               <TabsContent value="en" className="mt-0 space-y-6">
//                 <FormField
//                   control={form.control}
//                   name="title_en"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t("news.title")}</FormLabel>
//                       <FormControl>
//                         <Input dir="ltr" placeholder="Enter news title" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="content_en"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t("content")}</FormLabel>
//                       <FormControl>
//                         <Textarea dir="ltr" placeholder="Enter news content" className="min-h-[200px]" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </TabsContent>
//             </Tabs>

//             <FormField
//               control={form.control}
//               name="category"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("news.category")}</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder={t("select.option")} />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {categories.map((category) => (
//                         <SelectItem key={category.value} value={category.value}>
//                           {language === "ar" ? category.label_ar : category.label_en}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="featured"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
//                   <div className="space-y-0.5">
//                     <FormLabel>{t("news.featured")}</FormLabel>
//                     <FormDescription>
//                       {language === "ar"
//                         ? "عرض هذا الخبر في قسم الأخبار المميزة"
//                         : "Display this news in the featured section"}
//                     </FormDescription>
//                   </div>
//                   <FormControl>
//                     <Switch checked={field.value} onCheckedChange={field.onChange} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={form.control}
//             name="image"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("image")}</FormLabel>
//                 <FormControl>
//                   <div className="mt-2 flex flex-col gap-4">
//                     <div className="flex items-center gap-4">
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="w-full"
//                         onClick={() => document.getElementById("image-upload")?.click()}
//                       >
//                         <ImageIcon className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
//                         {imagePreview ? t("change.image") : t("upload.image")}
//                       </Button>
//                       <Input
//                         id="image-upload"
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={handleImageChange}
//                       />
//                     </div>

//                     {imagePreview && (
//                       <div className="relative aspect-video w-full overflow-hidden rounded-md border">
//                         <Image
//                           src={imagePreview || "/placeholder.svg"}
//                           alt={language === "ar" ? "معاينة" : "Preview"}
//                           fill
//                           className="object-cover"
//                         />
//                       </div>
//                     )}

//                     {!imagePreview && (
//                       <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed">
//                         <span className="text-sm text-muted-foreground">{t("no.image.uploaded")}</span>
//                       </div>
//                     )}

//                     <FormDescription>
//                       {language === "ar"
//                         ? "يفضل استخدام صورة بأبعاد 16:9 وبدقة عالية"
//                         : "Preferably use a 16:9 aspect ratio image with high resolution"}
//                     </FormDescription>
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="flex flex-wrap gap-4">
//           <Button type="submit" className="bg-[#BB2121] hover:bg-[#C20000]" disabled={isLoading}>
//             {isLoading ? t("saving") : initialData?.id ? t("update.news") : t("create.news.button")}
//           </Button>
//           <Button type="button" variant="outline" onClick={() => router.push("/dashboard/news")}>
//             {t("cancel")}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }



"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { API_URL } from "@/lib/constants"

// Define form validation schema
const formSchema = z.object({
  title_ar: z.string().min(3, {
    message: "يجب أن يكون العنوان 3 أحرف على الأقل.",
  }),
  title_en: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content_ar: z.string().min(10, {
    message: "يجب أن يكون المحتوى 10 أحرف على الأقل.",
  }),
  content_en: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  category: z.string().optional(),
})

interface NewsFormProps {
  newsId?: string;
  initialData?: {
    _id?: string
    title?: {
      ar: string
      en: string
    }
    content?: {
      ar: string
      en: string
    }
    category?: string
    image?: {
      secure_url: string
    }
  }
}

export function NewsForm({ newsId, initialData }: NewsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image?.secure_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  // State to store the news data from API
  const [newsData, setNewsData] = useState(initialData)

  // Fetch news data if a newsId is provided but no initialData
  useEffect(() => {
    const fetchNewsData = async () => {
      if (newsId && !initialData) {
        try {
          setIsFetching(true)
          const response = await fetch(`${API_URL}/news/getnews/${newsId}`)
          
          if (!response.ok) {
            throw new Error("Failed to fetch news data")
          }
          
          const data = await response.json()
          setNewsData(data.news)
          
          // Set preview URL if image exists
          if (data.news?.image?.secure_url) {
            setPreviewUrl(data.news.image.secure_url)
          }
          
          // Reset form with fetched data
          form.reset({
            title_ar: data.news?.title?.ar || "",
            title_en: data.news?.title?.en || "",
            content_ar: data.news?.content?.ar || "",
            content_en: data.news?.content?.en || "",
            category: data.news?.category || "",
          })
        } catch (error) {
          console.error("Error fetching news:", error)
          toast({
            title: "خطأ",
            description: "فشل في تحميل بيانات الخبر. يرجى المحاولة مرة أخرى.",
            variant: "destructive",
          })
        } finally {
          setIsFetching(false)
        }
      }
    }

    fetchNewsData()
  }, [newsId, initialData])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || newsData
      ? {
          title_ar: (initialData || newsData)?.title?.ar || "",
          title_en: (initialData || newsData)?.title?.en || "",
          content_ar: (initialData || newsData)?.content?.ar || "",
          content_en: (initialData || newsData)?.content?.en || "",
          category: (initialData || newsData)?.category || "",
        }
      : {
          title_ar: "",
          title_en: "",
          content_ar: "",
          content_en: "",
          category: "",
        },
  })

  // Update form when newsData changes
  useEffect(() => {
    if (newsData) {
      form.reset({
        title_ar: newsData.title?.ar || "",
        title_en: newsData.title?.en || "",
        content_ar: newsData.content?.ar || "",
        content_en: newsData.content?.en || "",
        category: newsData.category || "",
      })
    }
  }, [newsData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      // Check if we're creating a new news item and require an image
      if (!newsId && !initialData?._id && !selectedImage) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار صورة للخبر",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Create FormData to send multipart/form-data (for file upload)
      const formData = new FormData()
      
      // Add all form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })
      
      // Add image if selected
      if (selectedImage) {
        formData.append("image", selectedImage)
      }
      
      // Determine which ID to use
      const id = newsId || initialData?._id || newsData?._id
      
      // Determine URL and method based on whether we're editing or creating
      const url = id 
        ? `${API_URL}/news/updatenews/${id}` 
        : `${API_URL}/news/addNews`
      
      const method = id ? "PUT" : "POST"

      // Send request to API
      const response = await fetch(url, {
        method,
        body: formData,
        // Don't set Content-Type header when sending FormData
        // The browser will set it automatically with the correct boundary
      })
      
      if (!response.ok) {
        throw new Error("Failed to save news")
      }

      const responseData = await response.json()
      console.log(responseData)

      toast({
        title: id ? "تم تحديث الخبر" : "تم إنشاء الخبر",
        description: id ? "تم تحديث الخبر بنجاح." : "تم إنشاء الخبر بنجاح.",
      })

      // Redirect to news list
      router.push("/dashboard/news")
      router.refresh() // Refresh the page to show updated data
    } catch (error) {
      console.error("Error saving news:", error)
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ الخبر",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onDelete() {
    const id = newsId || initialData?._id || newsData?._id
    if (!id) return

    try {
      setIsLoading(true)
  
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: "DELETE",
      })
  
      if (!response.ok) {
        throw new Error("فشل في حذف الخبر")
      }
  
      const result = await response.json()
      console.log(result)
  
      toast({
        title: "تم حذف الخبر",
        description: "تم حذف الخبر بنجاح.",
      })
  
      router.push("/dashboard/news")
      router.refresh()
    } catch (error) {
      console.error("Error deleting news:", error)
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء حذف الخبر",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BB2121] border-r-transparent"></div>
        <p className="mr-2">جاري تحميل البيانات...</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Arabic Title */}
          <FormField
            control={form.control}
            name="title_ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان (بالعربية)</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل عنوان الخبر بالعربية" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* English Title */}
          <FormField
            control={form.control}
            name="title_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان (بالإنجليزية)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter news title in English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Arabic Content */}
          <FormField
            control={form.control}
            name="content_ar"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>المحتوى (بالعربية)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="أدخل محتوى الخبر بالعربية" 
                    className="min-h-[150px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* English Content */}
          <FormField
            control={form.control}
            name="content_en"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>المحتوى (بالإنجليزية)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter news content in English" 
                    className="min-h-[150px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الفئة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر فئة الخبر" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="رياضة">رياضة</SelectItem>
                    <SelectItem value="فعاليات">فعاليات</SelectItem>
                    <SelectItem value="إعلانات">إعلانات</SelectItem>
                    <SelectItem value="أخرى">أخرى</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div className="col-span-1 md:col-span-2">
            <FormLabel>صورة الخبر</FormLabel>
            <div className="mt-2 flex flex-col space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={triggerFileInput}
                className="w-full h-32 border-dashed"
              >
                {previewUrl ? "تغيير الصورة" : "اختر صورة"}
              </Button>
              
              {previewUrl && (
                <div className="relative w-full h-48 mt-2 rounded-md overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {!newsId && !initialData?._id && !newsData?._id && !previewUrl && (
                <p className="text-sm text-red-500">* الصورة مطلوبة للأخبار الجديدة</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="bg-[#BB2121] hover:bg-[#C20000]" 
            disabled={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : (newsId || initialData?._id || newsData?._id) ? "تحديث الخبر" : "إنشاء خبر جديد"}
          </Button>
          {(newsId || initialData?._id || newsData?._id) && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              disabled={isLoading}
            >
              {isLoading ? "جاري الحذف..." : "حذف الخبر"}
            </Button>
          )}
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/dashboard/news")}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Form>
  )
}
