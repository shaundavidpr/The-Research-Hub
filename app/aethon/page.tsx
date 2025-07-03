"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  Send,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  FileText,
  BarChart3,
  Users,
  Lightbulb,
  Zap,
  AlertCircle,
  Loader2,
  Sparkles,
  Search,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  liked?: boolean
  disliked?: boolean
  suggestions?: string[]
  research_actions?: Array<{
    type: string
    label: string
    priority: string
  }>
}

export default function AethonPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm Aethon, your advanced AI research assistant powered by Python and GPT-4. I specialize in literature reviews, research methodology, data analysis, and academic writing. I can provide more accurate and detailed research guidance than standard AI assistants. What research challenge can I help you with today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "Plan a systematic literature review",
        "Design research methodology",
        "Analyze research data",
        "Structure academic paper",
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    {
      icon: <BookOpen className="h-4 w-4" />,
      title: "Literature Review",
      prompt:
        "I need to conduct a systematic literature review on machine learning applications in healthcare. Can you guide me through the process step by step?",
      category: "Research",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Research Methodology",
      prompt:
        "What research methodology should I use for studying the impact of remote work on employee productivity? I need both quantitative and qualitative approaches.",
      category: "Methods",
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      title: "Data Analysis",
      prompt:
        "I have survey data from 750 participants about social media usage and mental health. What statistical methods should I use to analyze this data?",
      category: "Analysis",
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Academic Writing",
      prompt:
        "Help me structure a research paper on renewable energy adoption. I need guidance on organizing my findings and creating a compelling narrative.",
      category: "Writing",
    },
    {
      icon: <Search className="h-4 w-4" />,
      title: "Research Gaps",
      prompt:
        "How can I identify research gaps in the field of artificial intelligence ethics? What databases and strategies should I use?",
      category: "Discovery",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Grant Proposal",
      prompt:
        "I'm writing a research grant proposal for studying climate change adaptation strategies. Can you help me structure it effectively?",
      category: "Funding",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
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
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Update conversation history
    const newHistory = [...conversationHistory, { role: "user", content: messageToSend }]

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          context: "Advanced research assistant specializing in academic research methodology and analysis",
          conversation_history: newHistory,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      // Add AI response with enhanced features
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        research_actions: data.research_actions || [],
      }

      setMessages((prev) => [...prev, aiMessage])

      // Update conversation history
      setConversationHistory([...newHistory, { role: "assistant", content: data.response }])
    } catch (error: any) {
      console.error("Chat error:", error)
      setError(error.message || "Failed to get AI response")

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I'm having trouble connecting to my Python backend. ${error.message.includes("Python backend") ? "Please make sure the Python server is running on port 8000." : "Please try again in a moment."}`,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
      toast.error("Failed to get AI response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Message copied to clipboard!")
  }

  const handleLikeMessage = (messageId: string, isLike: boolean) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              liked: isLike ? !msg.liked : false,
              disliked: !isLike ? !msg.disliked : false,
            }
          : msg,
      ),
    )
    toast.success(isLike ? "Response liked!" : "Response disliked!")
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Aethon AI</CardTitle>
                  <p className="text-sm text-muted-foreground">Python-Powered Research Assistant</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Python Backend Active</span>
                </div>
                <Badge variant="secondary" className="w-full justify-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Enhanced with Python
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  GPT-4 Powered
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Research Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-3 text-left"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                >
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-0.5">{prompt.icon}</div>
                    <div>
                      <div className="font-medium text-sm">{prompt.title}</div>
                      <div className="text-xs text-muted-foreground">{prompt.category}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[800px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Advanced Research Chat
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Python-enhanced AI for superior research assistance</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{messages.length - 1} messages</Badge>
                  <Badge variant="secondary">Python Backend</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Error Display */}
              {error && (
                <div className="p-4 border-b">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-lg p-4 ${
                          message.isUser ? "bg-blue-600 text-white" : "bg-muted"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                        {/* Suggestions */}
                        {!message.isUser && message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-muted-foreground/20">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Suggested follow-ups:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-xs bg-transparent"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Research Actions */}
                        {!message.isUser && message.research_actions && message.research_actions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Research Actions:</p>
                            <div className="space-y-1">
                              {message.research_actions.map((action, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      action.priority === "high"
                                        ? "bg-red-500"
                                        : action.priority === "medium"
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }`}
                                  ></div>
                                  <span>{action.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {!message.isUser && (
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-muted-foreground/20">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyMessage(message.content)}
                              className="h-6 px-2"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikeMessage(message.id, true)}
                              className={`h-6 px-2 ${message.liked ? "text-green-600" : ""}`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikeMessage(message.id, false)}
                              className={`h-6 px-2 ${message.disliked ? "text-red-600" : ""}`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-4 max-w-[85%]">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-sm text-muted-foreground">
                            Aethon is analyzing your research question...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              {/* Input Area */}
              <div className="p-4">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Aethon about your research methodology, literature review, data analysis..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={() => handleSendMessage()} disabled={!input.trim() || isLoading} size="icon">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Enhanced Python backend provides more accurate research guidance • Press Enter to send
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
