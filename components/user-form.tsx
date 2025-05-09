"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { API_URL } from "@/lib/constants";

import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

// Define your API URL - adjust as needed for your environment

const formSchema = z.object({
  name: z.string().min(3, {
    message: "يجب أن يكون الاسم 3 أحرف على الأقل.",
  }),
  email: z.string().email({
    message: "يرجى إدخال عنوان بريد إلكتروني صالح.",
  }),
  phoneNumber: z.string().min(10, {
    message: "يرجى إدخال رقم هاتف صالح.",
  }),
  role: z.enum(['مدير', 'محرر', 'مستخدم'], {
    required_error: "يرجى اختيار دور.",
  }),
  status: z.enum(["active", "inactive"], {
    required_error: "يرجى اختيار حالة.",
  }),
  password: z
    .string()
    .min(8, {
      message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل.",
    })
    .optional()
    .or(z.literal("")),
})

interface UserFormProps {
  initialData?: {
    id?: string
    name: string
    email: string
    phoneNumber: string
    role: string
    status: string
  }
}

export function UserForm({ initialData }: UserFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()
  
  console.log("UserForm component rendered", { initialData });

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
        }
      : {
          name: "",
          email: "",
          phoneNumber: "",
          role: "محرر",
          status: "active",
          password: "",
        },
  })

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    setIsLoading(true);

    try {
      if (initialData?.id) {
        console.log("Updating existing user:", initialData.id);
        const apiUrl = `${API_URL}/auth/update/${initialData.id}`;
        
        const userData = {
          userName: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          role: values.role,
          isActive: values.status === "active"
        };

        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("API error response:", errorData);
          throw new Error(`Failed to update user: ${response.statusText}`);
        }

        toast({
          title: "تم تحديث المستخدم",
          description: "تم تحديث المستخدم بنجاح.",
        });
      } else {
        console.log("Creating new user, preparing API call");
        // Create new user
        const apiUrl = `${API_URL}/auth/addUser`;
        console.log("API endpoint:", apiUrl);
        
        const userData = {
          userName: values.name,
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          role: values.role
        };
        console.log("Sending user data:", userData);
        
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          
          console.log("API response status:", response.status);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("API error response:", errorData);
            throw new Error(`Failed to create user: ${response.statusText}`);
          }
          
          const responseData = await response.json().catch(() => ({}));
          console.log("API success response:", responseData);

          toast({
            title: "تم إنشاء المستخدم",
            description: "تم إنشاء المستخدم بنجاح.",
          });
        } catch (fetchError) {
          console.error("Fetch error:", fetchError);
          throw fetchError;
        }
      }

      console.log("Operation successful, redirecting to users dashboard");
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المستخدم.",
        variant: "destructive",
      });
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
                  <Input placeholder="أدخل اسم المستخدم" {...field} />
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
                <FormLabel>{t("رقم الهاتف") || "phoneNumber"}</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل رقم الهاتف" {...field} />
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

          {!initialData && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
