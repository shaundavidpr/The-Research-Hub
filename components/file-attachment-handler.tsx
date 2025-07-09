"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  File, 
  FileText, 
  FileImage, 
  FileSpreadsheet,
  X,
  Paperclip,
  Brain,
  Eye
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AttachedFile {
  id: string
  name: string
  type: string
  size: number
  url?: string
  content?: string
  status: 'uploading' | 'ready' | 'analyzing' | 'analyzed' | 'error'
  analysis?: {
    summary: string
    keyPoints: string[]
    suggestions: string[]
  }
}

interface FileAttachmentHandlerProps {
  onFilesChange: (files: AttachedFile[]) => void
  onFileAnalysis: (fileId: string, analysis: any) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
}

export function FileAttachmentHandler({ 
  onFilesChange, 
  onFileAnalysis,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedTypes = ['.pdf', '.txt', '.doc', '.docx', '.csv', '.xlsx', '.png', '.jpg', '.jpeg']
}: FileAttachmentHandlerProps) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FileImage className="h-4 w-4" />
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-4 w-4" />
    if (type.includes('spreadsheet') || type.includes('csv')) return <FileSpreadsheet className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type ${fileExtension} is not supported`
    }

    // Check max files limit
    if (attachedFiles.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`
    }

    return null
  }

  const processFile = async (file: File) => {
    const validation = validateFile(file)
    if (validation) {
      toast({
        title: "File validation failed",
        description: validation,
        variant: "destructive"
      })
      return
    }

    const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const attachedFile: AttachedFile = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading'
    }

    setAttachedFiles(prev => [...prev, attachedFile])

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Read file content for text files
      let content = ''
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        content = await file.text()
      }

      // Create object URL for the file
      const url = URL.createObjectURL(file)

      const updatedFile: AttachedFile = {
        ...attachedFile,
        url,
        content,
        status: 'ready'
      }

      setAttachedFiles(prev => 
        prev.map(f => f.id === fileId ? updatedFile : f)
      )

      // Trigger analysis
      await analyzeFile(updatedFile)

      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis`
      })

    } catch (error) {
      setAttachedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, status: 'error' } : f)
      )
      
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      })
    }
  }

  const analyzeFile = async (file: AttachedFile) => {
    setAttachedFiles(prev => 
      prev.map(f => f.id === file.id ? { ...f, status: 'analyzing' } : f)
    )

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))

      const analysis = {
        summary: `Analysis of ${file.name}: This document contains research-related content with key insights and methodological approaches.`,
        keyPoints: [
          "Contains structured research methodology",
          "Includes statistical analysis and findings",
          "References multiple academic sources",
          "Presents clear conclusions and implications"
        ],
        suggestions: [
          "Extract key citations for reference",
          "Summarize main findings",
          "Identify research gaps mentioned",
          "Compare with similar studies"
        ]
      }

      const analyzedFile = {
        ...file,
        status: 'analyzed' as const,
        analysis
      }

      setAttachedFiles(prev => 
        prev.map(f => f.id === file.id ? analyzedFile : f)
      )

      onFileAnalysis(file.id, analysis)

      toast({
        title: "File analysis complete",
        description: `${file.name} has been analyzed by Aethon AI`
      })

    } catch (error) {
      setAttachedFiles(prev => 
        prev.map(f => f.id === file.id ? { ...f, status: 'error' } : f)
      )
    }
  }

  const removeFile = (fileId: string) => {
    const file = attachedFiles.find(f => f.id === fileId)
    if (file?.url) {
      URL.revokeObjectURL(file.url)
    }
    
    const updatedFiles = attachedFiles.filter(f => f.id !== fileId)
    setAttachedFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    files.forEach(processFile)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    files.forEach(processFile)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  // Update parent component when files change
  React.useEffect(() => {
    onFilesChange(attachedFiles)
  }, [attachedFiles, onFilesChange])

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Paperclip className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag files here or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files, {maxFileSize}MB each. Supports: {acceptedTypes.join(', ')}
            </p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Attached Files */}
      {attachedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Attached Files ({attachedFiles.length})</h4>
          {attachedFiles.map((file) => (
            <Card key={file.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-xs">Uploading...</span>
                      </div>
                    )}
                    
                    {file.status === 'analyzing' && (
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 animate-pulse text-primary" />
                        <span className="text-xs">Analyzing...</span>
                      </div>
                    )}
                    
                    {file.status === 'analyzed' && (
                      <Badge variant="secondary" className="text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        Analyzed
                      </Badge>
                    )}
                    
                    {file.status === 'ready' && (
                      <Badge variant="outline" className="text-xs">
                        Ready
                      </Badge>
                    )}
                    
                    {file.status === 'error' && (
                      <Badge variant="destructive" className="text-xs">
                        Error
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* File Analysis Results */}
              {file.analysis && (
                <div className="mt-3 pt-3 border-t">
                  <div className="space-y-2">
                    <p className="text-xs font-medium">AI Analysis:</p>
                    <p className="text-xs text-muted-foreground">{file.analysis.summary}</p>
                    
                    {file.analysis.keyPoints.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-1">Key Points:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {file.analysis.keyPoints.slice(0, 2).map((point, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}