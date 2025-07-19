"use client"

import { useState, useEffect, useCallback } from "react"
import type { File } from "@/lib/database" // Assuming File interface is still in lib/database

interface UseFilesOptions {
  userId: string | undefined
  type?: string
  projectId?: string
}

export function useFiles({ userId, type, projectId }: UseFilesOptions) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = useCallback(async () => {
    if (!userId) {
      setFiles([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append("userId", userId)
      if (type) params.append("type", type)
      if (projectId) params.append("projectId", projectId)

      const response = await fetch(`/api/files?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`)
      }
      const data: File[] = await response.json()
      setFiles(data)
    } catch (err: any) {
      setError(err.message || "Failed to load files.")
      console.error("Error fetching files:", err)
    } finally {
      setLoading(false)
    }
  }, [userId, type, projectId])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const createFile = useCallback(
    async (fileData: Omit<File, "id" | "created_at" | "updated_at" | "user_id">) => {
      if (!userId) {
        setError("User not authenticated.")
        return null
      }
      try {
        const response = await fetch("/api/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...fileData, userId }),
        })
        if (!response.ok) {
          throw new Error(`Failed to create file: ${response.statusText}`)
        }
        const newFile: File = await response.json()
        setFiles((prev) => [newFile, ...prev])
        return newFile
      } catch (err: any) {
        setError(err.message || "Failed to create file.")
        console.error("Error creating file:", err)
        return null
      }
    },
    [userId],
  )

  const deleteFile = useCallback(
    async (id: string) => {
      if (!userId) {
        setError("User not authenticated.")
        return false
      }
      try {
        const response = await fetch(`/api/files?id=${id}&userId=${userId}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error(`Failed to delete file: ${response.statusText}`)
        }
        setFiles((prev) => prev.filter((file) => file.id !== id))
        return true
      } catch (err: any) {
        setError(err.message || "Failed to delete file.")
        console.error("Error deleting file:", err)
        return false
      }
    },
    [userId],
  )

  return { files, loading, error, fetchFiles, createFile, deleteFile }
}
