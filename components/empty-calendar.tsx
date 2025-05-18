import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"

export function EmptyCalendar() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50 h-[500px]">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Calendar className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No events yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Add research milestones, deadlines, and meetings to keep track of your research timeline.
      </p>
      <Button className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Add First Event
      </Button>
    </div>
  )
}
