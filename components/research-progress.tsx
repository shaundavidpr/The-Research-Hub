import { Button } from "@/components/ui/button"
import { BarChart, Plus } from "lucide-react"

export function ResearchProgress() {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <BarChart className="h-12 w-12 text-muted-foreground/60 mb-4" />
      <h3 className="text-lg font-medium">No research projects yet</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        Create a research project to track your progress and milestones.
      </p>
      <Button className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Create Research Project
      </Button>
    </div>
  )
}
