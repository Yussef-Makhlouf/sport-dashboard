import type { Metadata } from "next"
import { UserForm } from "@/components/user-form"
import { API_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "تعديل مستخدم | إدارة الرياضة",
  description: "تعديل مستخدم موجود",
}

async function getUserData(id: string) {
  try {
    const response = await fetch(`${API_URL}/auth/getUser/${id}`, {
      cache: 'no-store'
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

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const userData = await getUserData(params.id)

  if (!userData) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">تعديل مستخدم</h1>
        <p>لم يتم العثور على المستخدم</p>
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
      <h1 className="text-3xl font-bold tracking-tight">تعديل مستخدم</h1>
      <UserForm initialData={formData} />
    </div>
  )
}
