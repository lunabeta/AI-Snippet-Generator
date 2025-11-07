"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ShareSnippetButtonProps {
  snippet: any
}

export function ShareSnippetButton({ snippet }: ShareSnippetButtonProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/snippets/${snippet.id}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 size={16} className="mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Snippet</DialogTitle>
          <DialogDescription>
            {snippet.is_public
              ? "This snippet is public. Share the link below."
              : "Make this snippet public to share it with others."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {snippet.is_public ? (
            <div className="flex gap-2">
              <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 rounded-md border bg-muted" />
              <Button onClick={handleCopy} size="sm">
                {copied ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Copied
                  </>
                ) : (
                  "Copy"
                )}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Edit the snippet to make it public before sharing.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
