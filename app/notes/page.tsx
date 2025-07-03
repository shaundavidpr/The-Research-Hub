"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard-shell"
import { FileText, Search, Plus, Star, Calendar, Tag, Edit, Trash2, Filter, Grid, List } from "lucide-react"
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

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { toast } = useToast()

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem("userNotes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem("userNotes", JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }

  const toggleFavorite = (noteId: string) => {
    const updatedNotes = notes.map((note) => (note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note))
    saveNotes(updatedNotes)

    const note = notes.find((n) => n.id === noteId)
    toast({
      title: note?.isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `"${note?.title}" ${note?.isFavorite ? "removed from" : "added to"} your favorites.`,
    })
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    saveNotes(updatedNotes)

    toast({
      title: "Note deleted",
      description: "The note has been permanently deleted.",
    })
  }

  const getAllTags = () => {
    const allTags = notes.flatMap((note) => note.tags)
    return [...new Set(allTags)]
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || note.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Research Notes</h1>
            <p className="text-muted-foreground">Organize and manage your research notes</p>
          </div>
          <Link href="/notes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Tags */}
        {getAllTags().length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All Notes
            </Button>
            {getAllTags().map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Button>
            ))}
          </div>
        )}

        {/* Notes Grid/List */}
        {filteredNotes.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(note.updatedAt)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toggleFavorite(note.id)} className="h-8 w-8 p-0">
                        <Star className={`h-4 w-4 ${note.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{note.content}</p>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {note.category}
                    </Badge>
                    <div className="flex gap-1">
                      <Link href={`/notes/${note.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery || selectedTag ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {searchQuery || selectedTag
                  ? "Try adjusting your search or filter criteria."
                  : "Start building your research knowledge base by creating your first note."}
              </p>
              {!searchQuery && !selectedTag && (
                <Link href="/notes/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Note
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {notes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{notes.length}</div>
                <div className="text-sm text-muted-foreground">Total Notes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{notes.filter((n) => n.isFavorite).length}</div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{getAllTags().length}</div>
                <div className="text-sm text-muted-foreground">Tags</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {
                    notes.filter((n) => {
                      const today = new Date()
                      const noteDate = new Date(n.updatedAt)
                      const diffTime = Math.abs(today.getTime() - noteDate.getTime())
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      return diffDays <= 7
                    }).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
