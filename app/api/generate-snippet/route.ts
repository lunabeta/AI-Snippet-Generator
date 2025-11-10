import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { description, language, context, complexity, constraints } = await request.json()

    if (!description || !language) {
      return Response.json({ error: "Missing description or language" }, { status: 400 })
    }

    const complexityInstructions = {
      beginner: "Use simple, easy-to-understand code. Add detailed comments explaining each step. Avoid advanced concepts.",
      intermediate: "Use standard patterns and best practices. Include moderate comments. Balance simplicity with efficiency.",
      advanced: "Use advanced patterns, optimizations, and modern techniques. Minimal comments needed. Focus on performance and elegance.",
    }

    const prompt = `Generate a ${language} code snippet based on the following request:

Description: ${description}
${context ? `Context/Notes: ${context}` : ""}
${constraints ? `Constraints: ${constraints}` : ""}
Complexity Level: ${complexity || "intermediate"}

Requirements:
- Write clean, well-commented code
- Follow best practices for ${language}
- Include error handling where appropriate
- Make the code production-ready
${complexity ? `- ${complexityInstructions[complexity as keyof typeof complexityInstructions] || complexityInstructions.intermediate}` : ""}
${constraints ? `- Pay special attention to: ${constraints}` : ""}

Return ONLY the code, no explanations or markdown formatting.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return Response.json({
      code: text,
      language,
      description,
    })
  } catch (error) {
    console.error("Generation error:", error)
    return Response.json({ error: "Failed to generate snippet" }, { status: 500 })
  }
}
