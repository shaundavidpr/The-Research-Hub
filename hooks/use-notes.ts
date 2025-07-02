"use client"

import { useState, useEffect } from 'react'
import { db, Note } from '@/lib/database'

export function useNotes(userId: string = 'demo-user', filters?: { type?: string; project_id?: string; tags?: string[] }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotes = async () => {
    try {
      setLoading(true)
      const userNotes = await db.getNotes(userId, filters)
      setNotes(userNotes)
    } catch (err) {
      setError('Failed to load notes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async (noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newNote = await db.createNote({
        ...noteData,
        user_id: userId
      })
      setNotes(prev => [newNote, ...prev])
      return newNote
    } catch (err) {
      setError('Failed to create note')
      throw err
    }
  }

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await db.updateNote(id, updates)
      if (updatedNote) {
        setNotes(prev => prev.map(note => note.id === id ? updatedNote : note))
      }
      return updatedNote
    } catch (err) {
      setError('Failed to update note')
      throw err
    }
  }

  const deleteNote = async (id: string) => {
    try {
      const success = await db.deleteNote(id)
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== id))
      }
      return success
    } catch (err) {
      setError('Failed to delete note')
      throw err
    }
  }

  const toggleFavorite = async (id: string) => {
    const note = notes.find(n => n.id === id)
    if (note) {
      return updateNote(id, { is_favorite: !note.is_favorite })
    }
  }

  useEffect(() => {
    loadNotes()
  }, [userId, JSON.stringify(filters)])

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    refreshNotes: loadNotes
  }
}