import type { NextRequest } from "next/server"
import { streamText, convertToCoreMessages } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 })
    }

    const coreMessages = convertToCoreMessages(messages)

    const result = streamText({
      model: openai("gpt-4o"),
      system: `You are Aethon, an advanced AI research assistant for The Research Hub platform. You help researchers with:

1. Research methodology and design
2. Literature reviews and analysis
3. Data interpretation and statistical analysis
4. Writing assistance for papers and grants
5. Citation formatting and reference management
6. Collaboration suggestions and networking
7. Research project planning and organization

Guidelines:
- Be helpful, accurate, and professional
- Provide specific, actionable advice
- Ask clarifying questions when needed
- Suggest relevant resources and tools
- Maintain academic integrity standards
- Be encouraging and supportive
- Use clear, accessible language
- Provide structured responses when appropriate

Always aim to enhance the researcher's work while maintaining the highest standards of academic excellence.`,
      messages: coreMessages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
