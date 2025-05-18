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
import { toast } from "@/hooks/use-toast"
import { API_URL } from "@/lib/constants"
import { useLanguage } from "@/components/language-provider"
import { getAuthToken } from "@/components/login-form"
import Cookies from 'js-cookie'
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { showToast } from "@/lib/utils"
import { fetchWithTokenRefresh } from "@/lib/utils"

interface User {
  _id: string
  userName: string
  email: string
  phoneNumber: string
  role: string
  isActive: boolean
  createdAt: string
  image: {
    secure_url: string
    public_id: string
  }
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, language } = useLanguage()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWithTokenRefresh(`${API_URL}/auth/getAll`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }

        const data = await response.json()
        
        // Get current user data from cookies
        const userDataStr = Cookies.get('userData')
        const currentUser = userDataStr ? JSON.parse(userDataStr) : null
        
        // Filter out the current user from the list
        const filteredUsers = data.users.filter((user: User) => 
          user._id !== currentUser?._id
        )
        
        setUsers(filteredUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات المستخدمين.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetchWithTokenRefresh(`${API_URL}/auth/${itemToDelete}`, {
        method: 'DELETE',
      });
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5uYWRlci5uYWJpbGwuNjVAZ21haWwuY29tIiwiX2lkIjoiNjgxZjlmOTBhZjI0NmNjMTNhMWIyODFjIiwiaWF0IjoxNzQ3NTc3NTgxLCJleHAiOjE3NDc1ODExODF9.kCRyTMkoyBGbdwGgspePoXuWn0un_CYZi3xcbVUSoCY
      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.message === "UnAuthorized to access this api") {
          throw new Error(t("unauthorized.error"));
        }
        throw new Error(errorData.message || t("user.delete.error.description"));
      }
      
      // Only update the UI if the API call was successful
      setUsers(users.filter((item) => item._id !== itemToDelete));
      showToast.success(t, "user.delete.success.title", "user.delete.success.description");
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : t("user.delete.error.description");
      toast({
        title: t("user.delete.error.title"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const getSingleUser = async (id: string) => {
    try {
      const response = await fetchWithTokenRefresh(`${API_URL}/auth/getUser/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      showToast.error(t, "error", "user.fetch.error");
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
      header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{t("user")}</div>,
      cell: ({ row }) => {
        const user = row.original
        console.log(user);
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image?.secure_url} alt={user.userName} />
              <AvatarFallback>{user.userName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.userName}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "phoneNumber",
      header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{t("phone.number")}</div>,
      cell: ({ row }) => {
        return <div>{row.original.phoneNumber}</div>
      },
    },
    {
      accessorKey: "role",
      header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{t("role")}</div>,
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <Badge variant={role === "مدير" ? "default" : role === "محرر" ? "outline" : "secondary"}>
            {role === "مدير" ? t("admin") : role === "محرر" ? t("editor") : t("viewer")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{t("status")}</div>,
      cell: ({ row }) => {
        const isActive = row.original.isActive
        return (
          <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
            {isActive ? t("active") : t("inactive")}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{t("actions")}</div>,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("open.menu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEdit(user._id)}>
                  <Edit className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(user._id)}>
                  <Trash className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                    {t("no.users.found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            {t("previous")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {t("next")}
          </Button>
        </div>
      </div>
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setItemToDelete(null)
        }}
        onConfirm={confirmDelete}
        title={t("confirm.delete.user.title")}
        description={t("confirm.delete.user.description")}
      />
    </>
  )
}
