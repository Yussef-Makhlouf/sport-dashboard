import type { Metadata } from "next"
import { ForgotPasswordPageClient } from "@/components/forgot-password-page-client"

export const metadata: Metadata = {
  title: "نسيت كلمة المرور | لوحة تحكم الرياضة",
  description: "إعادة تعيين كلمة المرور للوحة تحكم الرياضة",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />
} 