"use client"

import { useState, useEffect, useCallback } from "react"
import type { Timeline } from "@/lib/database" // Assuming Timeline interface is still in lib/database

interface UseTimelineOptions {
  userId: string | undefined
  projectId?: string
  type?: "milestone" | "deadline" | "meeting" | "task"
}

export function useTimeline({ userId, projectId, type }: UseTimelineOptions) {
  const [timelineEvents, setTimelineEvents] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTimelineEvents = useCallback(async () => {
    if (!userId) {
      setTimelineEvents([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append("userId", userId)
      if (projectId) params.append("projectId", projectId)
      if (type) params.append("type", type)

      const response = await fetch(`/api/timeline?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline events: ${response.statusText}`)
      }
      const data: Timeline[] = await response.json()
      setTimelineEvents(data)
    } catch (err: any) {
      setError(err.message || "Failed to load timeline events.")
      console.error("Error fetching timeline events:", err)
    } finally {
      setLoading(false)
    }
  }, [userId, projectId, type])

  useEffect(() => {
    fetchTimelineEvents()
  }, [fetchTimelineEvents])

  const createTimelineEvent = useCallback(
    async (eventData: Omit<Timeline, "id" | "created_at" | "updated_at" | "user_id">) => {
      if (!userId) {
        setError("User not authenticated.")
        return null
      }
      try {
        const response = await fetch("/api/timeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...eventData, userId }),
        })
        if (!response.ok) {
          throw new Error(`Failed to create timeline event: ${response.statusText}`)
        }
        const newEvent: Timeline = await response.json()
        setTimelineEvents((prev) => [newEvent, ...prev])
        return newEvent
      } catch (err: any) {
        setError(err.message || "Failed to create timeline event.")
        console.error("Error creating timeline event:", err)
        return null
      }
    },
    [userId],
  )

  const updateTimelineEvent = useCallback(
    async (id: string, updates: Partial<Timeline>) => {
      if (!userId) {
        setError("User not authenticated.")
        return null
      }
      try {
        const response = await fetch(`/api/timeline`, {
          // PUT to base /api/timeline with ID in body
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, userId, updates }),
        })
        if (!response.ok) {
          throw new Error(`Failed to update timeline event: ${response.statusText}`)
        }
        const updatedEvent: Timeline = await response.json()
        setTimelineEvents((prev) => prev.map((event) => (event.id === id ? updatedEvent : event)))
        return updatedEvent
      } catch (err: any) {
        setError(err.message || "Failed to update timeline event.")
        console.error("Error updating timeline event:", err)
        return null
      }
    },
    [userId],
  )

  const deleteTimelineEvent = useCallback(
    async (id: string) => {
      if (!userId) {
        setError("User not authenticated.")
        return false
      }
      try {
        const response = await fetch(`/api/timeline?id=${id}&userId=${userId}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error(`Failed to delete timeline event: ${response.statusText}`)
        }
        setTimelineEvents((prev) => prev.filter((event) => event.id !== id))
        return true
      } catch (err: any) {
        setError(err.message || "Failed to delete timeline event.")
        console.error("Error deleting timeline event:", err)
        return false
      }
    },
    [userId],
  )

  const getUpcomingDeadlines = (days = 30) => {
    const now = new Date()
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    return timelineEvents
      .filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= now && itemDate <= future && !item.completed
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const getOverdueItems = () => {
    const now = new Date()
    return timelineEvents.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate < now && !item.completed
    })
  }

  return {
    timelineEvents,
    loading,
    error,
    fetchTimelineEvents,
    createTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    getUpcomingDeadlines,
    getOverdueItems,
  }
}
