import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "تسجيل الدخول | إدارة الرياضة",
  description: "تسجيل الدخول إلى لوحة تحكم إدارة الرياضة",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 