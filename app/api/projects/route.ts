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

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Transform database format to API format
    const projects = data?.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.long_description,
      image: project.image,
      technologies: project.technologies,
      demoUrl: project.demo_url,
      githubUrl: project.github_url,
      featured: project.featured,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    })) || []

    // Create response with caching headers
    const response = NextResponse.json(projects)
    
    // Cache for 12 hours (43200 seconds), revalidate for 24 hours
    response.headers.set('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400')
    
    return response
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const projectData = await request.json()
    
    // Validate required fields
    if (!projectData.title || !projectData.description || !projectData.longDescription) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, longDescription" },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const dbProject = {
      title: projectData.title,
      description: projectData.description,
      long_description: projectData.longDescription,
      image: projectData.image || "/placeholder.svg",
      technologies: projectData.technologies || [],
      demo_url: projectData.demoUrl,
      github_url: projectData.githubUrl,
      featured: projectData.featured || false,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(dbProject)
      .select()
      .single()

    if (error) throw error

    // Transform back to API format
    const newProject = {
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

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
