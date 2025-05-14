"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UsersTable } from "@/components/users-table"
import { PlusCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function UsersPage() {
  const { t } = useLanguage()
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("user.management.title")}</h1>
        <Link href="/dashboard/users/create">
          <Button className="bg-[#BB2121] hover:bg-[#C20000]">
            <PlusCircle className="ml-2 h-4 w-4" />
            {t("add.user")}
          </Button>
        </Link>
      </div>
      <UsersTable />
    </div>
  )
}
