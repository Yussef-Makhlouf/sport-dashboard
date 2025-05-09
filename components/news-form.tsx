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
import { X } from "lucide-react" // Import X icon for delete button

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

interface Category {
  _id: string;
  name: string;
}

interface NewsFormProps {
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
    images?: Array<{
      secure_url: string
    }>
  }
}

export function NewsForm({ initialData }: NewsFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  // Initialize preview URLs from initialData if available
  useEffect(() => {
    if (initialData) {
      const initialImages: string[] = []
      
      // Add main image if exists
      if (initialData.image?.secure_url) {
        initialImages.push(initialData.image.secure_url)
      }
      
      // Add additional images if they exist
      if (initialData.images && initialData.images.length > 0) {
        initialData.images.forEach(img => {
          if (img.secure_url) initialImages.push(img.secure_url)
        })
      }
      
      setPreviewUrls(initialImages)
    }
  }, [initialData])

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const response = await fetch(`${API_URL}/category/getAll`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        
        const data = await response.json()
        if (data.category && Array.isArray(data.category)) {
          setCategories(data.category)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast({
          title: "خطأ",
          description: "فشل في تحميل الفئات",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title_ar: initialData.title?.ar || "",
          title_en: initialData.title?.en || "",
          content_ar: initialData.content?.ar || "",
          content_en: initialData.content?.en || "",
          category: initialData.category || "",
        }
      : {
          title_ar: "",
          title_en: "",
          content_ar: "",
          content_en: "",
          category: "",
        },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // Check if adding these files would exceed the limit of 4 images
    if (selectedImages.length + files.length + previewUrls.length > 4) {
      toast({
        title: "تنبيه",
        description: "يمكنك إضافة 4 صور كحد أقصى",
        variant: "destructive",
      })
      return
    }
    
    // Add new files to selectedImages array
    const newFiles = Array.from(files)
    setSelectedImages(prev => [...prev, ...newFiles])
    
    // Create preview URLs for new files
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    // If the image is from initialData (existing image)
    if (index < previewUrls.length - selectedImages.length) {
      setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    } 
    // If the image is newly added
    else {
      const newSelectedImagesIndex = index - (previewUrls.length - selectedImages.length)
      setSelectedImages(prev => prev.filter((_, i) => i !== newSelectedImagesIndex))
      setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      // Check if we're creating a new news item and require at least one image
      if (!initialData && previewUrls.length === 0) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار صورة واحدة على الأقل للخبر",
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
      
      // Add all selected images to FormData
      selectedImages.forEach((file, index) => {
        formData.append(`image`, file)
      })
      
      // Determine URL and method based on whether we're editing or creating
      const url = initialData?._id 
        ? `${API_URL}/news/${initialData._id}` 
        : `${API_URL}/news/addNews`
      
      const method = initialData?._id ? "PUT" : "POST"

      // Send request to API
      const response = await fetch(url, {
        method,
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save news")
      }

      toast({
        title: initialData ? "تم تحديث الخبر" : "تم إنشاء الخبر",
        description: initialData ? "تم تحديث الخبر بنجاح." : "تم إنشاء الخبر بنجاح.",
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
                    {isLoadingCategories ? (
                      <SelectItem value="loading" disabled>جاري تحميل الفئات...</SelectItem>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>لا توجد فئات متاحة</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Multiple Image Upload */}
          <div className="col-span-1 md:col-span-2">
            <FormLabel>صور الخبر (الحد الأقصى 4 صور)</FormLabel>
            <div className="mt-2 flex flex-col space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              {/* Upload button - disabled if already have 4 images */}
              <Button 
                type="button" 
                variant="outline" 
                onClick={triggerFileInput}
                className="w-full h-16 border-dashed"
                disabled={previewUrls.length >= 4}
              >
                {previewUrls.length > 0 
                  ? `إضافة صورة (${previewUrls.length}/4)` 
                  : "اختر صورة"}
              </Button>
              
              {/* Image previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-48 rounded-md overflow-hidden border">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-80 hover:opacity-100"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {!initialData && previewUrls.length === 0 && (
                <p className="text-sm text-red-500">* يجب إضافة صورة واحدة على الأقل</p>
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
            {isLoading ? "جاري الحفظ..." : initialData ? "تحديث الخبر" : "إنشاء خبر جديد"}
          </Button>
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
