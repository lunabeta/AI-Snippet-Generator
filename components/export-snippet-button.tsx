"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, Code } from "lucide-react"
import { toast } from "sonner"

interface ExportSnippetButtonProps {
  snippet: {
    title: string
    description: string | null
    language: string
    code: string
    tags: string[] | null
    created_at: string
  }
}

export function ExportSnippetButton({ snippet }: ExportSnippetButtonProps) {
  const handleExport = (format: "txt" | "json") => {
    let content = ""
    let filename = ""
    let mimeType = ""

    if (format === "txt") {
      content = snippet.code
      filename = `${snippet.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`
      mimeType = "text/plain"
    } else {
      content = JSON.stringify(
        {
          title: snippet.title,
          description: snippet.description,
          language: snippet.language,
          code: snippet.code,
          tags: snippet.tags || [],
          createdAt: snippet.created_at,
        },
        null,
        2
      )
      filename = `${snippet.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download size={16} className="mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("txt")}>
          <FileText className="mr-2 h-4 w-4" />
          Export as TXT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <Code className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



