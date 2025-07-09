"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Send,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  CheckSquare,
  Clock,
  AlertTriangle,
  Sparkles,
  BookOpen,
  FileText,
  BarChart3,
  PenTool,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
  suggestions?: string[]
  action_items?: ActionItem[]
}

interface ActionItem {
  task: string
  priority: "high" | "medium" | "low"
  estimated_time: string
}

const quickPrompts = [
  {
    icon: BookOpen,
    title: "Literature Review",
    prompt:
      "Help me design a systematic literature review for my research topic. What are the key steps and best practices?",
    category: "Research Planning",
  },
  {
    icon: BarChart3,
    title: "Research Methodology",
    prompt:
      "I need guidance on choosing the right research methodology for my study. Can you help me compare quantitative vs qualitative approaches?",
    category: "Methodology",
  },
  {
    icon: FileText,
    title: "Data Analysis",
    prompt:
      "What statistical tests should I use for my research data? Help me understand the appropriate analysis methods.",
    category: "Analysis",
  },
  {
    icon: PenTool,
    title: "Academic Writing",
    prompt:
      "I'm writing my first research paper. Can you guide me through the structure and best practices for academic writing?",
    category: "Writing",
  },
]

export default function AethonPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      content: `Hello! I'm Aethon, your AI research assistant powered by advanced Python algorithms. I'm here to help you with:

• **Literature Reviews** - Systematic search strategies and source evaluation
• **Research Methodology** - Quantitative, qualitative, and mixed methods guidance  
• **Data Analysis** - Statistical tests, software recommendations, and interpretation
• **Academic Writing** - Paper structure, citation styles, and publication strategies
• **Grant Proposals** - Funding applications and research planning

How can I assist with your research today?`,
      role: "assistant",
      timestamp: new Date().toISOString(),
      suggestions: ["Start a literature review", "Choose research methodology", "Plan data analysis strategy"],
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input.trim()
    if (!messageToSend || isLoading) return

    setError(null)
    setInput("")
    setIsLoading(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      role: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          conversation_history: conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Add assistant message with enhanced features
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: data.timestamp || new Date().toISOString(),
        suggestions: data.suggestions || [],
        action_items: data.action_items || [],
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error calling AI:", error)
      setError("Failed to get AI response. Please ensure the Python backend is running.")

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm experiencing technical difficulties. Please ensure the Python backend server is running and try again.",
        role: "assistant",
        timestamp: new Date().toISOString(),
        suggestions: ["Check Python backend status", "Verify API configuration", "Try again in a moment"],
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    handleSendMessage(prompt)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    })
  }

  const handleFeedback = (messageId: string, type: "like" | "dislike") => {
    toast({
      title: `Feedback recorded`,
      description: `Thank you for your ${type === "like" ? "positive" : "constructive"} feedback!`,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Aethon AI Assistant</h1>
              <p className="text-muted-foreground">Advanced Python-powered research guidance</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Python Enhanced
          </Badge>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Prompts Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Start</CardTitle>
                <CardDescription>Common research assistance prompts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-3 text-left bg-transparent"
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                  >
                    <div className="flex items-start gap-3">
                      <prompt.icon className="h-4 w-4 mt-0.5 text-primary" />
                      <div>
                        <div className="font-medium text-sm">{prompt.title}</div>
                        <div className="text-xs text-muted-foreground">{prompt.category}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Research Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Research Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded text-blue-800">💡 Start with a clear research question</div>
                <div className="p-2 bg-green-50 rounded text-green-800">📚 Use systematic literature search</div>
                <div className="p-2 bg-purple-50 rounded text-purple-800">📊 Choose appropriate methodology</div>
                <div className="p-2 bg-orange-50 rounded text-orange-800">✍️ Follow academic writing standards</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Research Assistant Chat
                  </CardTitle>
                  {error && (
                    <Alert className="max-w-md">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-3">
                        <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                          {message.role === "assistant" && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                            <div
                              className={`rounded-lg p-4 ${
                                message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                              }`}
                            >
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                              {message.role === "assistant" && (
                                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(message.content)}>
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleFeedback(message.id, "like")}>
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFeedback(message.id, "dislike")}
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Suggestions */}
                            {message.suggestions && message.suggestions.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                  <Lightbulb className="h-3 w-3" />
                                  Suggestions
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {message.suggestions.map((suggestion, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7 bg-transparent"
                                      onClick={() => handleQuickPrompt(suggestion)}
                                    >
                                      {suggestion}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Items */}
                            {message.action_items && message.action_items.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                  <CheckSquare className="h-3 w-3" />
                                  Action Items
                                </div>
                                <div className="space-y-2">
                                  {message.action_items.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 bg-background border rounded-lg"
                                    >
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">{item.task}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${getPriorityColor(item.priority)}`}
                                          >
                                            {item.priority}
                                          </Badge>
                                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {item.estimated_time}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {message.role === "user" && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-sm text-muted-foreground">Aethon is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Input Area */}
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me about research methodology, literature reviews, data analysis..."
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button onClick={() => handleSendMessage()} disabled={isLoading || !input.trim()} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Powered by Python AI • Press Enter to send • Shift+Enter for new line
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
