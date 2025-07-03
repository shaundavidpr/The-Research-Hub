"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { 
  User, 
  Mail, 
  Building, 
  GraduationCap, 
  LinkIcon, 
  Save,
  Users,
  FileText,
  Star,
  MapPin,
  Calendar,
  Award,
  Plus,
  UserPlus,
  MessageSquare
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Dr. Sarah Chen",
    title: "Professor of Computer Science",
    institution: "MIT",
    location: "Cambridge, MA",
    email: "s.chen@mit.edu",
    website: "https://sarahchen.mit.edu",
    bio: "Research scientist specializing in quantum computing and machine learning. Passionate about advancing the intersection of quantum algorithms and artificial intelligence.",
    followers: 2340,
    following: 456,
    papers: 45,
    citations: 12500,
    hIndex: 34,
    researchInterests: "Quantum Computing, Machine Learning, Algorithms, Artificial Intelligence",
    achievements: ["Best Paper Award 2023", "NSF Career Award", "IEEE Fellow"]
  })

  const recentPapers = [
    {
      id: 1,
      title: "Quantum Machine Learning Algorithms for Pattern Recognition",
      journal: "Nature Quantum Information",
      year: "2024",
      citations: 89,
      downloads: 234
    },
    {
      id: 2,
      title: "Advances in Quantum Error Correction for NISQ Devices",
      journal: "Physical Review Letters",
      year: "2023",
      citations: 156,
      downloads: 567
    }
  ]

  const collaborators = [
    { name: "Prof. Michael Rodriguez", institution: "Stanford", field: "Data Science" },
    { name: "Dr. Emily Watson", institution: "Harvard", field: "Machine Learning" },
    { name: "Dr. James Liu", institution: "Berkeley", field: "Quantum Physics" }
  ]

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, save to backend
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Profile"
        text="Manage your research profile and connect with the community."
        icon={<User className="h-5 w-5 text-muted-foreground" />}
        actions={
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <Save className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={profile.name} />
                  <AvatarFallback className="text-lg">SC</AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <div className="w-full space-y-2">
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="text-center"
                    />
                    <Input
                      value={profile.title}
                      onChange={(e) => setProfile({...profile, title: e.target.value})}
                      className="text-center text-sm"
                    />
                    <Input
                      value={profile.institution}
                      onChange={(e) => setProfile({...profile, institution: e.target.value})}
                      className="text-center text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.title}</p>
                    <p className="text-sm text-muted-foreground">{profile.institution}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>

                <div className="flex gap-4 text-center">
                  <div>
                    <p className="font-bold">{profile.followers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold">{profile.following}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div>
                    <p className="font-bold">{profile.papers}</p>
                    <p className="text-xs text-muted-foreground">Papers</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                  <Button className="flex-1">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Research Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Total Citations</span>
                <span className="font-bold">{profile.citations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">h-index</span>
                <span className="font-bold">{profile.hIndex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Publications</span>
                <span className="font-bold">{profile.papers}</span>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="collaborations">Network</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Input
                      value={profile.researchInterests}
                      onChange={(e) => setProfile({...profile, researchInterests: e.target.value})}
                      placeholder="Enter research interests..."
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.researchInterests.split(', ').map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    ) : (
                      <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                        {profile.email}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                      />
                    ) : (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Personal Website
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="publications" className="space-y-4">
              {recentPapers.map((paper) => (
                <Card key={paper.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{paper.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {paper.journal} • {paper.year}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{paper.citations} citations</span>
                      <span>{paper.downloads} downloads</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="collaborations" className="space-y-4">
              <div className="grid gap-4">
                {collaborators.map((collaborator, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{collaborator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{collaborator.name}</p>
                            <p className="text-sm text-muted-foreground">{collaborator.institution}</p>
                            <p className="text-xs text-muted-foreground">{collaborator.field}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your recent research activities will appear here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}