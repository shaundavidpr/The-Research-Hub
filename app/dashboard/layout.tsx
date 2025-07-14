"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Home,
  BookOpen,
  Folder,
  Calendar,
  Sparkles,
  Users,
  FileText,
  BarChart,
  Settings,
  Menu,
  Brain,
} from "lucide-react"
import { EnhancedAethonAssistant } from "@/components/enhanced-aethon-assistant"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isAethonOpen, setIsAethonOpen] = useState(false)

  const getAethonContext = (path: string) => {
    if (path.startsWith("/notes")) return "notes"
    if (path.startsWith("/files")) return "files"
    if (path.startsWith("/projects")) return "projects"
    if (path.startsWith("/community")) return "community"
    if (path.startsWith("/publish")) return "publish"
    if (path.startsWith("/citations")) return "citations"
    if (path.startsWith("/calendar")) return "calendar"
    return "general"
  }

  const aethonContext = getAethonContext(pathname)

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="">The Research Hub</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname === "/dashboard" ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Dashboard</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/notes"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname.startsWith("/notes") ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      Notes
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Notes</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/files"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname.startsWith("/files") ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Folder className="h-4 w-4" />
                      Files
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Files</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/projects"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname.startsWith("/projects") ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      Projects
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Projects</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/calendar"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname.startsWith("/calendar") ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      Calendar
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Calendar</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/citations"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname.startsWith("/citations") ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      Citations
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Citations</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/collaboration"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname.startsWith("/collaboration") ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      Collaboration
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Collaboration</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/analytics"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname.startsWith("/analytics") ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <BarChart className="h-4 w-4" />
                      Analytics
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Analytics</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/ai-assistant"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname.startsWith("/ai-assistant") ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                      AI Assistant
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">AI Assistant</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/settings"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                        pathname.startsWith("/settings") ? "bg-muted text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span className="">The Research Hub</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname === "/dashboard" ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/notes"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname.startsWith("/notes") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  Notes
                </Link>
                <Link
                  href="/files"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname.startsWith("/files") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Folder className="h-5 w-5" />
                  Files
                </Link>
                <Link
                  href="/projects"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname.startsWith("/projects") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  Projects
                </Link>
                <Link
                  href="/calendar"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname.startsWith("/calendar") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  Calendar
                </Link>
                <Link
                  href="/citations"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname.startsWith("/citations") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  Citations
                </Link>
                <Link
                  href="/collaboration"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname.startsWith("/collaboration") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  Collaboration
                </Link>
                <Link
                  href="/analytics"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname.startsWith("/analytics") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <BarChart className="h-5 w-5" />
                  Analytics
                </Link>
                <Link
                  href="/ai-assistant"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname.startsWith("/ai-assistant") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Sparkles className="h-5 w-5" />
                  AI Assistant
                </Link>
                <Link
                  href="/settings"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    pathname.startsWith("/settings") ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          {/* Add any other header content here if needed */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>

        {/* Floating Aethon AI Assistant Button */}
        <Sheet open={isAethonOpen} onOpenChange={setIsAethonOpen}>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="fixed bottom-6 right-6 rounded-full shadow-lg h-14 w-14 z-50"
              onClick={() => setIsAethonOpen(true)}
            >
              <Brain className="h-7 w-7" />
              <span className="sr-only">Open Aethon AI Assistant</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
            <ScrollArea className="flex-1 h-full">
              <div className="p-6">
                <EnhancedAethonAssistant context={aethonContext} />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
