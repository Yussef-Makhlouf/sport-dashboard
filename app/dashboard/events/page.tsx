import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EventsTable } from "@/components/events-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "إدارة الفعاليات | إدارة الرياضة",
  description: "إدارة الفعاليات للموقع الرياضي",
}

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة الفعاليات</h1>
        <Link href="/dashboard/events/create">
          <Button className="bg-[#BB2121] hover:bg-[#C20000]">
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة فعالية
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">الفعاليات القادمة</TabsTrigger>
          <TabsTrigger value="past">الفعاليات السابقة</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <EventsTable type="upcoming" />
        </TabsContent>
        <TabsContent value="past">
          <EventsTable type="past" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
