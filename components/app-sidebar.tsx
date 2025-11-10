"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Code, FileText, Settings, LogOut, Menu, X, Layers } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppSidebar() {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Code },
    { label: "Snippets", href: "/dashboard/snippets", icon: FileText },
    { label: "Templates", href: "/dashboard/templates", icon: Layers },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-accent rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-xl font-bold mb-8 text-sidebar-foreground hover:opacity-80 transition-opacity"
          >
            Snippet Gen
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground hover:text-sidebar-accent-foreground">
                  <Icon size={20} />
                  <span>{label}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-sidebar-border pt-4 space-y-4">
            <div className="flex items-center justify-between px-4">
              <ThemeToggle />
            </div>
            {user && (
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.email}</p>
              </div>
            )}
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <LogOut size={20} />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
