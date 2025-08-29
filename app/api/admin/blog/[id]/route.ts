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

// Calculate read time based on content
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
      }
      throw error
    }

    // Transform to API format
    const post = {
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

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    // Check if post exists
    const { error: fetchError } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
      }
      throw fetchError
    }

    // Transform updates to database format
    const dbUpdates: Record<string, string | number | boolean | string[] | null> = {
      updated_at: new Date().toISOString()
    }
    
    if (updates.title) dbUpdates.title = updates.title
    if (updates.excerpt) dbUpdates.excerpt = updates.excerpt
    if (updates.content) {
      dbUpdates.content = updates.content
      dbUpdates.read_time = calculateReadTime(updates.content)
    }
    if (updates.image) dbUpdates.image = updates.image
    if (updates.tags) dbUpdates.tags = updates.tags
    if (updates.slug) dbUpdates.slug = updates.slug
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured
    if (updates.publishedAt) dbUpdates.published_at = updates.publishedAt

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Transform back to API format
    const updatedPost = {
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

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Check if post exists
    const { error: fetchError } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
      }
      throw fetchError
    }

    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
