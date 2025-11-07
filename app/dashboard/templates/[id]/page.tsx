import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Edit2, Zap } from "lucide-react"
import { DeleteTemplateButton } from "@/components/delete-template-button"

interface TemplatePageProps {
  params: Promise<{ id: string }>
}

export default async function TemplateDetailPage({ params }: TemplatePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: template } = await supabase.from("templates").select("*").eq("id", id).single()

  if (!template) {
    redirect("/dashboard/templates")
  }

  if (template.user_id !== user?.id) {
    redirect("/dashboard/templates")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground mt-1">{template.language}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/dashboard/templates/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit2 size={16} className="mr-2" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/generate?templateId=${id}`}>
            <Button size="sm">
              <Zap size={16} className="mr-2" />
              Use Template
            </Button>
          </Link>
          <DeleteTemplateButton templateId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompt Template */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Prompt Template</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono whitespace-pre-wrap">
              <code>{template.prompt_template}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {template.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Language</h3>
              <p className="text-sm text-muted-foreground">{template.language}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Created</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(template.created_at).toLocaleDateString()} at{" "}
                {new Date(template.created_at).toLocaleTimeString()}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Updated</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(template.updated_at).toLocaleDateString()} at{" "}
                {new Date(template.updated_at).toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
