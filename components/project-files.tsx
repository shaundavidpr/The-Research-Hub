import { Button } from "@/components/ui/button"
import { FolderOpen, Upload } from "lucide-react"

interface ProjectFilesProps {
  projectId: string
}

export function ProjectFiles({ projectId }: ProjectFilesProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <FolderOpen className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No project files yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Upload research papers, datasets, and other files related to this project.
      </p>
      <Button className="mt-6">
        <Upload className="mr-2 h-4 w-4" />
        Upload Project Files
      </Button>
    </div>
  )
}
