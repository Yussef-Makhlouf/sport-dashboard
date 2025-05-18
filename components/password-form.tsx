"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { showToast } from "@/lib/utils"

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { t, language } = useLanguage()

  // Dynamic form schema based on current language
  const formSchema = z
    .object({
      currentPassword: z.string().min(8, {
        message: t("current.password.min.length.error") || "Current password must be at least 8 characters.",
      }),
      newPassword: z.string().min(8, {
        message: t("new.password.min.length.error") || "New password must be at least 8 characters.",
      }),
      confirmPassword: z.string().min(8, {
        message: t("password.min.length.error") || "Password must be at least 8 characters.",
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwords.not.matching.error") || "Passwords do not match.",
      path: ["confirmPassword"],
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Show loading toast
    showToast.loading(t, "changing.password", "please.wait")

    // In a real application, you would send the data to an API
    setTimeout(() => {
      setIsLoading(false)

      showToast.success(t, "password.changed", "password.changed.description")

      form.reset()
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 max-w-md">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("current.password")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
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
        </div>

        <Button type="submit" className="bg-[#BB2121] hover:bg-[#C20000]" disabled={isLoading}>
          {isLoading ? t("saving") : t("change.password")}
        </Button>
      </form>
    </Form>
  )
}
