"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Upload,
  Users,
  Globe,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Plus,
  X,
  AlertCircle,
  BookOpen,
  Building,
} from "lucide-react"

interface Author {
  id: string
  name: string
  email: string
  affiliation: string
  isCorresponding: boolean
}

interface PaperData {
  title: string
  abstract: string
  keywords: string[]
  authors: Author[]
  field: string
  subfield: string
  paperType: string
  file: File | null
  fileName: string
  fileSize: number
  uploadProgress: number
  visibility: string
  license: string
  allowComments: boolean
  allowDownloads: boolean
  embargoDate: string
  fundingInfo: string
  conflictOfInterest: string
  ethicsStatement: string
}

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

const PAPER_TYPES = [
  { value: "research", label: "Research Article" },
  { value: "review", label: "Review Article" },
  { value: "case-study", label: "Case Study" },
  { value: "short-communication", label: "Short Communication" },
  { value: "letter", label: "Letter to Editor" },
  { value: "commentary", label: "Commentary" },
  { value: "editorial", label: "Editorial" },
  { value: "book-chapter", label: "Book Chapter" },
  { value: "conference", label: "Conference Paper" },
  { value: "thesis", label: "Thesis/Dissertation" },
  { value: "preprint", label: "Preprint" },
  { value: "other", label: "Other" },
]

const LICENSES = [
  { value: "cc-by", label: "CC BY - Attribution" },
  { value: "cc-by-sa", label: "CC BY-SA - Attribution-ShareAlike" },
  { value: "cc-by-nc", label: "CC BY-NC - Attribution-NonCommercial" },
  { value: "cc-by-nc-sa", label: "CC BY-NC-SA - Attribution-NonCommercial-ShareAlike" },
  { value: "cc-by-nd", label: "CC BY-ND - Attribution-NoDerivatives" },
  { value: "cc-by-nc-nd", label: "CC BY-NC-ND - Attribution-NonCommercial-NoDerivatives" },
  { value: "all-rights-reserved", label: "All Rights Reserved" },
  { value: "public-domain", label: "Public Domain" },
]

