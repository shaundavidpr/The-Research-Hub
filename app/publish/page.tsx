"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { 
  Upload, 
  FileText, 
  Plus, 
  X, 
  Brain,
  Save,
  Eye,
  Send
} from "lucide-react"

export default function PublishPage() {
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isAethonHelping, setIsAethonHelping] = useState(false)

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleAethonHelp = () => {
    setIsAethonHelping(true)
    // Simulate Aethon assistance
    setTimeout(() => {
      setIsAethonHelping(false)
    }, 2000)
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Publish Research Paper"
        text="Share your research with the global research community."
        icon={<FileText className="h-5 w-5 text-primary" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paper Details</CardTitle>
              <CardDescription>
                Provide the basic information about your research paper.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <div className="flex gap-2">
                  <Input 
                    id="title" 
                    placeholder="Enter your paper title..." 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleAethonHelp}
                    disabled={isAethonHelping}
                  >
                    <Brain className={`h-4 w-4 ${isAethonHelping ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the brain icon to get Aethon's help with title suggestions
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="abstract">Abstract *</Label>
                <div className="space-y-2">
                  <Textarea 
                    id="abstract" 
                    placeholder="Provide a concise summary of your research..."
                    className="min-h-[120px]"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAethonHelp}
                    disabled={isAethonHelping}
                  >
                    <Brain className={`mr-2 h-4 w-4 ${isAethonHelping ? 'animate-pulse' : ''}`} />
                    {isAethonHelping ? 'Aethon is helping...' : 'Get Aethon\'s help with abstract'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field">Research Field *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select research field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="environmental-science">Environmental Science</SelectItem>
                      <SelectItem value="psychology">Psychology</SelectItem>
                      <SelectItem value="economics">Economics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Paper Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select paper type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research">Research Paper</SelectItem>
                      <SelectItem value="review">Review Paper</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                      <SelectItem value="technical">Technical Report</SelectItem>
                      <SelectItem value="thesis">Thesis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Keywords/Tags</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a keyword..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authors & Affiliations</CardTitle>
              <CardDescription>
                Add all authors and their institutional affiliations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author-name">Author Name</Label>
                  <Input id="author-name" placeholder="Dr. John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input id="institution" placeholder="University Name" />
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Another Author
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload your paper and any supplementary materials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload your paper</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Aethon Assistant
              </CardTitle>
              <CardDescription>
                Get AI-powered help with your publication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={handleAethonHelp}>
                <FileText className="mr-2 h-4 w-4" />
                Improve Abstract
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleAethonHelp}>
                <Plus className="mr-2 h-4 w-4" />
                Suggest Keywords
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleAethonHelp}>
                <Eye className="mr-2 h-4 w-4" />
                Review for Clarity
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleAethonHelp}>
                <Send className="mr-2 h-4 w-4" />
                Publication Checklist
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select defaultValue="public">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="institutional">Institution Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>License</Label>
                <Select defaultValue="cc-by">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cc-by">CC BY 4.0</SelectItem>
                    <SelectItem value="cc-by-sa">CC BY-SA 4.0</SelectItem>
                    <SelectItem value="cc-by-nc">CC BY-NC 4.0</SelectItem>
                    <SelectItem value="all-rights">All Rights Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publication Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Write a clear, descriptive title</li>
                <li>• Include relevant keywords for discoverability</li>
                <li>• Provide a comprehensive abstract</li>
                <li>• Upload high-quality PDF files</li>
                <li>• Add all co-authors and affiliations</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
