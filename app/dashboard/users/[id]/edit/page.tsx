"use client"

import { UserForm } from "@/components/user-form"
import { API_URL } from "@/lib/constants"
import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"

interface UserData {
  _id: string
  userName: string
  email: string
  phoneNumber?: string
  role: string
  isActive: boolean
  image?: {
    secure_url: string
    public_id: string
  }
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/auth/getUser/${params.id}`, {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        
        const data = await response.json()
        setUserData(data.user)
        setError(null)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(t("user.not.found.error"))
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [params.id, t])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("edit.user")}</h1>
        <div>{t("loading")}</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("edit.user")}</h1>
        <p className="text-red-500">{error || t("user.not.found")}</p>
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
    status: userData.isActive ? 'active' : 'inactive',
    image: userData.image
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("edit.user")}</h1>
      <UserForm initialData={formData} />
    </div>
  )
}
