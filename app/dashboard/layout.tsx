"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  FlaskConical,
  BookOpen,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  Brain,
  LogOut,
  Search,
  Lightbulb,
  CheckSquare,
  Clock,
  AlertTriangle,
  Sparkles,
  PenTool,
  User,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot } from "lucide-react"
import { useUser } from "@/hooks/use-user" // Assuming a hook to get current user ID

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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile()
  const pathname = usePathname()
  const { toast } = useToast()
  const supabase = createClient()
  const { user } = useUser() // Get current user ID
  const currentUserId = user?.id || "" // Assign user ID to currentUserId

  const [isAethonOpen, setIsAethonOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoadingAethon, setIsLoadingAethon] = useState(false)
  const [aethonError, setAethonError] = useState<string | null>(null)

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      content: `Hello! I'm Aethon, your AI research assistant. I'm here to help you with:

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

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input.trim()
    if (!messageToSend || isLoadingAethon) return

    setAethonError(null)
    setInput("")
    setIsLoadingAethon(true)

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
        content: "", // Will be filled by stream
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

      // After streaming, fetch suggestions and action items
      const finalResponse = await fetch("/api/chat-suggestions", {
        // Assuming a new API route for suggestions
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend, aiResponse: receivedText }),
      }).then((res) => res.json())

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantPlaceholder.id
            ? {
                ...msg,
                content: receivedText,
                suggestions: finalResponse.suggestions || [],
                action_items: finalResponse.action_items || [],
              }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error calling AI:", error)
      setAethonError("Failed to get AI response. Please ensure the Python backend is running.")

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
      setIsLoadingAethon(false)
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Logged out successfully",
        description: "You have been signed out.",
      })
      window.location.href = "/login" // Redirect to login page
    }
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/projects", icon: FlaskConical, label: "Projects" },
    { href: "/notes", icon: FileText, label: "Notes" },
    { href: "/files", icon: BookOpen, label: "Files" },
    { href: "/citations", icon: Search, label: "Citations" },
    { href: "/calendar", icon: Calendar, label: "Calendar" },
    { href: "/collaboration", icon: Users, label: "Collaboration" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-lg">Research Hub</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname === item.href ? "bg-muted text-primary" : ""
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4">
          <Separator className="mb-4" />
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <Brain className="h-6 w-6 text-primary" />
                  <span>Research Hub</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                      pathname === item.href ? "bg-muted text-primary" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-4">
                <Separator className="mb-4" />
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">{/* Search or other header content */}</div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setIsAethonOpen(true)}>
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="sr-only">Open Aethon AI Assistant</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open Aethon AI Assistant</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${currentUserId}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
      </div>

      {/* Aethon AI Assistant Sidebar */}
      <Sheet open={isAethonOpen} onOpenChange={setIsAethonOpen}>
        <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Aethon AI Assistant</h2>
                  <p className="text-sm text-muted-foreground">Advanced research guidance</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAethonOpen(false)}>
                <User className="h-5 w-5" />
                <span className="sr-only">Close Aethon Assistant</span>
              </Button>
            </div>

            {aethonError && (
              <div className="m-4 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {aethonError}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
                              <User className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleFeedback(message.id, "like")}>
                              <User className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleFeedback(message.id, "dislike")}>
                              <User className="h-3 w-3" />
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
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}

              {isLoadingAethon && (
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

            <Separator />

            {/* Input Area */}
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about research methodology, literature reviews, data analysis..."
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={isLoadingAethon}
                  className="flex-1"
                />
                <Button onClick={() => handleSendMessage()} disabled={isLoadingAethon || !input.trim()} size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Powered by Python AI • Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
