"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { API_URL } from "@/lib/constants";
import { Eye, EyeOff } from "lucide-react"
import { getAuthToken } from "@/components/login-form"

import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { showToast } from "@/lib/utils"

// Define your API URL - adjust as needed for your environment

interface UserFormProps {
  initialData?: {
    id?: string
    name: string
    email: string
    phoneNumber: string
    role: string
    status: string
    image?: {
      secure_url: string
      public_id: string
    }
  }
}

export function UserForm({ initialData }: UserFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image?.secure_url || '')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { t, language } = useLanguage()
  
  console.log("UserForm component rendered", { initialData });

  // Define the form schema with translated messages
  const formSchema = z.object({
    name: z.string().min(3, {
      message: t("name.min.length.error") || "Name must be at least 3 characters.",
    }),
    email: z.string().email({
      message: t("email.invalid.error") || "Please enter a valid email address.",
    }),
    phoneNumber: z.string().min(10, {
      message: t("phone.number.invalid.error") || "Please enter a valid phone number.",
    }),
    role: z.enum(['مدير', 'محرر', 'مستخدم'], {
      required_error: t("role.required.error") || "Please select a role.",
    }),
    status: z.enum(["active", "inactive"], {
      required_error: t("status.required.error") || "Please select a status.",
    }),
    password: z
      .string()
      .min(8, {
        message: t("password.min.length.error") || "Password must be at least 8 characters.",
      })
      .optional()
      .or(z.literal("")),
    confirmPassword: z
      .string()
      .min(8, {
        message: t("password.min.length.error") || "Password must be at least 8 characters.",
      })
      .optional()
      .or(z.literal("")),
    image: z.object({
      secure_url: z.string(),
      public_id: z.string()
    }).optional()
  }).refine((data) => {
    // Only validate password confirmation if password is provided
    if (data.password) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: t("passwords.not.matching.error") || "Passwords do not match.",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phoneNumber: initialData.phoneNumber,
          role: initialData.role as "مدير" | "محرر" | "مستخدم",
          status: initialData.status as "active" | "inactive",
          password: "",
          confirmPassword: "",
          image: initialData.image
        }
      : {
          name: "",
          email: "",
          phoneNumber: "",
          role: "محرر",
          status: "active",
          password: "",
          confirmPassword: "",
          image: { secure_url: "", public_id: "" }
        },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    
    try {
      // Show a loading toast
      showToast.loading(t, initialData?.id ? "updating.user" : "creating.user")

      if (initialData?.id) {
        console.log("Updating existing user:", initialData.id);
        const apiUrl = `${API_URL}/auth/update/${initialData.id}`;
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('userName', values.name);
        formData.append('email', values.email);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('role', values.role);
        formData.append('isActive', values.status === 'active' ? 'true' : 'false');
        formData.append('password', values.password || '');
        
        if (imageFile) {
          formData.append('image', imageFile);
        }

        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            Authorization: `MMA ${getAuthToken()}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error response:", errorData);
          
          // Handle unauthorized error specifically
          if (response.status === 400 && errorData.message === 'UnAuthorized to access this api') {
            showToast.error(t, "unauthorized.title", "unauthorized.description");
            router.push("/dashboard"); // Redirect to dashboard if unauthorized
            return;
          }
          
          throw new Error(errorData.message || `Failed to update user: ${response.status}`);
        }

        showToast.success(t, "user.updated.title", "user.updated.description");
      } else {
        console.log("Creating new user, preparing API call");
        // Create new user
        const apiUrl = `${API_URL}/auth/addUser`;
        console.log("API endpoint:", apiUrl);
        
        // Use FormData for new user creation to handle image upload
        const formData = new FormData();
        formData.append('userName', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('role', values.role);
        formData.append('isActive', values.status === 'active' ? 'true' : 'false');
        
        // Handle image upload
        if (imageFile) {
          formData.append('image', imageFile);
        } else if (values.image && values.image.secure_url) {
          // If we have an existing image URL but no new file, send the URL
          formData.append('imageUrl', values.image.secure_url);
          formData.append('imageId', values.image.public_id || '');
        }
        
        console.log("Sending user data with FormData");
        
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              Authorization: `MMA ${getAuthToken()}`,
            },
            body: formData,
          });
          
          console.log("API response status:", response.status);
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error("API error response:", errorData);
            
            // Handle unauthorized error specifically
            if (response.status === 400 && errorData.message === 'UnAuthorized to access this api') {
              showToast.error(t, "unauthorized.title", "unauthorized.description");
              router.push("/dashboard"); // Redirect to dashboard if unauthorized
              return;
            }
            
            throw new Error(errorData.message || `Failed to create user: ${response.status}`);
          }
          
          const responseData = await response.json().catch(() => ({}));
          console.log("API success response:", responseData);

          showToast.success(t, "user.created.title", "user.created.description");
        } catch (fetchError) {
          console.error("Fetch error:", fetchError);
          throw fetchError;
        }
      }

      console.log("Operation successful, redirecting to users dashboard");
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error during form submission:", error);
      showToast.error(
        t, 
        "user.save.error.title", 
        "user.save.error.description", 
        error instanceof Error ? error.message : undefined
      );
    } finally {
      setIsLoading(false);
      console.log("Form submission process completed");
    }
  };

  const handleSubmitButtonClick = () => {
    console.log("Submit button clicked manually");
    form.handleSubmit(handleFormSubmit)();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input placeholder={language === "en" ? "Enter user name" : "أدخل اسم المستخدم"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phoneNumber") || "phoneNumber"}</FormLabel>
                <FormControl>
                  <Input placeholder={language === "en" ? "Enter phone number" : "أدخل رقم الهاتف"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("role")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر دور المستخدم" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="مدير">{t("admin")}</SelectItem>
                    <SelectItem value="محرر">{t("editor")}</SelectItem>
                    <SelectItem value="مستخدم">{t("viewer")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة المستخدم" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">{t("active")}</SelectItem>
                    <SelectItem value="inactive">{t("inactive")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirm.password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.image")}</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4">
                    {imagePreview && (
                      <div className="w-32 h-32 relative overflow-hidden rounded-full">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button 
            type="button" 
            className="bg-[#BB2121] hover:bg-[#C20000]" 
            disabled={isLoading}
            onClick={handleSubmitButtonClick}
          >
            {isLoading ? t("saving") : initialData ? t("update.user") : t("create.user.button")}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              console.log("Cancel button clicked");
              router.push("/dashboard/users");
            }}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

