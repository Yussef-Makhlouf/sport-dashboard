"use client"

import Link from "next/link"

export function ResetLinkSentMessage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-green-600"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold">تم إرسال رابط إعادة التعيين</h3>
      <p className="text-sm text-muted-foreground">
        لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك.
      </p>
      <div className="mt-4">
        <Link 
          href="/login" 
          className="text-sm text-[#BB2121] hover:text-[#D82F2F] hover:underline"
        >
          العودة إلى صفحة تسجيل الدخول
        </Link>
      </div>
    </div>
  )
} 