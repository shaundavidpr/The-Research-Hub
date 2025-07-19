"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Users,
  FileText,
  TrendingUp,
  Plus,
  MessageCircle,
  Heart,
  BookOpen,
  Calendar,
  Target,
  Zap,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Bookmark,
  Share2,
  Download,
  Eye,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Lightbulb,
  Rocket,
  Globe,
  Shield,
  Database,
  Cpu,
  Network,
  Layers,
  GitBranch,
  Code,
  Terminal,
  Settings,
  Bell,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Minus,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@/hooks/use-user"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  papers: number
  citations: number
  projects: number
  notes: number
  collaborators: number
  followers: number
  following: number
  totalViews: number
  totalDownloads: number
  hIndex: number
  impactFactor: number
  recentActivity: ActivityItem[]
  trendingPapers: TrendingPaper[]
  upcomingDeadlines: Deadline[]
  researchMetrics: ResearchMetric[]
  collaborationRequests: CollaborationRequest[]
  systemHealth: SystemHealth
}

interface ActivityItem {
  id: string
  type: 'paper_published' | 'collaboration_started' | 'note_created' | 'citation_added' | 'project_updated'
  title: string
  description: string
  timestamp: string
  icon: any
  color: string
}

interface TrendingPaper {
  id: string
  title: string
  authors: string[]
  journal: string
  views: number
  downloads: number
  likes: number
  field: string
  trending_score: number
}

interface Deadline {
  id: string
  title: string
  type: 'submission' | 'conference' | 'review' | 'milestone'
  date: string
  priority: 'high' | 'medium' | 'low'
  project: string
  days_remaining: number
}

interface ResearchMetric {
  label: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  color: string
}

interface CollaborationRequest {
  id: string
  from_user: string
  project_title: string
  message: string
  timestamp: string
  status: 'pending' | 'accepted' | 'declined'
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  response_time: number
  active_users: number
  storage_used: number
  ai_requests_today: number
}

