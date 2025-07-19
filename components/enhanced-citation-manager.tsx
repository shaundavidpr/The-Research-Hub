"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Download, 
  Copy, 
  Edit, 
  Trash2,
  BookMarked,
  FileDown,
  Brain,
  Star,
  Filter,
  SortAsc,
  Import,
  Export,
  Globe,
  Calendar,
  Users,
  Tag,
  Quote,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Zap,
  Sparkles,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Citation {
  id: string
  type: 'article' | 'book' | 'website' | 'conference' | 'thesis' | 'report'
  title: string
  authors: string[]
  journal?: string
  year: number
  doi?: string
  url?: string
  pages?: string
  volume?: string
  issue?: string
  publisher?: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at: string
  formatted_citations?: {
    apa: string
    mla: string
    chicago: string
    harvard: string
  }
}

export function EnhancedCitationManager() {
  const { toast } = useToast()
  const { user } = useUser()
  const supabase = createClient()

  const [citations, setCitations] = useState<Citation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [citationStyle, setCitationStyle] = useState('apa')
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'authors' | 'created_at'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCitation, setEditingCitation] = useState<Citation | null>(null)
  const [selectedCitations, setSelectedCitations] = useState<Set<string>>(new Set())
  const [isGeneratingCitations, setIsGeneratingCitations] = useState(false)

  const [newCitation, setNewCitation] = useState<Partial<Citation>>({
    type: 'article',
    title: '',
    authors: [''],
    year: new Date().getFullYear(),
    tags: []
  })

  // Load citations
  useEffect(() => {
    if (user) {
      loadCitations()
    }
  }, [user])

  const loadCitations = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('citations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCitations(data || [])
    } catch (error) {
      console.error('Error loading citations:', error)
      toast({
        title: "Error loading citations",
        description: "Failed to load your citations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Add new citation
  const handleAddCitation = async () => {
    if (!user || !newCitation.title || !newCitation.authors?.[0]) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the title and at least one author.",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('citations')
        .insert({
          user_id: user.id,
          type: newCitation.type!,
          title: newCitation.title,
          authors: newCitation.authors.filter(author => author.trim()),
          journal: newCitation.journal,
          year: newCitation.year!,
          doi: newCitation.doi,
          url: newCitation.url,
          pages: newCitation.pages,
          volume: newCitation.volume,
          issue: newCitation.issue,
          publisher: newCitation.publisher,
          tags: newCitation.tags || [],
          is_favorite: false
        })
        .select()
        .single()

      if (error) throw error

      setCitations(prev => [data, ...prev])
      setNewCitation({
        type: 'article',
        title: '',
        authors: [''],
        year: new Date().getFullYear(),
        tags: []
      })
      setShowAddDialog(false)

      toast({
        title: "Citation added",
        description: "Your citation has been successfully added.",
      })

      // Auto-generate formatted citations
      generateFormattedCitations(data.id)

    } catch (error) {
      console.error('Error adding citation:', error)
      toast({
        title: "Error adding citation",
        description: "Failed to add citation. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Generate formatted citations using AI
  const generateFormattedCitations = async (citationId: string) => {
    const citation = citations.find(c => c.id === citationId)
    if (!citation) return

    try {
      setIsGeneratingCitations(true)

      // Simulate AI citation formatting (in production, this would call actual AI service)
      const formattedCitations = {
        apa: generateAPACitation(citation),
        mla: generateMLACitation(citation),
        chicago: generateChicagoCitation(citation),
        harvard: generateHarvardCitation(citation)
      }

      // Update citation with formatted versions
      const { error } = await supabase
        .from('citations')
        .update({ 
          formatted_citations: formattedCitations 
        })
        .eq('id', citationId)

      if (error) throw error

      setCitations(prev => prev.map(c => 
        c.id === citationId 
          ? { ...c, formatted_citations: formattedCitations }
          : c
      ))

    } catch (error) {
      console.error('Error generating formatted citations:', error)
    } finally {
      setIsGeneratingCitations(false)
    }
  }

  // Citation formatting functions
  const generateAPACitation = (citation: Citation): string => {
    const authors = citation.authors.join(', ')
    const year = citation.year
    const title = citation.title
    
    if (citation.type === 'article' && citation.journal) {
      return `${authors} (${year}). ${title}. ${citation.journal}${citation.volume ? `, ${citation.volume}` : ''}${citation.issue ? `(${citation.issue})` : ''}${citation.pages ? `, ${citation.pages}` : ''}.${citation.doi ? ` https://doi.org/${citation.doi}` : ''}`
    } else if (citation.type === 'book') {
      return `${authors} (${year}). ${title}. ${citation.publisher || 'Publisher'}.`
    } else if (citation.type === 'website') {
      return `${authors} (${year}). ${title}. Retrieved from ${citation.url || 'URL'}`
    }
    
    return `${authors} (${year}). ${title}.`
  }

  const generateMLACitation = (citation: Citation): string => {
    const firstAuthor = citation.authors[0] || 'Author'
    const title = `"${citation.title}"`
    
    if (citation.type === 'article' && citation.journal) {
      return `${firstAuthor}. ${title} ${citation.journal}, vol. ${citation.volume || '1'}, no. ${citation.issue || '1'}, ${citation.year}, pp. ${citation.pages || '1-10'}.`
    }
    
    return `${firstAuthor}. ${title} ${citation.year}.`
  }

  const generateChicagoCitation = (citation: Citation): string => {
    const authors = citation.authors.join(', ')
    const title = `"${citation.title}"`
    
    if (citation.type === 'article' && citation.journal) {
      return `${authors}. ${title} ${citation.journal} ${citation.volume || '1'}, no. ${citation.issue || '1'} (${citation.year}): ${citation.pages || '1-10'}.`
    }
    
    return `${authors}. ${title} ${citation.year}.`
  }

  const generateHarvardCitation = (citation: Citation): string => {
    const authors = citation.authors.join(', ')
    return `${authors}, ${citation.year}. ${citation.title}. ${citation.journal || citation.publisher || 'Source'}.`
  }

  // Toggle favorite
  const toggleFavorite = async (citationId: string) => {
    const citation = citations.find(c => c.id === citationId)
    if (!citation) return

    try {
      const { error } = await supabase
        .from('citations')
        .update({ is_favorite: !citation.is_favorite })
        .eq('id', citationId)

      if (error) throw error

      setCitations(prev => prev.map(c => 
        c.id === citationId 
          ? { ...c, is_favorite: !c.is_favorite }
          : c
      ))

      toast({
        title: citation.is_favorite ? "Removed from favorites" : "Added to favorites",
        description: `"${citation.title}" ${citation.is_favorite ? 'removed from' : 'added to'} favorites.`,
      })
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  // Delete citation
  const deleteCitation = async (citationId: string) => {
    try {
      const { error } = await supabase
        .from('citations')
        .delete()
        .eq('id', citationId)

      if (error) throw error

      setCitations(prev => prev.filter(c => c.id !== citationId))
      setSelectedCitations(prev => {
        const newSet = new Set(prev)
        newSet.delete(citationId)
        return newSet
      })

      toast({
        title: "Citation deleted",
        description: "The citation has been permanently deleted.",
      })
    } catch (error) {
      console.error('Error deleting citation:', error)
      toast({
        title: "Error deleting citation",
        description: "Failed to delete citation. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Copy citation to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Citation has been copied to your clipboard.",
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: "Copy failed",
        description: "Failed to copy citation. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Export bibliography
  const exportBibliography = () => {
    const bibliography = filteredCitations
      .map(citation => citation.formatted_citations?.[citationStyle as keyof typeof citation.formatted_citations] || citation.title)
      .join('\n\n')

    const blob = new Blob([bibliography], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bibliography-${citationStyle}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Bibliography exported",
      description: `Bibliography exported in ${citationStyle.toUpperCase()} format.`,
    })
  }

  // Filter and sort citations
  const filteredCitations = citations
    .filter(citation => {
      const matchesSearch = citation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           citation.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           citation.journal?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || citation.type === selectedType
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => citation.tags.includes(tag))
      return matchesSearch && matchesType && matchesTags
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'year':
          comparison = a.year - b.year
          break
        case 'authors':
          comparison = (a.authors[0] || '').localeCompare(b.authors[0] || '')
          break
        case 'created_at':
        default:
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const citationTypes = [
    { value: 'all', label: 'All Types', count: citations.length },
    { value: 'article', label: 'Articles', count: citations.filter(c => c.type === 'article').length },
    { value: 'book', label: 'Books', count: citations.filter(c => c.type === 'book').length },
    { value: 'website', label: 'Websites', count: citations.filter(c => c.type === 'website').length },
    { value: 'conference', label: 'Conference', count: citations.filter(c => c.type === 'conference').length },
    { value: 'thesis', label: 'Thesis', count: citations.filter(c => c.type === 'thesis').length },
    { value: 'report', label: 'Reports', count: citations.filter(c => c.type === 'report').length }
  ]

  const allTags = [...new Set(citations.flatMap(c => c.tags))]

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search citations by title, author, or journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={citationStyle} onValueChange={setCitationStyle}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apa">APA 7th</SelectItem>
              <SelectItem value="mla">MLA 9th</SelectItem>
              <SelectItem value="chicago">Chicago 17th</SelectItem>
              <SelectItem value="harvard">Harvard</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportBibliography} disabled={filteredCitations.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Citation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Citation</DialogTitle>
                <DialogDescription>
                  Enter the details for your new citation. Aethon AI will help format it properly.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select 
                      value={newCitation.type} 
                      onValueChange={(value: any) => setNewCitation({...newCitation, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Journal Article</SelectItem>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="conference">Conference Paper</SelectItem>
                        <SelectItem value="thesis">Thesis/Dissertation</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year *</Label>
                    <Input
                      type="number"
                      value={newCitation.year}
                      onChange={(e) => setNewCitation({...newCitation, year: parseInt(e.target.value)})}
                      min="1900"
                      max={new Date().getFullYear() + 5}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={newCitation.title}
                    onChange={(e) => setNewCitation({...newCitation, title: e.target.value})}
                    placeholder="Enter the title of the work..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Authors *</Label>
                  <div className="space-y-2">
                    {newCitation.authors?.map((author, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={author}
                          onChange={(e) => {
                            const newAuthors = [...(newCitation.authors || [])]
                            newAuthors[index] = e.target.value
                            setNewCitation({...newCitation, authors: newAuthors})
                          }}
                          placeholder={`Author ${index + 1}`}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newAuthors = newCitation.authors?.filter((_, i) => i !== index)
                              setNewCitation({...newCitation, authors: newAuthors})
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewCitation({
                          ...newCitation, 
                          authors: [...(newCitation.authors || []), '']
                        })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Author
                    </Button>
                  </div>
                </div>

                {newCitation.type === 'article' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Journal</Label>
                      <Input
                        value={newCitation.journal || ''}
                        onChange={(e) => setNewCitation({...newCitation, journal: e.target.value})}
                        placeholder="Journal name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Volume</Label>
                      <Input
                        value={newCitation.volume || ''}
                        onChange={(e) => setNewCitation({...newCitation, volume: e.target.value})}
                        placeholder="Volume"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pages</Label>
                      <Input
                        value={newCitation.pages || ''}
                        onChange={(e) => setNewCitation({...newCitation, pages: e.target.value})}
                        placeholder="e.g., 123-145"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>DOI</Label>
                    <Input
                      value={newCitation.doi || ''}
                      onChange={(e) => setNewCitation({...newCitation, doi: e.target.value})}
                      placeholder="10.1000/xyz123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={newCitation.url || ''}
                      onChange={(e) => setNewCitation({...newCitation, url: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCitation}>
                  <Brain className="mr-2 h-4 w-4" />
                  Add & Format Citation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
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

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Filter by tags:</Label>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  )
                }}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Sort Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Sort by:</Label>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Added</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="authors">Author</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            <SortAsc className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCitations.size > 0 && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>{selectedCitations.size} citations selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Export className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
              <Button size="sm" variant="outline">
                <Tag className="h-4 w-4 mr-2" />
                Add Tags
              </Button>
              <Button size="sm" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Citations List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredCitations.length === 0 ? (
          <div className="text-center py-12">
            <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No citations found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || selectedType !== 'all' || selectedTags.length > 0
                ? 'Try adjusting your search or filter criteria'
                : 'Add your first citation to get started'}
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Citation
            </Button>
          </div>
        ) : (
          filteredCitations.map((citation) => (
            <Card key={citation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedCitations.has(citation.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedCitations)
                        if (e.target.checked) {
                          newSelected.add(citation.id)
                        } else {
                          newSelected.delete(citation.id)
                        }
                        setSelectedCitations(newSelected)
                      }}
                      className="mt-1 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{citation.title}</h3>
                        {citation.is_favorite && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {citation.authors.join(', ')} ({citation.year})
                      </p>
                      {citation.journal && (
                        <p className="text-sm text-muted-foreground italic mb-2">
                          {citation.journal}
                          {citation.volume && `, Vol. ${citation.volume}`}
                          {citation.issue && ` (${citation.issue})`}
                          {citation.pages && `, pp. ${citation.pages}`}
                        </p>
                      )}
                      {citation.doi && (
                        <p className="text-sm text-muted-foreground mb-2">
                          DOI: <a href={`https://doi.org/${citation.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{citation.doi}</a>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {citation.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(citation.id)}
                    >
                      <Star className={`h-4 w-4 ${citation.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                {citation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {citation.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Formatted Citation */}
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">{citationStyle.toUpperCase()} Format:</Label>
                    {isGeneratingCitations && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Formatting...</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-mono leading-relaxed">
                    {citation.formatted_citations?.[citationStyle as keyof typeof citation.formatted_citations] || 
                     generateAPACitation(citation)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(
                        citation.formatted_citations?.[citationStyle as keyof typeof citation.formatted_citations] || 
                        generateAPACitation(citation)
                      )}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {citation.url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={citation.url} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-3 w-3 mr-1" />
                          View Source
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateFormattedCitations(citation.id)}
                      disabled={isGeneratingCitations}
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      AI Format
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteCitation(citation.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* AI Citation Assistant */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Aethon Citation Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Auto-Format</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically format citations in APA, MLA, Chicago, and Harvard styles.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-green-600" />
                <span className="font-medium">Smart Search</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Find and import citations from DOI, URL, or by searching academic databases.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Quality Check</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Verify citation accuracy and completeness with AI-powered validation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Helper function for APA citation (used as fallback)
  function generateAPACitation(citation: Citation): string {
    const authors = citation.authors.join(', ')
    const year = citation.year
    const title = citation.title
    
    if (citation.type === 'article' && citation.journal) {
      return `${authors} (${year}). ${title}. ${citation.journal}${citation.volume ? `, ${citation.volume}` : ''}${citation.issue ? `(${citation.issue})` : ''}${citation.pages ? `, ${citation.pages}` : ''}.${citation.doi ? ` https://doi.org/${citation.doi}` : ''}`
    } else if (citation.type === 'book') {
      return `${authors} (${year}). ${title}. ${citation.publisher || 'Publisher'}.`
    } else if (citation.type === 'website') {
      return `${authors} (${year}). ${title}. Retrieved from ${citation.url || 'URL'}`
    }
    
    return `${authors} (${year}). ${title}.`
  }
}