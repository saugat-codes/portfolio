import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Calculate read time based on content
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error
    
    // Transform database format to API format
    const posts = data?.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      tags: post.tags,
      slug: post.slug,
      featured: post.featured,
      publishedAt: post.published_at,
      readTime: post.read_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    })) || []

    // Create response with caching headers
    const response = NextResponse.json(posts)
    
    // Cache for 12 hours (43200 seconds), revalidate for 24 hours
    response.headers.set('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400')
    
    return response
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const postData = await request.json()
    
    // Validate required fields
    if (!postData.title || !postData.content || !postData.excerpt) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, excerpt" },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug = postData.slug || generateSlug(postData.title)
    const readTime = calculateReadTime(postData.content)
    const now = new Date().toISOString()

    const dbPost = {
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      image: postData.image || "/placeholder.svg",
      tags: postData.tags || [],
      slug: slug,
      featured: postData.featured || false,
      published_at: postData.publishedAt || now,
      read_time: readTime,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert(dbPost)
      .select()
      .single()

    if (error) throw error

    // Transform back to API format
    const newPost = {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      image: data.image,
      tags: data.tags,
      slug: data.slug,
      featured: data.featured,
      publishedAt: data.published_at,
      readTime: data.read_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
