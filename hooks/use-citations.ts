"use client"

import { useState, useEffect, useCallback } from "react"
import type { Citation } from "@/lib/database" // Assuming Citation interface is still in lib/database

interface UseCitationsOptions {
  userId: string | undefined
  type?: "article" | "book" | "website" | "conference"
  tags?: string[]
}

export function useCitations({ userId, type, tags }: UseCitationsOptions) {
  const [citations, setCitations] = useState<Citation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCitations = useCallback(async () => {
    if (!userId) {
      setCitations([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append("userId", userId)
      if (type) params.append("type", type)
      if (tags && tags.length > 0) params.append("tags", JSON.stringify(tags)) // Pass tags as JSON string

      const response = await fetch(`/api/citations?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch citations: ${response.statusText}`)
      }
      const data: Citation[] = await response.json()
      setCitations(data)
    } catch (err: any) {
      setError(err.message || "Failed to load citations.")
      console.error("Error fetching citations:", err)
    } finally {
      setLoading(false)
    }
  }, [userId, type, tags])

  useEffect(() => {
    fetchCitations()
  }, [fetchCitations])

  const createCitation = useCallback(
    async (citationData: Omit<Citation, "id" | "created_at" | "updated_at" | "user_id">) => {
      if (!userId) {
        setError("User not authenticated.")
        return null
      }
      try {
        const response = await fetch("/api/citations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...citationData, userId }),
        })
        if (!response.ok) {
          throw new Error(`Failed to create citation: ${response.statusText}`)
        }
        const newCitation: Citation = await response.json()
        setCitations((prev) => [newCitation, ...prev])
        return newCitation
      } catch (err: any) {
        setError(err.message || "Failed to create citation.")
        console.error("Error creating citation:", err)
        return null
      }
    },
    [userId],
  )

  const updateCitation = useCallback(
    async (id: string, updates: Partial<Citation>) => {
      if (!userId) {
        setError("User not authenticated.")
        return null
      }
      try {
        const response = await fetch(`/api/citations`, {
          // PUT to base /api/citations with ID in body
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, userId, updates }),
        })
        if (!response.ok) {
          throw new Error(`Failed to update citation: ${response.statusText}`)
        }
        const updatedCitation: Citation = await response.json()
        setCitations((prev) => prev.map((c) => (c.id === id ? updatedCitation : c)))
        return updatedCitation
      } catch (err: any) {
        setError(err.message || "Failed to update citation.")
        console.error("Error updating citation:", err)
        return null
      }
    },
    [userId],
  )

  const deleteCitation = useCallback(
    async (id: string) => {
      if (!userId) {
        setError("User not authenticated.")
        return false
      }
      try {
        const response = await fetch(`/api/citations?id=${id}&userId=${userId}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error(`Failed to delete citation: ${response.statusText}`)
        }
        setCitations((prev) => prev.filter((c) => c.id !== id))
        return true
      } catch (err: any) {
        setError(err.message || "Failed to delete citation.")
        console.error("Error deleting citation:", err)
        return false
      }
    },
    [userId],
  )

  return { citations, loading, error, fetchCitations, createCitation, updateCitation, deleteCitation }
}
