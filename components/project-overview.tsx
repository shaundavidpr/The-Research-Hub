import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, FileText, FolderOpen, Users, Calendar, Brain, Plus } from "lucide-react"
import Link from "next/link"

interface ProjectOverviewProps {
  projectId: string
}

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
  // This would normally fetch project data from an API
  const project = {
    id: projectId,
    title: "Research Project",
    description:
      "This is a placeholder for your research project description. Edit the project to add details about your research goals, methodology, and expected outcomes.",
    progress: 0,
    startDate: "Not set",
    endDate: "Not set",
    members: [],
    notes: 0,
    files: 0,
    aiInteractions: 0,
    events: 0,
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.notes}</div>
            <Button variant="link" className="px-0 h-auto" asChild>
              <Link href={`/projects/${projectId}?tab=notes`}>View Notes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.files}</div>
            <Button variant="link" className="px-0 h-auto" asChild>
              <Link href={`/projects/${projectId}?tab=files`}>View Files</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.members.length}</div>
            <Button variant="link" className="px-0 h-auto" asChild>
              <Link href={`/projects/${projectId}?tab=team`}>Manage Team</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aethon Insights</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.aiInteractions}</div>
            <Button variant="link" className="px-0 h-auto" asChild>
              <Link href="/aethon">Ask Aethon</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Project Description</CardTitle>
            <CardDescription>Overview and goals of your research project</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{project.description}</p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{project.startDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium">{project.endDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Researchers collaborating on this project</CardDescription>
          </CardHeader>
          <CardContent>
            {project.members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Users className="h-10 w-10 text-muted-foreground/60 mb-4" />
                <h3 className="text-lg font-medium">No team members yet</h3>
                <p className="text-sm text-muted-foreground mt-1">Invite researchers to collaborate on this project.</p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Invite Researchers
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {project.members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${index}`} alt="Member" />
                        <AvatarFallback>{String.fromCharCode(65 + index)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Member Name</p>
                        <p className="text-sm text-muted-foreground">Role</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Important dates and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-medium">No deadlines yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add important deadlines and milestones to your project.
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Deadline
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Clock className="h-10 w-10 text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-medium">No recent activity</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Activity will appear here as you work on your project.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
