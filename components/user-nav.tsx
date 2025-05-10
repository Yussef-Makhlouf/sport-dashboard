"use client"

import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { API_URL } from "@/lib/constants"
import Cookies from 'js-cookie'

export function UserNav() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = async () => {
    try {
      // Get token from cookies
      const token = Cookies.get('token')
      
      if (!token) {
        router.push("/login")
        return
      }

      // Call logout API
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
      
      const data = await response.json()
      console.log(data)
      if (!response.ok) {
        throw new Error('Failed to logout')
      }

      // Clear cookies
      Cookies.remove('token')
      Cookies.remove('userData')
      
      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error('Error during logout:', error)
      // Still redirect to login page even if API call fails
      router.push("/login")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback>أح</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">أحمد محمد</p>
            <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>{t("profile")}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>{t("logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
