"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "next-themes"

const formSchema = z.object({
  language: z.enum(["ar", "en"], {
    required_error: "يرجى اختيار لغة.",
  }),
  theme: z.enum(["light", "dark", "system"], {
    required_error: "يرجى اختيار سمة.",
  }),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
})

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language,
      theme: (theme as "light" | "dark" | "system") || "system",
      emailNotifications: true,
      pushNotifications: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // In a real application, you would send the data to an API
    setTimeout(() => {
      setIsLoading(false)

      // Update language and theme
      setLanguage(values.language)
      setTheme(values.theme)

      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ الإعدادات بنجاح.",
      })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("general.settings")}</CardTitle>
            <CardDescription>إدارة إعدادات لوحة التحكم الخاصة بك</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("language")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="ar" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("arabic")}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="en" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("english")}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("theme")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="light" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("light")}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="dark" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("dark")}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="system" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("system")}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("notifications")}</CardTitle>
            <CardDescription>إدارة إعدادات الإشعارات الخاصة بك</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("email.notifications")}</FormLabel>
                    <FormDescription>
                      تلقي إشعارات عبر البريد الإلكتروني عند إضافة محتوى جديد أو تحديثه.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("push.notifications")}</FormLabel>
                    <FormDescription>تلقي إشعارات فورية عند إضافة محتوى جديد أو تحديثه.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="bg-[#BB2121] hover:bg-[#C20000]" disabled={isLoading}>
          {isLoading ? t("saving") : t("save.changes")}
        </Button>
      </form>
    </Form>
  )
}
