"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Brain,
  Users,
  FileText,
  TrendingUp,
  Plus,
  MessageCircle,
  Heart,
  BookOpen,
  Calendar,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    papers: 0,
    citations: 0,
    projects: 0,
    notes: 0,
  })

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("userStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  const quickActions = [
    {
      title: "Chat with Aethon",
      description: "Get AI-powered research assistance",
      icon: <Brain className="h-5 w-5" />,
      href: "/aethon",
      color: "bg-purple-500",
    },
    {
      title: "Create Note",
      description: "Start a new research note",
      icon: <FileText className="h-5 w-5" />,
      href: "/notes/new",
      color: "bg-blue-500",
    },
    {
      title: "Join Community",
      description: "Connect with researchers",
      icon: <Users className="h-5 w-5" />,
      href: "/community",
      color: "bg-green-500",
    },
    {
      title: "New Project",
      description: "Start a research project",
      icon: <Plus className="h-5 w-5" />,
      href: "/projects/new",
      color: "bg-orange-500",
    },
  ]

  const recentActivity = [
    {
      type: "note",
      title: "Literature Review Notes",
      time: "2 hours ago",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      type: "chat",
      title: "Discussed methodology with Aethon",
      time: "5 hours ago",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      type: "community",
      title: "New follower: Dr. Sarah Chen",
      time: "1 day ago",
      icon: <Users className="h-4 w-4" />,
    },
  ]

  const trendingPapers = [
    {
      title: "Advances in Quantum Computing for ML",
      author: "Dr. Sarah Chen",
      likes: 234,
      comments: 45,
      field: "Computer Science",
    },
    {
      title: "Climate Change Impact on Marine Life",
      author: "Prof. Michael Rodriguez",
      likes: 189,
      comments: 32,
      field: "Environmental Science",
    },
  ]

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">Here's what's happening with your research today.</p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-4 w-4 mr-1" />
            Pro Researcher
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.papers}</div>
              <div className="text-sm text-muted-foreground">Papers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.citations}</div>
              <div className="text-sm text-muted-foreground">Citations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.projects}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.notes}</div>
              <div className="text-sm text-muted-foreground">Notes</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Jump into your most common research tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}
                            >
                              {action.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{action.title}</h3>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Papers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending in Community
                </CardTitle>
                <CardDescription>Popular papers from researchers you follow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingPapers.map((paper, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {paper.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">{paper.title}</h4>
                      <p className="text-sm text-muted-foreground">{paper.author}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {paper.field}
                        </Badge>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {paper.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {paper.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/community">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Trending Papers
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-muted">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Research Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  This Week's Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Complete literature review</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Analyze survey data</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Draft methodology section</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </CardContent>
            </Card>

            {/* AI Assistant Prompt */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold mb-1">Need Research Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ask Aethon AI for assistance with your research questions.
                </p>
                <Link href="/aethon">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Chat with Aethon
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
