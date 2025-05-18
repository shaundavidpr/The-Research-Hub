import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"

interface EmptyNotesProps {
  type?: "research" | "personal"
}

export function EmptyNotes({ type = "research" }: EmptyNotesProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No {type === "personal" ? "personal " : ""}notes yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        {type === "personal"
          ? "Create your first personal note to keep track of private thoughts and ideas."
          : "Create your first research note to organize your findings, ideas, and insights."}
      </p>
      <Button className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Create {type === "personal" ? "Personal " : ""}Note
      </Button>
    </div>
  )
}
