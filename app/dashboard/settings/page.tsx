import type { Metadata } from "next"
import { SettingsForm } from "@/components/settings-form"

export const metadata: Metadata = {
  title: "الإعدادات | إدارة الرياضة",
  description: "إعدادات النظام",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">إعدادات النظام</h1>
      <SettingsForm />
    </div>
  )
}
