import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_history } = await request.json()

    // Check if Python API URL is configured
    const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000"

    // Call Python backend
    const response = await fetch(`${pythonApiUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversation_history: conversation_history || [],
      }),
    })

    if (!response.ok) {
      throw new Error(`Python API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      response: data.response,
      suggestions: data.suggestions || [],
      action_items: data.action_items || [],
      timestamp: data.timestamp,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Fallback response if Python backend is not available
    return NextResponse.json(
      {
        response:
          "I'm currently experiencing technical difficulties. Please ensure the Python backend is running and try again. You can start the Python server by running: python scripts/chatbot_server.py",
        suggestions: [
          "Check if Python backend is running",
          "Verify OPENAI_API_KEY is set",
          "Ensure all dependencies are installed",
        ],
        action_items: [
          {
            task: "Start Python backend server",
            priority: "high",
            estimated_time: "2 minutes",
          },
        ],
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
