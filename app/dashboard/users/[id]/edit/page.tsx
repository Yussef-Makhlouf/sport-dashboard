import type { Metadata } from "next"
import { UserForm } from "@/components/user-form"

export const metadata: Metadata = {
  title: "تعديل مستخدم | إدارة الرياضة",
  description: "تعديل مستخدم موجود",
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  // في تطبيق حقيقي، ستقوم بجلب بيانات المستخدم بناءً على المعرف
  const userData = {
    id: params.id,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=300&width=300",
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">تعديل مستخدم</h1>
      <UserForm initialData={userData} />
    </div>
  )
}
