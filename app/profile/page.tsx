"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardShell } from "@/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  LinkIcon,
  Trophy,
  Target,
  BookOpen,
  Star,
  Zap,
  Crown,
  Medal,
  CheckCircle,
  Phone,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Upload,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  name: string
  email: string
  title: string
  institution: string
  department: string
  location: string
  bio: string
  website: string
  phone: string
  socialLinks: {
    twitter: string
    linkedin: string
    github: string
    orcid: string
    googleScholar: string
  }
  researchInterests: string[]
  skills: string[]
  languages: string[]
  avatar: string
  joinDate: string
  followers: number
  following: number
  papers: number
  citations: number
  hIndex: number
  achievements: Achievement[]
  isPublic: boolean
  allowMessages: boolean
  allowCollaboration: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: any
  color: string
  earned: boolean
  progress?: number
  requirement?: number
  earnedDate?: string
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

const ACADEMIC_TITLES = [
  { value: "undergraduate", label: "Undergraduate Student" },
  { value: "graduate", label: "Graduate Student" },
  { value: "masters", label: "Master's Student" },
  { value: "phd", label: "PhD Student" },
  { value: "phd-candidate", label: "PhD Candidate" },
  { value: "postdoc", label: "Postdoctoral Researcher" },
  { value: "research-assistant", label: "Research Assistant" },
  { value: "research-associate", label: "Research Associate" },
  { value: "research-scientist", label: "Research Scientist" },
  { value: "senior-researcher", label: "Senior Researcher" },
  { value: "principal-investigator", label: "Principal Investigator" },
  { value: "lecturer", label: "Lecturer" },
  { value: "assistant-professor", label: "Assistant Professor" },
  { value: "associate-professor", label: "Associate Professor" },
  { value: "professor", label: "Professor" },
  { value: "emeritus-professor", label: "Professor Emeritus" },
  { value: "visiting-scholar", label: "Visiting Scholar" },
  { value: "industry-researcher", label: "Industry Researcher" },
  { value: "consultant", label: "Research Consultant" },
  { value: "independent", label: "Independent Researcher" },
  { value: "other", label: "Other" },
]

