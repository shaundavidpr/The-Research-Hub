import type { NextRequest } from "next/server"
import { streamText, convertToCoreMessages } from "ai"
import { openai } from "@ai-sdk/openai"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Get the current user for personalization
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 })
    }

    const coreMessages = convertToCoreMessages(messages)

    // Enhanced system prompt with user context
    const systemPrompt = `You are Aethon, an advanced AI research assistant for The Research Hub platform. You are specifically designed to help researchers with:

1. **Research Methodology & Design**
   - Quantitative, qualitative, and mixed-methods approaches
   - Experimental design and statistical planning
   - Survey design and data collection strategies
   - Ethical considerations and IRB processes

2. **Literature Reviews & Analysis**
   - Systematic literature search strategies
   - Critical analysis and synthesis of research
   - Gap identification and research opportunities
   - Citation management and reference formatting

3. **Data Analysis & Interpretation**
   - Statistical test selection and application
   - Data visualization and presentation
   - Results interpretation and significance testing
   - Software recommendations (R, Python, SPSS, etc.)

4. **Academic Writing & Publishing**
   - Paper structure and organization
   - Grant proposal development
   - Journal selection and submission strategies
   - Peer review processes and responses

5. **Project Management & Collaboration**
   - Research timeline planning and milestone setting
   - Team coordination and communication
   - Resource allocation and budget planning
   - Risk assessment and mitigation

6. **Professional Development**
   - Career guidance for researchers
   - Conference presentation strategies
   - Networking and collaboration opportunities
   - Skill development recommendations

**Guidelines:**
- Provide specific, actionable advice with concrete examples
- Reference current best practices and methodological standards
- Suggest relevant tools, software, and resources
- Ask clarifying questions when context is needed
- Maintain academic rigor while being accessible
- Encourage ethical research practices
- Support evidence-based decision making

**Response Style:**
- Be comprehensive yet concise
- Use structured formatting (bullet points, numbered lists)
- Include practical next steps and recommendations
- Provide multiple perspectives when appropriate
- Reference established frameworks and methodologies

${user ? `**User Context:** You are assisting ${user.user_metadata?.name || 'a researcher'} who is using The Research Hub platform.` : ''}

Always aim to enhance the researcher's capabilities while maintaining the highest standards of academic excellence and integrity.`

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: coreMessages,
      temperature: 0.8,
      maxTokens: 1500,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
    })

    // Log the interaction for analytics (optional)
    if (user) {
      try {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          message: messages[messages.length - 1]?.content || '',
          context: { timestamp: new Date().toISOString() }
        })
      } catch (error) {
        console.error('Failed to log chat interaction:', error)
      }
    }

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(
      JSON.stringify({ 
        error: "I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
