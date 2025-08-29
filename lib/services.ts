import { supabase } from './supabase'
import type { Project, BlogPost } from './types'

// Helper function to convert database row to Project type
function dbProjectToProject(dbProject: Record<string, unknown>): Project {
  return {
    id: dbProject.id as string,
    title: dbProject.title as string,
    description: dbProject.description as string,
    longDescription: dbProject.long_description as string,
    image: dbProject.image as string,
    technologies: dbProject.technologies as string[],
    demoUrl: dbProject.demo_url as string | undefined,
    githubUrl: dbProject.github_url as string | undefined,
    featured: dbProject.featured as boolean,
    createdAt: dbProject.created_at as string,
    updatedAt: dbProject.updated_at as string,
  }
}

// Helper function to convert Project type to database insert/update
function projectToDbProject(project: Partial<Project>) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    long_description: project.longDescription,
    image: project.image,
    technologies: project.technologies,
    demo_url: project.demoUrl,
    github_url: project.githubUrl,
    featured: project.featured,
    updated_at: new Date().toISOString(),
  }
}

// Helper function to convert database row to BlogPost type
function dbBlogPostToBlogPost(dbPost: Record<string, unknown>): BlogPost {
  return {
    id: dbPost.id as string,
    title: dbPost.title as string,
    excerpt: dbPost.excerpt as string,
    content: dbPost.content as string,
    image: dbPost.image as string,
    tags: dbPost.tags as string[],
    slug: dbPost.slug as string,
    featured: dbPost.featured as boolean,
    publishedAt: dbPost.published_at as string,
    createdAt: dbPost.created_at as string,
    updatedAt: dbPost.updated_at as string,
    readTime: dbPost.read_time as number,
  }
}

// Helper function to convert BlogPost type to database insert/update
function blogPostToDbBlogPost(post: Partial<BlogPost>) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    tags: post.tags,
    slug: post.slug,
    featured: post.featured,
    published_at: post.publishedAt,
    read_time: post.readTime,
    updated_at: new Date().toISOString(),
  }
}

// Calculate read time based on content
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Project Services
export const projectService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(dbProjectToProject) || []
  },

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data ? dbProjectToProject(data) : null
  },

  async getFeatured(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(dbProjectToProject) || []
  },

  async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const now = new Date().toISOString()
    const dbProject = {
      ...projectToDbProject(project),
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase
      .from('projects')
      .insert(dbProject)
      .select()
      .single()

    if (error) throw error
    return dbProjectToProject(data)
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const dbUpdates = projectToDbProject(updates)

    const { data, error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return dbProjectToProject(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Blog Services
export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data?.map(dbBlogPostToBlogPost) || []
  },

  async getPublished(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })

    if (error) throw error
    return data?.map(dbBlogPostToBlogPost) || []
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data ? dbBlogPostToBlogPost(data) : null
  },

  async getById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data ? dbBlogPostToBlogPost(data) : null
  },

  async getFeatured(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })

    if (error) throw error
    return data?.map(dbBlogPostToBlogPost) || []
  },

  async create(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'readTime'>): Promise<BlogPost> {
    const now = new Date().toISOString()
    const readTime = calculateReadTime(post.content)
    
    const dbPost = {
      ...blogPostToDbBlogPost({ ...post, readTime }),
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(dbPost)
      .select()
      .single()

    if (error) throw error
    return dbBlogPostToBlogPost(data)
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    // Recalculate read time if content is being updated
    if (updates.content) {
      updates.readTime = calculateReadTime(updates.content)
    }
    
    const dbUpdates = blogPostToDbBlogPost(updates)

    const { data, error } = await supabase
      .from('blog_posts')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return dbBlogPostToBlogPost(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
