"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { showToast } from "@/lib/utils"

// بيانات نموذجية - في تطبيق حقيقي، ستأتي هذه من API
const upcomingEvents = [
  {
    id: "1",
    title: "نهائيات البطولة",
    content: "المباراة النهائية لسلسلة البطولة.",
    image: "/placeholder.svg?height=80&width=120",
    date: new Date("2023-08-15"),
    location: "الملعب الرئيسي، وسط المدينة",
    type: "upcoming",
  },
  {
    id: "2",
    title: "بطولة خيرية",
    content: "البطولة الخيرية السنوية لجمع التبرعات للقضايا المحلية.",
    image: "/placeholder.svg?height=80&width=120",
    date: new Date("2023-09-02"),
    location: "ملعب المجتمع، الجانب الغربي",
    type: "upcoming",
  },
  {
    id: "3",
    title: "معسكر تدريب الشباب",
    content: "معسكر تدريبي خاص للرياضيين الشباب من سن 10-16.",
    image: "/placeholder.svg?height=80&width=120",
    date: new Date("2023-09-10"),
    location: "مركز التدريب، الجانب الشرقي",
    type: "upcoming",
  },
]

const pastEvents = [
  {
    id: "4",
    title: "افتتاح الموسم",
    content: "المباراة الافتتاحية للموسم الجديد.",
    image: "/placeholder.svg?height=80&width=120",
    date: new Date("2023-04-15"),
    location: "الملعب الرئيسي، وسط المدينة",
    type: "past",
  },
  {
    id: "5",
    title: "مباراة كل النجوم",
    content: "المباراة السنوية التي تضم أفضل لاعبي الدوري.",
    image: "/placeholder.svg?height=80&width=120",
    date: new Date("2023-05-20"),
    location: "الساحة الوطنية، العاصمة",
    type: "past",
  },
]

interface EventsTableProps {
  type: "upcoming" | "past"
}

export function EventsTable({ type }: EventsTableProps) {
  const initialData = type === "upcoming" ? upcomingEvents : pastEvents
  const [tableData, setTableData] = useState(initialData)
  const { t } = useLanguage()

  const handleDelete = (id: string) => {
    setTableData(tableData.filter((item) => item.id !== id))
    showToast.success(t, "event.deleted", "event.deleted.description")
  }

  const columns: ColumnDef<(typeof initialData)[0]>[] = [
    {
      accessorKey: "image",
      header: "الصورة",
      cell: ({ row }) => (
        <div className="w-[80px] h-[50px] relative">
          <Image
            src={row.getValue("image") || "/placeholder.svg"}
            alt={row.getValue("title")}
            fill
            className="object-cover rounded-md"
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "العنوان",
    },
    {
      accessorKey: "content",
      header: "المحتوى",
      cell: ({ row }) => {
        const content = row.getValue("content") as string
        return <div className="truncate max-w-[200px]">{content}</div>
      },
    },
    {
      accessorKey: "date",
      header: "التاريخ",
      cell: ({ row }) => {
        const date = row.getValue("date") as Date
        return <div>{format(date, "PPP", { locale: ar })}</div>
      },
    },
    {
      accessorKey: "location",
      header: "الموقع",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/events/${event.id}/edit`}>
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(event.id)}>
                <Trash className="ml-2 h-4 w-4" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  لم يتم العثور على فعاليات.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          السابق
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          التالي
        </Button>
      </div>
    </div>
  )
}
