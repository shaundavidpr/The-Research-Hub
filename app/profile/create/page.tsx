"use client"

import { Checkbox } from "@/components/ui/checkbox"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import { Globe, Users, Plus, X, Loader2 } from "lucide-react"
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

export default function CreateProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newResearchTopic, setNewResearchTopic] = useState("")
  const [newMethodology, setNewMethodology] = useState("")
  const [newSpecialization, setNewSpecialization] = useState("")

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    title: "",
    institution: "",
    department: "",
    bio: "",
    avatar: "",
    degree: "",
    field: "",
    advisor: "",
    yearStarted: "",
    orcid: "",
    googleScholar: "",
    researchTopics: [] as string[],
    methodologies: [] as string[],
    specializations: [] as string[],
    profileVisibility: "public",
    allowMessages: true,
    allowCollaboration: true,
    emailNotifications: true,
    researchUpdates: true,
  })

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        router.push("/login") // Redirect to login if not authenticated
        return
      }
      setUserId(user.id)
      setProfileData((prev) => ({
        ...prev,
        name: user.user_metadata?.name || "",
        email: user.email || "",
      }))

      // Check if profile already exists
      try {
        const response = await fetch(`/api/profile/${user.id}`)
        if (response.ok) {
          const existingProfile = await response.json()
          // If profile exists, redirect to dashboard or profile view
          toast({
            title: "Profile already exists",
            description: "You already have a profile. Redirecting to dashboard.",
            variant: "default",
          })
          router.push("/dashboard")
        } else if (response.status === 404) {
          // Profile does not exist, proceed with creation
          setIsLoading(false)
        } else {
          throw new Error("Failed to check existing profile.")
        }
      } catch (err: any) {
        setError(err.message || "Failed to check existing profile.")
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [router, supabase, toast])

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const addToList = (
    listName: "researchTopics" | "methodologies" | "specializations",
    newItem: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (newItem.trim() && !profileData[listName].includes(newItem.trim())) {
      setProfileData((prev) => ({
        ...prev,
        [listName]: [...prev[listName], newItem.trim()],
      }))
      setter("")
    }
  }

  const removeFromList = (listName: "researchTopics" | "methodologies" | "specializations", itemToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((item) => item !== itemToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!userId) {
      setError("User not authenticated. Please log in again.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...profileData, userId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Profile created successfully!",
          description: "Your research profile is now live.",
        })
        router.push("/dashboard")
      } else {
        setError(data.error || "Failed to create profile.")
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading profile...</span>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Create Your Research Profile</h1>
          <p className="text-muted-foreground">Share your expertise and connect with the global research community.</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Basic Information</CardTitle>
              <CardDescription>Tell us about yourself.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Dr. Jane Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="jane.smith@university.edu"
                    disabled // Email usually comes from auth
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Professor, Research Scientist, PhD Candidate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={profileData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    placeholder="University of Research"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={profileData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="Department of Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="A brief description of your research interests and background."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                <Input
                  id="avatar"
                  value={profileData.avatar}
                  onChange={(e) => handleInputChange("avatar", e.target.value)}
                  placeholder="https://example.com/your-avatar.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Academic Details</CardTitle>
              <CardDescription>Your academic background and affiliations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Highest Degree</Label>
                  <Select value={profileData.degree} onValueChange={(value) => handleInputChange("degree", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEGREES.map((degree) => (
                        <SelectItem key={degree} value={degree}>
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field">Primary Research Field</Label>
                  <Select value={profileData.field} onValueChange={(value) => handleInputChange("field", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESEARCH_FIELDS.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="advisor">Advisor/Supervisor (if applicable)</Label>
                  <Input
                    id="advisor"
                    value={profileData.advisor}
                    onChange={(e) => handleInputChange("advisor", e.target.value)}
                    placeholder="Prof. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearStarted">Year Started Research</Label>
                  <Input
                    id="yearStarted"
                    type="number"
                    value={profileData.yearStarted}
                    onChange={(e) => handleInputChange("yearStarted", e.target.value)}
                    placeholder="YYYY"
                    min="1900"
                    max={new Date().getFullYear().toString()}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orcid">ORCID iD (Optional)</Label>
                  <Input
                    id="orcid"
                    value={profileData.orcid}
                    onChange={(e) => handleInputChange("orcid", e.target.value)}
                    placeholder="e.g., 0000-0002-1825-0097"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleScholar">Google Scholar Profile (Optional)</Label>
                  <Input
                    id="googleScholar"
                    value={profileData.googleScholar}
                    onChange={(e) => handleInputChange("googleScholar", e.target.value)}
                    placeholder="Link to your Google Scholar profile"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Research Interests</CardTitle>
              <CardDescription>Keywords that describe your research focus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profileData.researchTopics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeFromList("researchTopics", topic)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newResearchTopic}
                  onChange={(e) => setNewResearchTopic(e.target.value)}
                  placeholder="Add research topic (e.g., AI Ethics)"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addToList("researchTopics", newResearchTopic, setNewResearchTopic))
                  }
                />
                <Button
                  type="button"
                  onClick={() => addToList("researchTopics", newResearchTopic, setNewResearchTopic)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Methodologies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Methodologies</CardTitle>
              <CardDescription>The research methods you commonly employ.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profileData.methodologies.map((method, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {method}
                    <button
                      type="button"
                      onClick={() => removeFromList("methodologies", method)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMethodology}
                  onChange={(e) => setNewMethodology(e.target.value)}
                  placeholder="Add methodology (e.g., Quantitative Analysis)"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addToList("methodologies", newMethodology, setNewMethodology))
                  }
                />
                <Button type="button" onClick={() => addToList("methodologies", newMethodology, setNewMethodology)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Specializations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Specializations</CardTitle>
              <CardDescription>Specific areas of expertise within your field.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profileData.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeFromList("specializations", spec)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Add specialization (e.g., Natural Language Processing)"
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
            </CardContent>
          </Card>

          {/* Privacy & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Privacy & Notifications</CardTitle>
              <CardDescription>Control your profile visibility and communication preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select
                  value={profileData.profileVisibility}
                  onValueChange={(value) => handleInputChange("profileVisibility", value)}
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
                  checked={profileData.allowMessages}
                  onCheckedChange={(checked) => handleInputChange("allowMessages", checked)}
                />
                <Label htmlFor="allowMessages">Allow other researchers to send me messages</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowCollaboration"
                  checked={profileData.allowCollaboration}
                  onCheckedChange={(checked) => handleInputChange("allowCollaboration", checked)}
                />
                <Label htmlFor="allowCollaboration">Open to collaboration requests</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailNotifications"
                  checked={profileData.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                />
                <Label htmlFor="emailNotifications">Receive email notifications</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="researchUpdates"
                  checked={profileData.researchUpdates}
                  onCheckedChange={(checked) => handleInputChange("researchUpdates", checked)}
                />
                <Label htmlFor="researchUpdates">Receive research updates and newsletters</Label>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              "Create Profile"
            )}
          </Button>
        </form>
      </div>
    </DashboardShell>
  )
}
