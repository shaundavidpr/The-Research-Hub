"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  FileText, 
  Lightbulb, 
  Search, 
  Users, 
  BarChart,
  Calendar,
  MessageSquare,
  Sparkles,
  Wand2,
  BookOpen,
  Target,
  Zap,
  Upload,
  Download,
  Share2
} from "lucide-react"
import { aethonAI } from "@/lib/aethon-ai"

interface AethonAssistantProps {
  context?: string
  onSuggestion?: (suggestion: string) => void
}

export function EnhancedAethonAssistant({ context, onSuggestion }: AethonAssistantProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentTask, setCurrentTask] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState<any>(null)

  const contextualSuggestions = {
    notes: [
      "Generate research outline",
      "Suggest related topics", 
      "Create mind map",
      "Find knowledge gaps",
      "Improve note structure",
      "Add citations"
    ],
    files: [
      "Analyze document content",
      "Extract key findings",
      "Generate summary",
      "Find similar papers",
      "Create bibliography",
      "Identify methodology"
    ],
    projects: [
      "Create project timeline",
      "Suggest collaborators",
      "Identify milestones",
      "Risk assessment",
      "Resource planning",
      "Progress tracking"
    ],
    community: [
      "Find relevant researchers",
      "Suggest collaboration topics",
      "Analyze trending papers",
      "Network recommendations",
      "Publication opportunities",
      "Conference suggestions"
    ],
    publish: [
      "Improve abstract",
      "Suggest keywords",
      "Review for clarity",
      "Citation suggestions",
      "Journal recommendations",
      "Formatting check"
    ],
    citations: [
      "Format citations",
      "Find missing references",
      "Check citation style",
      "Generate bibliography",
      "Verify sources",
      "Update references"
    ],
    calendar: [
      "Plan research schedule",
      "Set deadlines",
      "Schedule meetings",
      "Track milestones",
      "Manage priorities",
      "Time allocation"
    ]
  }

  const quickActions = [
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Literature Analysis",
      description: "Analyze papers and extract insights",
      action: "literature_analysis"
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      label: "Research Ideas",
      description: "Generate research questions and hypotheses",
      action: "research_ideas"
    },
    {
      icon: <Search className="h-4 w-4" />,
      label: "Smart Search",
      description: "Find relevant papers and resources",
      action: "smart_search"
    },
    {
      icon: <BarChart className="h-4 w-4" />,
      label: "Data Analysis",
      description: "Analyze and interpret research data",
      action: "data_analysis"
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Find Collaborators",
      description: "Discover potential research partners",
      action: "find_collaborators"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Plan Timeline",
      description: "Create research project timelines",
      action: "plan_timeline"
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Write Paper",
      description: "Get help with academic writing",
      action: "write_paper"
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: "Methodology",
      description: "Design research methodology",
      action: "methodology"
    }
  ]

  const currentSuggestions = context ? contextualSuggestions[context as keyof typeof contextualSuggestions] || [] : []

  const handleQuickAction = async (action: string, label: string) => {
    setCurrentTask(label)
    setIsActive(true)
    setIsProcessing(true)

    try {
      const aiResponse = await aethonAI.generateResponse(
        `Help me with ${label.toLowerCase()}`,
        { currentPage: context },
        action
      )
      setResponse(aiResponse)
    } catch (error) {
      console.error('Aethon error:', error)
      setResponse({
        text: "I'm sorry, I encountered an error. Please try again.",
        suggestions: [],
        actions: []
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCustomPrompt = async (prompt: string) => {
    setCurrentTask(prompt)
    setIsActive(true)
    setIsProcessing(true)

    try {
      const aiResponse = await aethonAI.generateResponse(
        prompt,
        { currentPage: context }
      )
      setResponse(aiResponse)
    } catch (error) {
      console.error('Aethon error:', error)
      setResponse({
        text: "I'm sorry, I encountered an error. Please try again.",
        suggestions: [],
        actions: []
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const executeAction = (action: any) => {
    // Handle different action types
    switch (action.type) {
      case 'create_note':
        window.location.href = '/notes'
        break
      case 'create_project':
        window.location.href = '/projects'
        break
      case 'create_timeline':
        window.location.href = '/calendar'
        break
      case 'upload_file':
        window.location.href = '/files'
        break
      case 'create_citation':
        window.location.href = '/citations'
        break
      default:
        console.log('Executing action:', action)
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Aethon AI Assistant
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              I'm your advanced research AI assistant. I can help with literature analysis, methodology design, data interpretation, and much more.
            </p>
            
            {currentSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Contextual Suggestions
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {currentSuggestions.slice(0, 4).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => handleCustomPrompt(suggestion)}
                    >
                      <Wand2 className="h-3 w-3 mr-2" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Quick Actions
              </p>
              <div className="grid grid-cols-1 gap-2">
                {quickActions.slice(0, 4).map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => handleQuickAction(action.action, action.label)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-0.5">
                        {action.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">{action.label}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t">
              <Input
                placeholder="Ask Aethon anything..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleCustomPrompt(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className={`h-4 w-4 text-primary ${isProcessing ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-medium">
                  {isProcessing ? 'Processing...' : `Working on: ${currentTask}`}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsActive(false)
                  setResponse(null)
                  setCurrentTask('')
                }}
              >
                New Task
              </Button>
            </div>

            {response && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Aethon's Analysis</span>
                </div>
                
                <div className="text-sm space-y-2 max-h-60 overflow-y-auto">
                  <div className="whitespace-pre-wrap">{response.text}</div>
                </div>

                {response.suggestions && response.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium">Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {response.suggestions.map((suggestion: string, index: number) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          className="text-xs h-6"
                          onClick={() => handleCustomPrompt(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {response.actions && response.actions.length > 0 && (
                  <div className="flex gap-2 pt-2 border-t">
                    {response.actions.map((action: any, index: number) => (
                      <Button
                        key={index}
                        size="sm"
                        onClick={() => executeAction(action)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Textarea
              placeholder="Ask follow-up questions or request modifications..."
              className="min-h-[60px]"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && e.currentTarget.value.trim()) {
                  e.preventDefault()
                  handleCustomPrompt(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}