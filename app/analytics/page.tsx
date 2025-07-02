"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  TrendingUp, 
  Eye, 
  Download, 
  Heart, 
  Users,
  FileText,
  Calendar,
  Award
} from "lucide-react"

export default function AnalyticsPage() {
  const publicationData = [
    { month: 'Jan', papers: 2, citations: 45 },
    { month: 'Feb', papers: 1, citations: 67 },
    { month: 'Mar', papers: 3, citations: 89 },
    { month: 'Apr', papers: 2, citations: 123 },
    { month: 'May', papers: 4, citations: 156 },
    { month: 'Jun', papers: 1, citations: 178 }
  ]

  const engagementData = [
    { name: 'Views', value: 2340, color: '#8884d8' },
    { name: 'Downloads', value: 890, color: '#82ca9d' },
    { name: 'Likes', value: 456, color: '#ffc658' },
    { name: 'Shares', value: 234, color: '#ff7300' }
  ]

  const collaborationData = [
    { month: 'Jan', projects: 2, collaborators: 8 },
    { month: 'Feb', projects: 2, collaborators: 12 },
    { month: 'Mar', projects: 3, collaborators: 15 },
    { month: 'Apr', projects: 3, collaborators: 18 },
    { month: 'May', projects: 4, collaborators: 22 },
    { month: 'Jun', projects: 4, collaborators: 25 }
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Analytics"
        text="Track your research impact, engagement, and collaboration metrics."
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Publications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citations</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,500</div>
            <p className="text-xs text-muted-foreground">+234 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,340</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="publications" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="publications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Publications Over Time</CardTitle>
                <CardDescription>Number of papers published each month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={publicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="papers" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Citations Growth</CardTitle>
                <CardDescription>Monthly citation accumulation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={publicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="citations" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
                <CardDescription>How users interact with your research</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Papers</CardTitle>
                <CardDescription>Papers with highest engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium text-sm">Quantum ML Algorithms</p>
                      <p className="text-xs text-muted-foreground">234 views • 89 downloads</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm">45</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium text-sm">Quantum Error Correction</p>
                      <p className="text-xs text-muted-foreground">189 views • 67 downloads</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm">32</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium text-sm">Hybrid Optimization Methods</p>
                      <p className="text-xs text-muted-foreground">156 views • 45 downloads</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm">28</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Growth</CardTitle>
              <CardDescription>Projects and collaborators over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={collaborationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="projects" stroke="#8884d8" strokeWidth={2} name="Projects" />
                  <Line type="monotone" dataKey="collaborators" stroke="#82ca9d" strokeWidth={2} name="Collaborators" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>h-index</CardTitle>
                <CardDescription>Research impact metric</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">34</div>
                <p className="text-sm text-muted-foreground mt-2">
                  34 papers with at least 34 citations each
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>i10-index</CardTitle>
                <CardDescription>Papers with 10+ citations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">28</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Papers cited 10 or more times
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Citations</CardTitle>
                <CardDescription>Per paper citation average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">278</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Citations per published paper
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}