const RESEARCH_FIELDS = [
  "Computer Science",
  "Engineering",
  "Medicine",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Psychology",
  "Sociology",
  "Economics",
  "Political Science",
  "History",
  "Literature",
  "Philosophy",
  "Environmental Science",
  "Neuroscience",
  "Biotechnology",
  "Materials Science",
  "Astronomy",
  "Geology",
  "Anthropology",
  "Education",
  "Business",
  "Law",
  "Art",
  "Music",
  "Architecture",
  "Other",
]

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Czech",
  "Hungarian",
  "Greek",
  "Turkish",
  "Hebrew",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Other",
]

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    title: "",
    institution: "",
    department: "",
    location: "",
    bio: "",
    website: "",
    phone: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "",
      orcid: "",
      googleScholar: "",
    },
    researchInterests: [],
    skills: [],
    languages: [],
    avatar: "",
    joinDate: new Date().toISOString().split("T")[0],
    followers: 0,
    following: 0,
    papers: 0,
    citations: 0,
    hIndex: 0,
    achievements: [],
    isPublic: true,
    allowMessages: true,
    allowCollaboration: true,
  })
  const [newInterest, setNewInterest] = useState("")
  const [publications, setPublications] = useState<Publication[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  // Achievement system
  const availableAchievements: Achievement[] = [
    {
      id: "first_paper",
      name: "First Publication",
      description: "Publish your first research paper",
      icon: FileText,
      color: "text-blue-600",
      earned: false,
      progress: 0,
      requirement: 1,
    },
    {
      id: "prolific_author",
      name: "Prolific Author",
      description: "Publish 10 research papers",
      icon: BookOpen,
      color: "text-green-600",
      earned: false,
      progress: 0,
      requirement: 10,
    },
    {
      id: "citation_master",
      name: "Citation Master",
      description: "Receive 100 citations",
      icon: Star,
      color: "text-yellow-600",
      earned: false,
      progress: 0,
      requirement: 100,
    },
    {
      id: "collaborator",
      name: "Team Player",
      description: "Collaborate with 5 researchers",
      icon: Users,
      color: "text-purple-600",
      earned: false,
      progress: 0,
      requirement: 5,
    },
    {
      id: "h_index_hero",
      name: "H-Index Hero",
      description: "Achieve an H-index of 10",
      icon: Trophy,
      color: "text-orange-600",
      earned: false,
      progress: 0,
      requirement: 10,
    },
    {
      id: "research_veteran",
      name: "Research Veteran",
      description: "Active for 2 years",
      icon: Medal,
      color: "text-red-600",
      earned: false,
      progress: 0,
      requirement: 730, // days
    },
    {
      id: "network_builder",
      name: "Network Builder",
      description: "Follow 50 researchers",
      icon: Zap,
      color: "text-teal-600",
      earned: false,
      progress: 0,
      requirement: 50,
    },
    {
      id: "thought_leader",
      name: "Thought Leader",
      description: "Gain 100 followers",
      icon: Crown,
      color: "text-indigo-600",
      earned: false,
      progress: 0,
      requirement: 100,
    },
  ]

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const loadedProfile = JSON.parse(savedProfile)
      setProfile(loadedProfile)
      updateAchievements(loadedProfile)
    } else {
      // Initialize with default achievements and zero stats
      setProfile((prev) => ({
        ...prev,
        achievements: availableAchievements,
        followers: 0,
        following: 0,
        papers: 0,
        citations: 0,
        hIndex: 0,
      }))
    }

    // Load sample collaborators (in real app, this would come from API)
    setCollaborators([
      {
        id: "1",
        name: "Dr. Sarah Chen",
        institution: "MIT",
        field: "Computer Science",
        avatar: "/placeholder.svg?height=40&width=40",
        isFollowing: false,
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
        isFollowing: false,
      },
    ])
  }, [])

  const updateAchievements = (profileData: UserProfile) => {
    const updatedAchievements = availableAchievements.map((achievement) => {
      let progress = 0
      let earned = false

      switch (achievement.id) {
        case "first_paper":
          progress = profileData.papers
          earned = profileData.papers >= 1
          break
        case "prolific_author":
          progress = profileData.papers
          earned = profileData.papers >= 10
          break
        case "citation_master":
          progress = profileData.citations
          earned = profileData.citations >= 100
          break
        case "collaborator":
          progress = profileData.following
          earned = profileData.following >= 5
          break
        case "h_index_hero":
          progress = profileData.hIndex
          earned = profileData.hIndex >= 10
          break
        case "research_veteran":
          const daysSinceJoin = Math.floor(
            (Date.now() - new Date(profileData.joinDate).getTime()) / (1000 * 60 * 60 * 24),
          )
          progress = daysSinceJoin
          earned = daysSinceJoin >= 730
          break
        case "network_builder":
          progress = profileData.following
          earned = profileData.following >= 50
          break
        case "thought_leader":
          progress = profileData.followers
          earned = profileData.followers >= 100
          break
      }

      return {
        ...achievement,
        progress,
        earned,
        earnedDate: earned ? new Date().toISOString() : undefined,
      }
    })

    setProfile((prev) => ({ ...prev, achievements: updatedAchievements }))
  }

  const handleSave = async () => {
    try {
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem("userProfile", JSON.stringify(profile))

      // Update achievements
      updateAchievements(profile)

      setIsEditing(false)

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a file storage service
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile((prev) => ({ ...prev, avatar: e.target?.result as string }))
        setShowAvatarDialog(false)
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated.",
        })
      }
      reader.readAsDataURL(file)
    }
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

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const addLanguage = () => {
    if (newLanguage && !profile.languages.includes(newLanguage)) {
      setProfile((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage],
      }))
      setNewLanguage("")
    }
  }

  const removeLanguage = (language: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }))
  }

  const toggleFollow = async (collaboratorId: string) => {
    const collaborator = collaborators.find((c) => c.id === collaboratorId)
    if (!collaborator) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCollaborators((prev) =>
        prev.map((collab) => (collab.id === collaboratorId ? { ...collab, isFollowing: !collab.isFollowing } : collab)),
      )

      // Update following count
      setProfile((prev) => ({
        ...prev,
        following: collaborator.isFollowing ? prev.following - 1 : prev.following + 1,
      }))

      toast({
        title: collaborator.isFollowing ? "Unfollowed" : "Following",
        description: `You are ${collaborator.isFollowing ? "no longer following" : "now following"} ${collaborator.name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const sendMessage = async (collaboratorId: string) => {
    const collaborator = collaborators.find((c) => c.id === collaboratorId)
    if (!collaborator) return

    toast({
      title: "Message sent",
      description: `Your message to ${collaborator.name} has been sent.`,
    })
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

  const earnedAchievements = profile.achievements.filter((a) => a.earned)
  const profileCompleteness = Math.min(
    100,
    Math.round(
      (((profile.name ? 1 : 0) +
        (profile.email ? 1 : 0) +
        (profile.title ? 1 : 0) +
        (profile.institution ? 1 : 0) +
        (profile.bio ? 1 : 0) +
        (profile.researchInterests.length > 0 ? 1 : 0) +
        (profile.location ? 1 : 0) +
        (profile.avatar ? 1 : 0) +
        (profile.skills.length > 0 ? 1 : 0) +
        (profile.languages.length > 0 ? 1 : 0)) /
        10) *
        100,
    ),
  )

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
                      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Profile Picture</DialogTitle>
                            <DialogDescription>
                              Choose a new profile picture. Recommended size: 400x400px
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                              </label>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                    <Button
                      className="flex-1 bg-transparent"
                      variant="outline"
                      onClick={() =>
                        toast({ title: "Feature Coming Soon", description: "Direct messaging will be available soon." })
                      }
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() =>
                        toast({
                          title: "Feature Coming Soon",
                          description: "Follow functionality will be available soon.",
                        })
                      }
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Profile Complete</span>
                    <span className="text-sm font-medium">{profileCompleteness}%</span>
                  </div>
                  <Progress value={profileCompleteness} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {profileCompleteness === 100
                      ? "Your profile is complete!"
                      : "Complete your profile to unlock more features"}
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
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Achievements ({earnedAchievements.length}/{profile.achievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {earnedAchievements.length > 0 ? (
                  <div className="space-y-3">
                    {earnedAchievements.slice(0, 3).map((achievement) => {
                      const Icon = achievement.icon
                      return (
                        <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <div className={`w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center`}>
                            <Icon className={`h-4 w-4 ${achievement.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{achievement.name}</p>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      )
                    })}
                    {earnedAchievements.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{earnedAchievements.length - 3} more achievements
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Complete your profile and start researching to earn achievements!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="publications">Publications</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
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
                        <Label htmlFor="name">Full Name *</Label>
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
                        <Label htmlFor="email">Email Address *</Label>
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
                        <Label htmlFor="title">Academic Title/Role *</Label>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <Select
                            value={profile.title}
                            onValueChange={(value) => setProfile((prev) => ({ ...prev, title: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your academic title" />
                            </SelectTrigger>
                            <SelectContent>
                              {ACADEMIC_TITLES.map((title) => (
                                <SelectItem key={title.value} value={title.value}>
                                  {title.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution *</Label>
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
                        <Label htmlFor="department">Department/Faculty</Label>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="department"
                            value={profile.department}
                            onChange={(e) => setProfile((prev) => ({ ...prev, department: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Computer Science Department"
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
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Personal Website</Label>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
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
                        placeholder="Tell us about your research background, interests, and current work..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Social & Academic Links</CardTitle>
                    <CardDescription>Connect your professional and academic profiles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter/X</Label>
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="twitter"
                            value={profile.socialLinks.twitter}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                              }))
                            }
                            disabled={!isEditing}
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            value={profile.socialLinks.linkedin}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                              }))
                            }
                            disabled={!isEditing}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="github"
                            value={profile.socialLinks.github}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, github: e.target.value },
                              }))
                            }
                            disabled={!isEditing}
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orcid">ORCID ID</Label>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="orcid"
                            value={profile.socialLinks.orcid}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, orcid: e.target.value },
                              }))
                            }
                            disabled={!isEditing}
                            placeholder="0000-0000-0000-0000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="googleScholar">Google Scholar Profile</Label>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="googleScholar"
                            value={profile.socialLinks.googleScholar}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, googleScholar: e.target.value },
                              }))
                            }
                            disabled={!isEditing}
                            placeholder="https://scholar.google.com/citations?user=..."
                          />
                        </div>
                      </div>
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
                              <X className="h-3 w-3" />
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

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                    <CardDescription>Add your technical skills, methodologies, and areas of expertise</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {profile.skills.length === 0 && (
                        <p className="text-muted-foreground text-sm">No skills added yet.</p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add skill or expertise..."
                          onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button onClick={addSkill} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                    <CardDescription>Languages you speak for international collaboration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((language, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {language}
                          {isEditing && (
                            <button
                              onClick={() => removeLanguage(language)}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {profile.languages.length === 0 && (
                        <p className="text-muted-foreground text-sm">No languages added yet.</p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2">
                        <Select value={newLanguage} onValueChange={setNewLanguage}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={addLanguage} size="sm" disabled={!newLanguage}>
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
                      <Button asChild>
                        <a href="/publish">
                          <Plus className="h-4 w-4 mr-2" />
                          Publish Paper
                        </a>
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
                            <Button variant="outline" size="sm" onClick={() => sendMessage(collaborator.id)}>
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

              <TabsContent value="achievements" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.achievements.map((achievement) => {
                    const Icon = achievement.icon
                    const progressPercentage = achievement.requirement
                      ? Math.min(100, (achievement.progress / achievement.requirement) * 100)
                      : 0

                    return (
                      <Card
                        key={achievement.id}
                        className={`${achievement.earned ? "border-yellow-200 bg-yellow-50/50" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                achievement.earned ? "bg-yellow-100" : "bg-gray-100"
                              }`}
                            >
                              <Icon className={`h-5 w-5 ${achievement.earned ? achievement.color : "text-gray-400"}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{achievement.name}</h3>
                                {achievement.earned && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>

                              {!achievement.earned && achievement.requirement && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>
                                      {achievement.progress} / {achievement.requirement}
                                    </span>
                                    <span>{Math.round(progressPercentage)}%</span>
                                  </div>
                                  <Progress value={progressPercentage} className="h-1" />
                                </div>
                              )}

                              {achievement.earned && achievement.earnedDate && (
                                <p className="text-xs text-muted-foreground">
                                  Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
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
