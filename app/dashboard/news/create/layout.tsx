import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "إنشاء خبر | إدارة الرياضة",
  description: "إنشاء مقال إخباري جديد",
}

export default function CreateNewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 