"use client"

import { useState, useEffect, useCallback } from "react"
import type { Project } from "@/lib/database" // Assuming Project interface is still in lib/database

interface UseProjectsOptions {
  userId: string | undefined
  projectId?: string // For fetching a single project
}

export function useProjects({ userId, projectId }: UseProjectsOptions) {
  const [projects, setProjects] = useState<Project[]>([])
  const [project, setProject] = useState<Project | null>(null) // For single project fetch
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setProjects([])
      setProject(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append("userId", userId)
      if (projectId) params.append("projectId", projectId)

      const response = await fetch(`/api/projects?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch project(s): ${response.statusText}`)
      }
      const data = await response.json()
      if (projectId) {
        setProject(data)
      } else {
        setProjects(data)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load project(s).")
      console.error("Error fetching project(s):", err)
    } finally {
      setLoading(false)
    }
  }, [userId, projectId])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = useCallback(
    async (projectData: Omit<Project, "id" | "created_at" | "updated_at" | "user_id">) => {
      if (!userId) {
        setError("User not authenticated.")
        return null
      }
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...projectData, userId }),
        })
        if (!response.ok) {
          throw new Error(`Failed to create project: ${response.statusText}`)
        }
        const newProject: Project = await response.json()
        setProjects((prev) => [newProject, ...prev])
        return newProject
      } catch (err: any) {
        setError(err.message || "Failed to create project.")
        console.error("Error creating project:", err)
        return null
      }
    },
    [userId],
  )

  const updateProject = useCallback(
    async (id: string, updates: Partial<Project>) => {
      if (!userId) {
        setError("User not authenticated.")
        return null
      }
      try {
        const response = await fetch(`/api/projects`, {
          // PUT to base /api/projects with ID in body
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, userId, updates }),
        })
        if (!response.ok) {
          throw new Error(`Failed to update project: ${response.statusText}`)
        }
        const updatedProject: Project = await response.json()
        setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)))
        if (project && project.id === id) {
          setProject(updatedProject)
        }
        return updatedProject
      } catch (err: any) {
        setError(err.message || "Failed to update project.")
        console.error("Error updating project:", err)
        return null
      }
    },
    [userId, project],
  )

  const deleteProject = useCallback(
    async (id: string) => {
      if (!userId) {
        setError("User not authenticated.")
        return false
      }
      try {
        const response = await fetch(`/api/projects?id=${id}&userId=${userId}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error(`Failed to delete project: ${response.statusText}`)
        }
        setProjects((prev) => prev.filter((p) => p.id !== id))
        return true
      } catch (err: any) {
        setError(err.message || "Failed to delete project.")
        console.error("Error deleting project:", err)
        return false
      }
    },
    [userId],
  )

  return {
    projects,
    project,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}
