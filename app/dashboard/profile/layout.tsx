import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "الملف الشخصي | إدارة الرياضة",
  description: "إدارة الملف الشخصي",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 