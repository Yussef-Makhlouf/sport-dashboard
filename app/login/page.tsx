import type { Metadata } from "next"
import Link from "next/link"

import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "تسجيل الدخول | لوحة تحكم الرياضة",
  description: "تسجيل الدخول إلى لوحة تحكم الرياضة",
}

export default function LoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-[#BB2121]" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          إدارة الرياضة
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;لقد ساعدتنا لوحة التحكم هذه في تبسيط عملية إدارة المحتوى وجعلت من السهل إبقاء جمهورنا على اطلاع
              بأحدث الأخبار والفعاليات.&rdquo;
            </p>
            <footer className="text-sm">سارة أحمد</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">تسجيل الدخول إلى حسابك</h1>
            <p className="text-sm text-muted-foreground">أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link href="/forgot-password" className="hover:text-brand underline underline-offset-4">
              نسيت كلمة المرور؟
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
