"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function NewTemplatePage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [promptTemplate, setPromptTemplate] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSave = async () => {
    if (!name || !promptTemplate) {
      setError("Name and prompt template are required")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error: saveError } = await supabase.from("templates").insert({
        user_id: user.id,
        name,
        description,
        language,
        prompt_template: promptTemplate,
      })

      if (saveError) throw saveError

      router.push("/dashboard/templates")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create template")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Template</h1>
        <p className="text-muted-foreground mt-1">Create a reusable template for generating snippets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
            <CardDescription>Define your template configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="E.g., React Functional Component"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this template is for..."
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
                    Creating...
                  </>
                ) : (
                  "Create Template"
                )}
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard/templates")} disabled={isSaving}>
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
              <p className="pt-2">Example:</p>
              <code className="block bg-muted p-2 rounded text-xs">
                Generate a {"{{language}}"} function for: {"{{description}}"}
              </code>
            </CardContent>
          </Card>

          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle>Prompt Template</CardTitle>
              <CardDescription>Define the AI prompt structure</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                placeholder={
                  "Generate a {{language}} solution for: {{description}}\n\nContext: {{context}}\n\nRequirements:\n- Clean and well-commented code\n- Follow best practices\n- Production-ready"
                }
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
