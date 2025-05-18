import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"

interface ProjectTimelineProps {
  projectId: string
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Calendar className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No timeline events yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Create a timeline with important milestones, deadlines, and events for your research project.
      </p>
      <Button className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Add Timeline Event
      </Button>
    </div>
  )
}
