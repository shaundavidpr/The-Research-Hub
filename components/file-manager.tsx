"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Share2
} from "lucide-react"
import { useFiles } from '@/hooks/use-files'
import { aethonAI } from '@/lib/aethon-ai'

interface FileManagerProps {
  projectId?: string
}

export function FileManager({ projectId }: FileManagerProps) {
  const { files, loading, uploadFile, deleteFile, searchFiles } = useFiles('demo-user', { project_id: projectId })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [analyzingFile, setAnalyzingFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // In a real app, you'd upload to a cloud storage service
      const mockUrl = `https://example.com/files/${file.name}`
      
      await uploadFile({
        name: file.name,
        type: file.type,
        size: file.size,
        url: mockUrl,
        project_id: projectId,
        metadata: {
          title: file.name.replace(/\.[^/.]+$/, ""),
          uploadDate: new Date().toISOString()
        }
      })

      setUploadProgress(100)
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)
    } catch (error) {
      console.error('Upload failed:', error)
      setIsUploading(false)
      setUploadProgress(0)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const analyzeFile = async (file: any) => {
    setAnalyzingFile(file.id)
    try {
      const analysis = await aethonAI.analyzeFile(file)
      // In a real app, you'd save this analysis or show it in a modal
      console.log('File analysis:', analysis)
      alert(`Analysis complete! Key insights: ${analysis.text.substring(0, 200)}...`)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setAnalyzingFile(null)
    }
  }

  const filteredFiles = searchQuery 
    ? searchFiles(searchQuery)
    : selectedType === 'all' 
      ? files 
      : files.filter(file => file.type.includes(selectedType))

  const fileTypes = [
    { value: 'all', label: 'All Files', count: files.length },
    { value: 'pdf', label: 'PDFs', count: files.filter(f => f.type.includes('pdf')).length },
    { value: 'image', label: 'Images', count: files.filter(f => f.type.includes('image')).length },
    { value: 'document', label: 'Documents', count: files.filter(f => f.type.includes('document')).length },
    { value: 'spreadsheet', label: 'Spreadsheets', count: files.filter(f => f.type.includes('spreadsheet')).length }
  ]

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>File Upload</span>
            <Button onClick={() => fileInputRef.current?.click()}>
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
          />
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Research Files</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop files here, or click to browse. Supports PDFs, images, documents, and datasets.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
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

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{file.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {file.metadata?.keywords && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {file.metadata.keywords.slice(0, 3).map((keyword: string) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => analyzeFile(file)}
                  disabled={analyzingFile === file.id}
                >
                  <Brain className={`h-3 w-3 mr-1 ${analyzingFile === file.id ? 'animate-pulse' : ''}`} />
                  {analyzingFile === file.id ? 'Analyzing...' : 'Analyze'}
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteFile(file.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No files found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
          </p>
        </div>
      )}
    </div>
  )
}