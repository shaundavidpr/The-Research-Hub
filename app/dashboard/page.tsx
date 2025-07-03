import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  FolderOpen,
  Brain,
  Calendar,
  Clock,
  BookOpen,
  BarChart,
  FileQuestion,
  Plus,
  ArrowRight,
  Users,
  Globe,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RecentActivity } from "@/components/recent-activity"
import { UpcomingDeadlines } from "@/components/upcoming-deadlines"
import { ResearchProgress } from "@/components/research-progress"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Dashboard"
        text="Welcome back! Here's an overview of your research activities and progress."
        actions={
          <Button asChild>
            <Link href="/projects">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Uploaded</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aethon Interactions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+15 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+5 new followers</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Research Progress</CardTitle>
            <CardDescription>Track your research project milestones and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ResearchProgress />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent research activities</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Smart Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3" asChild>
                <Link href="/notes">
                  <BookOpen className="mr-2 h-4 w-4 text-primary" />
                  <span>Create Research Note</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3" asChild>
                <Link href="/personal-notes">
                  <FileText className="mr-2 h-4 w-4 text-primary" />
                  <span>Personal Note</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3" asChild>
                <Link href="/notes">
                  <Target className="mr-2 h-4 w-4 text-primary" />
                  <span>View All Notes</span>
                </Link>
              </Button>
            </div>
          </CardContent>
          <div className="px-6 pb-4">
            <Button asChild className="w-full">
              <Link href="/notes">
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Link>
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Research Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <UpcomingDeadlines />
          </CardContent>
          <div className="px-6 pb-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/calendar">
                View Timeline
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              Aethon AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                <span>Analyze Research Papers</span>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                <BarChart className="mr-2 h-4 w-4 text-primary" />
                <span>Generate Insights</span>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                <FileQuestion className="mr-2 h-4 w-4 text-primary" />
                <span>Research Questions</span>
              </Button>
            </div>
          </CardContent>
          <div className="px-6 pb-4">
            <Button asChild className="w-full">
              <Link href="/aethon">
                Chat with Aethon
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Community and Tools */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-primary" />
              Research Community
            </CardTitle>
            <CardDescription>Connect with researchers worldwide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Researchers</span>
                <span className="font-bold">12,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Papers Shared Today</span>
                <span className="font-bold">234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Collaborations</span>
                <span className="font-bold">18</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/community">
                  <Globe className="mr-2 h-4 w-4" />
                  Explore
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/collaboration">
                  <Users className="mr-2 h-4 w-4" />
                  Collaborate
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Research Tools
            </CardTitle>
            <CardDescription>Access your research toolkit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/files">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Files
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/citations">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Citations
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/analytics">
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/publish">
                  <FileText className="mr-2 h-4 w-4" />
                  Publish
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}