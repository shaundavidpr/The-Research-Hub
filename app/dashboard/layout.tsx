"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/ui/sidebar" // Assuming this is the main sidebar component
import { EnhancedAethonAssistant } from "@/components/enhanced-aethon-assistant"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAethonOpen, setIsAethonOpen] = useState(false)
  const isMobile = useMobile()

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Main Sidebar (if you have one) */}
      <Sidebar />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
      </div>

      {/* Aethon Assistant Integration */}
      {isMobile ? (
        <Sheet open={isAethonOpen} onOpenChange={setIsAethonOpen}>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="fixed bottom-4 right-4 rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50"
              aria-label="Open Aethon Assistant"
            >
              <Brain className="h-6 w-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0">
            <EnhancedAethonAssistant />
          </SheetContent>
        </Sheet>
      ) : (
        <aside
          className={`fixed right-0 top-0 h-full bg-white border-l transition-all duration-300 ease-in-out z-40 ${
            isAethonOpen ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          <EnhancedAethonAssistant onClose={() => setIsAethonOpen(false)} />
        </aside>
      )}

      {/* Floating button for desktop to open Aethon */}
      {!isMobile && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50"
          onClick={() => setIsAethonOpen(!isAethonOpen)}
          aria-label={isAethonOpen ? "Close Aethon Assistant" : "Open Aethon Assistant"}
        >
          <Brain className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  )
}
