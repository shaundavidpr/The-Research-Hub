"use client"

import { useState, useEffect } from 'react'
import { db, File } from '@/lib/database'

export function useFiles(userId: string = 'demo-user', filters?: { type?: string; project_id?: string }) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFiles = async () => {
    try {
      setLoading(true)
      const userFiles = await db.getFiles(userId, filters)
      setFiles(userFiles)
    } catch (err) {
      setError('Failed to load files')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (fileData: {
    name: string
    type: string
    size: number
    url: string
    project_id?: string
    metadata?: any
  }) => {
    try {
      const newFile = await db.createFile({
        ...fileData,
        user_id: userId
      })
      setFiles(prev => [newFile, ...prev])
      return newFile
    } catch (err) {
      setError('Failed to upload file')
      throw err
    }
  }

  const deleteFile = async (id: string) => {
    try {
      const success = await db.deleteFile(id)
      if (success) {
        setFiles(prev => prev.filter(file => file.id !== id))
      }
      return success
    } catch (err) {
      setError('Failed to delete file')
      throw err
    }
  }

  const getFilesByType = (type: string) => {
    return files.filter(file => file.type.includes(type))
  }

  const searchFiles = (query: string) => {
    return files.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.metadata?.title?.toLowerCase().includes(query.toLowerCase())
    )
  }

  useEffect(() => {
    loadFiles()
  }, [userId, JSON.stringify(filters)])

  return {
    files,
    loading,
    error,
    uploadFile,
    deleteFile,
    getFilesByType,
    searchFiles,
    refreshFiles: loadFiles
  }
}