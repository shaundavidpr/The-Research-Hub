"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EnhancedFileManager } from "@/components/enhanced-file-manager"
import { Upload, FolderOpen } from "lucide-react"

export default function FilesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Files"
        text="Upload, organize, and analyze your research files with AI assistance."
        icon={<FolderOpen className="h-5 w-5 text-muted-foreground" />}
      />

      <EnhancedFileManager />
    </DashboardShell>
  )
}
