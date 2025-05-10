"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { API_URL } from "@/lib/constants"

// Define the type for news items from your API
interface NewsItem {
  _id: string
  customId: string
  title: {
    ar: string
    en: string
  }
  content: {
    ar: string
    en: string
  }
  image: Array<{
    secure_url: string
    public_id: string
    _id: string
  }>
  date: string
  category: {
    _id: string
    name: {
      ar: string
      en: string
    }
  }
}

export function NewsTable() {
  // Client-side only state
  const [tableData, setTableData] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data on the client side only
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/news/getallnews`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }
        
        const data = await response.json()
        setTableData(data.news || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("Failed to load news. Please try again later.")
        setTableData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      // In a real app, you would call an API to delete the news
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete news');
      }
      
      // Update the UI after successful deletion
      setTableData(tableData.filter((item) => item._id !== id))
      
      toast({
        title: "تم حذف المقال الإخباري",
        description: "تم حذف المقال الإخباري بنجاح.",
      })
    } catch (err) {
      console.error("Error deleting news:", err)
      toast({
        title: "خطأ",
        description: "فشل حذف المقال الإخباري. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    }
  }

  // Format date safely without locale-specific formatting
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    } catch (e) {
      return dateString
    }
  }

  // Define columns only on the client side
  const columns: ColumnDef<NewsItem>[] = [
    {
      accessorKey: "image",
      header: "الصورة",
      cell: ({ row }) => {
        const news = row.original
        // Add null check for image array
        if (!news.image || news.image.length === 0 || !news.image[0].secure_url) {
          return <div className="w-[80px] h-[50px] bg-gray-200 rounded-md"></div>
        }
        
        return (
          <div className="w-[80px] h-[50px] relative overflow-hidden rounded-md">
            <img
              src={news.image[0].secure_url}
              alt={news.title?.ar || "News image"}
              className="w-full h-full object-cover"
            />
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: "العنوان",
      cell: ({ row }) => {
        const news = row.original
        // Add null check for title
        const title = news.title?.ar || ""
        return <div className="font-medium">{title}</div>
      },
    },
    {
      accessorKey: "category",
      header: "الفئة",
      cell: ({ row }) => {
        const news = row.original
        // Add null check for category
        const category = news.category?.name?.ar || ""
        return <div className="font-medium">{category}</div>
      },
    },
    {
      accessorKey: "content",
      header: "المحتوى",
      cell: ({ row }) => {
        const news = row.original
        // Add null check for content
        const content = news.content?.ar || ""
        
        // Now content is guaranteed to be a string
        const truncatedContent = content.length > 50 
          ? content.substring(0, 50) + "..." 
          : content
        
        return <div className="truncate max-w-[300px]">{truncatedContent}</div>
      },
    },
    {
      accessorKey: "date",
      header: "تاريخ النشر",
      cell: ({ row }) => {
        const news = row.original
        // Add null check for date
        return <div>{news.date ? formatDate(news.date) : ""}</div>
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
              {/* <DropdownMenuItem asChild>
                <Link href={`/dashboard/news/${news._id}`}>
                  <Eye className="ml-2 h-4 w-4" />
                  عرض
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/news/${news._id}/edit`}>
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(news._id)}>
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
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BB2121] border-r-transparent"></div>
        <p className="mr-2">جاري التحميل...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-md">
        {error}
      </div>
    )
  }

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
