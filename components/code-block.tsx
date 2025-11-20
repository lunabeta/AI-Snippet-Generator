"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

const languageMap: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  react: "jsx",
  vue: "javascript",
  sql: "sql",
  html: "html",
  css: "css",
  bash: "bash",
  shell: "bash",
  go: "go",
  rust: "rust",
  java: "java",
  csharp: "csharp",
  php: "php",
  laravel: "php",
}

export function CodeBlock({ code, language = "javascript", className = "" }: CodeBlockProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const mappedLanguage = languageMap[language.toLowerCase()] || language.toLowerCase()

  return (
    <div className={`rounded-lg overflow-hidden border ${className}`}>
      <SyntaxHighlighter
        language={mappedLanguage}
        style={isDark ? vscDarkPlus : vs}
        customStyle={{
          margin: 0,
          padding: "1rem",
          backgroundColor: "transparent",
          fontSize: "0.875rem",
        }}
        wrapLines
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}





