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
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all hover:text-white",
                    isActive 
                      ? "bg-[#BB2121] text-white shadow-lg shadow-[#BB2121]/20" 
                      : "text-[#8A8A8A] hover:bg-[#222222] hover:text-white",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-[#8A8A8A]")} />
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
