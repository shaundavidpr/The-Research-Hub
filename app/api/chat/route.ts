import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: `You are Aethon, an advanced AI research assistant. You help researchers with literature reviews, methodology design, data analysis, and academic writing. 

User question: ${message}

Provide a helpful, detailed response that assists with their research needs. Be professional, accurate, and cite relevant methodologies or approaches when appropriate.`,
    })

    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error("OpenAI API error:", error)

    if (error?.status === 401) {
      return NextResponse.json({ error: "Invalid OpenAI API key" }, { status: 401 })
    }

    if (error?.status === 429) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    if (error?.status === 402) {
      return NextResponse.json({ error: "OpenAI quota exceeded. Please check your billing." }, { status: 402 })
    }

    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}
