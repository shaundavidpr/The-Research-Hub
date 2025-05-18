import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyCalendar } from "@/components/empty-calendar"

export default function CalendarPage() {
  const today = new Date()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Calendar"
        text="Plan and track your research milestones and deadlines."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-0 pt-6">
              <Calendar mode="single" selected={today} className="rounded-md" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No deadlines yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add research deadlines to keep track of important dates.
                </p>
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Deadline
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Button variant="outline" size="icon" className="h-7 w-7 mr-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous month</span>
                </Button>
                <CardTitle>May 2025</CardTitle>
                <Button variant="outline" size="icon" className="h-7 w-7 ml-2">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next month</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Month
                </Button>
                <Button variant="outline" size="sm">
                  Week
                </Button>
                <Button variant="outline" size="sm">
                  Day
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <EmptyCalendar />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
