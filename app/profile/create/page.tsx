"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, GraduationCap, Brain, Settings, ArrowRight, ArrowLeft, CheckCircle, X, Camera } from "lucide-react"

interface ProfileData {
  // Basic Info
  firstName: string
  lastName: string
  email: string
  title: string
  institution: string
  department: string
  location: string
  bio: string
  avatar: string

  // Academic Info
  degree: string
  researchField: string
  advisor: string
  yearStarted: string

  // Research Interests
  topics: string[]
  methodologies: string[]
  specializations: string[]

  // Privacy & Preferences
  profileVisibility: string
  allowMessages: boolean
  allowCollaboration: boolean
  emailNotifications: boolean
  researchUpdates: boolean
}

const researchFields = [
  "Computer Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Psychology",
  "Medicine",
  "Engineering",
  "Environmental Science",
  "Social Sciences",
  "Economics",
  "Literature",
  "History",
  "Philosophy",
  "Other",
]

const commonTopics = [
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Biotechnology",
  "Climate Change",
  "Quantum Computing",
  "Neuroscience",
  "Genetics",
  "Renewable Energy",
  "Public Health",
  "Social Psychology",
  "Behavioral Economics",
  "Digital Humanities",
  "Computational Biology",
]

const methodologies = [
  "Quantitative Research",
  "Qualitative Research",
  "Mixed Methods",
  "Experimental Design",
  "Survey Research",
  "Case Studies",
  "Ethnography",
  "Statistical Analysis",
  "Computational Modeling",
  "Literature Review",
  "Meta-Analysis",
  "Field Research",
]

