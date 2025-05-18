import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MoreHorizontal,
  FileText,
  FileIcon as FilePdf,
  FileSpreadsheet,
  ImageIcon,
  Download,
  Share2,
} from "lucide-react"

export function FilesList() {
  // This would normally fetch files from an API or state management
  const files = [
    {
      id: 1,
      name: "Literature Review Draft.docx",
      type: "document",
      size: "2.4 MB",
      modified: "May 17, 2025",
      icon: FileText,
    },
    {
      id: 2,
      name: "Research Paper - Machine Learning.pdf",
      type: "pdf",
      size: "4.8 MB",
      modified: "May 15, 2025",
      icon: FilePdf,
    },
    {
      id: 3,
      name: "Data Analysis Results.xlsx",
      type: "spreadsheet",
      size: "1.2 MB",
      modified: "May 12, 2025",
      icon: FileSpreadsheet,
    },
    {
      id: 4,
      name: "Experiment Setup.jpg",
      type: "image",
      size: "3.5 MB",
      modified: "May 10, 2025",
      icon: ImageIcon,
    },
    {
      id: 5,
      name: "Research Methodology.pdf",
      type: "pdf",
      size: "2.1 MB",
      modified: "May 8, 2025",
      icon: FilePdf,
    },
    {
      id: 6,
      name: "Survey Results.xlsx",
      type: "spreadsheet",
      size: "1.8 MB",
      modified: "May 5, 2025",
      icon: FileSpreadsheet,
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50">
              <tr>
                <th scope="col" className="p-4">
                  <Checkbox id="select-all" />
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                  Modified
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="bg-card border-b hover:bg-muted/50">
                  <td className="p-4">
                    <Checkbox id={`select-file-${file.id}`} />
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <file.icon className="h-5 w-5 text-muted-foreground" />
                      <span>{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">{file.size}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{file.modified}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
