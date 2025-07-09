import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_history, attached_files } = await request.json()

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
        attached_files: attached_files || [],
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
      file_analysis: data.file_analysis || null,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Fallback response if Python backend is not available
    const hasFiles = attached_files && attached_files.length > 0
    const fileContext = hasFiles ? 
      `\n\nI can see you've attached ${attached_files.length} file${attached_files.length > 1 ? 's' : ''}. ` +
      `Once the Python backend is running, I'll be able to analyze these files and provide detailed insights.` : ''
    
    return NextResponse.json(
      {
        response:
          "I'm currently experiencing technical difficulties. Please ensure the Python backend is running and try again. You can start the Python server by running: python scripts/chatbot_server.py" + fileContext,
        suggestions: [
          "Check if Python backend is running",
          "Verify OPENAI_API_KEY is set",
          "Ensure all dependencies are installed",
          ...(hasFiles ? ["Upload files when backend is ready"] : []),
        ],
        action_items: [
          {
            task: "Start Python backend server",
            priority: "high",
            estimated_time: "2 minutes",
          },
          ...(hasFiles ? [{
            task: "Re-upload files for analysis",
            priority: "medium", 
            estimated_time: "1 minute",
          }] : []),
        ],
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
