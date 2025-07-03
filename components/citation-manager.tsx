"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Search, 
  Download, 
  Copy, 
  Edit, 
  Trash2,
  BookMarked,
  FileDown,
  Brain
} from "lucide-react"
import { useCitations } from '@/hooks/use-citations'
import { Citation } from '@/lib/database'

export function CitationManager() {
  const { citations, loading, createCitation, generateCitation, exportBibliography, searchCitations } = useCitations()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [citationStyle, setCitationStyle] = useState('apa')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCitation, setNewCitation] = useState<Partial<Citation>>({
    type: 'article',
    title: '',
    authors: [''],
    year: new Date().getFullYear(),
    tags: []
  })

  const filteredCitations = searchQuery 
    ? searchCitations(searchQuery)
    : selectedType === 'all' 
      ? citations 
      : citations.filter(citation => citation.type === selectedType)

  const citationTypes = [
    { value: 'all', label: 'All Types', count: citations.length },
    { value: 'article', label: 'Articles', count: citations.filter(c => c.type === 'article').length },
    { value: 'book', label: 'Books', count: citations.filter(c => c.type === 'book').length },
    { value: 'website', label: 'Websites', count: citations.filter(c => c.type === 'website').length },
    { value: 'conference', label: 'Conference', count: citations.filter(c => c.type === 'conference').length }
  ]

  const handleAddCitation = async () => {
    if (!newCitation.title || !newCitation.authors?.[0]) return

    try {
      await createCitation({
        type: newCitation.type as 'article' | 'book' | 'website' | 'conference',
        title: newCitation.title,
        authors: newCitation.authors.filter(author => author.trim()),
        year: newCitation.year || new Date().getFullYear(),
        journal: newCitation.journal,
        doi: newCitation.doi,
        url: newCitation.url,
        pages: newCitation.pages,
        volume: newCitation.volume,
        issue: newCitation.issue,
        publisher: newCitation.publisher,
        tags: newCitation.tags || []
      })

      setNewCitation({
        type: 'article',
        title: '',
        authors: [''],
        year: new Date().getFullYear(),
        tags: []
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add citation:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatCitation = async (citation: Citation) => {
    return await generateCitation(citation, citationStyle)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search citations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={citationStyle} onValueChange={setCitationStyle}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apa">APA 7th</SelectItem>
              <SelectItem value="mla">MLA 9th</SelectItem>
              <SelectItem value="chicago">Chicago 17th</SelectItem>
              <SelectItem value="harvard">Harvard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportBibliography(citationStyle)}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Citation
          </Button>
        </div>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 flex-wrap">
        {citationTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.value)}
          >
            {type.label} ({type.count})
          </Button>
        ))}
      </div>

      {/* Add Citation Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Citation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select 
                  value={newCitation.type} 
                  onValueChange={(value) => setNewCitation({...newCitation, type: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Journal Article</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="conference">Conference Paper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input
                  type="number"
                  value={newCitation.year}
                  onChange={(e) => setNewCitation({...newCitation, year: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newCitation.title}
                onChange={(e) => setNewCitation({...newCitation, title: e.target.value})}
                placeholder="Enter citation title..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Authors</label>
              <Input
                value={newCitation.authors?.[0] || ''}
                onChange={(e) => setNewCitation({...newCitation, authors: [e.target.value]})}
                placeholder="Enter author names (comma separated)..."
              />
            </div>

            {newCitation.type === 'article' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Journal</label>
                  <Input
                    value={newCitation.journal || ''}
                    onChange={(e) => setNewCitation({...newCitation, journal: e.target.value})}
                    placeholder="Journal name..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume</label>
                  <Input
                    value={newCitation.volume || ''}
                    onChange={(e) => setNewCitation({...newCitation, volume: e.target.value})}
                    placeholder="Volume..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pages</label>
                  <Input
                    value={newCitation.pages || ''}
                    onChange={(e) => setNewCitation({...newCitation, pages: e.target.value})}
                    placeholder="Page range..."
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCitation}>
                Add Citation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Citations List */}
      <div className="space-y-4">
        {filteredCitations.map((citation) => (
          <Card key={citation.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium">{citation.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {citation.authors.join(', ')} ({citation.year})
                  </p>
                  {citation.journal && (
                    <p className="text-sm text-muted-foreground italic">
                      {citation.journal}
                      {citation.volume && `, ${citation.volume}`}
                      {citation.issue && `(${citation.issue})`}
                      {citation.pages && `, ${citation.pages}`}
                    </p>
                  )}
                </div>
                <Badge variant="outline">{citation.type}</Badge>
              </div>

              <div className="bg-muted p-3 rounded text-sm font-mono mb-3">
                {/* This would show the formatted citation */}
                {citation.authors[0]} ({citation.year}). {citation.title}. 
                {citation.journal && ` ${citation.journal}.`}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {citation.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(`${citation.authors[0]} (${citation.year}). ${citation.title}.`)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCitations.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No citations found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? 'Try adjusting your search terms' : 'Add your first citation to get started'}
          </p>
        </div>
      )}
    </div>
  )
}
