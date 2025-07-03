"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Save, 
  Star, 
  Tag, 
  Plus, 
  X, 
  Brain,
  FileText,
  Lightbulb,
  Link,
  Clock
} from "lucide-react"
import { Note } from '@/lib/database'
import { aethonAI } from '@/lib/aethon-ai'

interface SmartNoteEditorProps {
  note?: Note
  onSave: (noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  projectId?: string
}

export function SmartNoteEditor({ note, onSave, onCancel, projectId }: SmartNoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [type, setType] = useState<'research' | 'personal'>(note?.type || 'research')
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [isFavorite, setIsFavorite] = useState(note?.is_favorite || false)
  const [isAethonHelping, setIsAethonHelping] = useState(false)
  const [aethonSuggestions, setAethonSuggestions] = useState<string[]>([])

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async () => {
    if (!title.trim()) return

    await onSave({
      title: title.trim(),
      content: content.trim(),
      type,
      tags,
      project_id: projectId,
      is_favorite: isFavorite
    })
  }

  const getAethonHelp = async () => {
    if (!content.trim()) return

    setIsAethonHelping(true)
    try {
      const response = await aethonAI.generateResponse(
        `Help me improve this research note: "${title}"\n\nContent: ${content}`,
        undefined,
        'note_improvement'
      )
      setAethonSuggestions(response.suggestions || [])
    } catch (error) {
      console.error('Aethon help failed:', error)
    } finally {
      setIsAethonHelping(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    // Simple implementation - in a real app, this would be more sophisticated
    setContent(prev => prev + '\n\n' + suggestion)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{note ? 'Edit Note' : 'Create New Note'}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={getAethonHelp}
                disabled={isAethonHelping || !content.trim()}
              >
                <Brain className={`mr-2 h-4 w-4 ${isAethonHelping ? 'animate-pulse' : ''}`} />
                {isAethonHelping ? 'Analyzing...' : 'Get Aethon Help'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={type} onValueChange={(value: 'research' | 'personal') => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="research">Research Note</SelectItem>
                  <SelectItem value="personal">Personal Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note content here..."
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button onClick={addTag} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {aethonSuggestions.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-primary" />
                  Aethon Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {aethonSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{suggestion}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              <Save className="mr-2 h-4 w-4" />
              Save Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
