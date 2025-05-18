import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProjectOverview } from "@/components/project-overview"
import { ProjectFiles } from "@/components/project-files"
import { ProjectNotes } from "@/components/project-notes"
import { ProjectTimeline } from "@/components/project-timeline"
import { ProjectTeam } from "@/components/project-team"
import { Edit, Share2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // This would normally fetch project data from an API
  const projectId = params.id
  const projectName = "Research Project"

  return (
    <DashboardShell>
      <DashboardHeader
        heading={projectName}
        text="Manage your research project, track progress, and collaborate with team members."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Duplicate Project</DropdownMenuItem>
                <DropdownMenuItem>Export Project</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Archive Project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <ProjectOverview projectId={projectId} />
        </TabsContent>

        <TabsContent value="notes" className="mt-0">
          <ProjectNotes projectId={projectId} />
        </TabsContent>

        <TabsContent value="files" className="mt-0">
          <ProjectFiles projectId={projectId} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-0">
          <ProjectTimeline projectId={projectId} />
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <ProjectTeam projectId={projectId} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
