import { Button } from "@/components/ui/button"
import { BookMarked, Plus } from "lucide-react"

export function EmptyCitations() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <BookMarked className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No citations yet</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Add citations for your research papers, books, and other sources to easily reference them in your work.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-2">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Citation
        </Button>
        <Button variant="outline">Import Citations</Button>
      </div>
    </div>
  )
}
