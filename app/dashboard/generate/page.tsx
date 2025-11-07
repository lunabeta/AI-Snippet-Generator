"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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

export default function GeneratePage() {
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [context, setContext] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please describe what you need")
      return
    }

    setIsLoading(true)
    setError(null)
    setGeneratedCode("")

    try {
      const response = await fetch("/api/generate-snippet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          language,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate snippet")
      }

      const data = await response.json()
      setGeneratedCode(data.code)
      setTitle(description.substring(0, 60))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!generatedCode || !title) {
      setError("Please generate code and provide a title")
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

      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const { error: saveError } = await supabase.from("snippets").insert({
        user_id: user.id,
        title,
        description,
        code: generatedCode,
        language,
        tags: tagArray,
        is_public: isPublic,
      })

      if (saveError) throw saveError

      router.push("/dashboard/snippets")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save snippet")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Snippet</h1>
        <p className="text-muted-foreground mt-1">Describe what you need and AI will generate the code for you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Describe your needs and select the language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">What do you need?</Label>
              <Textarea
                id="description"
                placeholder="E.g., A function that validates email addresses using regex"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
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
              <Label htmlFor="context">Context (optional)</Label>
              <Textarea
                id="context"
                placeholder="Any additional requirements or context..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

            <Button onClick={handleGenerate} disabled={isLoading || !description.trim()} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Snippet"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
            {generatedCode && (
              <Button variant="ghost" size="sm" onClick={handleCopy} className="ml-auto">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
                <code>{generatedCode}</code>
              </pre>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Generated code will appear here
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Section */}
        {generatedCode && (
          <Card>
            <CardHeader>
              <CardTitle>Save Snippet</CardTitle>
              <CardDescription>Add details before saving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Give your snippet a title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., validation, utils, regex"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
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

              <Button onClick={handleSave} disabled={isSaving || !generatedCode || !title} className="w-full" size="lg">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Snippet"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
