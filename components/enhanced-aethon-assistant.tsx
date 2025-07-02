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
  Zap
} from "lucide-react"

interface AethonAssistantProps {
  context?: string
  onSuggestion?: (suggestion: string) => void
}

export function EnhancedAethonAssistant({ context, onSuggestion }: AethonAssistantProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentTask, setCurrentTask] = useState("")

  const contextualSuggestions = {
    notes: [
      "Generate research outline",
      "Suggest related topics",
      "Create mind map",
      "Find knowledge gaps"
    ],
    files: [
      "Analyze document content",
      "Extract key findings",
      "Generate summary",
      "Find similar papers"
    ],
    projects: [
      "Create project timeline",
      "Suggest collaborators",
      "Identify milestones",
      "Risk assessment"
    ],
    community: [
      "Find relevant researchers",
      "Suggest collaboration topics",
      "Analyze trending papers",
      "Network recommendations"
    ],
    publish: [
      "Improve abstract",
      "Suggest keywords",
      "Review for clarity",
      "Citation suggestions"
    ]
  }

  const quickActions = [
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Write Abstract",
      description: "Generate or improve paper abstracts"
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      label: "Research Ideas",
      description: "Brainstorm new research directions"
    },
    {
      icon: <Search className="h-4 w-4" />,
      label: "Literature Search",
      description: "Find relevant papers and sources"
    },
    {
      icon: <BarChart className="h-4 w-4" />,
      label: "Data Analysis",
      description: "Analyze and interpret research data"
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Find Collaborators",
      description: "Suggest potential research partners"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Plan Timeline",
      description: "Create research project timelines"
    }
  ]

  const currentSuggestions = context ? contextualSuggestions[context as keyof typeof contextualSuggestions] || [] : []

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
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
              I'm here to help with your research. What would you like to work on?
            </p>
            
            {currentSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Contextual Suggestions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {currentSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => {
                        setCurrentTask(suggestion)
                        setIsActive(true)
                        onSuggestion?.(suggestion)
                      }}
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
                {quickActions.slice(0, 3).map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => {
                      setCurrentTask(action.label)
                      setIsActive(true)
                    }}
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
                    setCurrentTask(e.currentTarget.value)
                    setIsActive(true)
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">Working on: {currentTask}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsActive(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Aethon's Response</span>
              </div>
              
              <div className="text-sm space-y-2">
                <p>I'm analyzing your request and generating helpful suggestions...</p>
                
                {currentTask.includes("abstract") && (
                  <div className="space-y-2">
                    <p className="font-medium">Abstract Improvement Suggestions:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Consider adding quantitative results to strengthen impact</li>
                      <li>Clarify the methodology in the second sentence</li>
                      <li>Include broader implications of your findings</li>
                    </ul>
                  </div>
                )}

                {currentTask.includes("ideas") && (
                  <div className="space-y-2">
                    <p className="font-medium">Research Direction Ideas:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Explore cross-disciplinary applications</li>
                      <li>Investigate scalability challenges</li>
                      <li>Consider ethical implications</li>
                    </ul>
                  </div>
                )}

                {currentTask.includes("collaborators") && (
                  <div className="space-y-2">
                    <p className="font-medium">Potential Collaborators:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Dr. Sarah Chen (MIT) - Quantum Computing</li>
                      <li>Prof. Michael Rodriguez (Stanford) - Data Science</li>
                      <li>Dr. Emily Watson (Harvard) - Machine Learning</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Discuss
                </Button>
                <Button size="sm" variant="outline">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Learn More
                </Button>
                <Button size="sm">
                  <Target className="h-3 w-3 mr-1" />
                  Apply
                </Button>
              </div>
            </div>

            <Textarea
              placeholder="Ask follow-up questions or request modifications..."
              className="min-h-[60px]"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}