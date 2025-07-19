"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  FileText, 
  FileImage, 
  FileSpreadsheet,
  File as FileIcon,
  Brain,
  Eye,
  Share2,
  Star,
  FolderOpen,
  Grid,
  List,
  SortAsc,
  MoreHorizontal,
  Edit,
  Copy,
  Move,
  Archive,
  Tag,
  Calendar,
  User,
  Clock,
  HardDrive,
  Zap
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileItem {
  id: string
  name: string
  type: string
  size: number
  url: string
  project_id?: string
  metadata?: any
  is_private: boolean
  created_at: string
  updated_at: string
  is_favorite?: boolean
  tags?: string[]
  analysis_status?: 'pending' | 'analyzing' | 'completed' | 'failed'
  analysis_results?: any
}

interface FileManagerProps {
  projectId?: string
}

export function EnhancedFileManager({ projectId }: FileManagerProps) {
  const { toast } = useToast()
  const { user } = useUser()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date')
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isUploading, setIsUploading] = useState(false)
  const [analyzingFiles, setAnalyzingFiles] = useState<Set<string>>(new Set())
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  // Load files
  const loadFiles = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      let query = supabase
        .from('research_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query

      if (error) throw error

      setFiles(data || [])
    } catch (error) {
      console.error('Error loading files:', error)
      toast({
        title: "Error loading files",
        description: "Failed to load your files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [user, projectId, supabase, toast])

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    if (!uploadedFiles.length || !user) return

    setIsUploading(true)

    for (const file of uploadedFiles) {
      try {
        // Validate file
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 50MB limit.`,
            variant: "destructive",
          })
          continue
        }

        const fileId = `${Date.now()}-${file.name}`
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: Math.min((prev[fileId] || 0) + Math.random() * 30, 90)
          }))
        }, 200)

        // Upload to Supabase Storage
        const filePath = `${user.id}/${projectId || 'general'}/${fileId}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('research-files')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('research-files')
          .getPublicUrl(filePath)

        // Save file metadata to database
        const { data: fileData, error: dbError } = await supabase
          .from('research_files')
          .insert({
            user_id: user.id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: publicUrl,
            project_id: projectId,
            metadata: {
              original_name: file.name,
              upload_date: new Date().toISOString(),
            },
            is_private: false,
          })
          .select()
          .single()

        if (dbError) throw dbError

        clearInterval(progressInterval)
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))

        // Add to files list
        setFiles(prev => [fileData, ...prev])

        // Auto-analyze if it's a research document
        if (file.type.includes('pdf') || file.type.includes('document')) {
          analyzeFile(fileData.id)
        }

        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded and is ready for analysis.`,
        })

        // Clean up progress after delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[fileId]
            return newProgress
          })
        }, 2000)

      } catch (error) {
        console.error('Upload error:', error)
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive",
        })
      }
    }

    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // AI file analysis
  const analyzeFile = async (fileId: string) => {
    setAnalyzingFiles(prev => new Set([...prev, fileId]))

    try {
      const response = await fetch('/api/analyze-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      })

      if (!response.ok) throw new Error('Analysis failed')

      const analysis = await response.json()

      // Update file with analysis results
      const { error } = await supabase
        .from('research_files')
        .update({
          metadata: {
            ...files.find(f => f.id === fileId)?.metadata,
            analysis: analysis,
            analysis_date: new Date().toISOString(),
          }
        })
        .eq('id', fileId)

      if (error) throw error

      // Update local state
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, analysis_status: 'completed', analysis_results: analysis }
          : file
      ))

      toast({
        title: "Analysis completed",
        description: "File has been analyzed by Aethon AI.",
      })

    } catch (error) {
      console.error('Analysis error:', error)
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, analysis_status: 'failed' }
          : file
      ))
      toast({
        title: "Analysis failed",
        description: "Failed to analyze file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAnalyzingFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(fileId)
        return newSet
      })
    }
  }

  // File operations
  const toggleFavorite = async (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return

    try {
      const { error } = await supabase
        .from('research_files')
        .update({ 
          metadata: { 
            ...file.metadata, 
            is_favorite: !file.metadata?.is_favorite 
          } 
        })
        .eq('id', fileId)

      if (error) throw error

      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, is_favorite: !f.is_favorite }
          : f
      ))

      toast({
        title: file.is_favorite ? "Removed from favorites" : "Added to favorites",
        description: `${file.name} ${file.is_favorite ? 'removed from' : 'added to'} favorites.`,
      })
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const deleteFile = async (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return

    try {
      // Delete from storage
      const filePath = file.url.split('/').pop()
      if (filePath) {
        await supabase.storage
          .from('research-files')
          .remove([filePath])
      }

      // Delete from database
      const { error } = await supabase
        .from('research_files')
        .delete()
        .eq('id', fileId)

      if (error) throw error

      setFiles(prev => prev.filter(f => f.id !== fileId))
      setSelectedFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(fileId)
        return newSet
      })

      toast({
        title: "File deleted",
        description: `${file.name} has been permanently deleted.`,
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      toast({
        title: "Delete failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Utility functions
  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FileImage className="h-5 w-5" />
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-5 w-5" />
    if (type.includes('spreadsheet') || type.includes('csv')) return <FileSpreadsheet className="h-5 w-5" />
    return <FileIcon className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter and sort files
  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || file.type.includes(selectedType)
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return b.size - a.size
        case 'type':
          return a.type.localeCompare(b.type)
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const fileTypes = [
    { value: 'all', label: 'All Files', count: files.length },
    { value: 'pdf', label: 'PDFs', count: files.filter(f => f.type.includes('pdf')).length },
    { value: 'image', label: 'Images', count: files.filter(f => f.type.includes('image')).length },
    { value: 'document', label: 'Documents', count: files.filter(f => f.type.includes('document')).length },
    { value: 'spreadsheet', label: 'Spreadsheets', count: files.filter(f => f.type.includes('spreadsheet')).length }
  ]

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const storageUsed = (totalSize / (1024 * 1024 * 1024)) * 100 // Percentage of 1GB

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Overview
            </span>
            <Badge variant="secondary">
              {formatFileSize(totalSize)} used
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Used</span>
              <span>{storageUsed.toFixed(1)}% of 1GB</span>
            </div>
            <Progress value={storageUsed} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>File Upload</span>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
          />
          
          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2 mb-4">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          )}

          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Research Files</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">PDF</Badge>
              <Badge variant="outline">DOC</Badge>
              <Badge variant="outline">XLSX</Badge>
              <Badge variant="outline">Images</Badge>
              <Badge variant="outline">CSV</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>File Library</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              {fileTypes.map((type) => (
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
          </div>

          {/* Bulk Actions */}
          {selectedFiles.size > 0 && (
            <Alert>
              <AlertDescription className="flex items-center justify-between">
                <span>{selectedFiles.size} files selected</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button size="sm" variant="outline">
                    <Move className="h-4 w-4 mr-2" />
                    Move
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Files Display */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No files found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-2"
            }>
              {filteredFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardContent className={viewMode === 'grid' ? "p-4" : "p-3"}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedFiles.has(file.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedFiles)
                              if (e.target.checked) {
                                newSelected.add(file.id)
                              } else {
                                newSelected.delete(file.id)
                              }
                              setSelectedFiles(newSelected)
                            }}
                            className="rounded"
                          />
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{file.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDate(file.created_at)}</span>
                            {file.analysis_status === 'completed' && (
                              <>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">
                                  <Brain className="h-3 w-3 mr-1" />
                                  Analyzed
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleFavorite(file.id)}>
                            <Star className={`h-4 w-4 mr-2 ${file.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                            {file.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy link
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => deleteFile(file.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* File Tags */}
                    {file.tags && file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {file.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {file.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{file.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Analysis Status */}
                    {file.analysis_status && (
                      <div className="mb-3">
                        {file.analysis_status === 'analyzing' && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                            <span>Analyzing with Aethon AI...</span>
                          </div>
                        )}
                        {file.analysis_status === 'completed' && file.analysis_results && (
                          <div className="p-2 bg-green-50 rounded text-sm">
                            <div className="font-medium text-green-800 mb-1">AI Analysis Complete</div>
                            <div className="text-green-700 text-xs">
                              {file.analysis_results.summary?.substring(0, 100)}...
                            </div>
                          </div>
                        )}
                        {file.analysis_status === 'failed' && (
                          <div className="p-2 bg-red-50 rounded text-sm text-red-700">
                            Analysis failed. Click to retry.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => analyzeFile(file.id)}
                        disabled={analyzingFiles.has(file.id)}
                        className="flex-1"
                      >
                        <Brain className={`h-3 w-3 mr-1 ${analyzingFiles.has(file.id) ? 'animate-pulse' : ''}`} />
                        {analyzingFiles.has(file.id) ? 'Analyzing...' : 'AI Analyze'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}