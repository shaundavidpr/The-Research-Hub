"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare,
  Video,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus
} from "lucide-react"

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState("projects")

  const collaborativeProjects = [
    {
      id: 1,
      title: "Quantum Computing Research Initiative",
      description: "Multi-institutional research on quantum algorithms",
      members: 8,
      status: "active",
      deadline: "2024-06-15",
      progress: 65,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      title: "Climate Change Data Analysis",
      description: "Global climate data modeling and prediction",
      members: 12,
      status: "planning",
      deadline: "2024-08-30",
      progress: 25,
      lastActivity: "1 day ago"
    }
  ]

  const invitations = [
    {
      id: 1,
      project: "AI Ethics in Healthcare",
      invitedBy: "Dr. Emily Watson",
      institution: "Harvard Medical School",
      role: "Co-Researcher",
      invitedAt: "2 days ago"
    },
    {
      id: 2,
      project: "Sustainable Energy Solutions",
      invitedBy: "Prof. Michael Rodriguez",
      institution: "Stanford University",
      role: "Data Analyst",
      invitedAt: "1 week ago"
    }
  ]

  const meetings = [
    {
      id: 1,
      title: "Weekly Research Sync",
      project: "Quantum Computing Research Initiative",
      time: "Today, 2:00 PM",
      attendees: 6,
      type: "video"
    },
    {
      id: 2,
      title: "Data Review Meeting",
      project: "Climate Change Data Analysis",
      time: "Tomorrow, 10:00 AM",
      attendees: 4,
      type: "video"
    }
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Collaboration"
        text="Collaborate with researchers worldwide on joint projects and initiatives."
        icon={<Users className="h-5 w-5 text-primary" />}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Start New Project
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search projects..." className="w-full pl-8" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Collaborator
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Team Chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">{meeting.title}</h4>
                  <p className="text-xs text-muted-foreground">{meeting.project}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{meeting.time}</span>
                    <div className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      <span className="text-xs">{meeting.attendees}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="projects">
                <FileText className="mr-2 h-4 w-4" />
                Active Projects
              </TabsTrigger>
              <TabsTrigger value="invitations">
                <UserPlus className="mr-2 h-4 w-4" />
                Invitations
              </TabsTrigger>
              <TabsTrigger value="meetings">
                <Calendar className="mr-2 h-4 w-4" />
                Meetings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-0 space-y-6">
              {collaborativeProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {project.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={project.status === 'active' ? 'default' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        {project.status === 'active' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{project.members} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due {project.deadline}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{project.lastActivity}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                          <Button variant="outline" size="sm">
                            View Project
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="invitations" className="mt-0 space-y-6">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{invitation.project}</CardTitle>
                        <CardDescription className="mt-1">
                          Invited by {invitation.invitedBy} from {invitation.institution}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <p>Role: <span className="font-medium">{invitation.role}</span></p>
                        <p>Invited {invitation.invitedAt}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                        <Button size="sm">
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="meetings" className="mt-0 space-y-6">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <CardDescription>
                      {meeting.project}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{meeting.attendees} attendees</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          <span>Video call</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}
