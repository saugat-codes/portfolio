import { NextResponse } from "next/server"
import { blogService } from "@/lib/services"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await blogService.getBySlug(params.slug)
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const updates = await request.json()
    
    // First get the post by slug to get its ID
    const existingPost = await blogService.getBySlug(params.slug)
    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const updatedPost = await blogService.update(existingPost.id, updates)
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    // First get the post by slug to get its ID
    const existingPost = await blogService.getBySlug(params.slug)
    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    await blogService.delete(existingPost.id)
    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
