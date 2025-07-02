"use client"

import { useState, useEffect } from 'react'
import { db, Citation } from '@/lib/database'
import { aethonAI } from '@/lib/aethon-ai'

export function useCitations(userId: string = 'demo-user', filters?: { type?: string; tags?: string[] }) {
  const [citations, setCitations] = useState<Citation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCitations = async () => {
    try {
      setLoading(true)
      const userCitations = await db.getCitations(userId, filters)
      setCitations(userCitations)
    } catch (err) {
      setError('Failed to load citations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createCitation = async (citationData: Omit<Citation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newCitation = await db.createCitation({
        ...citationData,
        user_id: userId
      })
      setCitations(prev => [newCitation, ...prev])
      return newCitation
    } catch (err) {
      setError('Failed to create citation')
      throw err
    }
  }

  const generateCitation = async (source: any, style: string = 'apa') => {
    try {
      return await aethonAI.generateCitation(source, style)
    } catch (err) {
      setError('Failed to generate citation')
      throw err
    }
  }

  const exportBibliography = (style: string = 'apa') => {
    const bibliography = citations.map(citation => 
      aethonAI.generateCitation(citation, style)
    ).join('\n\n')
    
    const blob = new Blob([bibliography], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bibliography-${style}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const searchCitations = (query: string) => {
    return citations.filter(citation => 
      citation.title.toLowerCase().includes(query.toLowerCase()) ||
      citation.authors.some(author => author.toLowerCase().includes(query.toLowerCase())) ||
      citation.journal?.toLowerCase().includes(query.toLowerCase())
    )
  }

  useEffect(() => {
    loadCitations()
  }, [userId, JSON.stringify(filters)])

  return {
    citations,
    loading,
    error,
    createCitation,
    generateCitation,
    exportBibliography,
    searchCitations,
    refreshCitations: loadCitations
  }
}