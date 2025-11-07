"use client"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function TemplatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-1">Manage your reusable code templates</p>
        </div>
        <Link href="/dashboard/templates/new">
          <Button>
            <Plus size={20} className="mr-2" />
            New Template
          </Button>
        </Link>
      </div>

      {templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                window.location.href = `/dashboard/templates/${template.id}`
              }}
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{template.language}</p>
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  {new Date(template.created_at).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No templates created yet</p>
          <Link href="/dashboard/templates/new">
            <Button>
              <Plus size={20} className="mr-2" />
              Create First Template
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
