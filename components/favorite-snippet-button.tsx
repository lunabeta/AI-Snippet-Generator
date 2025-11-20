"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Star } from "lucide-react"
import { toast } from "sonner"

interface FavoriteSnippetButtonProps {
  snippetId: string
  isFavorite: boolean
  onToggle?: () => void
}

export function FavoriteSnippetButton({ snippetId, isFavorite: initialFavorite, onToggle }: FavoriteSnippetButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("snippets")
        .update({ is_favorite: !isFavorite })
        .eq("id", snippetId)

      if (error) throw error

      setIsFavorite(!isFavorite)
      if (onToggle) onToggle()
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites")
    } catch (error) {
      toast.error("Failed to update favorite status")
      console.error("Favorite toggle error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={isFavorite ? "text-yellow-500 border-yellow-500" : ""}
    >
      <Star size={16} className={`mr-2 ${isFavorite ? "fill-yellow-500" : ""}`} />
      {isFavorite ? "Favorited" : "Favorite"}
    </Button>
  )
}





