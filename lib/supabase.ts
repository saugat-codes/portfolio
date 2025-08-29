import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key for bypassing RLS
// This should only be used server-side (API routes, server components)
export function getSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client should not be used on the client side')
  }
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for admin client. Please check your .env.local file.')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          long_description: string
          image: string
          technologies: string[]
          demo_url: string | null
          github_url: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          long_description: string
          image: string
          technologies: string[]
          demo_url?: string | null
          github_url?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          long_description?: string
          image?: string
          technologies?: string[]
          demo_url?: string | null
          github_url?: string | null
          featured?: boolean
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          image: string
          tags: string[]
          slug: string
          featured: boolean
          published_at: string
          created_at: string
          updated_at: string
          read_time: number
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content: string
          image: string
          tags: string[]
          slug: string
          featured?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
          read_time?: number
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          image?: string
          tags?: string[]
          slug?: string
          featured?: boolean
          published_at?: string
          updated_at?: string
          read_time?: number
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'user'
        }
      }
    }
  }
}

export type TypedSupabaseClient = typeof supabase
