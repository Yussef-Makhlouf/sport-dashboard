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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const { language, t } = useLanguage()

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
    if (!confirm(t("Are you sure you want to delete this member?"))) {
      return
    }
    
    try {
      console.log(`Attempting to delete member with ID: ${id}`)
      
      // Try the primary endpoint first
      let response
      let deleteSuccessful = false
      
      try {
        console.log(`Using primary endpoint: ${API_URL}/members/${id}`)
        response = await fetch(`${API_URL}/members/${id}`, {
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
          const alternativeEndpoint = `${API_URL}/members/delete/${id}`
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
      header: () => <div className="text-center">{t("Image")}</div>,
      cell: ({ row }) => {
        const member = row.original
        
        // Add null check for image
        if (!member.image || !member.image.secure_url) {
          return <div className="w-[80px] h-[50px] bg-gray-200 rounded-md mx-auto"></div>
        }
        
        return (
          <div className="w-[80px] h-[50px] relative overflow-hidden rounded-md mx-auto">
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
      header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{language === 'ar' ? 'الاسم' : t("Name")}</div>,
      cell: ({ row }) => {
        const member = row.original
        // Add null check for name
        const name = member.name?.[language]
        return <div className={`font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>{name}</div>
      },
    },
    {
      accessorKey: "position",
      header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{language === 'ar' ? 'المنصب' : t("Position")}</div>,
      cell: ({ row }) => {
        const member = row.original
        // Add null check for position
        const position = member.position?.[language]
        return <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>{position}</div>
      },
    },
    {
      id: "actions",
      header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{language === 'ar' ? 'الإجراءات' : t("Actions")}</div>,
      cell: ({ row }) => {
        const member = row.original
        return (
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{language === 'ar' ? 'فتح القائمة' : t("Open menu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                  <Eye className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {language === 'ar' ? 'عرض الملف الشخصي' : t("View Profile")}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/members/edit/${member._id}`}>
                    <Edit className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {language === 'ar' ? 'تعديل' : t("Edit")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(member._id)}>
                  <Trash className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {language === 'ar' ? 'حذف' : t("Delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            {language === 'ar' ? 'عدد العناصر في الصفحة' : 'Rows per page'}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side={language === 'ar' ? 'left' : 'right'}>
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {language === 'ar' ? 'السابق' : 'Previous'}
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {language === 'ar' ? 'صفحة' : 'Page'}
            </span>
            <span className="text-sm font-medium">
              {table.getState().pagination.pageIndex + 1}
            </span>
            <span className="text-sm font-medium">
              {language === 'ar' ? 'من' : 'of'}
            </span>
            <span className="text-sm font-medium">
              {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {language === 'ar' ? 'التالي' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}
