"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { API_URL } from "@/lib/constants"

const formSchema = z.object({
  email: z.string().email({
    message: "يرجى إدخال عنوان بريد إلكتروني صالح.",
  }),
})

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور');
      }

      // Store email in localStorage for reset password form
      localStorage.setItem('resetEmail', values.email);
      
      setIsSubmitted(true);
      toast({
        title: "تم إرسال رمز التحقق",
        description: data.message,
      });

      router.push("/reset-password");
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
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
        <h3 className="text-xl font-semibold">تحقق من بريدك الإلكتروني</h3>
        <p className="text-sm text-muted-foreground">
          لقد أرسلنا لك رمز التحقق. يرجى التحقق من بريدك الإلكتروني.
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
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-[#BB2121] hover:bg-[#C20000]" disabled={isLoading}>
            {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
