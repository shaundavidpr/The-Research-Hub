"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Sparkles, FileSearch, BookOpen, Lightbulb, Clock } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AethonMessage } from "@/components/aethon-message"
import { useAethon } from "@/hooks/use-aethon"

export default function AethonPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useAethon()
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Aethon AI Research Assistant"
        text="Your intelligent research companion powered by advanced AI."
        icon={<Sparkles className="h-5 w-5 text-primary" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3">Aethon Capabilities</h2>
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
                          <div className="text-center space-y-3">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mx-auto">
                              <Sparkles className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="font-medium text-lg">I'm Aethon, your research assistant</h3>
                            <p className="text-muted-foreground max-w-md">
                              Ask me to analyze papers, generate research questions, summarize findings, or help
                              organize your research.
                            </p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message, index) => <AethonMessage key={index} message={message} />)
                      )}
                    </div>

                    <div className="border-t p-4">
                      <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                          placeholder="Ask Aethon a research question..."
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
