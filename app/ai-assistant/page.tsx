"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Sparkles, FileSearch, BookOpen, Lightbulb, Clock } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { useChat } from "@/hooks/use-chat"

export default function AIAssistantPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span>ResearchAssist</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/notes" className="text-sm font-medium">
              Notes
            </Link>
            <Link href="/files" className="text-sm font-medium">
              Files
            </Link>
            <Link href="/calendar" className="text-sm font-medium">
              Calendar
            </Link>
            <Link href="/ai-assistant" className="text-sm font-medium text-primary">
              AI Assistant
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">AI Research Assistant</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold mb-3">AI Capabilities</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FileSearch className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Research Analysis</h3>
                      <p className="text-sm text-muted-foreground">Analyze papers and extract key insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Literature Review</h3>
                      <p className="text-sm text-muted-foreground">Summarize and connect research papers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Idea Generation</h3>
                      <p className="text-sm text-muted-foreground">Generate research questions and hypotheses</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold mb-3">Suggested Prompts</h2>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => {
                      handleInputChange({
                        target: { value: "Summarize the key findings from my latest uploaded papers" },
                      } as any)
                    }}
                  >
                    Summarize the key findings from my latest uploaded papers
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => {
                      handleInputChange({
                        target: { value: "Generate a literature review outline for my research topic" },
                      } as any)
                    }}
                  >
                    Generate a literature review outline for my research topic
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => {
                      handleInputChange({
                        target: { value: "Suggest research questions based on gaps in the current literature" },
                      } as any)
                    }}
                  >
                    Suggest research questions based on gaps in the current literature
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="chat">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Clock className="mr-2 h-4 w-4" />
                  Chat History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="mt-0">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="flex flex-col h-[600px]">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                          <div className="flex h-full items-center justify-center">
                            <div className="text-center space-y-3">
                              <Sparkles className="h-12 w-12 text-primary mx-auto" />
                              <h3 className="font-medium text-lg">How can I help with your research today?</h3>
                              <p className="text-muted-foreground max-w-md">
                                Ask me to analyze papers, generate research questions, summarize findings, or help
                                organize your research.
                              </p>
                            </div>
                          </div>
                        ) : (
                          messages.map((message, index) => <ChatMessage key={index} message={message} />)
                        )}
                      </div>

                      <div className="border-t p-4">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                          <Input
                            placeholder="Ask a research question..."
                            value={input}
                            onChange={handleInputChange}
                            className="flex-1"
                          />
                          <Button type="submit" disabled={isLoading}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-4">Recent Conversations</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                        <div>
                          <p className="font-medium">Literature Review Analysis</p>
                          <p className="text-sm text-muted-foreground">Yesterday at 2:34 PM</p>
                        </div>
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                        <div>
                          <p className="font-medium">Research Question Brainstorming</p>
                          <p className="text-sm text-muted-foreground">May 15, 2025</p>
                        </div>
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                        <div>
                          <p className="font-medium">Methodology Discussion</p>
                          <p className="text-sm text-muted-foreground">May 10, 2025</p>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
