"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { toast } from "@/hooks/use-toast"
import { API_URL } from "@/lib/constants"
import { getAuthToken } from "@/components/login-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { showToast } from "@/lib/utils"
import Cookies from 'js-cookie'
import { UploadImage } from "@/components/upload-image"

const profileSchema = z.object({
  userName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(0,{ message: "Invalid phone number" }),
  role: z.string(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  // Get user data from cookies
  const userDataStr = Cookies.get('userData')
  const userData = userDataStr ? JSON.parse(userDataStr) : null
  console.log(userData);
  
  // Initialize preview URL from user data
  useEffect(() => {
    if (userData?.image?.secure_url) {
      setPreviewUrl(userData.image.secure_url)
    }
  }, [userData])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: userData?.userName || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || "",
      role: userData?.role || "",
    },
  })

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("userName", data.userName)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber)
      formData.append("role", data.role)
      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      const response = await fetch(`${API_URL}/auth/updateProfile/${userData._id}`, {
        method: "PUT",
        headers: {
          Authorization: `MMA ${getAuthToken()}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || t("user.save.error.description"))
      }

      const updatedUser = await response.json()
      
      // Update user data in cookies
      Cookies.set('userData', JSON.stringify(updatedUser.user))
      
      showToast.success(t, "user.updated.title", "user.updated.description")
    } catch (error) {
      console.error('Error updating profile:', error)
      const errorMessage = error instanceof Error ? error.message : t("user.save.error.description")
      toast({
        title: t("user.save.error.title"),
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <UploadImage
          label={t("profile.image")}
          initialImage={userData?.image?.secure_url}
          onChange={handleImageChange}
        />

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="userName">{t("name")}</Label>
            <Input
              id="userName"
              {...form.register("userName")}
              placeholder={t("name")}
            />
            {form.formState.errors.userName && (
              <p className="text-sm text-red-500">{form.formState.errors.userName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder={t("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t("phone.number")}</Label>
            <Input
              id="phoneNumber"
              {...form.register("phoneNumber")}
              placeholder={t("phone.number")}
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-sm text-red-500">{form.formState.errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{t("role")}</Label>
            <Input
              id="role"
              value={userData?.role || ""}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? t("saving") : t("update.profile")}
      </Button>
    </form>
  )
}
