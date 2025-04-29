import type { Metadata } from "next"
import { UserForm } from "@/components/user-form"

export const metadata: Metadata = {
  title: "إنشاء مستخدم | إدارة الرياضة",
  description: "إنشاء مستخدم جديد",
}

export default function CreateUserPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">إنشاء مستخدم جديد</h1>
      <UserForm />
    </div>
  )
}
