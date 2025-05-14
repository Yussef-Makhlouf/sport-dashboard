import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "تعديل مستخدم | إدارة الرياضة",
  description: "تعديل مستخدم موجود",
}

export default function EditUserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 