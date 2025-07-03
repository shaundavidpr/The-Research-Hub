"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardShell } from "@/components/dashboard-shell"
import { Save, ArrowLeft, Plus, X, Star } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  category: string
}

export default function NewNotePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const categories = [
    "Literature Review",
    "Methodology",
    "Data Analysis",
    "Research Ideas",
    "Meeting Notes",
    "Personal Thoughts",
    "Citations",
    "Other",
  ]

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const saveNote = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        tags,
        category: category || "Other",
        isFavorite,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Load existing notes
      const existingNotes = JSON.parse(localStorage.getItem("userNotes") || "[]")

      // Add new note
      const updatedNotes = [newNote, ...existingNotes]

      // Save to localStorage
      localStorage.setItem("userNotes", JSON.stringify(updatedNotes))

      toast({
        title: "Note saved",
        description: "Your note has been created successfully.",
      })

      router.push("/notes")
    } catch (error) {
      toast({
        title: "Error saving note",
        description: "There was a problem saving your note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/notes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notes
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Create New Note</h1>
              <p className="text-muted-foreground">Add a new research note to your collection</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-yellow-600" : ""}
            >
              <Star className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </Button>
            <Button onClick={saveNote} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Note"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Note Content</CardTitle>
                <CardDescription>Write your research note content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your note content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category</CardTitle>
                <CardDescription>Organize your note by category</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
                <CardDescription>Add tags to help organize and find your notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Citation
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Insert Template
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Link to Project
                </Button>
              </CardContent>
            </Card>

            {/* Note Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Note Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Characters:</span>
                  <span>{content.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Words:</span>
                  <span>{content.trim() ? content.trim().split(/\s+/).length : 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tags:</span>
                  <span>{tags.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
