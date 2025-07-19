"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EnhancedCitationManager } from "@/components/enhanced-citation-manager"
import { BookMarked } from "lucide-react"

export default function CitationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Citation Manager"
        text="Organize and generate citations for your research papers with AI assistance."
        icon={<BookMarked className="h-5 w-5 text-muted-foreground" />}
      />

      <EnhancedCitationManager />
    </DashboardShell>
  )
}
