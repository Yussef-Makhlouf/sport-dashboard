import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "إدارة المستخدمين | إدارة الرياضة",
  description: "إدارة مستخدمي النظام",
}

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 