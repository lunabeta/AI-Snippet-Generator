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

    const { description, language, context } = await request.json()

    if (!description || !language) {
      return Response.json({ error: "Missing description or language" }, { status: 400 })
    }

    const prompt = `Generate a ${language} code snippet based on the following request:

Description: ${description}
${context ? `Context/Notes: ${context}` : ""}

Requirements:
- Write clean, well-commented code
- Follow best practices for ${language}
- Include error handling where appropriate
- Make the code production-ready
- Add meaningful comments explaining key parts

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
