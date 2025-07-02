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
  type: 'research' | 'personal'
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
  status: 'planning' | 'active' | 'completed' | 'archived'
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
  type: 'article' | 'book' | 'website' | 'conference'
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
  type: 'milestone' | 'deadline' | 'meeting' | 'task'
  date: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
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
  status: 'draft' | 'published' | 'under_review'
  visibility: 'public' | 'private' | 'institutional'
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

// Mock database implementation
class MockDatabase {
  private users: User[] = []
  private notes: Note[] = []
  private files: File[] = []
  private projects: Project[] = []
  private citations: Citation[] = []
  private timelines: Timeline[] = []
  private papers: Paper[] = []

  // User methods
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const user: User = {
      ...userData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.users.push(user)
    return user
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) return null
    
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    return this.users[index]
  }

  // Note methods
  async createNote(noteData: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<Note> {
    const note: Note = {
      ...noteData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.notes.push(note)
    return note
  }

  async getNotes(userId: string, filters?: { type?: string; project_id?: string; tags?: string[] }): Promise<Note[]> {
    let userNotes = this.notes.filter(n => n.user_id === userId)
    
    if (filters?.type) {
      userNotes = userNotes.filter(n => n.type === filters.type)
    }
    
    if (filters?.project_id) {
      userNotes = userNotes.filter(n => n.project_id === filters.project_id)
    }
    
    if (filters?.tags?.length) {
      userNotes = userNotes.filter(n => 
        filters.tags!.some(tag => n.tags.includes(tag))
      )
    }
    
    return userNotes.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    const index = this.notes.findIndex(n => n.id === id)
    if (index === -1) return null
    
    this.notes[index] = {
      ...this.notes[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    return this.notes[index]
  }

  async deleteNote(id: string): Promise<boolean> {
    const index = this.notes.findIndex(n => n.id === id)
    if (index === -1) return false
    
    this.notes.splice(index, 1)
    return true
  }

  // File methods
  async createFile(fileData: Omit<File, 'id' | 'created_at' | 'updated_at'>): Promise<File> {
    const file: File = {
      ...fileData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.files.push(file)
    return file
  }

  async getFiles(userId: string, filters?: { type?: string; project_id?: string }): Promise<File[]> {
    let userFiles = this.files.filter(f => f.user_id === userId)
    
    if (filters?.type) {
      userFiles = userFiles.filter(f => f.type.includes(filters.type!))
    }
    
    if (filters?.project_id) {
      userFiles = userFiles.filter(f => f.project_id === filters.project_id)
    }
    
    return userFiles.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }

  async deleteFile(id: string): Promise<boolean> {
    const index = this.files.findIndex(f => f.id === id)
    if (index === -1) return false
    
    this.files.splice(index, 1)
    return true
  }

  // Project methods
  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const project: Project = {
      ...projectData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.projects.push(project)
    return project
  }

  async getProjects(userId: string): Promise<Project[]> {
    return this.projects
      .filter(p => p.user_id === userId || p.collaborators.includes(userId))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projects.find(p => p.id === id) || null
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const index = this.projects.findIndex(p => p.id === id)
    if (index === -1) return null
    
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    return this.projects[index]
  }

  // Citation methods
  async createCitation(citationData: Omit<Citation, 'id' | 'created_at' | 'updated_at'>): Promise<Citation> {
    const citation: Citation = {
      ...citationData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.citations.push(citation)
    return citation
  }

  async getCitations(userId: string, filters?: { type?: string; tags?: string[] }): Promise<Citation[]> {
    let userCitations = this.citations.filter(c => c.user_id === userId)
    
    if (filters?.type) {
      userCitations = userCitations.filter(c => c.type === filters.type)
    }
    
    if (filters?.tags?.length) {
      userCitations = userCitations.filter(c => 
        filters.tags!.some(tag => c.tags.includes(tag))
      )
    }
    
    return userCitations.sort((a, b) => b.year - a.year)
  }

  // Timeline methods
  async createTimeline(timelineData: Omit<Timeline, 'id' | 'created_at' | 'updated_at'>): Promise<Timeline> {
    const timeline: Timeline = {
      ...timelineData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.timelines.push(timeline)
    return timeline
  }

  async getTimelines(userId: string, filters?: { project_id?: string; type?: string }): Promise<Timeline[]> {
    let userTimelines = this.timelines.filter(t => t.user_id === userId)
    
    if (filters?.project_id) {
      userTimelines = userTimelines.filter(t => t.project_id === filters.project_id)
    }
    
    if (filters?.type) {
      userTimelines = userTimelines.filter(t => t.type === filters.type)
    }
    
    return userTimelines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Paper methods
  async createPaper(paperData: Omit<Paper, 'id' | 'created_at' | 'updated_at' | 'views' | 'downloads' | 'likes'>): Promise<Paper> {
    const paper: Paper = {
      ...paperData,
      id: this.generateId(),
      views: 0,
      downloads: 0,
      likes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.papers.push(paper)
    return paper
  }

  async getPapers(filters?: { user_id?: string; field?: string; status?: string }): Promise<Paper[]> {
    let papers = this.papers
    
    if (filters?.user_id) {
      papers = papers.filter(p => p.user_id === filters.user_id)
    }
    
    if (filters?.field) {
      papers = papers.filter(p => p.field === filters.field)
    }
    
    if (filters?.status) {
      papers = papers.filter(p => p.status === filters.status)
    }
    
    return papers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

export const db = new MockDatabase()