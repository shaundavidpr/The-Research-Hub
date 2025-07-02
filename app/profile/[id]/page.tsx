"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { 
  User, 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  Mail,
  Users,
  FileText,
  Star,
  Eye,
  Download,
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  UserCheck
} from "lucide-react"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  
  // Mock user data - would normally be fetched based on params.id
  const user = {
    id: params.id,
    name: "Dr. Sarah Chen",
    title: "Professor of Computer Science",
    institution: "MIT",
    location: "Cambridge, MA",
    joinDate: "January 2020",
    email: "s.chen@mit.edu",
    website: "https://sarahchen.mit.edu",
    bio: "Research scientist specializing in quantum computing and machine learning. Passionate about advancing the intersection of quantum algorithms and artificial intelligence.",
    followers: 2340,
    following: 456,
    papers: 45,
    citations: 12500,
    hIndex: 34,
    avatar: "/placeholder.svg?height=120&width=120",
    fields: ["Quantum Computing", "Machine Learning", "Algorithms"],
    achievements: ["Best Paper Award 2023", "NSF Career Award", "IEEE Fellow"]
  }

  const papers = [
    {
      id: 1,
      title: "Quantum Machine Learning Algorithms for Pattern Recognition",
      journal: "Nature Quantum Information",
      year: "2024",
      citations: 89,
      downloads: 234,
      likes: 45,
      comments: 12
    },
    {
      id: 2,
      title: "Advances in Quantum Error Correction for NISQ Devices",
      journal: "Physical Review Letters",
      year: "2023",
      citations: 156,
      downloads: 567,
      likes: 78,
      comments: 23
    },
    {
      id: 3,
      title: "Hybrid Classical-Quantum Optimization Methods",
      journal: "Science",
      year: "2023",
      citations: 203,
      downloads: 890,
      likes: 123,
      comments: 34
    }
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Researcher Profile"
        text="View researcher information, publications, and connect with the community."
        icon={<User className="h-5 w-5 text-muted-foreground" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.title}</p>
                  <p className="text-sm text-muted-foreground">{user.institution}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {user.joinDate}</span>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => setIsFollowing(!isFollowing)}
                  variant={isFollowing ? "outline" : "default"}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>

                <div className="flex gap-4 text-center">
                  <div>
                    <p className="font-bold">{user.followers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold">{user.following}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div>
                    <p className="font-bold">{user.papers}</p>
                    <p className="text-xs text-muted-foreground">Papers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                  {user.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Personal Website
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Research Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.fields.map((field) => (
                  <Badge key={field} variant="secondary">
                    {field}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.achievements.map((achievement) => (
                  <div key={achievement} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{user.bio}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary">{user.citations}</div>
                <p className="text-sm text-muted-foreground">Total Citations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary">{user.hIndex}</div>
                <p className="text-sm text-muted-foreground">h-index</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary">{user.papers}</div>
                <p className="text-sm text-muted-foreground">Publications</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="publications" className="w-full">
            <TabsList>
              <TabsTrigger value="publications">
                <FileText className="mr-2 h-4 w-4" />
                Publications
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Users className="mr-2 h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="publications" className="mt-6 space-y-4">
              {papers.map((paper) => (
                <Card key={paper.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg hover:text-primary cursor-pointer">
                      {paper.title}
                    </CardTitle>
                    <CardDescription>
                      {paper.journal} • {paper.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{paper.citations} citations</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{paper.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{paper.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{paper.comments}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/60 mb-4" />
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Recent research activities and interactions will appear here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}