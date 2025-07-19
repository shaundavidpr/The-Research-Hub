"use client"

import { Checkbox } from "@/components/ui/checkbox"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import { Globe, Users, Plus, X, Loader2, Edit, Save, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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
]

const DEGREES = ["Bachelor's", "Master's", "PhD", "Postdoc", "Professor", "Other"]

interface ProfileData {
  name: string
  email: string
  title?: string
  institution?: string
  department?: string
  bio?: string
  avatar?: string
  degree?: string
  field?: string
  advisor?: string
  year_started?: string
  orcid?: string
  google_scholar?: string
  research_topics?: string[]
  methodologies?: string[]
  specializations?: string[]
  profile_visibility?: string
  allow_messages?: boolean
  allow_collaboration?: boolean
  email_notifications?: boolean
  research_updates?: boolean
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const profileId = params.id as string

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [newResearchTopic, setNewResearchTopic] = useState("")
  const [newMethodology, setNewMethodology] = useState("")
  const [newSpecialization, setNewSpecialization] = useState("")

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        router.push("/login")
        return
      }
      setCurrentUserId(user.id)

      const response = await fetch(`/api/profile/${profileId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`)
      }
      const data: ProfileData = await response.json()
      setProfile(data)
    } catch (err: any) {
      setError(err.message || "Failed to load profile.")
      console.error("Error fetching profile:", err)
    } finally {
      setLoading(false)
    }
  }, [profileId, router, supabase])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleInputChange = (field: keyof ProfileData, value: string | boolean | string[]) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null))
    if (error) setError(null)
  }

  const addToList = (
    listName: "research_topics" | "methodologies" | "specializations",
    newItem: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (profile && newItem.trim() && !profile[listName]?.includes(newItem.trim())) {
      setProfile((prev) => (prev ? { ...prev, [listName]: [...(prev[listName] || []), newItem.trim()] } : null))
      setter("")
    }
  }

  const removeFromList = (listName: "research_topics" | "methodologies" | "specializations", itemToRemove: string) => {
    if (profile) {
      setProfile((prev) =>
        prev ? { ...prev, [listName]: (prev[listName] || []).filter((item) => item !== itemToRemove) } : null,
      )
    }
  }

  const handleSave = async () => {
    setIsEditing(false) // Optimistically set to false
    setLoading(true)
    setError(null)

    if (!profile || currentUserId !== profileId) {
      setError("Unauthorized to edit this profile.")
      setLoading(false)
      setIsEditing(true) // Revert if unauthorized
      return
    }

    try {
      const response = await fetch(`/api/profile/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(data)
        toast({
          title: "Profile updated successfully!",
          description: "Your research profile has been saved.",
        })
      } else {
        setError(data.error || "Failed to update profile.")
        setIsEditing(true) // Revert to editing if save failed
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.")
      setIsEditing(true) // Revert to editing if save failed
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading profile...</span>
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertDescription className="text-red-500">{error}</AlertDescription>
          <Button onClick={fetchProfile} className="mt-4">
            Try Again
          </Button>
        </div>
      </DashboardShell>
    )
  }

  if (!profile) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertDescription>Profile not found.</AlertDescription>
        </div>
      </DashboardShell>
    )
  }

  const isOwner = currentUserId === profileId

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={profile.avatar || "/placeholder-user.jpg"} />
              <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                {profile.name ? profile.name.charAt(0) : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.title}</p>
              <p className="text-muted-foreground text-sm">{profile.institution}</p>
            </div>
          </div>
          {isOwner && (
            <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Profile
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </>
              )}
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">About Me</CardTitle>
            <CardDescription>A brief overview of my research and background.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Highest Degree</Label>
                <Input
                  id="degree"
                  value={profile.degree || "N/A"}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio || "No bio provided."}
                disabled={!isEditing}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field">Primary Research Field</Label>
                <Input
                  id="field"
                  value={profile.field || "N/A"}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("field", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={profile.institution || "N/A"}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("institution", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Research Interests</CardTitle>
            <CardDescription>My key areas of focus.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(profile.research_topics || []).map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {topic}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeFromList("research_topics", topic)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newResearchTopic}
                  onChange={(e) => setNewResearchTopic(e.target.value)}
                  placeholder="Add research topic"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addToList("research_topics", newResearchTopic, setNewResearchTopic))
                  }
                />
                <Button
                  type="button"
                  onClick={() => addToList("research_topics", newResearchTopic, setNewResearchTopic)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Methodologies</CardTitle>
            <CardDescription>The research methods I commonly employ.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(profile.methodologies || []).map((method, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {method}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeFromList("methodologies", method)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newMethodology}
                  onChange={(e) => setNewMethodology(e.target.value)}
                  placeholder="Add methodology"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addToList("methodologies", newMethodology, setNewMethodology))
                  }
                />
                <Button type="button" onClick={() => addToList("methodologies", newMethodology, setNewMethodology)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Specializations</CardTitle>
            <CardDescription>Specific areas of expertise within my field.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(profile.specializations || []).map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {spec}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeFromList("specializations", spec)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Add specialization"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addToList("specializations", newSpecialization, setNewSpecialization))
                  }
                />
                <Button
                  type="button"
                  onClick={() => addToList("specializations", newSpecialization, setNewSpecialization)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Privacy & Communication</CardTitle>
            <CardDescription>How others can view and interact with your profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profileVisibility">Profile Visibility</Label>
              <Select
                value={profile.profile_visibility || "public"}
                onValueChange={(value) => handleInputChange("profile_visibility", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Public - Anyone can view
                    </div>
                  </SelectItem>
                  <SelectItem value="institutional">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> Institutional - Members of your institution only
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Private - Only you
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowMessages"
                checked={profile.allow_messages || false}
                onCheckedChange={(checked) => handleInputChange("allow_messages", checked)}
                disabled={!isEditing}
              />
              <Label htmlFor="allowMessages">Allow other researchers to send me messages</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowCollaboration"
                checked={profile.allow_collaboration || false}
                onCheckedChange={(checked) => handleInputChange("allow_collaboration", checked)}
                disabled={!isEditing}
              />
              <Label htmlFor="allowCollaboration">Open to collaboration requests</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailNotifications"
                checked={profile.email_notifications || false}
                onCheckedChange={(checked) => handleInputChange("email_notifications", checked)}
                disabled={!isEditing}
              />
              <Label htmlFor="emailNotifications">Receive email notifications</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="researchUpdates"
                checked={profile.research_updates || false}
                onCheckedChange={(checked) => handleInputChange("research_updates", checked)}
                disabled={!isEditing}
              />
              <Label htmlFor="researchUpdates">Receive research updates and newsletters</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
