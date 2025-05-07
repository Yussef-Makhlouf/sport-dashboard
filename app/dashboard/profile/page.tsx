import type { Metadata } from "next"
import { UserForm } from "@/components/user-form"
import { API_URL } from "@/lib/constants"
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: "الملف الشخصي | إدارة الرياضة",
  description: "إدارة الملف الشخصي",
}

async function getCurrentUserData() {
  try {
    const cookieStore = await cookies()
    const userDataCookie = cookieStore.get('userData')?.value

    if (!userDataCookie) {
      throw new Error('User data not found in cookies')
    }
    
    const userData = JSON.parse(userDataCookie)
    
    const userId = userData._id

    if (!userId) {
      throw new Error('User ID not found in user data')
    }

    const response = await fetch(`${API_URL}/auth/getUser/${userId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }
    
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export default async function ProfilePage() {
  const userData = await getCurrentUserData()

  if (!userData) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">الملف الشخصي</h1>
        <p>لم يتم العثور على بيانات المستخدم</p>
      </div>
    )
  }

  // Transform the API data to match the UserForm's expected format
  const formData = {
    id: userData._id,
    name: userData.userName,
    email: userData.email,
    phoneNumber: userData.phoneNumber || '',
    role: userData.role,
    status: userData.isActive ? 'active' : 'inactive'
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">الملف الشخصي</h1>
      <UserForm initialData={formData} />
    </div>
  )
}
