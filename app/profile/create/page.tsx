"use client"

import { useState, useEffect } from "react"
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
import { toast } from "@/hooks/use-toast"
import { Brain, User, GraduationCap, Heart, Settings, Camera, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

interface ProfileData {
  // Basic Information
  name: string
  email: string
  title: string
  institution: string
  department: string
  bio: string
  avatar: string

  // Academic Information
  degree: string
  field: string
  advisor: string
  yearStarted: string
  orcid: string
  googleScholar: string

  // Research Interests
  researchTopics: string[]
  methodologies: string[]
  specializations: string[]

  // Privacy & Preferences
  profileVisibility: string
  allowMessages: boolean
  allowCollaboration: boolean
  emailNotifications: boolean
  researchUpdates: boolean
}

const RESEARCH_TOPICS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics",
  "Cybersecurity",
  "Blockchain",
  "Quantum Computing",
  "Bioinformatics",
  "Climate Science",
  "Neuroscience",
  "Psychology",
  "Sociology",
  "Economics",
  "Political Science",
  "History",
  "Literature",
  "Philosophy",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
]

const METHODOLOGIES = [
  "Quantitative Research",
  "Qualitative Research",
  "Mixed Methods",
  "Experimental Design",
  "Survey Research",
  "Case Study",
  "Ethnography",
  "Content Analysis",
  "Meta-Analysis",
  "Statistical Modeling",
  "Machine Learning",
  "Deep Learning",
  "Simulation",
  "Field Research",
  "Laboratory Research",
  "Computational Methods",
]

