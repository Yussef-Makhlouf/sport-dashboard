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
import Cookies from 'js-cookie'
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

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
  order?: number
  createdAt?: string
}

export function MembersTable() {
  // Client-side only state
  const [tableData, setTableData] = useState<MemberItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const { t, language } = useLanguage()

  // Fetch data on the client side only
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true)
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          return // Exit early during SSR
        }
        
        console.log('Fetching members from API endpoint:', `${API_URL}/members/getallmembers`)
        
        // Try the primary endpoint first
        let response = await fetch(`${API_URL}/members/getallmembers`, {
          cache: 'no-store',
        })
        
        console.log('API response status:', response.status)
        
        // If the first endpoint fails with a 404, try an alternative format
        if (response.status === 404) {
          console.log('First endpoint returned 404, trying alternative...')
          const alternativeEndpoint = `${API_URL}/members`
          console.log('Alternative API endpoint:', alternativeEndpoint)
          
          response = await fetch(alternativeEndpoint, {
            cache: 'no-store',
          })
          console.log('Alternative API response status:', response.status)
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch members: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('API response structure:', Object.keys(data))
        
        // Handle different response structures
        let members: MemberItem[] = []
        
        if (Array.isArray(data)) {
          // If response is directly an array
          members = data
        } else if (data.members && Array.isArray(data.members)) {
          // If response has a members property that is an array
          members = data.members
        } else if (data.data && Array.isArray(data.data)) {
          // If response has a data property that is an array
          members = data.data
        } else if (data.results && Array.isArray(data.results)) {
          // If response has a results property that is an array
          members = data.results
        } else {
          // Try to find array property in data
          const arrayProperty = Object.entries(data).find(([_, value]) => Array.isArray(value))
          if (arrayProperty) {
            members = arrayProperty[1] as MemberItem[]
          } else {
            throw new Error('Could not find members array in API response')
          }
        }
        
        // Sort members by order
        members.sort((a, b) => (a.order || 0) - (b.order || 0))
        
        console.log(`Found ${members.length} members in response`)
        setTableData(members)
        setError(null)
      } catch (err) {
        console.error("Error fetching members:", err)
        setError(err instanceof Error ? err.message : "Failed to load members. Please try again later.")
        setTableData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMembers()
  }, [])

  const handleDelete = async (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      console.log(`Attempting to delete member with ID: ${itemToDelete}`)
      
      // Try the primary endpoint first
      let response
      let deleteSuccessful = false
      
      try {
        console.log(`Using primary endpoint: ${API_URL}/members/${itemToDelete}`)
        response = await fetch(`${API_URL}/members/${itemToDelete}`, {
          method: 'DELETE',
        });
        
        console.log('Delete response status:', response.status)
        
        if (response.ok) {
          deleteSuccessful = true
        } else if (response.status === 404) {
          // If the first endpoint fails with a 404, try an alternative format
          console.log('Primary endpoint returned 404, trying alternative...')
        }
      } catch (primaryError) {
        console.error('Error with primary delete endpoint:', primaryError)
      }
      
      // Try alternative endpoint if first one failed
      if (!deleteSuccessful) {
        try {
          const alternativeEndpoint = `${API_URL}/members/delete/${itemToDelete}`
          console.log(`Using alternative endpoint: ${alternativeEndpoint}`)
          
          response = await fetch(alternativeEndpoint, {
            method: 'DELETE',
          });
          
          console.log('Alternative delete response status:', response?.status)
          
          if (response?.ok) {
            deleteSuccessful = true
          }
        } catch (alternativeError) {
          console.error('Error with alternative delete endpoint:', alternativeError)
        }
      }
      
      if (!deleteSuccessful) {
        throw new Error('Failed to delete member after trying multiple endpoints')
      }
      
      // Update the UI after successful deletion
      setTableData(tableData.filter((item) => item._id !== itemToDelete))
      
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
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleViewProfile = (member: MemberItem) => {
    try {
      // Store the member data in both cookie and localStorage
      const memberData = {
        _id: member._id,
        name: member.name,
        position: member.position,
        description: member.description,
        image: member.image
      }
      
      // Get the authentication token if available
      const token = Cookies.get('token')
      
      // Set in cookie (7 days expiration)
      Cookies.set('memberData', JSON.stringify(memberData), { expires: 7, secure: true })
      
      // Set token in cookie if available
      if (token) {
        // Renew the token cookie to match the memberData expiration
        Cookies.set('token', token, { expires: 7, secure: true })
      }
      
      // Set in localStorage as fallback
      localStorage.setItem('memberData', JSON.stringify(memberData))
      
      // Log the stored data (without sensitive info)
      console.log('Stored member data for profile view:', { id: member._id, name: member.name })
      
      // Navigate to profile page
      window.location.href = '/dashboard/members/profile'
    } catch (error) {
      console.error('Error storing member data:', error)
      toast({
        title: t("Error"),
        description: t("Failed to view member profile. Please try again."),
        variant: "destructive"
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
              alt={member.name?.[language] || "Member image"}
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
        const name = member.name?.[language]
        return <div className="font-medium">{name}</div>
      },
    },
    {
      accessorKey: "position",
      header: t("Position"),
      cell: ({ row }) => {
        const member = row.original
        // Add null check for position
        const position = member.position?.[language]
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
              {/* <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                <Eye className="ml-2 h-4 w-4" />
                {t("View Profile")}
              </DropdownMenuItem> */}
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
    <>
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
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setItemToDelete(null)
        }}
        onConfirm={confirmDelete}
        title={t("confirm.delete.member.title")}
        description={t("confirm.delete.member.description")}
      />
    </>
  )
}
