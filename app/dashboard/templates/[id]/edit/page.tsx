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
import { Loader2, Info } from "lucide-react"

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

export default function EditTemplatePage({ params }: EditPageProps) {
  const [id, setId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [promptTemplate, setPromptTemplate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadTemplate = async () => {
      const { id: templateId } = await params
      setId(templateId)

      const supabase = createClient()
      const { data: template } = await supabase.from("templates").select("*").eq("id", templateId).single()

      if (!template) {
        router.push("/dashboard/templates")
        return
      }

      setName(template.name)
      setDescription(template.description || "")
      setLanguage(template.language)
      setPromptTemplate(template.prompt_template)
      setIsLoading(false)
    }

    loadTemplate()
  }, [params, router])

  const handleSave = async () => {
    if (!name || !promptTemplate) {
      setError("Name and prompt template are required")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from("templates")
        .update({
          name,
          description,
          language,
          prompt_template: promptTemplate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (updateError) throw updateError

      router.push(`/dashboard/templates/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update template")
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
        <h1 className="text-3xl font-bold">Edit Template</h1>
        <p className="text-muted-foreground mt-1">Update your template</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
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
              <Button variant="outline" onClick={() => router.push(`/dashboard/templates/${id}`)} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info & Template Editor */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info size={18} />
                Template Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3 text-muted-foreground">
              <p>Use these variables in your prompt template:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <code className="bg-muted px-2 py-1 rounded">{"{{description}}"}</code> - User's description
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded">{"{{context}}"}</code> - Additional context
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded">{"{{language}}"}</code> - Programming language
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle>Prompt Template</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                rows={16}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
