export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          title: string | null
          institution: string | null
          department: string | null
          bio: string | null
          research_topics: string[] | null
          methodologies: string[] | null
          specializations: string[] | null
          profile_visibility: string
          allow_messages: boolean
          allow_collaboration: boolean
          email_notifications: boolean
          research_updates: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          institution?: string | null
          department?: string | null
          bio?: string | null
          research_topics?: string[] | null
          methodologies?: string[] | null
          specializations?: string[] | null
          profile_visibility?: string
          allow_messages?: boolean
          allow_collaboration?: boolean
          email_notifications?: boolean
          research_updates?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string | null
          institution?: string | null
          department?: string | null
          bio?: string | null
          research_topics?: string[] | null
          methodologies?: string[] | null
          specializations?: string[] | null
          profile_visibility?: string
          allow_messages?: boolean
          allow_collaboration?: boolean
          email_notifications?: boolean
          research_updates?: boolean
          updated_at?: string
        }
      }
      research_notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          type: string
          tags: string[]
          project_id: string | null
          is_favorite: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          type?: string
          tags?: string[]
          project_id?: string | null
          is_favorite?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          content?: string | null
          type?: string
          tags?: string[]
          project_id?: string | null
          is_favorite?: boolean
          is_public?: boolean
          updated_at?: string
        }
      }
      research_projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: string
          progress: number
          start_date: string | null
          end_date: string | null
          collaborators: string[]
          tags: string[]
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: string
          progress?: number
          start_date?: string | null
          end_date?: string | null
          collaborators?: string[]
          tags?: string[]
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          status?: string
          progress?: number
          start_date?: string | null
          end_date?: string | null
          collaborators?: string[]
          tags?: string[]
          is_private?: boolean
          updated_at?: string
        }
      }
      research_files: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          size: number
          url: string
          project_id: string | null
          metadata: Json | null
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          size: number
          url: string
          project_id?: string | null
          metadata?: Json | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          type?: string
          size?: number
          url?: string
          project_id?: string | null
          metadata?: Json | null
          is_private?: boolean
          updated_at?: string
        }
      }
      citations: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          authors: string[]
          journal: string | null
          year: number
          doi: string | null
          url: string | null
          pages: string | null
          volume: string | null
          issue: string | null
          publisher: string | null
          tags: string[]
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          authors: string[]
          journal?: string | null
          year: number
          doi?: string | null
          url?: string | null
          pages?: string | null
          volume?: string | null
          issue?: string | null
          publisher?: string | null
          tags?: string[]
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: string
          title?: string
          authors?: string[]
          journal?: string | null
          year?: number
          doi?: string | null
          url?: string | null
          pages?: string | null
          volume?: string | null
          issue?: string | null
          publisher?: string | null
          tags?: string[]
          is_favorite?: boolean
          updated_at?: string
        }
      }
      timeline_events: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          title: string
          description: string | null
          type: string
          event_date: string
          completed: boolean
          priority: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          title: string
          description?: string | null
          type: string
          event_date: string
          completed?: boolean
          priority?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          type?: string
          event_date?: string
          completed?: boolean
          priority?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}