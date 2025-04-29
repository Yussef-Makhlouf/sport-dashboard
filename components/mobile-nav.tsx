"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, Calendar, Users, User, Menu, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)

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
    {
      title: t("events.management"),
      href: "/dashboard/events",
      icon: Calendar,
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={language === "ar" ? "left" : "right"} className="w-[80%] bg-[#111111] text-white p-0">
        <div className="flex h-16 items-center border-b border-[#222222] px-4">
          <div className="flex items-center text-lg font-medium">
            <img src="/logo.png" alt="UAEMMAF" className={cn("h-8 w-8", language === "ar" ? "ml-2" : "mr-2")} />
            UAEMMAF
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(language === "ar" ? "mr-auto" : "ml-auto")}
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <nav className="grid items-start gap-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-white",
                  isActive ? "bg-[#BB2121] text-white" : "text-[#8A8A8A] hover:bg-[#222222]",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
