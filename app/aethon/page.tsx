"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Send,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BookOpen,
  Search,
  BarChart3,
  FileText,
  Lightbulb,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "aethon"
  timestamp: Date
  liked?: boolean
  disliked?: boolean
}

const quickPrompts = [
  {
    icon: BookOpen,
    title: "Literature Review",
    prompt: "Help me conduct a systematic literature review on machine learning applications in healthcare",
  },
  {
    icon: Search,
    title: "Research Methodology",
    prompt: "What research methodology should I use for studying user behavior in mobile apps?",
  },
  {
    icon: BarChart3,
    title: "Data Analysis",
    prompt: "How should I analyze survey data with 500+ responses using statistical methods?",
  },
  {
    icon: FileText,
    title: "Academic Writing",
    prompt: "Help me structure the introduction section of my research paper",
  },
  {
    icon: Lightbulb,
    title: "Research Ideas",
    prompt: "Suggest innovative research topics in artificial intelligence and ethics",
  },
]

export default function AethonPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm Aethon, your AI research assistant. I'm here to help you with literature reviews, research methodology, data analysis, academic writing, and more. How can I assist you with your research today?",
      sender: "aethon",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const callOpenAI = async (message: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get AI response")
      }

      const data = await response.json()
      return data.response
    } catch (error: any) {
      console.error("API call failed:", error)
      throw error
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const aiResponse = await callOpenAI(inputMessage)

      const aethonMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "aethon",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aethonMessage])
    } catch (error: any) {
      console.error("Error getting AI response:", error)

      let errorMessage = "I apologize, but I'm having trouble connecting right now. Please try again in a moment."

      if (error.message.includes("API key")) {
        errorMessage = "There's an issue with the API configuration. Please contact support."
      } else if (error.message.includes("rate limit")) {
        errorMessage = "I'm receiving too many requests right now. Please wait a moment and try again."
      } else if (error.message.includes("quota")) {
        errorMessage = "The service is temporarily unavailable due to usage limits. Please try again later."
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: "aethon",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorResponse])
      toast.error("Failed to get AI response")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Message copied to clipboard")
  }

  const likeMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, liked: !msg.liked, disliked: false } : msg)),
    )
    toast.success("Feedback recorded")
  }

  const dislikeMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, disliked: !msg.disliked, liked: false } : msg)),
    )
    toast.success("Feedback recorded")
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Aethon AI Assistant</h1>
            <p className="text-muted-foreground">Your intelligent research companion</p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Quick Start Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPrompts.map((prompt, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQuickPrompt(prompt.prompt)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <prompt.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{prompt.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{prompt.prompt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Research Assistant Chat</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <Avatar className="h-8 w-8">
                      {message.sender === "user" ? (
                        <>
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/placeholder-logo.png" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                            <Bot className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    <div
                      className={`rounded-lg p-3 ${message.sender === "user" ? "bg-blue-600 text-white" : "bg-muted"}`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>

                      {message.sender === "aethon" && (
                        <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-muted-foreground/20">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 px-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => likeMessage(message.id)}
                            className={`h-6 px-2 ${message.liked ? "text-green-600" : ""}`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dislikeMessage(message.id)}
                            className={`h-6 px-2 ${message.disliked ? "text-red-600" : ""}`}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                        <Bot className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about your research..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} className="px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
