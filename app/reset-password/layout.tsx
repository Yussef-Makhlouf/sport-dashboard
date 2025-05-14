import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "إعادة تعيين كلمة المرور | لوحة تحكم الرياضة",
  description: "تعيين كلمة مرور جديدة للوحة تحكم الرياضة",
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 