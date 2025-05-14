import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "إنشاء مستخدم | إدارة الرياضة",
  description: "إنشاء مستخدم جديد",
}

export default function CreateUserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 