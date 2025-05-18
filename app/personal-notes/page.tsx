import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Clock, Star, Folder, Lock } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyNotes } from "@/components/empty-notes"

export default function PersonalNotesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Personal Notes"
        text="Private notes only visible to you."
        icon={<Lock className="h-5 w-5 text-muted-foreground" />}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Personal Note
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search personal notes..." className="w-full pl-8" />
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4">
              <h2 className="font-semibold mb-3">Categories</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Folder className="mr-2 h-4 w-4" />
                  All Notes
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Star className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Clock className="mr-2 h-4 w-4" />
                  Recent
                </Button>
              </div>
            </div>

            <div className="border-t p-4">
              <h2 className="font-semibold mb-3">Personal Categories</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-primary" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Category
                </Button>
              </div>
            </div>

            <div className="border-t p-4">
              <h2 className="font-semibold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-7">
                  <Plus className="mr-1 h-3 w-3" />
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Personal Notes</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <EmptyNotes type="personal" />
            </TabsContent>

            <TabsContent value="recent" className="mt-0">
              <EmptyNotes type="personal" />
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              <EmptyNotes type="personal" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}