export default function PublishPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    email: "",
    affiliation: "",
    isCorresponding: false,
  })

  const [paperData, setPaperData] = useState<PaperData>({
    title: "",
    abstract: "",
    keywords: [],
    authors: [],
    field: "",
    subfield: "",
    paperType: "",
    file: null,
    fileName: "",
    fileSize: 0,
    uploadProgress: 0,
    visibility: "public",
    license: "cc-by",
    allowComments: true,
    allowDownloads: true,
    embargoDate: "",
    fundingInfo: "",
    conflictOfInterest: "",
    ethicsStatement: "",
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [".pdf", ".doc", ".docx", ".tex"]
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, DOCX, or TEX file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 50MB.",
          variant: "destructive",
        })
        return
      }

      setPaperData((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        fileSize: file.size,
      }))

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          toast({
            title: "File uploaded successfully",
            description: "Your paper has been uploaded and is ready for publication.",
          })
        }
        setPaperData((prev) => ({ ...prev, uploadProgress: progress }))
      }, 200)
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !paperData.keywords.includes(newKeyword.trim())) {
      setPaperData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setPaperData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }))
  }

  const addAuthor = () => {
    if (newAuthor.name.trim() && newAuthor.email.trim()) {
      const author: Author = {
        id: Date.now().toString(),
        ...newAuthor,
      }
      setPaperData((prev) => ({
        ...prev,
        authors: [...prev.authors, author],
      }))
      setNewAuthor({
        name: "",
        email: "",
        affiliation: "",
        isCorresponding: false,
      })
    }
  }

  const removeAuthor = (authorId: string) => {
    setPaperData((prev) => ({
      ...prev,
      authors: prev.authors.filter((a) => a.id !== authorId),
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(paperData.title && paperData.abstract && paperData.field && paperData.paperType)
      case 2:
        return paperData.authors.length > 0 && paperData.keywords.length > 0
      case 3:
        return !!paperData.file
      case 4:
        return true // Settings are optional
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
    setIsSubmitting(true)

    try {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user's paper count
      const userProfile = localStorage.getItem("userProfile")
      if (userProfile) {
        const profile = JSON.parse(userProfile)
        profile.papers = (profile.papers || 0) + 1
        localStorage.setItem("userProfile", JSON.stringify(profile))
      }

      toast({
        title: "Paper published successfully!",
        description: "Your research paper has been published and is now available to the community.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Publication failed",
        description: "There was an error publishing your paper. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Paper Details</h2>
              <p className="text-muted-foreground">Provide basic information about your research paper</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Paper Title *</Label>
                <Input
                  id="title"
                  value={paperData.title}
                  onChange={(e) => setPaperData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your paper title"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abstract">Abstract *</Label>
                <Textarea
                  id="abstract"
                  value={paperData.abstract}
                  onChange={(e) => setPaperData((prev) => ({ ...prev, abstract: e.target.value }))}
                  placeholder="Provide a comprehensive abstract of your research..."
                  rows={8}
                />
                <div className="text-xs text-muted-foreground text-right">{paperData.abstract.length} characters</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field">Research Field *</Label>
                  <Select
                    value={paperData.field}
                    onValueChange={(value) => setPaperData((prev) => ({ ...prev, field: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select research field" />
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

                <div className="space-y-2">
                  <Label htmlFor="paperType">Paper Type *</Label>
                  <Select
                    value={paperData.paperType}
                    onValueChange={(value) => setPaperData((prev) => ({ ...prev, paperType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select paper type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAPER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subfield">Subfield/Specialization</Label>
                <Input
                  id="subfield"
                  value={paperData.subfield}
                  onChange={(e) => setPaperData((prev) => ({ ...prev, subfield: e.target.value }))}
                  placeholder="e.g., Machine Learning, Quantum Physics, Molecular Biology"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Authors & Keywords</h2>
              <p className="text-muted-foreground">Add co-authors and keywords for your paper</p>
            </div>

            <div className="space-y-6">
              {/* Authors Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Authors *</CardTitle>
                  <CardDescription>Add all authors who contributed to this research</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paperData.authors.length > 0 && (
                    <div className="space-y-3">
                      {paperData.authors.map((author, index) => (
                        <div key={author.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{author.name}</span>
                              {author.isCorresponding && (
                                <Badge variant="secondary" className="text-xs">
                                  Corresponding
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{author.email}</p>
                            {author.affiliation && (
                              <p className="text-sm text-muted-foreground">{author.affiliation}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeAuthor(author.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 border-dashed rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="authorName">Author Name</Label>
                      <Input
                        id="authorName"
                        value={newAuthor.name}
                        onChange={(e) => setNewAuthor((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="authorEmail">Email</Label>
                      <Input
                        id="authorEmail"
                        type="email"
                        value={newAuthor.email}
                        onChange={(e) => setNewAuthor((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="authorAffiliation">Affiliation</Label>
                      <Input
                        id="authorAffiliation"
                        value={newAuthor.affiliation}
                        onChange={(e) => setNewAuthor((prev) => ({ ...prev, affiliation: e.target.value }))}
                        placeholder="University or Institution"
                      />
                    </div>
                    <div className="flex items-center space-x-2 md:col-span-2">
                      <Checkbox
                        id="isCorresponding"
                        checked={newAuthor.isCorresponding}
                        onCheckedChange={(checked) => setNewAuthor((prev) => ({ ...prev, isCorresponding: !!checked }))}
                      />
                      <Label htmlFor="isCorresponding">Corresponding author</Label>
                    </div>
                    <div className="md:col-span-2">
                      <Button onClick={addAuthor} disabled={!newAuthor.name || !newAuthor.email}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Author
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Keywords Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keywords *</CardTitle>
                  <CardDescription>Add keywords to help others discover your research</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {paperData.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="ml-2 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {paperData.keywords.length === 0 && (
                      <p className="text-muted-foreground text-sm">No keywords added yet.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add keyword..."
                      onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                    />
                    <Button onClick={addKeyword} disabled={!newKeyword.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Upload Paper</h2>
              <p className="text-muted-foreground">Upload your research paper file</p>
            </div>

            <Card>
              <CardContent className="p-6">
                {!paperData.file ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Upload your paper</h3>
                    <p className="text-muted-foreground mb-4">Drag and drop your file here, or click to browse</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supported formats: PDF, DOC, DOCX, TEX (Max size: 50MB)
                    </p>
                    <label className="cursor-pointer">
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx,.tex" onChange={handleFileUpload} />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">{paperData.fileName}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(paperData.fileSize)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setPaperData((prev) => ({
                            ...prev,
                            file: null,
                            fileName: "",
                            fileSize: 0,
                            uploadProgress: 0,
                          }))
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {paperData.uploadProgress > 0 && paperData.uploadProgress < 100 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{Math.round(paperData.uploadProgress)}%</span>
                        </div>
                        <Progress value={paperData.uploadProgress} />
                      </div>
                    )}

                    {paperData.uploadProgress === 100 && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          File uploaded successfully! Your paper is ready for publication.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="funding">Funding Information</Label>
                  <Textarea
                    id="funding"
                    value={paperData.fundingInfo}
                    onChange={(e) => setPaperData((prev) => ({ ...prev, fundingInfo: e.target.value }))}
                    placeholder="Acknowledge funding sources, grants, or financial support..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conflict">Conflict of Interest Statement</Label>
                  <Textarea
                    id="conflict"
                    value={paperData.conflictOfInterest}
                    onChange={(e) => setPaperData((prev) => ({ ...prev, conflictOfInterest: e.target.value }))}
                    placeholder="Declare any potential conflicts of interest..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ethics">Ethics Statement</Label>
                  <Textarea
                    id="ethics"
                    value={paperData.ethicsStatement}
                    onChange={(e) => setPaperData((prev) => ({ ...prev, ethicsStatement: e.target.value }))}
                    placeholder="Describe ethical considerations, approvals, or compliance..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Publication Settings</h2>
              <p className="text-muted-foreground">Configure how your paper will be published and shared</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visibility & Access</CardTitle>
                  <CardDescription>Control who can see and access your paper</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select
                      value={paperData.visibility}
                      onValueChange={(value) => setPaperData((prev) => ({ ...prev, visibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Public - Anyone can view
                          </div>
                        </SelectItem>
                        <SelectItem value="institutional">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Institutional - Institution members only
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Private - Only you and co-authors
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license">License</Label>
                    <Select
                      value={paperData.license}
                      onValueChange={(value) => setPaperData((prev) => ({ ...prev, license: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LICENSES.map((license) => (
                          <SelectItem key={license.value} value={license.value}>
                            {license.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="embargo">Embargo Date (Optional)</Label>
                    <Input
                      id="embargo"
                      type="date"
                      value={paperData.embargoDate}
                      onChange={(e) => setPaperData((prev) => ({ ...prev, embargoDate: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      If set, the paper will only become publicly available after this date
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Features</CardTitle>
                  <CardDescription>Enable community interaction with your paper</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowComments"
                      checked={paperData.allowComments}
                      onCheckedChange={(checked) => setPaperData((prev) => ({ ...prev, allowComments: !!checked }))}
                    />
                    <Label htmlFor="allowComments">Allow comments and discussions</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowDownloads"
                      checked={paperData.allowDownloads}
                      onCheckedChange={(checked) => setPaperData((prev) => ({ ...prev, allowDownloads: !!checked }))}
                    />
                    <Label htmlFor="allowDownloads">Allow downloads</Label>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Once published, your paper will be assigned a DOI and become part of the permanent research record.
                  Make sure all information is accurate before proceeding.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Publish Research Paper</h1>
          <p className="text-muted-foreground">Share your research with the global scientific community</p>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-8">
          {[
            { step: 1, label: "Details", icon: FileText },
            { step: 2, label: "Authors", icon: Users },
            { step: 3, label: "Upload", icon: Upload },
            { step: 4, label: "Settings", icon: Globe },
          ].map(({ step, label, icon: Icon }) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2">{label}</span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button onClick={handleNext} disabled={!validateStep(currentStep) || isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Publishing...
              </>
            ) : currentStep === 4 ? (
              <>
                Publish Paper
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

        {/* Publication Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Publication Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Write a clear, concise title that accurately reflects your research</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Include all authors who made significant contributions to the work</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Use relevant keywords to help others discover your research</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Choose an appropriate license to control how others can use your work</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
