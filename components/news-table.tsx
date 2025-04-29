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
import { toast } from "@/components/ui/use-toast"

// بيانات نموذجية - في تطبيق حقيقي، ستأتي هذه من API
const data = [
  {
    id: "1",
    title: "الفريق يفوز بالبطولة",
    content: "فاز فريقنا بالبطولة للعام الثالث على التوالي.",
    image: "/placeholder.svg?height=80&width=120",
    publishedAt: new Date("2023-05-15"),
  },
  {
    id: "2",
    title: "التعاقد مع لاعب جديد",
    content: "تعاقدنا مع لاعب نجم جديد لتعزيز فريقنا.",
    image: "/placeholder.svg?height=80&width=120",
    publishedAt: new Date("2023-06-02"),
  },
  {
    id: "3",
    title: "اكتمال تجديد الملعب",
    content: "اكتمل الآن تجديد الملعب مع مرافق جديدة.",
    image: "/placeholder.svg?height=80&width=120",
    publishedAt: new Date("2023-06-10"),
  },
  {
    id: "4",
    title: "مقابلة مع المدرب",
    content: "مقابلة حصرية مع مدربنا حول الموسم القادم.",
    image: "/placeholder.svg?height=80&width=120",
    publishedAt: new Date("2023-06-15"),
  },
  {
    id: "5",
    title: "تذاكر الموسم متاحة الآن",
    content: "تذاكر الموسم للموسم القادم متاحة الآن للشراء.",
    image: "/placeholder.svg?height=80&width=120",
    publishedAt: new Date("2023-06-20"),
  },
]

export function NewsTable() {
  const [tableData, setTableData] = useState(data)

  const handleDelete = (id: string) => {
    setTableData(tableData.filter((item) => item.id !== id))
    toast({
      title: "تم حذف المقال الإخباري",
      description: "تم حذف المقال الإخباري بنجاح.",
    })
  }

  const columns: ColumnDef<(typeof data)[0]>[] = [
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
        return <div className="truncate max-w-[300px]">{content}</div>
      },
    },
    {
      accessorKey: "publishedAt",
      header: "تاريخ النشر",
      cell: ({ row }) => {
        const date = row.getValue("publishedAt") as Date
        return <div>{format(date, "PPP", { locale: ar })}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const news = row.original

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
                <Link href={`/dashboard/news/${news.id}/edit`}>
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(news.id)}>
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
                  لم يتم العثور على مقالات إخبارية.
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
