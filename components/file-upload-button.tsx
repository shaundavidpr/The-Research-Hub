import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function FileUploadButton() {
  return (
    <Button>
      <Upload className="mr-2 h-4 w-4" />
      Upload Files
    </Button>
  )
}
