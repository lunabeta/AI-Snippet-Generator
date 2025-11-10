"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy, Check, RotateCcw, Download } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { CodeBlock } from "@/components/code-block"
import { toast } from "sonner"

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
  "php",
  "laravel",
]

const COMPLEXITY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

export default function GeneratePage() {
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [complexity, setComplexity] = useState("intermediate")
  const [context, setContext] = useState("")
  const [constraints, setConstraints] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [lastGenerationParams, setLastGenerationParams] = useState<{
    description: string
    language: string
    complexity: string
    context: string
    constraints: string
  } | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please describe what you need")
      return
    }

    setIsLoading(true)
    setGeneratedCode("")

    const params = {
      description,
      language,
      complexity,
      context,
      constraints,
    }

    try {
      const response = await fetch("/api/generate-snippet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate snippet")
      }

      const data = await response.json()
      setGeneratedCode(data.code)
      setTitle(description.substring(0, 60))
      setLastGenerationParams(params)
      toast.success("Snippet generated successfully!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!lastGenerationParams) {
      toast.error("No previous generation to regenerate")
      return
    }

    setDescription(lastGenerationParams.description)
    setLanguage(lastGenerationParams.language)
    setComplexity(lastGenerationParams.complexity)
    setContext(lastGenerationParams.context)
    setConstraints(lastGenerationParams.constraints)

    setIsLoading(true)
    setGeneratedCode("")

    try {
      const response = await fetch("/api/generate-snippet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastGenerationParams),
      })

      if (!response.ok) {
        throw new Error("Failed to regenerate snippet")
      }

      const data = await response.json()
      setGeneratedCode(data.code)
      toast.success("Snippet regenerated!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!generatedCode || !title) {
      toast.error("Please generate code and provide a title")
      return
    }

    setIsSaving(true)

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

      toast.success("Snippet saved successfully!")
      router.push("/dashboard/snippets")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save snippet")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy code")
    }
  }

  const handleExport = (format: "txt" | "json") => {
    if (!generatedCode || !title) {
      toast.error("No code to export")
      return
    }

    let content = ""
    let filename = ""
    let mimeType = ""

    if (format === "txt") {
      content = generatedCode
      filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`
      mimeType = "text/plain"
    } else {
      content = JSON.stringify(
        {
          title,
          description,
          language,
          code: generatedCode,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          createdAt: new Date().toISOString(),
        },
        null,
        2
      )
      filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`
      mimeType = "application/json"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exported as ${filename}`)
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
              <Label htmlFor="complexity">Complexity Level</Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger id="complexity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPLEXITY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
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

            <div className="space-y-2">
              <Label htmlFor="constraints">Constraints (optional)</Label>
              <Textarea
                id="constraints"
                placeholder="e.g., speed optimization, memory efficient, readable code..."
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleGenerate} disabled={isLoading || !description.trim()} className="flex-1" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Snippet"
              )}
              </Button>
              {lastGenerationParams && (
                <Button onClick={handleRegenerate} disabled={isLoading} variant="outline" size="lg" title="Regenerate">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Code</CardTitle>
              {generatedCode && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
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
                  <Button variant="ghost" size="sm" onClick={() => handleExport("txt")}>
                    <Download className="h-4 w-4 mr-2" />
                    TXT
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleExport("json")}>
                    <Download className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : generatedCode ? (
              <div className="max-h-96 overflow-auto">
                <CodeBlock code={generatedCode} language={language} />
              </div>
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
