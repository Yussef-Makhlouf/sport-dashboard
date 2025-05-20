import type { Metadata } from "next"
import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProtectedRoute } from "@/components/protected-route"
import { AuthWrapper } from "@/components/auth-wrapper"

export const metadata: Metadata = {
  title: "dashboard",
  description: "dashboard",
  icons: {
    icon: "/favicon.png"
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-[#111111] text-white">
          <div className="container flex h-16 items-center px-4 sm:px-6">
            <div className="flex items-center gap-2 text-lg font-medium">
              <img src="/logo3.png" alt="UAEMMAF" className="h-10 w-auto" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <LanguageSwitcher />
              <UserNav />
              <MobileNav />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-[#111111] text-white md:block">
            <DashboardNav />
          </aside>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
