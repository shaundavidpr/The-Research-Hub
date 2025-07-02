"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ResearchTimeline } from "@/components/research-timeline"
import { Calendar } from "lucide-react"

export default function CalendarPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Timeline"
        text="Plan and track your research milestones, deadlines, and important events."
        icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
      />

      <ResearchTimeline />
    </DashboardShell>
  )
}