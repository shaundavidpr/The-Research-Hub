"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { AdvancedResearchDashboard } from "@/components/advanced-research-dashboard"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <AdvancedResearchDashboard />
    </DashboardShell>
  )
}
