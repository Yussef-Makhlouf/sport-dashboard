"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { API_URL } from "@/lib/constants";
import Cookies from 'js-cookie'
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { showToast } from "@/lib/utils"

// Add token helper function
export const getAuthToken = () => {
  return Cookies.get('token');
};

// Add auth header helper function
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [redirectPath, setRedirectPath] = useState("/dashboard")
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()
  
  const formSchema = z.object({
    email: z.string().email({
      message: t("email.invalid.error") || "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: t("password.min.length.error") || "Password must be at least 8 characters.",
    }),
  })
  
  // Get the redirect path from URL query parameter
  useEffect(() => {
    const redirect = searchParams.get("redirect")
    if (redirect) {
      setRedirectPath(redirect)
    }
  }, [searchParams])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      // Parse the JSON response
      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        // Successful login
        showToast.success(t, "login.success", data.message || "welcome.message")
        
        // Store user data and token if available
        if (data.userUpdated) {
          const userToken = data.userUpdated.token;
          
          // Set cookies with a 7-day expiration (or match your token expiration)
          if (userToken) {
            Cookies.set('token', userToken, { expires: 7, secure: true });
          }
          
          // Store user data without sensitive information
          const userData = {
            _id: data.userUpdated._id,
            userName: data.userUpdated.userName,
            email: data.userUpdated.email,
            role: data.userUpdated.role,
            isActive: data.userUpdated.isActive,
            phoneNumber: data.userUpdated.phoneNumber,
          };
          
          Cookies.set('userData', JSON.stringify(userData), { expires: 7, secure: true });
        }
        
        // Redirect to the original path the user was trying to access
        router.push(redirectPath)
      } else {
        // Failed login
        showToast.error(t, "login.failed", "password.incorrect")
        console.error("Error during login:", data)
      }
    } catch (error) {
      showToast.error(t, "login.failed", "password.incorrect")
      console.error("Error during login:", error)
    } finally {
      setIsLoading(false)
    }
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
          <Button type="submit" className="w-full bg-[#BB2121] hover:bg-[#C20000]" disabled={isLoading}>
            {isLoading ? t("logging.in") : t("login")}
          </Button>
          <div className="text-center mt-4">
            <Link
              href="/forgot-password"
              className="text-sm text-[#BB2121] hover:text-[#D82F2F] hover:underline"
            >
              {t("forgot.password")}
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}