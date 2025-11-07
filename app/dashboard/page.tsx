import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Zap, Plus, TrendingUp, Code2, Layers } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch snippets and stats
  const { data: snippets } = await supabase
    .from("snippets")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const { data: templates } = await supabase.from("templates").select("*").eq("user_id", user?.id)

  const publicSnippets = snippets?.filter((s) => s.is_public) || []
  const recentSnippets = snippets?.slice(0, 5) || []

  // Get language distribution
  const languageStats =
    snippets?.reduce(
      (acc, snippet) => {
        acc[snippet.language] = (acc[snippet.language] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here is your snippet overview.</p>
        </div>
        <Link href="/dashboard/generate">
          <Button size="lg" className="gap-2">
            <Zap size={20} />
            Generate Snippet
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code2 size={18} />
              Total Snippets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snippets?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Code snippets saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Layers size={18} />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Reusable templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp size={18} />
              Public Snippets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicSnippets.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Shared with community</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Top Language</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topLanguages.length > 0 ? topLanguages[0][0] : "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">Most used language</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Snippets */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Snippets</CardTitle>
              <CardDescription>Your latest code snippets</CardDescription>
            </div>
            <Link href="/dashboard/snippets">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentSnippets.length > 0 ? (
              <div className="space-y-3">
                {recentSnippets.map((snippet) => (
                  <Link
                    key={snippet.id}
                    href={`/dashboard/snippets/${snippet.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium group-hover:text-accent-foreground">{snippet.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {snippet.language} • {new Date(snippet.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-xs bg-muted px-2 py-1 rounded">{snippet.language}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No snippets yet</p>
                <Link href="/dashboard/generate">
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Create First Snippet
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>Your most used languages</CardDescription>
          </CardHeader>
          <CardContent>
            {topLanguages.length > 0 ? (
              <div className="space-y-4">
                {topLanguages.map(([language, count]) => (
                  <div key={language}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{language}</span>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${(count / Math.max(...topLanguages.map(([, c]) => c))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Create snippets to see language stats</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/generate">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} className="text-primary" />
                Generate Snippet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Use AI to generate new code snippets</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/snippets">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 size={20} className="text-primary" />
                Browse Snippets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Search and manage all your snippets</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/templates">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers size={20} className="text-primary" />
                Create Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Build reusable generation templates</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
