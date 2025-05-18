import { Clock } from "lucide-react"

export function RecentActivity() {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <Clock className="h-12 w-12 text-muted-foreground/60 mb-4" />
      <h3 className="text-lg font-medium">No recent activity</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        Your recent research activities will appear here as you use The Research Hub.
      </p>
    </div>
  )
}
