import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyCitations } from "@/components/empty-citations"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BookMarked, FileDown, FileUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CitationsPage() {
  // This would normally be fetched from an API
  const hasCitations = false

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Citation Manager"
        text="Organize and generate citations for your research papers."
        icon={<BookMarked className="h-5 w-5 text-muted-foreground" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <FileUp className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Citation
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <div className="relative">
            <Input placeholder="Search citations..." className="pl-8" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>
        <div className="md:col-span-1">
          <Select defaultValue="apa">
            <SelectTrigger>
              <SelectValue placeholder="Citation Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apa">APA (7th Edition)</SelectItem>
              <SelectItem value="mla">MLA (9th Edition)</SelectItem>
              <SelectItem value="chicago">Chicago (17th Edition)</SelectItem>
              <SelectItem value="harvard">Harvard</SelectItem>
              <SelectItem value="ieee">IEEE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">All Citations</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="websites">Websites</TabsTrigger>
        </TabsList>
      </Tabs>

      <EmptyCitations />
    </DashboardShell>
  )
}
