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
import { ar, enUS } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { API_URL } from "@/lib/constants"
import { UploadMultipleImages } from "@/components/upload-multiple-images"
import { showToast } from "@/lib/utils"
import { ConfirmDialog } from "./ui/confirm-dialog"




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
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const { t, language } = useLanguage()
  const [imageToDelete, setImageToDelete] = useState<{ index: number; public_id?: string } | null>(null)


// Define form validation schema
const formSchema = z.object({
  title_ar: z.string().min(3, {
    message: t("title.ar.min.length.error")
  }),
  title_en: z.string().min(3, {
    message: t("title.en.min.length.error"),
  }),
  content_ar: z.string().min(10, {
    message: t("content.ar.min.length.error"),
  }),
  content_en: z.string().min(10, {
    message: t("content.en.min.length.error"),
  }),
  category: z.string().min(3,{
    message: t("category.is.required"),
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
})

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
        showToast.error(t, "error", "categories.load.error")
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [t])

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

  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files)
  }

  const handleImageRemove = async (index: number) => {
    if (!initialData?.image) return

    const imageToDelete = initialData.image[index]
    if (imageToDelete) {
      try {
        const response = await fetch(`${API_URL}/news/deleteNewsImage/${initialData._id}/${imageToDelete.public_id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete image')
        }

        showToast.success(t, "success", "image.deleted.success")
      } catch (error) {
        console.error("Error deleting image:", error)
        showToast.error(t, "error", "image.deleted.error")
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      // Check if we're creating a new news item and require at least one image
      if (!initialData && selectedImages.length === 0) {
        showToast.error(t, "error", "image.required")
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
      selectedImages.forEach((file) => {
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

      showToast.success(
        t, 
        initialData ? "update.news.success.title" : "create.news.success.title", 
        initialData ? "update.news.success.description" : "create.news.success.description"
      )

      // Redirect to news list
      router.push("/dashboard/news")
      router.refresh() // Refresh the page to show updated data
    } catch (error) {
      console.error("Error saving news:", error)
      showToast.error(
        t, 
        "error", 
        "news.save.error", 
        error instanceof Error ? error.message : undefined
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col space-y-6">
          {/* Title Fields - English first */}
          {/* English Title */}
          <FormField
            control={form.control}
            name="title_en"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("news.title.en")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("news.title.en.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Arabic Title */}
          <FormField
            control={form.control}
            name="title_ar"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("news.title.ar")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("news.title.ar.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Fields - English first */}
          {/* English Content */}
          <FormField
            control={form.control}
            name="content_en"
            render={({ field }) => (
              <FormItem className="w-full">
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

          {/* Arabic Content */}
          <FormField
            control={form.control}
            name="content_ar"
            render={({ field }) => (
              <FormItem className="w-full">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("news.category")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("news.category.placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("publication.date")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP", {
                              locale: language === "ar" ? ar : enUS,
                            })
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
          </div>

          {/* Image Upload */}
          <UploadMultipleImages
            label={t("news.images")}
            initialImages={initialData?.image || []}
            onChange={handleImagesChange}
            onRemove={handleImageRemove}
            imageRequired={!initialData}
            maxImages={3}
          />
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
function t(arg0: string): string | undefined {
  throw new Error("Function not implemented.")
}

