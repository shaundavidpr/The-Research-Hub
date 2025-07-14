import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation context
    const messages = [
      {
        role: "system" as const,
        content: `You are Aethon, an advanced AI research assistant specialized in academic research. You help researchers with:

- Literature reviews and systematic searches
- Research methodology design and recommendations
- Data analysis guidance and statistical advice
- Academic writing and paper structure
- Citation management and formatting
- Grant proposal writing
- Research project planning and timeline management
- Collaboration and networking advice

Provide detailed, actionable advice tailored to academic research. Always be helpful, accurate, and cite relevant methodologies or best practices when appropriate. Format your responses clearly with bullet points, numbered lists, or sections when helpful.

When providing suggestions, offer 3-5 specific, actionable recommendations.
When discussing methodology, explain the rationale behind your recommendations.
Always consider ethical implications and best practices in research.`,
      },
      ...(conversation_history || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ]

    // Generate AI response
    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages,
      maxTokens: 1000,
      temperature: 0.7,
    })

    // Generate contextual suggestions based on the response
    const suggestions = generateSuggestions(message, text)

    // Generate action items if applicable
    const actionItems = generateActionItems(message, text)

    return NextResponse.json({
      response: text,
      suggestions,
      action_items: actionItems,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response. Please try again.",
      },
      { status: 500 },
    )
  }
}

function generateSuggestions(message: string, response: string): string[] {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("literature") || lowerMessage.includes("review")) {
    return [
      "Create a systematic search strategy",
      "Set up citation alerts",
      "Organize papers by themes",
      "Identify research gaps",
    ]
  }

  if (lowerMessage.includes("methodology") || lowerMessage.includes("method")) {
    return [
      "Design data collection instruments",
      "Plan ethical approval process",
      "Create research timeline",
      "Identify potential limitations",
    ]
  }

  if (lowerMessage.includes("data") || lowerMessage.includes("analysis")) {
    return [
      "Choose appropriate statistical tests",
      "Plan data visualization",
      "Consider sample size requirements",
      "Prepare analysis protocol",
    ]
  }

  if (lowerMessage.includes("writing") || lowerMessage.includes("paper")) {
    return ["Create paper outline", "Set writing schedule", "Identify target journals", "Plan peer review process"]
  }

  return [
    "Explore related research areas",
    "Connect with other researchers",
    "Plan next research steps",
    "Consider collaboration opportunities",
  ]
}

function generateActionItems(
  message: string,
  response: string,
): Array<{ task: string; priority: string; estimated_time: string }> {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("literature") || lowerMessage.includes("review")) {
    return [
      {
        task: "Define search keywords and databases",
        priority: "high",
        estimated_time: "2-3 hours",
      },
      {
        task: "Set up reference management system",
        priority: "medium",
        estimated_time: "1 hour",
      },
    ]
  }

  if (lowerMessage.includes("methodology")) {
    return [
      {
        task: "Draft methodology section",
        priority: "high",
        estimated_time: "4-6 hours",
      },
      {
        task: "Prepare ethics application",
        priority: "high",
        estimated_time: "3-4 hours",
      },
    ]
  }

  if (lowerMessage.includes("data") || lowerMessage.includes("analysis")) {
    return [
      {
        task: "Prepare data analysis plan",
        priority: "high",
        estimated_time: "2-3 hours",
      },
      {
        task: "Set up analysis software",
        priority: "medium",
        estimated_time: "1-2 hours",
      },
    ]
  }

  return []
}
