"use client"

import { UserForm } from "@/components/user-form"
import { API_URL } from "@/lib/constants"
import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

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

export default function ProfilePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getCurrentUserData = async () => {
      try {
        setLoading(true)
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          return // Exit early during SSR
        }
        
        // Get user data from Cookies first, then try localStorage as fallback
        let userDataString = Cookies.get('userData')
        
        // Fallback to localStorage if not found in cookies
        if (!userDataString) {
          const localStorageData = localStorage.getItem('userData')
          if (localStorageData) {
            userDataString = localStorageData
          }
        }

        if (!userDataString) {
          // If user data is not found, redirect to login
          router.push('/login')
          throw new Error('User data not found')
        }
        
        let localUserData
        try {
          localUserData = JSON.parse(userDataString)
        } catch (e) {
          throw new Error('Invalid user data format')
        }
        
        // Get token from cookie
        const token = Cookies.get('token')
        
        let userId = localUserData?._id
        
        // If no userId from localStorage or cookies, try to get user info from token
        if (!userId && token) {
          try {
            console.log('No user ID found, trying to get user info from token')
            const response = await fetch(`${API_URL}/auth/verify`, {
              headers: {
                Authorization: `MMA ${token}`
              }
            })
            
            if (response.ok) {
              const userData = await response.json()
              console.log('User data from token verification:', userData)
              if (userData.user && userData.user._id) {
                userId = userData.user._id
                console.log('Got user ID from token:', userId)
              }
            }
          } catch (error) {
            console.error('Error getting user info from token:', error)
          }
        }

        if (!userId) {
          // If user ID is not found, redirect to login
          router.push('/login') 
          throw new Error('User ID not found in user data')
        }

        // Debug log
        console.log('Fetching user with ID:', userId)
        console.log('Using token:', token ? 'Token exists' : 'No token')
        
        const apiEndpoint = `${API_URL}/auth/getUser/${userId}`
        console.log('API endpoint:', apiEndpoint)

        try {
          // First try with the standard endpoint
          let response = await fetch(apiEndpoint, {
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `MMA ${token}` : ''
            }
          })
          
          console.log('API response status:', response.status)
          
          // If the first endpoint fails with a 404, try an alternative format
          if (response.status === 404) {
            console.log('First endpoint returned 404, trying alternative...')
            const alternativeEndpoint = `${API_URL}/auth/user/${userId}`
            console.log('Alternative API endpoint:', alternativeEndpoint)
            
            response = await fetch(alternativeEndpoint, {
              cache: 'no-store',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `MMA ${token}` : ''
              }
            })
            console.log('Alternative API response status:', response.status)
          }
          
          if (response.status === 401 || response.status === 403) {
            // Unauthorized - redirect to login
            router.push('/login')
            return
          }
          
          if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
          }
          
          const data = await response.json()
          console.log('API response data:', JSON.stringify(data).substring(0, 200))
          
          // Check if the response contains the user data in different formats
          let user = null
          if (data.user) {
            user = data.user
          } else if (data.data) {
            user = data.data
          } else if (data) {
            // If the data itself is the user object (contains expected fields)
            if (data._id && data.userName && data.email) {
              user = data
            }
          }
          
          if (!user) {
            console.error('User data structure in response:', data)
            throw new Error('User data not found in response')
          }
          
          setUserData(user)
          setError(null)
        } catch (fetchError) {
          console.error('Fetch error:', fetchError)
          throw fetchError
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(error instanceof Error ? error.message : String(error))
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }

    getCurrentUserData()
  }, [t, router])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("profile")}</h1>
        <div>{t("loading")}</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("profile")}</h1>
        <p className="text-red-500">{error || t("profile.not.found")}</p>
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
    image: userData.image || { secure_url: '', public_id: '' }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("profile")}</h1>
      <UserForm initialData={formData} />
    </div>
  )
}
