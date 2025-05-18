import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"

interface ProjectTeamProps {
  projectId: string
}

export function ProjectTeam({ projectId }: ProjectTeamProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Users className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No team members yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Invite researchers and collaborators to join your project team.
      </p>
      <Button className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Invite Team Members
      </Button>
    </div>
  )
}
