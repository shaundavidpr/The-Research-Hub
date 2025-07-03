"use client"

import { useState, useEffect } from 'react'
import { db, Project } from '@/lib/database'

export function useProjects(userId: string = 'demo-user') {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = async () => {
    try {
      setLoading(true)
      const userProjects = await db.getProjects(userId)
      setProjects(userProjects)
    } catch (err) {
      setError('Failed to load projects')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProject = await db.createProject({
        ...projectData,
        user_id: userId
      })
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (err) {
      setError('Failed to create project')
      throw err
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await db.updateProject(id, updates)
      if (updatedProject) {
        setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      }
      return updatedProject
    } catch (err) {
      setError('Failed to update project')
      throw err
    }
  }

  const getProject = async (id: string) => {
    try {
      return await db.getProject(id)
    } catch (err) {
      setError('Failed to get project')
      throw err
    }
  }

  useEffect(() => {
    loadProjects()
  }, [userId])

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    getProject,
    refreshProjects: loadProjects
  }
}
