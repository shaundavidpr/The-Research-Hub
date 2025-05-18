import { FolderKanban, Plus } from "lucide-react"
import { CreateProjectButton } from "@/components/create-project-button"

export function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <FolderKanban className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No research projects yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Create your first research project to organize your work, collaborate with others, and track your progress.
      </p>
      <CreateProjectButton>
        <Plus className="mr-2 h-4 w-4" />
        Create First Project
      </CreateProjectButton>
    </div>
  )
}