export default function CreateProfilePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState<ProfileData>({
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
    researchTopics: [],
    methodologies: [],
    specializations: [],
    profileVisibility: "public",
    allowMessages: true,
    allowCollaboration: true,
    emailNotifications: true,
    researchUpdates: true,
  })

  useEffect(() => {
    // Load user data from signup
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const user = JSON.parse(userData)
      setProfileData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [])

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayToggle = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter((item) => item !== value)
        : [...(prev[field] as string[]), value],
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(profileData.name && profileData.email && profileData.title && profileData.institution)
      case 2:
        return !!(profileData.degree && profileData.field)
      case 3:
        return profileData.researchTopics.length > 0
      case 4:
        return true // Privacy step is optional
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    } else {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required fields before proceeding.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    try {
      // Save to database via API
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const savedProfile = await response.json()

        // Update localStorage with complete profile
        localStorage.setItem("userProfile", JSON.stringify(savedProfile))

        toast({
          title: "Profile created successfully!",
          description: "Welcome to The Research Hub community.",
        })

        router.push("/dashboard")
      } else {
        throw new Error("Failed to save profile")
      }
    } catch (error) {
      toast({
        title: "Error creating profile",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Basic Information</h2>
              <p className="text-muted-foreground">Tell us about yourself and your academic background</p>
            </div>

            {/* Avatar Upload */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                  onClick={() => {
                    // In a real app, this would open a file picker
                    toast({
                      title: "Avatar upload",
                      description: "Avatar upload functionality will be implemented with file storage.",
                    })
                  }}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Dr. Jane Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="jane.smith@university.edu"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Academic Title *</Label>
                <Select value={profileData.title} onValueChange={(value) => handleInputChange("title", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate Student</SelectItem>
                    <SelectItem value="graduate">Graduate Student</SelectItem>
                    <SelectItem value="phd">PhD Student</SelectItem>
                    <SelectItem value="postdoc">Postdoctoral Researcher</SelectItem>
                    <SelectItem value="assistant">Assistant Professor</SelectItem>
                    <SelectItem value="associate">Associate Professor</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="researcher">Research Scientist</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  value={profileData.institution}
                  onChange={(e) => handleInputChange("institution", e.target.value)}
                  placeholder="Harvard University"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={profileData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
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
              <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Academic Information</h2>
              <p className="text-muted-foreground">Share your academic credentials and research details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Highest Degree *</Label>
                <Select value={profileData.degree} onValueChange={(value) => handleInputChange("degree", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelors">Bachelor's</SelectItem>
                    <SelectItem value="masters">Master's</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="postdoc">Postdoc</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field">Research Field *</Label>
                <Input
                  id="field"
                  value={profileData.field}
                  onChange={(e) => handleInputChange("field", e.target.value)}
                  placeholder="Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="advisor">Advisor/Supervisor</Label>
                <Input
                  id="advisor"
                  value={profileData.advisor}
                  onChange={(e) => handleInputChange("advisor", e.target.value)}
                  placeholder="Prof. John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearStarted">Year Started</Label>
                <Input
                  id="yearStarted"
                  type="number"
                  value={profileData.yearStarted}
                  onChange={(e) => handleInputChange("yearStarted", e.target.value)}
                  placeholder="2020"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orcid">ORCID ID</Label>
                <Input
                  id="orcid"
                  value={profileData.orcid}
                  onChange={(e) => handleInputChange("orcid", e.target.value)}
                  placeholder="0000-0000-0000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleScholar">Google Scholar Profile</Label>
                <Input
                  id="googleScholar"
                  value={profileData.googleScholar}
                  onChange={(e) => handleInputChange("googleScholar", e.target.value)}
                  placeholder="https://scholar.google.com/citations?user=..."
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Research Interests</h2>
              <p className="text-muted-foreground">Help us understand your research focus and methodologies</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Research Topics *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select topics that align with your research interests
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {RESEARCH_TOPICS.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={`topic-${topic}`}
                        checked={profileData.researchTopics.includes(topic)}
                        onCheckedChange={() => handleArrayToggle("researchTopics", topic)}
                      />
                      <Label htmlFor={`topic-${topic}`} className="text-sm cursor-pointer">
                        {topic}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {profileData.researchTopics.length} selected
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Research Methodologies</Label>
                <p className="text-sm text-muted-foreground mb-3">Select methodologies you use in your research</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {METHODOLOGIES.map((methodology) => (
                    <div key={methodology} className="flex items-center space-x-2">
                      <Checkbox
                        id={`methodology-${methodology}`}
                        checked={profileData.methodologies.includes(methodology)}
                        onCheckedChange={() => handleArrayToggle("methodologies", methodology)}
                      />
                      <Label htmlFor={`methodology-${methodology}`} className="text-sm cursor-pointer">
                        {methodology}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {profileData.methodologies.length} selected
                  </Badge>
                </div>
              </div>

              <div>
                <Label htmlFor="specializations">Specializations</Label>
                <Textarea
                  id="specializations"
                  placeholder="List any specific specializations, techniques, or areas of expertise..."
                  rows={3}
                  onChange={(e) => {
                    const specs = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s)
                    handleInputChange("specializations", specs)
                  }}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Privacy & Preferences</h2>
              <p className="text-muted-foreground">Configure your privacy settings and notification preferences</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Who can see your profile and research information?
                  </p>
                  <Select
                    value={profileData.profileVisibility}
                    onValueChange={(value) => handleInputChange("profileVisibility", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                      <SelectItem value="researchers">Researchers Only - Only verified researchers</SelectItem>
                      <SelectItem value="institution">Institution - Only members of your institution</SelectItem>
                      <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Communication Preferences</Label>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowMessages"
                      checked={profileData.allowMessages}
                      onCheckedChange={(checked) => handleInputChange("allowMessages", checked)}
                    />
                    <Label htmlFor="allowMessages" className="cursor-pointer">
                      Allow other researchers to send me messages
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowCollaboration"
                      checked={profileData.allowCollaboration}
                      onCheckedChange={(checked) => handleInputChange("allowCollaboration", checked)}
                    />
                    <Label htmlFor="allowCollaboration" className="cursor-pointer">
                      Open to collaboration requests
                    </Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Notification Preferences</Label>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={profileData.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                    />
                    <Label htmlFor="emailNotifications" className="cursor-pointer">
                      Email notifications for messages and updates
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="researchUpdates"
                      checked={profileData.researchUpdates}
                      onCheckedChange={(checked) => handleInputChange("researchUpdates", checked)}
                    />
                    <Label htmlFor="researchUpdates" className="cursor-pointer">
                      Weekly research updates and recommendations
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">The Research Hub</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Your Research Profile</h1>
          <p className="text-muted-foreground">
            Step {currentStep} of 4 - Let's build your professional research profile
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button onClick={handleNext} disabled={!validateStep(currentStep)}>
            {currentStep === 4 ? (
              <>
                Complete Profile
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`w-3 h-3 rounded-full ${step <= currentStep ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
