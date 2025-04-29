import type { Metadata } from "next"
import { ProfileForm } from "@/components/profile-form"

export const metadata: Metadata = {
  title: "الملف الشخصي | إدارة الرياضة",
  description: "إدارة الملف الشخصي",
}

export default function ProfilePage() {
  // في تطبيق حقيقي، ستقوم بجلب بيانات المستخدم الحالي
  const userData = {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=300&width=300",
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">الملف الشخصي</h1>
      <ProfileForm initialData={userData} />
    </div>
  )
}
