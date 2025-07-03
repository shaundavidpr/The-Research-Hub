"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardShell } from "@/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Building,
  GraduationCap,
  Save,
  Camera,
  MapPin,
  Calendar,
  Edit,
  Plus,
  Users,
  FileText,
  MessageSquare,
  UserPlus,
  Award,
  LinkIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  name: string
  email: string
  title: string
  institution: string
  location: string
  bio: string
  website: string
  researchInterests: string[]
  avatar: string
  joinDate: string
  followers: number
  following: number
  papers: number
  citations: number
  hIndex: number
  achievements: string[]
}

interface Publication {
  id: string
  title: string
  journal: string
  year: string
  citations: number
  downloads: number
}

interface Collaborator {
  id: string
  name: string
  institution: string
  field: string
  avatar: string
  isFollowing: boolean
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    title: "",
    institution: "",
    location: "",
    bio: "",
    website: "",
    researchInterests: [],
    avatar: "",
    joinDate: new Date().toISOString().split("T")[0],
    followers: 0,
    following: 0,
    papers: 0,
    citations: 0,
    hIndex: 0,
    achievements: [],
  })
  const [newInterest, setNewInterest] = useState("")
  const [publications, setPublications] = useState<Publication[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }

    // Load sample collaborators
    setCollaborators([
      {
        id: "1",
        name: "Dr. Sarah Chen",
        institution: "MIT",
        field: "Computer Science",
        avatar: "/placeholder.svg?height=40&width=40",
        isFollowing: true,
      },
      {
        id: "2",
        name: "Prof. Michael Rodriguez",
        institution: "Stanford University",
        field: "Environmental Science",
        avatar: "/placeholder.svg?height=40&width=40",
        isFollowing: false,
      },
      {
        id: "3",
        name: "Dr. Emily Watson",
        institution: "Harvard Medical School",
        field: "Biotechnology",
        avatar: "/placeholder.svg?height=40&width=40",
        isFollowing: true,
      },
    ])
  }, [])

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile))
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    })
  }

  const addResearchInterest = () => {
    if (newInterest.trim() && !profile.researchInterests.includes(newInterest.trim())) {
      setProfile((prev) => ({
        ...prev,
        researchInterests: [...prev.researchInterests, newInterest.trim()],
      }))
      setNewInterest("")
    }
  }

  const removeResearchInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((i) => i !== interest),
    }))
  }

  const toggleFollow = (collaboratorId: string) => {
    setCollaborators((prev) =>
      prev.map((collab) => (collab.id === collaboratorId ? { ...collab, isFollowing: !collab.isFollowing } : collab)),
    )

    // Update follower count
    const collaborator = collaborators.find((c) => c.id === collaboratorId)
    if (collaborator) {
      setProfile((prev) => ({
        ...prev,
        following: collaborator.isFollowing ? prev.following - 1 : prev.following + 1,
      }))
    }
  }

  const getInitials = (name: string) => {
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your research profile and connect with the community</p>
          </div>
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                      <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">{profile.name || "Complete your profile"}</h2>
                    <p className="text-muted-foreground">{profile.title}</p>
                    <p className="text-sm text-muted-foreground">{profile.institution}</p>
                  </div>

                  {profile.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}

                  <div className="flex gap-6 text-center">
                    <div>
                      <p className="font-bold text-lg">{profile.followers}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{profile.following}</p>
                      <p className="text-xs text-muted-foreground">Following</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{profile.papers}</p>
                      <p className="text-xs text-muted-foreground">Papers</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full">
                    <Button className="flex-1 bg-transparent" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button className="flex-1">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
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
                <div className="flex justify-between">
                  <span className="text-sm">Collaborations</span>
                  <span className="font-bold">{collaborators.filter((c) => c.isFollowing).length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.achievements.length > 0 ? (
                  <div className="space-y-2">
                    {profile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No achievements yet. Keep researching!</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="publications">Publications</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Your professional details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="title"
                            value={profile.title}
                            onChange={(e) => setProfile((prev) => ({ ...prev, title: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="e.g., PhD Student, Professor, Researcher"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="institution"
                            value={profile.institution}
                            onChange={(e) => setProfile((prev) => ({ ...prev, institution: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="University or Organization"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="website"
                            value={profile.website}
                            onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="https://your-website.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Tell us about your research background and interests..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Research Interests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Research Interests</CardTitle>
                    <CardDescription>Add topics and areas you're interested in researching</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.researchInterests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {interest}
                          {isEditing && (
                            <button
                              onClick={() => removeResearchInterest(interest)}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                      {profile.researchInterests.length === 0 && (
                        <p className="text-muted-foreground text-sm">No research interests added yet.</p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="Add research interest..."
                          onKeyPress={(e) => e.key === "Enter" && addResearchInterest()}
                        />
                        <Button onClick={addResearchInterest} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="publications" className="space-y-4">
                {publications.length > 0 ? (
                  publications.map((paper) => (
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
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No publications yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start publishing your research to build your academic profile.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Publication
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="network" className="space-y-4">
                <div className="grid gap-4">
                  {collaborators.map((collaborator) => (
                    <Card key={collaborator.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                              <AvatarFallback>
                                {collaborator.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{collaborator.name}</p>
                              <p className="text-sm text-muted-foreground">{collaborator.institution}</p>
                              <p className="text-xs text-muted-foreground">{collaborator.field}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button
                              variant={collaborator.isFollowing ? "secondary" : "default"}
                              size="sm"
                              onClick={() => toggleFollow(collaborator.id)}
                            >
                              <Users className="h-4 w-4 mr-1" />
                              {collaborator.isFollowing ? "Following" : "Follow"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
                    <p className="text-muted-foreground">
                      Your recent research activities will appear here as you use the platform.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
