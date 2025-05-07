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

// Define the type for member items from your API
interface MemberItem {
  _id: string
  name: {
    ar: string
    en: string
  }
  position: {
    ar: string
    en: string
  }
  description: {
    ar: string
    en: string
  }
  image: {
    secure_url: string
    public_id: string
  }
  createdAt?: string
}

export function MembersTable() {
  // Client-side only state
  const [tableData, setTableData] = useState<MemberItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { language, t } = useLanguage()

  // Fetch data on the client side only
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/members/getallmembers`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch members")
        }
        
        const data = await response.json()
        console.log(data);
        
        // Handle the new response structure with members array
        setTableData(data.members || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching members:", err)
        setError("Failed to load members. Please try again later.")
        setTableData([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm(t("Are you sure you want to delete this member?"))) {
      return
    }
    
    try {
      const response = await fetch(`${API_URL}/members/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      
      // Update the UI after successful deletion
      setTableData(tableData.filter((item) => item._id !== id))
      
      toast({
        title: t("member.deleted"),
        description: t("member.deleted.description"),
      })
    } catch (err) {
      console.error("Error deleting member:", err)
      toast({
        title: t("Error"),
        description: t("Failed to delete member. Please try again."),
        variant: "destructive",
      })
    }
  }

  // Define columns only on the client side
  const columns: ColumnDef<MemberItem>[] = [
    {
      accessorKey: "image",
      header: t("Image"),
      cell: ({ row }) => {
        const member = row.original
        
        // Add null check for image
        if (!member.image || !member.image.secure_url) {
          return <div className="w-[80px] h-[50px] bg-gray-200 rounded-md"></div>
        }
        
        return (
          <div className="w-[80px] h-[50px] relative overflow-hidden rounded-md">
            <img
              src={member.image.secure_url}
              alt={member.name?.ar || "Member image"}
              className="w-full h-full object-cover"
            />
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: t("Name"),
      cell: ({ row }) => {
        const member = row.original
        // Add null check for name
        const name = member.name?.ar
        return <div className="font-medium">{name}</div>
      },
    },
    {
      accessorKey: "position",
      header: t("Position"),
      cell: ({ row }) => {
        const member = row.original
        // Add null check for position
        const position = member.position?.ar
        return <div>{position}</div>
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("Open menu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/members/${member._id}`}>
                  <Eye className="ml-2 h-4 w-4" />
                  {t("View")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/members/edit/${member._id}`}>
                  <Edit className="ml-2 h-4 w-4" />
                  {t("Edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(member._id)}>
                <Trash className="ml-2 h-4 w-4" />
                {t("Delete")}
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
        <p className="mr-2">{t("Loading...")}</p>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("members.management")}</h2>
        <Link href="/dashboard/members/create">
          <Button>{t("add.member")}</Button>
        </Link>
      </div>
      
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
                  {t("No members found.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {t("Previous")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {t("Next")}
        </Button>
      </div>
    </div>
  )
}
