"use client"

import { useState, useEffect, useCallback } from "react"
import type { Note } from "@/lib/database" // Assuming Note interface is still in lib/database

interface UseNotesOptions {
  userId: string | undefined
  type?: "research" | "personal"
  projectId?: string
  tags?: string[]
}

export function useNotes({ userId, type, projectId, tags }: UseNotesOptions) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    if (!userId) {
      setNotes([])
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
      // Note: Passing tags as a query param array might need more complex handling on the API side
      // For simplicity, if tags are needed, consider joining them or sending as JSON string
      // if (tags && tags.length > 0) params.append('tags', JSON.stringify(tags));

      const response = await fetch(`/api/notes?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`)
      }
      const data: Note[] = await response.json()
      setNotes(data)
    } catch (err: any) {
      setError(err.message || "Failed to load notes.")
      console.error("Error fetching notes:", err)
    } finally {
      setLoading(false)
    }
  }, [userId, type, projectId, tags])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const createNote = useCallback(
    async (noteData: Omit<Note, "id" | "created_at" | "updated_at" | "user_id">) => {
      if (!userId) {
        setError("User not authenticated.")
        return null
      }
      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...noteData, userId }),
        })
        if (!response.ok) {
          throw new Error(`Failed to create note: ${response.statusText}`)
        }
        const newNote: Note = await response.json()
        setNotes((prev) => [newNote, ...prev])
        return newNote
      } catch (err: any) {
        setError(err.message || "Failed to create note.")
        console.error("Error creating note:", err)
        return null
      }
    },
    [userId],
  )

  const updateNote = useCallback(
    async (id: string, updates: Partial<Note>) => {
      if (!userId) {
        setError("User not authenticated.")
        return null
      }
      try {
        const response = await fetch(`/api/notes/${id}`, {
          // Assuming a PUT route for specific note ID
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, updates }),
        })
        if (!response.ok) {
          throw new Error(`Failed to update note: ${response.statusText}`)
        }
        const updatedNote: Note = await response.json()
        setNotes((prev) => prev.map((note) => (note.id === id ? updatedNote : note)))
        return updatedNote
      } catch (err: any) {
        setError(err.message || "Failed to update note.")
        console.error("Error updating note:", err)
        return null
      }
    },
    [userId],
  )

  const deleteNote = useCallback(
    async (id: string) => {
      if (!userId) {
        setError("User not authenticated.")
        return false
      }
      try {
        const response = await fetch(`/api/notes/${id}?userId=${userId}`, {
          // Assuming a DELETE route for specific note ID
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error(`Failed to delete note: ${response.statusText}`)
        }
        setNotes((prev) => prev.filter((note) => note.id !== id))
        return true
      } catch (err: any) {
        setError(err.message || "Failed to delete note.")
        console.error("Error deleting note:", err)
        return false
      }
    },
    [userId],
  )

  return { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote }
}
