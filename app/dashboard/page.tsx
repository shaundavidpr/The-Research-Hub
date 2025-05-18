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
        heading="Dashboard"
        text="Welcome back to your research workspace."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Start creating research notes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Uploaded</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Upload your research materials</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aethon Interactions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ask Aethon for research assistance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Add research milestones</p>
          </CardContent>
        </Card>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Quick Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex h-[180px] flex-col items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/60" />
                <h3 className="text-lg font-semibold">No notes yet</h3>
                <p className="text-sm text-muted-foreground">Create your first research note to get started.</p>
              </div>
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
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <UpcomingDeadlines />
          </CardContent>
          <div className="px-6 pb-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/calendar">
                View Calendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              Ask Aethon
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                <BookOpen className="mr-2 h-4 w-4 text-primary" />
                <span>Summarize a research paper</span>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                <BarChart className="mr-2 h-4 w-4 text-primary" />
                <span>Analyze my research data</span>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                <FileQuestion className="mr-2 h-4 w-4 text-primary" />
                <span>Generate research questions</span>
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
    </DashboardShell>
  )
}
