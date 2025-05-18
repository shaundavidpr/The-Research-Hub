import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function UpcomingDeadlines() {
  return (
    <div className="flex flex-col items-center justify-center h-[180px] text-center">
      <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No deadlines yet</h3>
      <p className="text-sm text-muted-foreground mt-1">Add research deadlines to stay on track.</p>
      <Button variant="outline" className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Add Deadline
      </Button>
    </div>
  )
}
