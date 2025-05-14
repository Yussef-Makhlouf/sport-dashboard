"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { X } from "lucide-react" // Import X icon for delete button
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

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
  date: z.date({
    required_error: "Please select a date",
  }),
})

interface Category {
  _id: string;
  name: {
    ar: string;
    en: string;
  };
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
    date?: string
    image?: Array<{
      secure_url: string
      public_id: string
      _id: string
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
      
      // Add all images from the image array if they exist
      if (initialData.image && Array.isArray(initialData.image)) {
        initialData.image.forEach(img => {
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
          date: initialData.date ? new Date(initialData.date) : new Date(),
        }
      : {
          title_ar: "",
          title_en: "",
          content_ar: "",
          content_en: "",
          category: "",
          date: new Date(),
        },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // Check if adding these files would exceed the limit of 3 images
    if (selectedImages.length + files.length + previewUrls.length > 3) {
      toast({
        title: "تنبيه",
        description: "يمكنك إضافة 3 صور كحد أقصى",
        variant: "destructive",
        duration: 3000,
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
          duration: 3000,
        })
        setIsLoading(false)
        return
      }

      // Check if total images exceed the limit of 3
      if (previewUrls.length > 3) {
        toast({
          title: "خطأ",
          description: "يمكنك إضافة 3 صور كحد أقصى",
          variant: "destructive",
          duration: 3000,
        })
        setIsLoading(false)
        return
      }

      // Create FormData to send multipart/form-data (for file upload)
      const formData = new FormData()
      
      // Add all form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          if (key === 'date') {
            formData.append(key, (value as Date).toISOString())
          } else {
            formData.append(key, String(value))
          }
        }
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
        title: initialData ? t("update.news.success.title") : t("create.news.success.title"),
        description: initialData ? t("update.news.success.description") : t("create.news.success.description"),
        duration: 3000,
      })

      // Redirect to news list
      router.push("/dashboard/news")
      router.refresh() // Refresh the page to show updated data
    } catch (error) {
      console.error("Error saving news:", error)
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("news.save.error"),
        variant: "destructive",
        duration: 3000,
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
                <FormLabel>{t("news.title.ar")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("news.title.ar.placeholder")} {...field} />
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
                <FormLabel>{t("news.title.en")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("news.title.en.placeholder")} {...field} />
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
                <FormLabel>{t("news.content.ar")}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t("news.content.ar.placeholder")} 
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
                <FormLabel>{t("news.content.en")}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t("news.content.en.placeholder")} 
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
                <FormLabel>{t("news.category")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("news.category.placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingCategories ? (
                      <SelectItem value="loading" disabled>{t("loading.categories")}</SelectItem>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name.ar}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>{t("no.categories.available")}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("publication.date")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-right font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ar })
                        ) : (
                          <span>{t("select.date")}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Multiple Image Upload */}
          <div className="col-span-1 md:col-span-2">
            <FormLabel>{t("news.images")}</FormLabel>
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
                disabled={previewUrls.length >= 3}
              >
                {previewUrls.length > 0 
                  ? `${t("add.image")} (${previewUrls.length}/3)` 
                  : t("choose.image")}
              </Button>
              
              {/* Image previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-48 rounded-md overflow-hidden border">
                        <img 
                          src={url} 
                          alt={`${t("preview")} ${index + 1}`} 
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
                <p className="text-sm text-red-500">* {t("image.required")}</p>
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
            {isLoading ? t("saving") : initialData ? t("update.news") : t("create.news.button")}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/dashboard/news")}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
