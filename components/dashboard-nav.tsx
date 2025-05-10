"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, Calendar, Users, User, Settings } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function DashboardNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    {
      title: t("dashboard"),
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      title: t("news.management"),
      href: "/dashboard/news",
      icon: FileText,
    },
    // {
    //   title: t("events.management"),
    //   href: "/dashboard/events",
    //   icon: Calendar,
    // },
    {
      title: t("members.management"),
      href: "/dashboard/members",
      icon: Settings,
    },
    {
      title: t("user.management"),
      href: "/dashboard/users",
      icon: Users,
    },
    {
      title: t("profile"),
      href: "/dashboard/profile",
      icon: User,
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-[#222222] px-4">
        <div className="flex items-center gap-2">
          <img src="/logo3.png" alt="UAEMMAF" className="h-auto w-auto" />
          
        </div>
      </div>
      <nav className="flex-1 overflow-auto py-6">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">{t("dashboard")}</h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-all hover:text-white",
                    isActive ? "bg-[#BB2121] text-white" : "text-[#8A8A8A] hover:bg-[#222222]",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      <div className="mt-auto border-t border-[#222222] p-4">
        <div className="flex items-center justify-center">
          <span className="text-xs text-[#8A8A8A]">© 2025 UAEMMAF</span>
        </div>
      </div>
    </div>
  )
}
