import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center space-y-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight mb-4">
              Generate Code Snippets with AI
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Create, manage, and organize your code snippets effortlessly using AI-powered generation and smart
              templates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">AI Generation</h3>
              <p className="text-sm text-muted-foreground">
                Describe what you need and let AI generate code snippets instantly.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Custom Templates</h3>
              <p className="text-sm text-muted-foreground">
                Create reusable templates for your most common code patterns.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Smart Search</h3>
              <p className="text-sm text-muted-foreground">
                Find and organize your snippets with powerful search and tagging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
