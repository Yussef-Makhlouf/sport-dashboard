"use client"

import { SettingsForm } from "@/components/settings-form"
import { useLanguage } from "@/components/language-provider"

export default function SettingsPage() {
  const { t } = useLanguage()
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("system.settings")}</h1>
      <SettingsForm />
    </div>
  )
}
