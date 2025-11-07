import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Edit2, Eye, EyeOff } from "lucide-react"
import { DeleteSnippetButton } from "@/components/delete-snippet-button"
import { ShareSnippetButton } from "@/components/share-snippet-button"

interface SnippetPageProps {
  params: Promise<{ id: string }>
}

export default async function SnippetDetailPage({ params }: SnippetPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: snippet } = await supabase.from("snippets").select("*").eq("id", id).single()

  if (!snippet) {
    redirect("/dashboard/snippets")
  }

  // Check ownership
  if (snippet.user_id !== user?.id) {
    redirect("/dashboard/snippets")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{snippet.title}</h1>
          <p className="text-muted-foreground mt-1">{snippet.language}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/dashboard/snippets/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit2 size={16} className="mr-2" />
              Edit
            </Button>
          </Link>
          <ShareSnippetButton snippet={snippet} />
          <DeleteSnippetButton snippetId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Code</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
              <code>{snippet.code}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {snippet.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{snippet.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Language</h3>
              <p className="text-sm text-muted-foreground">{snippet.language}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <div className="flex items-center gap-2">
                {snippet.is_public ? (
                  <>
                    <Eye size={16} className="text-primary" />
                    <span className="text-sm">Public</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={16} className="text-muted-foreground" />
                    <span className="text-sm">Private</span>
                  </>
                )}
              </div>
            </div>

            {snippet.tags && snippet.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {snippet.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Created</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(snippet.created_at).toLocaleDateString()} at{" "}
                {new Date(snippet.created_at).toLocaleTimeString()}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Updated</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(snippet.updated_at).toLocaleDateString()} at{" "}
                {new Date(snippet.updated_at).toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
