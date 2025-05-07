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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { API_URL } from "@/lib/constants"

interface User {
  _id: string
  userName: string
  email: string
  phoneNumber: string
  role: string
  isActive: boolean
  createdAt: string
}

export function UsersTable() {
  const [tableData, setTableData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/auth/getAll`)
        

        console.log(response);
        
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        
        const data = await response.json()
          console.log(data);
        // Transform API data to match the expected format
        const formattedData = data.users.map((user: User) => ({
          id: user._id,
          name: user.userName,
          email: user.email,
          role: user.role === "مدير" ? "admin" : user.role === "محرر" ? "editor" : "viewer",
          avatar: "/placeholder.svg",
          initials: user.userName.substring(0, 2),
          phoneNumber: user.phoneNumber,
          isActive: user.isActive
        }))
        
        setTableData(formattedData)
        setError(null)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to load users. Please try again later.")
        // Use sample data as fallback
        setTableData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Only update the UI if the API call was successful
      setTableData(tableData.filter((item) => item.id !== id));
      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المستخدم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }

  const getSingleUser = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/getUser/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات المستخدم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return null;
    }
  }

  const handleEdit = async (id: string) => {
    const userData = await getSingleUser(id);
    if (userData) {
      // Store user data in localStorage or state management before navigation
      localStorage.setItem('editUserData', JSON.stringify(userData));
      window.location.href = `/dashboard/users/${id}/edit`;
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "avatar",
      header: "المستخدم",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "رقم الهاتف",
      cell: ({ row }) => {
        return <div>{row.original.phoneNumber}</div>
      },
    },
    {
      accessorKey: "role",
      header: "الدور",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <Badge variant={role === "admin" ? "default" : role === "editor" ? "outline" : "secondary"}>
            {role === "admin" ? "مدير" : role === "editor" ? "محرر" : "مشاهد"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "الحالة",
      cell: ({ row }) => {
        const isActive = row.original.isActive
        return (
          <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
            {isActive ? "نشط" : "غير نشط"}
          </Badge>
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
              <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                <Edit className="ml-2 h-4 w-4" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(user.id)}>
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
