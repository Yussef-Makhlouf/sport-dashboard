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

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { t, language } = useLanguage()

  // Form schema with dynamic language-based validation messages
  const formSchema = z.object({
    email: z.string().email({
      message: t("email.invalid.error") || "Please enter a valid email address.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email
        }),
      });

      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      
      // Debug response info
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
          const errorMessage = language === "ar"
            ? `استجابة غير صالحة من الخادم: ${textResponse.substring(0, 100) || 'استجابة فارغة'}`
            : `API returned non-JSON response: ${textResponse.substring(0, 100) || 'Empty response'}`;
          throw new Error(errorMessage);
        }
      } else {
        // Regular JSON parsing
        data = await response.json();
      }

      if (!response.ok) {
        const errorMessage = language === "ar"
          ? (data.message || 'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور')
          : (data.message || 'An error occurred while sending the password reset request');
        throw new Error(errorMessage);
      }

      // Store email in localStorage for reset password form
      localStorage.setItem('resetEmail', values.email);
      
      setIsSubmitted(true);
      toast({
        title: language === "ar" ? "تم إرسال رمز التحقق" : "Verification Code Sent",
        description: data.message,
      });

      router.push("/reset-password");
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: error instanceof Error ? error.message : (language === "ar" ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-green-600"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">{t("check.email")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("check.email.description")}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" className="w-full bg-[#BB2121] hover:bg-[#C20000]" disabled={isLoading}>
            {isLoading ? t("sending") : t("send.reset.link")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
