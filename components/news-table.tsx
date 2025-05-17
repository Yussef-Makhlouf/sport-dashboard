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
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { API_URL } from "@/lib/constants"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { showToast } from "@/lib/utils"

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
  const { t, language } = useLanguage()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(5)

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
        setError(t("error"))
        setTableData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [t])

  const handleDelete = async (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`${API_URL}/news/${itemToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete news');
      }
      
      // Update the UI after successful deletion
      setTableData(tableData.filter((item) => item._id !== itemToDelete))
      
      showToast.success(t, "success", "news.delete.success")
    } catch (err) {
      console.error("Error deleting news:", err)
      showToast.error(t, "error", "news.delete.error")
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
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
      header: t("image"),
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
              alt={news.title?.[language] || "News image"}
              className="w-full h-full object-cover"
            />
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: language === "ar" ? t("news.title.ar") : "Title",
      cell: ({ row }) => {
        const news = row.original
        // Add null check for title
        const title = news.title?.[language] || ""
        return <div className="font-medium">{title}</div>
      },
    },
    {
      accessorKey: "category",
      header: t("news.category"),
      cell: ({ row }) => {
        const news = row.original
        // Add null check for category
        const category = news.category?.name?.[language] || ""
        return <div className="font-medium">{category}</div>
      },
    },
    {
      accessorKey: "content",
      header: t("content"),
      cell: ({ row }) => {
        const news = row.original
        // Add null check for content
        const content = news.content?.[language] || ""
        
        // Now content is guaranteed to be a string
        const truncatedContent = content.length > 50 
          ? content.substring(0, 50) + "..." 
          : content
        
        return <div className="truncate max-w-[300px]">{truncatedContent}</div>
      },
    },
    {
      accessorKey: "date",
      header: t("publication.date"),
      cell: ({ row }) => {
        const news = row.original
        // Add null check for date
        return <div>{news.date ? formatDate(news.date) : ""}</div>
      },
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => {
        const news = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("open.menu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem asChild>
                <Link href={`/dashboard/news/${news._id}`}>
                  <Eye className="ml-2 h-4 w-4" />
                  {t("news.view")}
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/news/${news._id}/edit`}>
                  <Edit className="ml-2 h-4 w-4" />
                  {t("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(news._id)}>
                <Trash className="ml-2 h-4 w-4" />
                {t("delete")}
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
        pageSize: pageSize,
      },
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BB2121] border-r-transparent"></div>
        <p className="mr-2">{t("loading")}</p>
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
    <>
      <div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className={language === "ar" ? "text-right" : "text-left"}>
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
                    {t("no.news.found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t("news.per.page")}</p>
            <select
              value={pageSize}
              onChange={e => {
                const newSize = Number(e.target.value)
                setPageSize(newSize)
                table.setPageSize(newSize)
              }}
              className="h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
            >
              {[5, 10, 20, 50].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="flex items-center gap-1 text-sm">
              <div>{t("page")}</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} {t("of")} {table.getPageCount()}
              </strong>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setItemToDelete(null)
        }}
        onConfirm={confirmDelete}
        title={t("confirm.delete.news.title")}
        description={t("confirm.delete.news.description")}
      />
    </>
  )
}
