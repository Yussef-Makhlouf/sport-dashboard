"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { API_URL } from "@/lib/constants"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Loader2, Upload, XCircle, Camera } from "lucide-react"
import { UploadImage } from "@/components/upload-image"

interface MemberFormProps {
  initialData?: {
    _id?: string
    name?: {
      ar: string
      en: string
    }
    position?: {
      ar: string
      en: string
    }
    // description?: {
    //   ar: string
    //   en: string
    // }
    image?: {
      secure_url: string
      public_id: string
    }
    order?: number
  }
}

export function MemberForm({ initialData }: MemberFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    nameAr: initialData?.name?.ar || "",
    nameEn: initialData?.name?.en || "",
    positionAr: initialData?.position?.ar || "",
    positionEn: initialData?.position?.en || "",
    // descriptionAr: initialData?.description?.ar || "",
    // descriptionEn: initialData?.description?.en || "",
    order: initialData?.order || 0,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      
      // Add member data directly
      formDataToSend.append("name[ar]", formData.nameAr)
      formDataToSend.append("name[en]", formData.nameEn)
      formDataToSend.append("position[ar]", formData.positionAr)
      formDataToSend.append("position[en]", formData.positionEn)
      // formDataToSend.append("description[ar]", formData.descriptionAr)
      // formDataToSend.append("description[en]", formData.descriptionEn)
      formDataToSend.append("order", formData.order.toString())

      // Add image if available
      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      const url = initialData?._id
        ? `${API_URL}/members/addmember/${initialData._id}`
        : `${API_URL}/members/addmember`
      
      const method = initialData?._id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to save member")
      }

      toast({
        title: t("Success"),
        description: initialData?._id
          ? t("Member updated successfully")
          : t("Member created successfully"),
      })

      router.push("/dashboard/members")
      router.refresh()
    } catch (error) {
      console.error("Error saving member:", error)
      toast({
        title: t("Error"),
        description: t("Failed to save member"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="nameAr">{t("name.ar")}</Label>
            <Input
              id="nameAr"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              required
              dir="rtl"
            />
          </div>
          
          <div>
            <Label htmlFor="positionAr">{t("position.ar")}</Label>
            <Input
              id="positionAr"
              name="positionAr"
              value={formData.positionAr}
              onChange={handleChange}
              required
              dir="rtl"
            />
          </div>
          
          {/* <div>
            <Label htmlFor="descriptionAr">{t("Description (Arabic)")}</Label>
            <Textarea
              id="descriptionAr"
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              rows={4}
              dir="rtl"
            />
          </div> */}
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="nameEn">{t("name.en")}</Label>
            <Input
              id="nameEn"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="positionEn">{t("position.en")}</Label>
            <Input
              id="positionEn"
              name="positionEn"
              value={formData.positionEn}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* <div>
            <Label htmlFor="descriptionEn">{t("Description (English)")}</Label>
            <Textarea
              id="descriptionEn"
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              rows={4}
            />
          </div> */}
        </div>
      </div>

      <div className="w-32">
        <Label htmlFor="order">{t("order")}</Label>
        <Input
          id="order"
          name="order"
          type="number"
          value={formData.order}
          onChange={handleChange}
          required
          min="0"
          className="w-full"
        />
      </div>

      <UploadImage 
        label={t("member.image")}
        initialImage={initialData?.image?.secure_url}
        onChange={handleImageChange}
      />

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="mr-2"
          onClick={() => router.back()}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData?._id ? t("update.member") : t("create.member")}
        </Button>
      </div>
    </form>
  )
}
