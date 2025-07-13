"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Users,
  FileText,
  BarChart3,
  Shield,
  Search,
  Zap,
  MessageSquare,
  Database,
  BookOpen,
  Target,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Lock,
  Cloud,
  Smartphone,
} from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Research Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Everything You Need for
            <br />
            <span className="text-yellow-300">Modern Research</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Discover powerful tools designed specifically for researchers, academics, and institutions to streamline
            workflows and accelerate discoveries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Feature Categories */}
        <Tabs defaultValue="ai-tools" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Explore Our Features</h2>
            <p className="text-muted-foreground text-lg">Choose a category to learn more about our capabilities</p>
          </div>

          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
            <TabsTrigger value="ai-tools" className="flex flex-col gap-2 p-4">
              <Brain className="h-5 w-5" />
              <span className="text-sm">AI Tools</span>
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex flex-col gap-2 p-4">
              <Users className="h-5 w-5" />
              <span className="text-sm">Collaboration</span>
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex flex-col gap-2 p-4">
              <FileText className="h-5 w-5" />
              <span className="text-sm">Organization</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col gap-2 p-4">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Tools */}
          <TabsContent value="ai-tools" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">AI-Powered Research Assistant</h3>
              <p className="text-muted-foreground">Leverage cutting-edge AI to accelerate your research process</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Intelligent Literature Review</CardTitle>
                  <CardDescription>
                    AI analyzes thousands of papers to identify key themes, gaps, and research opportunities in your
                    field.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Automated paper summarization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Research gap identification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Citation network analysis
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Smart Research Questions</CardTitle>
                  <CardDescription>
                    Generate innovative research questions based on current literature and emerging trends.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Question generation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Hypothesis formation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Methodology suggestions
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Semantic Search</CardTitle>
                  <CardDescription>
                    Find relevant research using natural language queries and concept-based search.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Natural language search
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Concept mapping
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Cross-disciplinary discovery
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Collaboration */}
          <TabsContent value="collaboration" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Global Research Collaboration</h3>
              <p className="text-muted-foreground">Connect and collaborate with researchers worldwide</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Research Networks</CardTitle>
                  <CardDescription>
                    Build your professional network and discover collaboration opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Researcher Discovery</div>
                        <div className="text-sm text-muted-foreground">
                          Find researchers by expertise, institution, or research interests
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Collaboration Matching</div>
                        <div className="text-sm text-muted-foreground">
                          AI-powered matching based on research compatibility
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Project Invitations</div>
                        <div className="text-sm text-muted-foreground">
                          Invite collaborators to join your research projects
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Real-time Communication</CardTitle>
                  <CardDescription>Seamless communication tools for distributed research teams.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Integrated Chat</div>
                        <div className="text-sm text-muted-foreground">Project-based messaging with file sharing</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Video Conferencing</div>
                        <div className="text-sm text-muted-foreground">Built-in video calls for team meetings</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Annotation Tools</div>
                        <div className="text-sm text-muted-foreground">Collaborative document and paper annotation</div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Organization */}
          <TabsContent value="organization" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Research Organization & Management</h3>
              <p className="text-muted-foreground">Keep your research organized and accessible</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Smart Note Taking</CardTitle>
                  <CardDescription>AI-enhanced note organization with automatic tagging and linking.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Auto-tagging
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Cross-referencing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Version control
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Citation Management</CardTitle>
                  <CardDescription>Automated citation formatting and reference management.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Multiple formats
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Auto-import
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Duplicate detection
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>File Management</CardTitle>
                  <CardDescription>Secure cloud storage with intelligent organization.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Cloud sync
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Version history
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Access control
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Research Analytics & Insights</h3>
              <p className="text-muted-foreground">Track your progress and measure your impact</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Impact Metrics</CardTitle>
                  <CardDescription>Comprehensive analytics on your research impact and reach.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Citation Tracking</span>
                      <Badge variant="secondary">Real-time</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Collaboration Network</span>
                      <Badge variant="secondary">Visual</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Research Trends</span>
                      <Badge variant="secondary">Predictive</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>Monitor your research goals and project milestones.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Project Timelines</span>
                      <Badge variant="secondary">Gantt Charts</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Goal Setting</span>
                      <Badge variant="secondary">SMART Goals</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Productivity Insights</span>
                      <Badge variant="secondary">AI-Powered</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Security & Privacy */}
        <div className="mt-16 bg-slate-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Security & Privacy First</h2>
            <p className="text-muted-foreground">Your research data is protected with enterprise-grade security</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Lock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">All data encrypted in transit and at rest</p>
            </div>
            <div className="text-center">
              <Cloud className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure Cloud Storage</h3>
              <p className="text-sm text-muted-foreground">SOC 2 compliant infrastructure</p>
            </div>
            <div className="text-center">
              <Smartphone className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Multi-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Additional security layers for your account</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Research?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of researchers who are already using our platform to accelerate their discoveries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Brochure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
