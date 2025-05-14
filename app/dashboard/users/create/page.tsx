"use client"

import { UserForm } from "@/components/user-form"
import { useLanguage } from "@/components/language-provider"

export default function CreateUserPage() {
  const { t } = useLanguage()
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("create.user")}</h1>
      <UserForm />
    </div>
  )
}