export default function CreateProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    institution: "",
    department: "",
    location: "",
    bio: "",
    avatar: "",
    degree: "",
    researchField: "",
    advisor: "",
    yearStarted: "",
    topics: [],
    methodologies: [],
    specializations: [],
    profileVisibility: "public",
    allowMessages: true,
    allowCollaboration: true,
    emailNotifications: true,
    researchUpdates: true,
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const updateProfileData = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const addTopic = (topic: string) => {
    if (!profileData.topics.includes(topic)) {
      updateProfileData("topics", [...profileData.topics, topic])
    }
  }

  const removeTopic = (topic: string) => {
    updateProfileData(
      "topics",
      profileData.topics.filter((t) => t !== topic),
    )
  }

  const addMethodology = (methodology: string) => {
    if (!profileData.methodologies.includes(methodology)) {
      updateProfileData("methodologies", [...profileData.methodologies, methodology])
    }
  }

  const removeMethodology = (methodology: string) => {
    updateProfileData(
      "methodologies",
      profileData.methodologies.filter((m) => m !== methodology),
    )
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          profileData.firstName &&
          profileData.lastName &&
          profileData.email &&
          profileData.title &&
          profileData.institution
        )
      case 2:
        return profileData.degree && profileData.researchField
      case 3:
        return profileData.topics.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)

    try {
      // Save profile data to localStorage
      const completeProfile = {
        ...profileData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        followers: 0,
        following: 0,
        papers: 0,
        citations: 0,
        projects: 0,
        notes: 0,
      }

      localStorage.setItem("userProfile", JSON.stringify(completeProfile))
      localStorage.setItem("isProfileComplete", "true")

      toast({
        title: "Profile created successfully!",
        description: "Welcome to The Research Hub. Your profile is now live.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error creating profile",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = () => {
    return `${profileData.firstName[0] || ""}${profileData.lastName[0] || ""}`.toUpperCase()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold">Basic Information</h2>
              <p className="text-muted-foreground">Let's start with your basic details</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-transparent"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => updateProfileData("firstName", e.target.value)}
                  placeholder="Jane"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => updateProfileData("lastName", e.target.value)}
                  placeholder="Smith"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => updateProfileData("email", e.target.value)}
                placeholder="jane.smith@university.edu"
                required
              />
            </div>

            <div>
              <Label htmlFor="title">Professional Title *</Label>
              <Input
                id="title"
                value={profileData.title}
                onChange={(e) => updateProfileData("title", e.target.value)}
                placeholder="PhD Student, Research Scientist, Professor"
                required
              />
            </div>

            <div>
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={profileData.institution}
                onChange={(e) => updateProfileData("institution", e.target.value)}
                placeholder="Harvard University"
                required
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profileData.department}
                onChange={(e) => updateProfileData("department", e.target.value)}
                placeholder="Computer Science Department"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => updateProfileData("location", e.target.value)}
                placeholder="Cambridge, MA, USA"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => updateProfileData("bio", e.target.value)}
                placeholder="Tell us about your research interests and background..."
                rows={4}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold">Academic Information</h2>
              <p className="text-muted-foreground">Share your academic background</p>
            </div>

            <div>
              <Label htmlFor="degree">Current Degree/Position *</Label>
              <Select value={profileData.degree} onValueChange={(value) => updateProfileData("degree", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current degree or position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate Student</SelectItem>
                  <SelectItem value="masters">Master's Student</SelectItem>
                  <SelectItem value="phd">PhD Student</SelectItem>
                  <SelectItem value="postdoc">Postdoctoral Researcher</SelectItem>
                  <SelectItem value="assistant">Assistant Professor</SelectItem>
                  <SelectItem value="associate">Associate Professor</SelectItem>
                  <SelectItem value="professor">Professor</SelectItem>
                  <SelectItem value="researcher">Research Scientist</SelectItem>
                  <SelectItem value="industry">Industry Researcher</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="researchField">Primary Research Field *</Label>
              <Select
                value={profileData.researchField}
                onValueChange={(value) => updateProfileData("researchField", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary research field" />
                </SelectTrigger>
                <SelectContent>
                  {researchFields.map((field) => (
                    <SelectItem key={field} value={field.toLowerCase().replace(/\s+/g, "-")}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="advisor">Research Advisor/Supervisor</Label>
              <Input
                id="advisor"
                value={profileData.advisor}
                onChange={(e) => updateProfileData("advisor", e.target.value)}
                placeholder="Dr. Jane Smith (optional)"
              />
            </div>

            <div>
              <Label htmlFor="yearStarted">Year Started Current Position</Label>
              <Select
                value={profileData.yearStarted}
                onValueChange={(value) => updateProfileData("yearStarted", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => 2024 - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h2 className="text-2xl font-bold">Research Interests</h2>
              <p className="text-muted-foreground">Help others discover your expertise</p>
            </div>

            <div>
              <Label>Research Topics *</Label>
              <p className="text-sm text-muted-foreground mb-3">Select topics that match your research interests</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {commonTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant={profileData.topics.includes(topic) ? "default" : "outline"}
                    size="sm"
                    onClick={() => (profileData.topics.includes(topic) ? removeTopic(topic) : addTopic(topic))}
                    className="justify-start"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
              {profileData.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                      {topic}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTopic(topic)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Research Methodologies</Label>
              <p className="text-sm text-muted-foreground mb-3">Select methodologies you use or are interested in</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {methodologies.map((methodology) => (
                  <Button
                    key={methodology}
                    variant={profileData.methodologies.includes(methodology) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      profileData.methodologies.includes(methodology)
                        ? removeMethodology(methodology)
                        : addMethodology(methodology)
                    }
                    className="justify-start"
                  >
                    {methodology}
                  </Button>
                ))}
              </div>
              {profileData.methodologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.methodologies.map((methodology) => (
                    <Badge key={methodology} variant="secondary" className="flex items-center gap-1">
                      {methodology}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeMethodology(methodology)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="specializations">Additional Specializations</Label>
              <Textarea
                id="specializations"
                placeholder="Any other specific areas of expertise or specializations..."
                rows={3}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Settings className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h2 className="text-2xl font-bold">Privacy & Preferences</h2>
              <p className="text-muted-foreground">Control how others can interact with you</p>
            </div>

            <div>
              <Label>Profile Visibility</Label>
              <Select
                value={profileData.profileVisibility}
                onValueChange={(value) => updateProfileData("profileVisibility", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can view your profile</SelectItem>
                  <SelectItem value="researchers">Researchers Only - Only verified researchers</SelectItem>
                  <SelectItem value="private">Private - Only people you approve</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowMessages"
                  checked={profileData.allowMessages}
                  onCheckedChange={(checked) => updateProfileData("allowMessages", checked)}
                />
                <Label htmlFor="allowMessages">Allow other researchers to message me</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowCollaboration"
                  checked={profileData.allowCollaboration}
                  onCheckedChange={(checked) => updateProfileData("allowCollaboration", checked)}
                />
                <Label htmlFor="allowCollaboration">Open to collaboration requests</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailNotifications"
                  checked={profileData.emailNotifications}
                  onCheckedChange={(checked) => updateProfileData("emailNotifications", checked)}
                />
                <Label htmlFor="emailNotifications">Email notifications for messages and mentions</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="researchUpdates"
                  checked={profileData.researchUpdates}
                  onCheckedChange={(checked) => updateProfileData("researchUpdates", checked)}
                />
                <Label htmlFor="researchUpdates">Weekly research updates and recommendations</Label>
              </div>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Profile Complete!</h3>
                </div>
                <p className="text-sm text-green-700">
                  Your research profile is ready. You can always update these settings later in your account
                  preferences.
                </p>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Create Your Research Profile</h1>
            <Badge variant="outline">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8">
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={!isStepValid() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      Complete Profile
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
