export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  technologies: string[]
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  tags: string[]
  slug: string
  featured: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
  readTime: number
}

export interface User {
  id: string
  email: string
  role: "admin" | "user"
}
