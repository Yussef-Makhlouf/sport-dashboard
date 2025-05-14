"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/constants"
import { useLanguage } from "@/components/language-provider"
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"


interface MemberData {
  _id: string
  name: {
    ar: string
    en: string
  }
  position: {
    ar: string
    en: string
  }
  description?: {
    ar: string
    en: string
  }
  image?: {
    secure_url: string
    public_id: string
  }
}

export default function MemberProfilePage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getCurrentMemberData = async () => {
      try {
        setLoading(true)
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          return // Exit early during SSR
        }
        
        // Get member data from Cookies
        let memberDataString = Cookies.get('memberData')
        
        // Fallback to localStorage if not found in cookies
        if (!memberDataString) {
          const localStorageData = localStorage.getItem('memberData')
          if (localStorageData) {
            memberDataString = localStorageData
          }
        }

        if (!memberDataString) {
          // Show error that user needs to select a member first
          throw new Error('Please select a member from the members list')
        }
        
        let localMemberData
        try {
          localMemberData = JSON.parse(memberDataString)
        } catch (e) {
          throw new Error('Invalid member data format')
        }
        
        const memberId = localMemberData?._id

        if (!memberId) {
          throw new Error('Member ID not found in stored data')
        }

        // Debug log
        console.log('Fetching member with ID:', memberId)
        
        // Get authentication token if available
        const token = Cookies.get('token')
        console.log('Using token for API request:', token ? 'Yes' : 'No')
        
        const apiEndpoint = `${API_URL}/members/getmemberbyid/${memberId}`
        console.log('API endpoint:', apiEndpoint)

        try {
          const response = await fetch(apiEndpoint, {
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            }
          })
          
          console.log('API response status:', response.status)
          
          // If the first endpoint fails with a 404, try an alternative format
          if (response.status === 404) {
            console.log('First endpoint returned 404, trying alternative...')
            const alternativeEndpoint = `${API_URL}/members/${memberId}`
            console.log('Alternative API endpoint:', alternativeEndpoint)
            
            const alternativeResponse = await fetch(alternativeEndpoint, {
              cache: 'no-store',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
              }
            })
            
            console.log('Alternative API response status:', alternativeResponse.status)
            
            if (alternativeResponse.ok) {
              const data = await alternativeResponse.json()
              console.log('Alternative API response data:', JSON.stringify(data).substring(0, 200))
              
              // Process the alternative response
              let member = null
              if (data.member) {
                member = data.member
              } else if (data.data) {
                member = data.data
              } else if (data) {
                // If the data itself is the member object (contains expected fields)
                if (data._id && data.name) {
                  member = data
                }
              }
              
              if (member) {
                setMemberData(member)
                setError(null)
                return // Exit early since we found and processed the data
              }
            }
          }
          
          // Continue with original response processing if alternative didn't work
          if (!response.ok) {
            throw new Error(`Failed to fetch member data: ${response.status} ${response.statusText}`)
          }
          
          const data = await response.json()
          console.log('API response data:', JSON.stringify(data).substring(0, 200))
          
          // Check if the response contains the member data
          let member = null
          if (data.member) {
            member = data.member
          } else if (data.data) {
            member = data.data
          } else if (data) {
            // If the data itself is the member object (contains expected fields)
            if (data._id && data.name) {
              member = data
            }
          }
          
          if (!member) {
            console.error('Member data structure in response:', data)
            throw new Error('Member data not found in response')
          }
          
          setMemberData(member)
          setError(null)
        } catch (fetchError) {
          console.error('Fetch error:', fetchError)
          throw fetchError
        }
      } catch (error) {
        console.error('Error fetching member data:', error)
        setError(error instanceof Error ? error.message : String(error))
        setMemberData(null)
      } finally {
        setLoading(false)
      }
    }

    getCurrentMemberData()
  }, [t])

  const handleEditMember = () => {
    if (memberData) {
      router.push(`/dashboard/members/edit/${memberData._id}`)
    }
  }
  
  const handleBackToList = () => {
    router.push('/dashboard/members')
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("member.profile")}</h1>
        <div className="flex items-center">
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
          {t("loading")}
        </div>
      </div>
    )
  }

  if (!memberData) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t("member.profile")}</h1>
        <p className="text-red-500">{error || t("member.not.found")}</p>
        <Button onClick={handleBackToList}>{t("back.to.members")}</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("member.profile")}</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleBackToList}>{t("back.to.members")}</Button>
          <Button onClick={handleEditMember}>{t("edit.member")}</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4 p-6 border rounded-lg">
          <div className="flex justify-center mb-4">
            {memberData.image?.secure_url ? (
              <div className="w-48 h-48 rounded-full overflow-hidden">
                <img 
                  src={memberData.image.secure_url} 
                  alt={memberData.name[language]} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No Image</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t("name")} ({language === 'ar' ? 'AR' : 'EN'})</h3>
              <p className="text-lg font-semibold">{memberData.name[language]}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t("position")} ({language === 'ar' ? 'AR' : 'EN'})</h3>
              <p className="text-lg">{memberData.position[language]}</p>
            </div>
            
            {memberData.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t("description")} ({language === 'ar' ? 'AR' : 'EN'})</h3>
                <p className="text-md">{memberData.description[language]}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-4 p-6 border rounded-lg">
          <h2 className="text-xl font-bold">{t("other.language")}</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t("name")} ({language === 'ar' ? 'EN' : 'AR'})</h3>
              <p className="text-lg font-semibold">{memberData.name[language === 'ar' ? 'en' : 'ar']}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t("position")} ({language === 'ar' ? 'EN' : 'AR'})</h3>
              <p className="text-lg">{memberData.position[language === 'ar' ? 'en' : 'ar']}</p>
            </div>
            
            {memberData.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t("description")} ({language === 'ar' ? 'EN' : 'AR'})</h3>
                <p className="text-md">{memberData.description[language === 'ar' ? 'en' : 'ar']}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 