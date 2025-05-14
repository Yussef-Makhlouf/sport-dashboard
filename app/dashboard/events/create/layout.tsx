import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "إنشاء فعالية | إدارة الرياضة",
  description: "إنشاء فعالية جديدة",
}

export default function CreateEventLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 