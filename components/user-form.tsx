"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "يجب أن يكون الاسم 3 أحرف على الأقل.",
  }),
  email: z.string().email({
    message: "يرجى إدخال عنوان بريد إلكتروني صالح.",
  }),
  role: z.enum(["admin", "editor", "viewer"], {
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
    role: string
    status: string
  }
}

export function UserForm({ initialData }: UserFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          role: initialData.role as "admin" | "editor" | "viewer",
          status: initialData.status as "active" | "inactive",
          password: "",
        }
      : {
          name: "",
          email: "",
          role: "viewer",
          status: "active",
          password: "",
        },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // In a real application, you would send the data to an API
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: initialData ? "تم تحديث المستخدم" : "تم إنشاء المستخدم",
        description: initialData ? "تم تحديث المستخدم بنجاح." : "تم إنشاء المستخدم بنجاح.",
      })

      router.push("/dashboard/users")
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <SelectItem value="admin">{t("admin")}</SelectItem>
                    <SelectItem value="editor">{t("editor")}</SelectItem>
                    <SelectItem value="viewer">{t("viewer")}</SelectItem>
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
          <Button type="submit" className="bg-[#BB2121] hover:bg-[#C20000]" disabled={isLoading}>
            {isLoading ? t("saving") : initialData ? t("update.user") : t("create.user.button")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/users")}>
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
