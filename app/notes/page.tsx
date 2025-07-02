"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Clock, Star, Folder, Tag, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SmartNoteEditor } from "@/components/smart-note-editor"
import { useNotes } from "@/hooks/use-notes"

export default function NotesPage() {
  const { notes, loading, createNote, updateNote, deleteNote, toggleFavorite } = useNotes()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showEditor, setShowEditor] = useState(false)
  const [editingNote, setEditingNote] = useState(null)

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (selectedFilter) {
      case 'favorites':
        return matchesSearch && note.is_favorite
      case 'recent':
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return matchesSearch && new Date(note.updated_at) > weekAgo
      case 'research':
        return matchesSearch && note.type === 'research'
      case 'personal':
        return matchesSearch && note.type === 'personal'
      default:
        return matchesSearch
    }
  })

  const handleSaveNote = async (noteData: any) => {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData)
      } else {
        await createNote(noteData)
      }
      setShowEditor(false)
      setEditingNote(null)
    } catch (error) {
      console.error('Failed to save note:', error)
    }
  }

  const handleEditNote = (note: any) => {
    setEditingNote(note)
    setShowEditor(true)
  }

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId)
      } catch (error) {
        console.error('Failed to delete note:', error)
      }
    }
  }

  if (showEditor) {
    return (
      <DashboardShell>
        <SmartNoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={() => {
            setShowEditor(false)
            setEditingNote(null)
          }}
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Research Notes"
        text="Create, organize, and manage your research notes with AI assistance."
        actions={
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search notes..." 
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4">
              <h2 className="font-semibold mb-3">Categories</h2>
              <div className="space-y-1">
                <Button 
                  variant={selectedFilter === 'all' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  All Notes ({notes.length})
                </Button>
                <Button 
                  variant={selectedFilter === 'favorites' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setSelectedFilter('favorites')}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Favorites ({notes.filter(n => n.is_favorite).length})
                </Button>
                <Button 
                  variant={selectedFilter === 'recent' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setSelectedFilter('recent')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Recent
                </Button>
                <Button 
                  variant={selectedFilter === 'research' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setSelectedFilter('research')}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  Research ({notes.filter(n => n.type === 'research').length})
                </Button>
                <Button 
                  variant={selectedFilter === 'personal' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setSelectedFilter('personal')}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  Personal ({notes.filter(n => n.type === 'personal').length})
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {filteredNotes.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Folder className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
                {searchQuery 
                  ? 'Try adjusting your search terms or filters'
                  : 'Create your first research note to organize your findings, ideas, and insights.'
                }
              </p>
              {!searchQuery && (
                <Button className="mt-6" onClick={() => setShowEditor(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Note
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {note.title}
                        {note.is_favorite && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => toggleFavorite(note.id)}
                        >
                          <Star className={`h-4 w-4 ${note.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {note.content || 'No content'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{note.type}</Badge>
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(note.updated_at).toLocaleDateString()}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}