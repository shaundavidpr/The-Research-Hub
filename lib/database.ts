export interface User {
  id: string
  email: string
  name: string
  title?: string
  institution?: string
  bio?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  type: "research" | "personal"
  tags: string[]
  project_id?: string
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface File {
  id: string
  user_id: string
  name: string
  type: string
  size: number
  url: string
  project_id?: string
  metadata?: {
    title?: string
    authors?: string[]
    abstract?: string
    keywords?: string[]
    doi?: string
  }
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description: string
  status: "planning" | "active" | "completed" | "archived"
  progress: number
  start_date?: string
  end_date?: string
  collaborators: string[]
  created_at: string
  updated_at: string
}

export interface Citation {
  id: string
  user_id: string
  type: "article" | "book" | "website" | "conference"
  title: string
  authors: string[]
  journal?: string
  year: number
  doi?: string
  url?: string
  pages?: string
  volume?: string
  issue?: string
  publisher?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Timeline {
  id: string
  user_id: string
  project_id?: string
  title: string
  description: string
  type: "milestone" | "deadline" | "meeting" | "task"
  date: string
  completed: boolean
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
}

export interface Paper {
  id: string
  user_id: string
  title: string
  abstract: string
  content?: string
  authors: string[]
  keywords: string[]
  field: string
  status: "draft" | "published" | "under_review"
  visibility: "public" | "private" | "institutional"
  file_url?: string
  doi?: string
  journal?: string
  publication_date?: string
  views: number
  downloads: number
  likes: number
  created_at: string
  updated_at: string
}

// MockDatabase class removed as data operations will now go through API routes.
// The interfaces are kept for type definitions.
