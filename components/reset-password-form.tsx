"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useLanguage } from "@/components/language-provider"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { API_URL } from "@/lib/constants"

export function ResetPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { t, language } = useLanguage()

  // Dynamic form schema based on current language
  const formSchema = z
    .object({
      verificationCode: z.string().min(6, {
        message: language === "ar"
          ? "يجب أن يكون رمز التحقق 6 أرقام على الأقل."
          : "Verification code must be at least 6 digits.",
      }),
      password: z.string().min(8, {
        message: language === "ar"
          ? "يجب أن تكون كلمة المرور 8 أحرف على الأقل."
          : "Password must be at least 8 characters.",
      }),
      confirmPassword: z.string().min(8, {
        message: language === "ar"
          ? "يجب أن تكون كلمة المرور 8 أحرف على الأقل."
          : "Password must be at least 8 characters.",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: language === "ar" ? "كلمات المرور غير متطابقة." : "Passwords do not match.",
      path: ["confirmPassword"],
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verificationCode: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationCode: parseInt(values.verificationCode),
          newPassword: values.password,
          email: localStorage.getItem('resetEmail') // Get email from localStorage
        }),
      });

      // Debug response info
      const contentType = response.headers.get('content-type');
      console.log('Response status:', response.status);
      console.log('Response content-type:', contentType);
      
      let data;
      
      // Handle different response types
      if (!contentType || !contentType.includes('application/json')) {
        // For non-JSON responses, try to get the text content for better error handling
        const textResponse = await response.text();
        console.log('Raw server response:', textResponse);
        
        // Try to parse text as JSON in case the Content-Type header is wrong
        try {
          data = JSON.parse(textResponse);
        } catch (parseError) {
          // If it's truly not JSON, throw error with the response text if available
          throw new Error(`API returned non-JSON response: ${textResponse.substring(0, 100) || 'Empty response'}`);
        }
      } else {
        // Regular JSON parsing
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || (language === "ar"
          ? 'حدث خطأ أثناء إعادة تعيين كلمة المرور'
          : 'Error resetting password'));
      }

      toast({
        title: t("reset.password"),
        description: data.message,
      });

      router.push("/login");
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{language === "ar" ? "رمز التحقق" : "Verification Code"}</FormLabel>
                <FormControl>
                  <Input placeholder={language === "ar" ? "أدخل رمز التحقق" : "Enter verification code"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("new.password")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
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
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-[#BB2121] hover:bg-[#C20000]" disabled={isLoading}>
            {isLoading ? t("saving") : t("reset.password")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
