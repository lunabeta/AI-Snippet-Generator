import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const language = searchParams.get("language")
    const tags = searchParams.get("tags")
    const sort = searchParams.get("sort") || "recent"

    let snippetsQuery = supabase.from("snippets").select("*").eq("user_id", user.id)

    if (query && query.trim()) {
      snippetsQuery = snippetsQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,code.ilike.%${query}%`)
    }

    if (language && language !== "all") {
      snippetsQuery = snippetsQuery.eq("language", language)
    }

    if (sort === "recent") {
      snippetsQuery = snippetsQuery.order("created_at", { ascending: false })
    } else if (sort === "oldest") {
      snippetsQuery = snippetsQuery.order("created_at", { ascending: true })
    } else if (sort === "modified") {
      snippetsQuery = snippetsQuery.order("updated_at", { ascending: false })
    }

    const { data: snippets, error } = await snippetsQuery

    if (error) throw error

    // Filter by tags if provided
    let filtered = snippets
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim().toLowerCase())
      filtered = snippets.filter((snippet) =>
        tagArray.some((tag) => snippet.tags?.some((t) => t.toLowerCase().includes(tag))),
      )
    }

    return Response.json({ snippets: filtered })
  } catch (error) {
    console.error("Search error:", error)
    return Response.json({ error: "Failed to search snippets" }, { status: 500 })
  }
}
