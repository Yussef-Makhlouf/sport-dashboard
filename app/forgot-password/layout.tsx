import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "نسيت كلمة المرور | لوحة تحكم الرياضة",
  description: "إعادة تعيين كلمة المرور للوحة تحكم الرياضة",
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 