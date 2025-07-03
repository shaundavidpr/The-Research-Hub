import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversation_history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Call Python FastAPI backend
    const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000"

    const response = await fetch(`${pythonApiUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        context,
        conversation_history: conversation_history || [],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Python API error")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("API route error:", error)

    if (error.message.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { error: "Python backend is not running. Please start the Python server." },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: error.message || "Failed to get AI response" }, { status: 500 })
  }
}
