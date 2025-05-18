import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"

interface ProjectNotesProps {
  projectId: string
}

export function ProjectNotes({ projectId }: ProjectNotesProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No project notes yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Create notes to document your research findings, ideas, and progress for this project.
      </p>
      <Button className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Create Project Note
      </Button>
    </div>
  )
}
