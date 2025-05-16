"use client"

import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>
        <ProfileForm />
      </div>
    </div>
  )
}
