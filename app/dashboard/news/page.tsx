import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NewsTable } from "@/components/news-table"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "إدارة الأخبار | إدارة الرياضة",
  description: "إدارة المقالات الإخبارية للموقع الرياضي",
}

export default function NewsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة الأخبار</h1>
        <Link href="/dashboard/news/create">
          <Button className="bg-[#BB2121] hover:bg-[#C20000]">
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة خبر
          </Button>
        </Link>
      </div>
      <NewsTable />
    </div>
  )
}
