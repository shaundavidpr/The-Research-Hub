"use client"

import { useState, useEffect } from 'react'
import { db, Timeline } from '@/lib/database'

export function useTimeline(userId: string = 'demo-user', filters?: { project_id?: string; type?: string }) {
  const [timelines, setTimelines] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTimelines = async () => {
    try {
      setLoading(true)
      const userTimelines = await db.getTimelines(userId, filters)
      setTimelines(userTimelines)
    } catch (err) {
      setError('Failed to load timeline')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createTimelineItem = async (timelineData: Omit<Timeline, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTimeline = await db.createTimeline({
        ...timelineData,
        user_id: userId
      })
      setTimelines(prev => [...prev, newTimeline].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ))
      return newTimeline
    } catch (err) {
      setError('Failed to create timeline item')
      throw err
    }
  }

  const getUpcomingDeadlines = (days: number = 30) => {
    const now = new Date()
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    
    return timelines.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= now && itemDate <= future && !item.completed
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const getOverdueItems = () => {
    const now = new Date()
    return timelines.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate < now && !item.completed
    })
  }

  useEffect(() => {
    loadTimelines()
  }, [userId, JSON.stringify(filters)])

  return {
    timelines,
    loading,
    error,
    createTimelineItem,
    getUpcomingDeadlines,
    getOverdueItems,
    refreshTimeline: loadTimelines
  }
}