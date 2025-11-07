"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "react",
  "vue",
  "sql",
  "html",
  "css",
  "bash",
  "go",
  "rust",
  "java",
  "csharp",
]

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default function EditSnippetPage({ params }: EditPageProps) {
  const [id, setId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [tags, setTags] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadSnippet = async () => {
      const { id: snippetId } = await params
      setId(snippetId)

      const supabase = createClient()
      const { data: snippet } = await supabase.from("snippets").select("*").eq("id", snippetId).single()

      if (!snippet) {
        router.push("/dashboard/snippets")
        return
      }

      setTitle(snippet.title)
      setDescription(snippet.description || "")
      setCode(snippet.code)
      setLanguage(snippet.language)
      setTags(snippet.tags?.join(", ") || "")
      setIsPublic(snippet.is_public)
      setIsLoading(false)
    }

    loadSnippet()
  }, [params, router])

  const handleSave = async () => {
    if (!title || !code) {
      setError("Title and code are required")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const { error: updateError } = await supabase
        .from("snippets")
        .update({
          title,
          description,
          code,
          language,
          tags: tagArray,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (updateError) throw updateError

      router.push(`/dashboard/snippets/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update snippet")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Snippet</h1>
        <p className="text-muted-foreground mt-1">Update your code snippet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="public" className="cursor-pointer">
                Make this snippet public
              </Label>
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button variant="outline" onClick={() => router.push(`/dashboard/snippets/${id}`)} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Code Editor */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={code} onChange={(e) => setCode(e.target.value)} rows={20} className="font-mono text-sm" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
