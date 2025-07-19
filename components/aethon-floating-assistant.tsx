"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Send,
  Minimize2,
  Maximize2,
  X,
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
  Users,
  Calendar,
  Search,
  Zap,
  MessageSquare,
  Bot,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"

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
    prompt: "Help me design a systematic literature review for my research topic. What are the key steps and best practices?",
    category: "Research Planning",
  },
  {
    icon: BarChart3,
    title: "Research Methodology",
    prompt: "I need guidance on choosing the right research methodology for my study. Can you help me compare quantitative vs qualitative approaches?",
    category: "Methodology",
  },
  {
    icon: FileText,
    title: "Data Analysis",
    prompt: "What statistical tests should I use for my research data? Help me understand the appropriate analysis methods.",
    category: "Analysis",
  },
  {
    icon: PenTool,
    title: "Academic Writing",
    prompt: "I'm writing my first research paper. Can you guide me through the structure and best practices for academic writing?",
    category: "Writing",
  },
  {
    icon: Users,
    title: "Find Collaborators",
    prompt: "How can I find and connect with researchers in my field for potential collaborations?",
    category: "Networking",
  },
  {
    icon: Calendar,
    title: "Project Planning",
    prompt: "Help me create a realistic timeline for my research project with key milestones and deadlines.",
    category: "Planning",
  },
]

export function AethonFloatingAssistant() {
  const { toast } = useToast()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Add welcome message when first opened
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: `Hello${user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}! I'm Aethon, your AI research assistant. I'm here to help you with:

• **Literature Reviews** - Systematic search strategies and source evaluation
• **Research Methodology** - Quantitative, qualitative, and mixed methods guidance  
• **Data Analysis** - Statistical tests, software recommendations, and interpretation
• **Academic Writing** - Paper structure, citation styles, and publication strategies
• **Project Management** - Timeline creation, milestone tracking, and collaboration
• **Citation Management** - Reference formatting and bibliography generation

How can I assist with your research today?`,
        role: "assistant",
        timestamp: new Date().toISOString(),
        suggestions: ["Start a literature review", "Choose research methodology", "Plan data analysis strategy"],
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, user])

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
          messages: [...conversationHistory, { role: "user", content: messageToSend }],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let receivedText = ""

      // Add a placeholder for the assistant's response
      const assistantPlaceholder: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantPlaceholder])

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        receivedText += chunk

        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === assistantPlaceholder.id ? { ...msg, content: receivedText } : msg)),
        )
      }

      // Generate suggestions and action items based on the response
      const suggestions = generateSuggestions(messageToSend, receivedText)
      const actionItems = generateActionItems(messageToSend, receivedText)

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantPlaceholder.id
            ? {
                ...msg,
                content: receivedText,
                suggestions,
                action_items: actionItems,
              }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error calling AI:", error)
      setError("Failed to get AI response. Please try again.")

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing technical difficulties. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date().toISOString(),
        suggestions: ["Try again", "Check connection", "Contact support"],
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateSuggestions = (userMessage: string, aiResponse: string): string[] => {
    const suggestions = []
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("literature") || lowerMessage.includes("review")) {
      suggestions.push("Create literature review outline", "Find relevant databases", "Set up search alerts")
    }
    if (lowerMessage.includes("methodology") || lowerMessage.includes("method")) {
      suggestions.push("Design research framework", "Choose data collection methods", "Plan ethical approval")
    }
    if (lowerMessage.includes("data") || lowerMessage.includes("analysis")) {
      suggestions.push("Select statistical software", "Plan data visualization", "Design analysis workflow")
    }
    if (lowerMessage.includes("write") || lowerMessage.includes("paper")) {
      suggestions.push("Create paper outline", "Find target journals", "Plan writing schedule")
    }

    return suggestions.slice(0, 3)
  }

  const generateActionItems = (userMessage: string, aiResponse: string): ActionItem[] => {
    const actionItems = []
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("start") || lowerMessage.includes("begin")) {
      actionItems.push({
        task: "Define research question and objectives",
        priority: "high",
        estimated_time: "2-3 hours"
      })
    }
    if (lowerMessage.includes("literature")) {
      actionItems.push({
        task: "Conduct systematic literature search",
        priority: "high",
        estimated_time: "4-6 hours"
      })
    }
    if (lowerMessage.includes("methodology")) {
      actionItems.push({
        task: "Select appropriate research design",
        priority: "medium",
        estimated_time: "2-4 hours"
      })
    }

    return actionItems.slice(0, 2)
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

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Brain className="h-6 w-6" />
          <span className="sr-only">Open Aethon AI Assistant</span>
        </Button>
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[600px]'
      }`}>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Aethon AI</CardTitle>
                <p className="text-sm text-muted-foreground">Research Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Online</span>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Enhanced
            </Badge>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-120px)]">
            {error && (
              <Alert variant="destructive" className="m-4 mb-0">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`max-w-[85%] ${message.role === "user" ? "order-first" : ""}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user" 
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto" 
                              : "bg-muted"
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
                              <Button variant="ghost" size="sm" onClick={() => handleFeedback(message.id, "dislike")}>
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
                                      <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
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
                          <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
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
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">Aethon is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Prompts when no messages */}
                {messages.length === 1 && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">Quick Actions:</div>
                    <div className="grid grid-cols-1 gap-2">
                      {quickPrompts.slice(0, 4).map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start h-auto p-3 text-left bg-transparent"
                          onClick={() => handleQuickPrompt(prompt.prompt)}
                        >
                          <div className="flex items-start gap-3">
                            <prompt.icon className="h-4 w-4 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium text-sm">{prompt.title}</div>
                              <div className="text-xs text-muted-foreground">{prompt.category}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
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
              <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                <span>Powered by Advanced AI • Press Enter to send</span>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}