import { MemberForm } from "@/components/member-form"

export default function NewMemberPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Member</h1>
      <MemberForm />
    </div>
  )
}
