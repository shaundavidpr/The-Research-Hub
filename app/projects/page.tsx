import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyProjects } from "@/components/empty-projects"
import { ProjectsGrid } from "@/components/projects-grid"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FolderKanban } from "lucide-react"
import { CreateProjectButton } from "@/components/create-project-button"

export default function ProjectsPage() {
  // This would normally be fetched from an API
  const hasProjects = false

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Projects"
        text="Create and manage your research projects."
        icon={<FolderKanban className="h-5 w-5 text-muted-foreground" />}
        actions={
          <CreateProjectButton>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </CreateProjectButton>
        }
      />

      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      {hasProjects ? <ProjectsGrid /> : <EmptyProjects />}
    </DashboardShell>
  )
}
