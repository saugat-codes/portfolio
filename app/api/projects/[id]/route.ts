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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      throw error
    }

    // Transform to API format
    const project = {
      id: data.id,
      title: data.title,
      description: data.description,
      longDescription: data.long_description,
      image: data.image,
      technologies: data.technologies,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      featured: data.featured,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    // Check if project exists
    const { error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      throw fetchError
    }

    // Transform updates to database format
    const dbUpdates: Record<string, string | number | boolean | string[] | null> = {
      updated_at: new Date().toISOString()
    }
    
    if (updates.title) dbUpdates.title = updates.title
    if (updates.description) dbUpdates.description = updates.description
    if (updates.longDescription) dbUpdates.long_description = updates.longDescription
    if (updates.image) dbUpdates.image = updates.image
    if (updates.technologies) dbUpdates.technologies = updates.technologies
    if (updates.demoUrl !== undefined) dbUpdates.demo_url = updates.demoUrl
    if (updates.githubUrl !== undefined) dbUpdates.github_url = updates.githubUrl
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Transform back to API format
    const updatedProject = {
      id: data.id,
      title: data.title,
      description: data.description,
      longDescription: data.long_description,
      image: data.image,
      technologies: data.technologies,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      featured: data.featured,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Check if project exists
    const { error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      throw fetchError
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
