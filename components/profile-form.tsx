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
import { showToast, fetchWithTokenRefresh } from "@/lib/utils"
import Cookies from 'js-cookie'
import { UploadImage } from "@/components/upload-image"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

const profileSchema = z.object({
  userName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(0,{ message: "Invalid phone number" }),
  role: z.string(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>

// Add refreshUserData function
const refreshUserData = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/getUser/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `MMA ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh user data");
    }

    const data = await response.json();
    console.log("Refreshed user data:", data.user);
    
    // تأكد من أن بيانات المستخدم تتضمن الصورة
    if (data.user && !data.user.image && data.user.image === undefined) {
      console.warn("Image data is missing in the user data");
    }
    
    // Update user data in cookies
    Cookies.set('userData', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    throw error;
  }
};

export function ProfileForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)

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
      password: "",
      confirmPassword: "",
    },
  })

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file)
    if (file) {
// <<<<<<< general-modifications
//       setPreviewUrl(URL.createObjectURL(file))
// =======
      setSelectedImage(file)
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file)
      setPreviewUrl(imageUrl)
    }
  }

  // Clean up the object URL when component unmounts or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

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
      if (data.password) {
        formData.append("password", data.password)
      }
      console.log("Current user data:", userData);
      
      // Use different API endpoints based on user role
      const apiUrl = userData.role === "مدير" 
        ? `${API_URL}/auth/update/${userData._id}`
        : `${API_URL}/auth/updateProfile/${userData._id}`;

      const response = await fetchWithTokenRefresh(apiUrl, {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        const updatedUser = await response.json()
        console.log("Updated user data from server:", updatedUser);
        
        // تأكد من وجود بيانات الصورة
        if (updatedUser.user && updatedUser.user.image) {
          console.log("Image data in updated user:", updatedUser.user.image);
        } else {
          console.warn("No image data in updated user response");
        }
        
        // تحديث بيانات المستخدم في الكوكيز
        Cookies.set('userData', JSON.stringify(updatedUser.user))
        
        // تحديث بيانات المستخدم من الخادم للتأكد من تحديث الصورة
        try {
          const refreshedUser = await refreshUserData(userData._id)
          console.log("Refreshed user data after update:", refreshedUser);
          
          // تأكد من وجود بيانات الصورة بعد التحديث
          if (refreshedUser && refreshedUser.image) {
            console.log("Image data after refresh:", refreshedUser.image);
          } else {
            console.warn("No image data in refreshed user data");
          }
        } catch (refreshError) {
          console.error("Error refreshing user data after update:", refreshError);
        }
        
        showToast.success(t, "user.updated.title", "user.updated.description")
        router.push("/dashboard")
      }
      
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

          {userData?.role === "مدير" && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="w-full"
              >
                {showPasswordFields ? t("cancel.password.update") : t("update.password")}
              </Button>

              {showPasswordFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...form.register("password")}
                        placeholder={t("password")}
                        className="pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirm.password")}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...form.register("confirmPassword")}
                        placeholder={t("confirm.password")}
                        className="pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {form.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? t("saving") : t("update.profile")}
      </Button>
    </form>
  )
}
