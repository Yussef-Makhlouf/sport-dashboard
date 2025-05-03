"use client"

import { useState, useEffect } from "react"
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
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

// Define the user data type
interface User {
  _id: string
  userName: string
  email: string
  role: string
  isActive: boolean
  image?: {
    public_id: string
    secure_url: string
  }
  createdAt: string
}

export function UserTable() {
  const [tableData, setTableData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://localhost:6060/user/getAllUsers")
        
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        
        const data = await response.json()
        setTableData(data.users || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to load users. Please try again later.")
        setTableData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      // In a real app, you would call an API to delete the user
      // const response = await fetch(`http://localhost:6060/user/delete/${id}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete user');
      // }
      
      // Update the UI after successful deletion
      setTableData(tableData.filter((item) => item._id !== id))
      
      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح.",
      })
    } catch (err) {
      console.error("Error deleting user:", err)
      toast({
        title: "خطأ",
        description: "فشل حذف المستخدم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    }
  }

  // Define columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "image",
      header: "الصورة",
      cell: ({ row }) => {
        const user = row.original
        const imageUrl = user.image?.secure_url || "/placeholder-avatar.png"
        
        return (
          <div className="w-10 h-10 relative overflow-hidden rounded-full">
            <img
              src={imageUrl}
              alt={user.userName}
              className="w-full h-full object-cover"
            />
          </div>
        )
      },
    },
    {
      accessorKey: "userName",
      header: "اسم المستخدم",
    },
    {
      accessorKey: "email",
      header: "البريد الإلكتروني",
    },
    {
      accessorKey: "role",
      header: "الدور",
    },
    {
      accessorKey: "isActive",
      header: "الحالة",
      cell: ({ row }) => {
        const isActive = row.original.isActive
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {isActive ? "نشط" : "غير نشط"}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
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
                <Link href={`/dashboard/users/${user._id}/edit`}>
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(user._id)}>
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
                  لم يتم العثور على مستخدمين.
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
