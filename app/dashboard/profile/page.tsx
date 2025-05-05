import type { Metadata } from "next"
import { ProfileForm } from "../../../components/profile-form"

export const metadata: Metadata = {
  title: "الملف الشخصي | إدارة الرياضة",
  description: "إدارة الملف الشخصي",
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">الملف الشخصي</h1>
      <ProfileForm />
    </div>
  )
}
