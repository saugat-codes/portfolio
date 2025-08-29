import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { blogService } from "@/lib/services"
import type { BlogPost } from "@/lib/types"
import Link from "next/link"
import Navigation from "@/components/navigation"
import EmptyState from "@/components/empty-state"

// Enable ISR - revalidate every 12 hours (43200 seconds)
export const revalidate = 43200

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await blogService.getPublished()
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const featuredPosts = posts.filter(post => post.featured)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation currentPage="blog" />

      {/* Back Button */}
      <div className="pt-20 pb-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-orbitron)] text-accent mb-6">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Thoughts, tutorials, and insights about web development, technology, and the future of software engineering.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-accent mb-12 text-center">
              Featured Articles
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="border-glow-hover bg-card group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {post.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-2xl text-accent group-hover:text-accent/80 transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-base">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime} min read</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-accent hover:text-accent/80 hover:bg-accent/10"
                        >
                          Read More →
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-accent mb-8">
            Latest Articles
          </h2>
          {posts.length === 0 ? (
            <EmptyState type="blog" />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="border-glow-hover bg-card group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {post.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-xl group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span>{post.readTime} min read</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
            © 2025 Saugat Bhattarai. Built with <span aria-label="love" role="img">❤️</span> in Nepal.
            </p>
        </div>
      </footer>
    </div>
  )
}
