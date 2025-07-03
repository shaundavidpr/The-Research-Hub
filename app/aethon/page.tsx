"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Sparkles, FileSearch, BookOpen, Lightbulb, Clock, Brain, Zap } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AethonMessage } from "@/components/aethon-message"
import { useAethon } from "@/hooks/use-aethon"

export default function AethonPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useAethon()
  const [activeTab, setActiveTab] = useState("chat")

  const quickPrompts = [
    "Analyze my research papers and find common themes",
    "Generate a literature review outline for quantum computing",
    "Suggest research questions for machine learning in healthcare",
    "Help me improve my paper's abstract",
    "Create a research methodology for my study",
    "Find potential collaborators in my field"
  ]

  const capabilities = [
    {
      icon: <FileSearch className="h-5 w-5 text-primary" />,
      title: "Literature Analysis",
      description: "Analyze papers, extract insights, and identify research gaps"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Research Writing",
      description: "Help with abstracts, papers, and academic writing"
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-primary" />,
      title: "Idea Generation",
      description: "Generate research questions and hypotheses"
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: "Methodology Design",
      description: "Design research methods and experimental approaches"
    }
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Aethon AI Research Assistant"
        text="Your advanced AI companion for research, analysis, and academic writing."
        icon={<Brain className="h-5 w-5 text-primary" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3 flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Aethon Capabilities
              </h2>
              <div className="space-y-3">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {capability.icon}
                    <div>
                      <h3 className="font-medium text-sm">{capability.title}</h3>
                      <p className="text-xs text-muted-foreground">{capability.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3">Quick Prompts</h2>
              <div className="space-y-2">
                {quickPrompts.slice(0, 3).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3 text-xs"
                    onClick={() => {
                      handleInputChange({
                        target: { value: prompt },
                      } as any)
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chat">
                <Sparkles className="mr-2 h-4 w-4" />
                Aethon Chat
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="mr-2 h-4 w-4" />
                Chat History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-0">
              <Card className="border shadow-sm">
                <CardContent className="p-0">
                  <div className="flex flex-col h-[600px]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center space-y-4 max-w-md">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mx-auto">
                              <Brain className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg">I'm Aethon, your research AI assistant</h3>
                            <p className="text-muted-foreground">
                              I can help you analyze papers, generate research questions, improve your writing, 
                              design methodologies, and much more. What would you like to work on today?
                            </p>
                            <div className="grid grid-cols-1 gap-2 mt-4">
                              {quickPrompts.slice(3, 6).map((prompt, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    handleInputChange({
                                      target: { value: prompt },
                                    } as any)
                                  }}
                                >
                                  {prompt}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        messages.map((message, index) => <AethonMessage key={index} message={message} />)
                      )}
                      {isLoading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Brain className="h-4 w-4 animate-pulse" />
                          <span>Aethon is thinking...</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t p-4">
                      <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                          placeholder="Ask Aethon anything about your research..."
                          value={input}
                          onChange={handleInputChange}
                          className="flex-1"
                          disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
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
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Clock className="h-12 w-12 text-muted-foreground/60 mb-4" />
                    <h3 className="text-lg font-medium">No conversation history yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      Your conversations with Aethon will appear here once you start chatting.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}