export function AdvancedResearchDashboard() {
  const { user } = useUser()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [stats, setStats] = useState<DashboardStats>({
    papers: 0,
    citations: 0,
    projects: 0,
    notes: 0,
    collaborators: 0,
    followers: 0,
    following: 0,
    totalViews: 0,
    totalDownloads: 0,
    hIndex: 0,
    impactFactor: 0,
    recentActivity: [],
    trendingPapers: [],
    upcomingDeadlines: [],
    researchMetrics: [],
    collaborationRequests: [],
    systemHealth: {
      status: 'healthy',
      uptime: 99.9,
      response_time: 120,
      active_users: 1247,
      storage_used: 67.3,
      ai_requests_today: 15420
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load user's research data
      const [
        { data: projects },
        { data: notes },
        { data: files },
        { data: citations },
        { data: timeline }
      ] = await Promise.all([
        supabase.from('research_projects').select('*').eq('user_id', user.id),
        supabase.from('research_notes').select('*').eq('user_id', user.id),
        supabase.from('research_files').select('*').eq('user_id', user.id),
        supabase.from('citations').select('*').eq('user_id', user.id),
        supabase.from('timeline_events').select('*').eq('user_id', user.id)
      ])

      // Generate mock data for demonstration
      const mockStats: DashboardStats = {
        papers: 12,
        citations: 1247,
        projects: projects?.length || 0,
        notes: notes?.length || 0,
        collaborators: 8,
        followers: 234,
        following: 156,
        totalViews: 5420,
        totalDownloads: 892,
        hIndex: 15,
        impactFactor: 2.34,
        recentActivity: [
          {
            id: '1',
            type: 'paper_published',
            title: 'New paper published',
            description: 'Machine Learning in Healthcare Diagnostics',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            icon: FileText,
            color: 'text-blue-600'
          },
          {
            id: '2',
            type: 'collaboration_started',
            title: 'Collaboration started',
            description: 'Joined quantum computing research project',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            icon: Users,
            color: 'text-green-600'
          },
          {
            id: '3',
            type: 'note_created',
            title: 'Research note added',
            description: 'Literature review findings documented',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            icon: BookOpen,
            color: 'text-purple-600'
          }
        ],
        trendingPapers: [
          {
            id: '1',
            title: 'Advances in Quantum Machine Learning',
            authors: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez'],
            journal: 'Nature Quantum Information',
            views: 2340,
            downloads: 567,
            likes: 89,
            field: 'Quantum Computing',
            trending_score: 95
          },
          {
            id: '2',
            title: 'Climate Change Impact on Marine Ecosystems',
            authors: ['Dr. Emily Watson', 'Prof. David Kim'],
            journal: 'Science',
            views: 1890,
            downloads: 423,
            likes: 67,
            field: 'Environmental Science',
            trending_score: 87
          }
        ],
        upcomingDeadlines: [
          {
            id: '1',
            title: 'Conference Paper Submission',
            type: 'submission',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high',
            project: 'AI Research Project',
            days_remaining: 7
          },
          {
            id: '2',
            title: 'Research Proposal Review',
            type: 'review',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium',
            project: 'Climate Study',
            days_remaining: 14
          }
        ],
        researchMetrics: [
          { label: 'Paper Views', value: 5420, change: 12.5, trend: 'up', color: 'text-blue-600' },
          { label: 'Citations', value: 1247, change: 8.3, trend: 'up', color: 'text-green-600' },
          { label: 'Collaborations', value: 8, change: 0, trend: 'stable', color: 'text-purple-600' },
          { label: 'Downloads', value: 892, change: -2.1, trend: 'down', color: 'text-orange-600' }
        ],
        collaborationRequests: [
          {
            id: '1',
            from_user: 'Dr. Lisa Thompson',
            project_title: 'AI Ethics in Healthcare',
            message: 'Would love to collaborate on this important research area.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          }
        ],
        systemHealth: {
          status: 'healthy',
          uptime: 99.9,
          response_time: 120,
          active_users: 1247,
          storage_used: 67.3,
          ai_requests_today: 15420
        }
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'critical':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.name || 'Researcher'}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your research today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-4 w-4 mr-1" />
            Pro Researcher
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.papers}</div>
            <div className="text-sm text-muted-foreground">Papers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.citations.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Citations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.projects}</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.notes}</div>
            <div className="text-sm text-muted-foreground">Notes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.hIndex}</div>
            <div className="text-sm text-muted-foreground">h-index</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.impactFactor}</div>
            <div className="text-sm text-muted-foreground">Impact Factor</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Research Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Research Metrics
                </CardTitle>
                <CardDescription>Track your research impact and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {stats.researchMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-xs ${
                            metric.change > 0 ? 'text-green-600' : 
                            metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/aethon">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Brain className="mr-2 h-4 w-4" />
                    Chat with Aethon AI
                  </Button>
                </Link>
                <Link href="/notes/new">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Research Note
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Project
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Find Collaborators
                  </Button>
                </Link>
                <Link href="/publish">
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="mr-2 h-4 w-4" />
                    Publish Research
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Trending */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Papers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.trendingPapers.map((paper, index) => (
                    <div key={paper.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-1">{paper.title}</h4>
                          <p className="text-sm text-muted-foreground">{paper.authors.join(', ')}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" className="text-xs">{paper.field}</Badge>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {paper.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {paper.downloads}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {paper.likes}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{deadline.title}</h4>
                        <p className="text-sm text-muted-foreground">{deadline.project}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(deadline.priority)}`}>
                            {deadline.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {deadline.days_remaining} days remaining
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {new Date(deadline.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {deadline.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Research Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Research Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Projects</span>
                      <span>{stats.projects} projects</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Papers in Progress</span>
                      <span>3 drafts</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Literature Review</span>
                      <span>85% complete</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Collection</span>
                      <span>45% complete</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Aethon AI Insights
              </CardTitle>
              <CardDescription>Personalized research recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Research Opportunity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on your recent work, consider exploring quantum machine learning applications in healthcare.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Collaboration Suggestion</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dr. Sarah Chen at MIT has complementary research interests. Consider reaching out for collaboration.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Conference Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ICML 2024 submission deadline is approaching. Your current research aligns well with their themes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collaboration Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaboration Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.collaborationRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{request.from_user}</h4>
                          <p className="text-sm text-muted-foreground">{request.project_title}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{request.message}</p>
                      <div className="flex gap-2">
                        <Button size="sm">Accept</Button>
                        <Button size="sm" variant="outline">Decline</Button>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Network Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Research Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Followers</span>
                    <span className="font-medium">{stats.followers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Following</span>
                    <span className="font-medium">{stats.following}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Collaborations</span>
                    <span className="font-medium">{stats.collaborators}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network Reach</span>
                    <span className="font-medium">2.3K researchers</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Top Collaborating Institutions</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>MIT</span>
                        <span>3 projects</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Stanford</span>
                        <span>2 projects</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Harvard</span>
                        <span>1 project</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Impact Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Impact Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.hIndex}</div>
                    <div className="text-sm text-muted-foreground">h-index</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.impactFactor}</div>
                    <div className="text-sm text-muted-foreground">Impact Factor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.citations.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Citations</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Views</span>
                    <span className="font-medium">{stats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Downloads</span>
                    <span className="font-medium">{stats.totalDownloads.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Shares</span>
                    <span className="font-medium">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bookmarks</span>
                    <span className="font-medium">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Research Fields */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Research Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">AI/ML</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Healthcare</span>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Data Science</span>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Health
                <Badge variant="secondary" className={getStatusColor(stats.systemHealth.status)}>
                  {stats.systemHealth.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Uptime</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.systemHealth.uptime}%</div>
                  <div className="text-xs text-muted-foreground">Last 30 days</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Response Time</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.systemHealth.response_time}ms</div>
                  <div className="text-xs text-muted-foreground">Average</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Active Users</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.systemHealth.active_users.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Currently online</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Storage Used</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.systemHealth.storage_used}%</div>
                  <div className="text-xs text-muted-foreground">Of allocated space</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium">AI Requests</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.systemHealth.ai_requests_today.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Today</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Last Backup</span>
                  </div>
                  <div className="text-2xl font-bold">2h</div>
                  <div className="text-xs text-muted-foreground">Ago</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  API Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication API</span>
                    <Badge variant="secondary" className="text-green-600">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Research Data API</span>
                    <Badge variant="secondary" className="text-green-600">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Assistant API</span>
                    <Badge variant="secondary" className="text-green-600">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">File Storage API</span>
                    <Badge variant="secondary" className="text-green-600">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notification API</span>
                    <Badge variant="secondary" className="text-yellow-600">Degraded</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-backup</span>
                    <Badge variant="secondary" className="text-green-600">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL Certificate</span>
                    <Badge variant="secondary" className="text-green-600">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CDN Status</span>
                    <Badge variant="secondary" className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monitoring</span>
                    <Badge variant="secondary" className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Limiting</span>
                    <Badge variant="secondary" className="text-green-600">Configured</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Assistant Prompt */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Need Research Assistance?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Aethon AI is ready to help with literature reviews, methodology design, data analysis, and more.
          </p>
          <Link href="/aethon">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Brain className="mr-2 h-4 w-4" />
              Start AI Session
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}