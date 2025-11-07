import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
