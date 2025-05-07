"use client"

import { useEffect, useState } from "react"
import { MemberForm } from "@/components/member-form"
import { API_URL } from "@/lib/constants"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"

export default function EditMemberPage({ params }) {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { t } = useLanguage()

  // Use useEffect to fetch data client-side only
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`${API_URL}/members/getmemberbyid/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch member")
        }
        const data = await response.json()
        setMember(data)
      } catch (error) {
        console.error("Error fetching member:", error)
        toast({
          title: t("Error"),
          description: t("Failed to load member data"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMember()
  }, [params.id, toast, t])

  // Use a client-side only rendering approach
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{t("Edit Member")}</h1>
      {loading ? (
        <div className="text-center">{t("Loading...")}</div>
      ) : member ? (
        <MemberForm initialData={member} />
      ) : (
        <div className="text-center">{t("Member not found")}</div>
      )}
    </div>
  )
}
