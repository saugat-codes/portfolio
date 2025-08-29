import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

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
    // Ping Supabase by making simple queries to keep it awake
    const [projectsResult, postsResult] = await Promise.all([
      supabaseAdmin.from('projects').select('id').limit(1),
      supabaseAdmin.from('blog_posts').select('id').limit(1)
    ])

    if (projectsResult.error) {
      console.error('Error pinging projects table:', projectsResult.error)
    }

    if (postsResult.error) {
      console.error('Error pinging blog_posts table:', postsResult.error)
    }

    // Log the ping for monitoring
    console.log(`Supabase pinged at ${new Date().toISOString()}`)

    return NextResponse.json({ 
      message: "Supabase ping successful!", 
      timestamp: new Date().toISOString(),
      projectsStatus: projectsResult.error ? 'error' : 'ok',
      postsStatus: postsResult.error ? 'error' : 'ok'
    })
  } catch (error) {
    console.error('Error pinging Supabase:', error)
    return NextResponse.json({ 
      error: "Failed to ping Supabase",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
