"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Plus, Search } from "lucide-react"

const LANGUAGES = [
  "all",
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

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "modified", label: "Recently Modified" },
]

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedSort, setSelectedSort] = useState("recent")
  const [tags, setTags] = useState("")

  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append("q", searchQuery)
        params.append("language", selectedLanguage)
        params.append("sort", selectedSort)
        if (tags) params.append("tags", tags)

        const response = await fetch(`/api/search-snippets?${params}`)
        const data = await response.json()

        if (data.snippets) {
          setSnippets(data.snippets)
        }
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(performSearch, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedLanguage, selectedSort, tags])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Snippets</h1>
          <p className="text-muted-foreground mt-1">Search and manage all your code snippets</p>
        </div>
        <Link href="/dashboard/generate">
          <Button>
            <Plus size={20} className="mr-2" />
            New Snippet
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
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

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input placeholder="Filter by tags..." value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      ) : snippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snippets.map((snippet) => (
            <Card
              key={snippet.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                window.location.href = `/dashboard/snippets/${snippet.id}`
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-balance">{snippet.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{snippet.language}</p>
                  </div>
                </div>
                {snippet.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{snippet.description}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  {snippet.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {snippet.tags?.length > 3 && (
                    <span className="text-xs text-muted-foreground px-2 py-1">+{snippet.tags.length - 3} more</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{new Date(snippet.created_at).toLocaleDateString()}</div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No snippets found</p>
          <Link href="/dashboard/generate">
            <Button>
              <Plus size={20} className="mr-2" />
              Create First Snippet
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
