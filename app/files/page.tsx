import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, ImageIcon, FileSpreadsheet, FileIcon, FolderPlus, List, Grid, Upload } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyFiles } from "@/components/empty-files"

export default function FilesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Files"
        text="Upload, organize, and manage your research files."
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search files..." className="w-full pl-8" />
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4">
              <h2 className="font-semibold mb-3">File Types</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Documents
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <FileIcon className="mr-2 h-4 w-4" />
                  PDFs
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Images
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Datasets
                </Button>
              </div>
            </div>

            <div className="border-t p-4">
              <h2 className="font-semibold mb-3">Folders</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-primary" size="sm">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </div>
            </div>

            <div className="border-t p-4">
              <h2 className="font-semibold mb-3">Storage</h2>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used</span>
                    <span>0 GB of 10 GB</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
                <Button variant="link" className="h-auto p-0 text-sm">
                  Upgrade Storage
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Files</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
            </div>
          </div>

          <EmptyFiles />
        </div>
      </div>
    </DashboardShell>
  )
}
