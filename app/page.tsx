import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, Instagram, ExternalLink, Code, Database, Globe, Smartphone } from "lucide-react"
import Spline from "@splinetool/react-spline/next"
import Navigation from "@/components/navigation"
import ContactForm from "@/components/contact-form"
import EmptyState from "@/components/empty-state"
import { projectService, blogService } from "@/lib/services"
import type { Project, BlogPost } from "@/lib/types"
import Link from "next/link"

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const projects = await projectService.getAll()
    return projects.filter(project => project.featured).slice(0, 3)
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
}

async function getLatestBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await blogService.getPublished()
    return posts.slice(0, 3)
  } catch (error) {
    console.error('Error fetching latest blog posts:', error)
    return []
  }
}

export default async function Portfolio() {
  const [featuredProjects, latestPosts] = await Promise.all([
    getFeaturedProjects(),
    getLatestBlogPosts()
  ])
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-[family-name:var(--font-orbitron)] text-balance">
              <span className="text-foreground">I am</span> <span className="text-accent">Saugat</span>
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-[family-name:var(--font-orbitron)]">
              Software Developer
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg text-pretty">
              Helping startups and businesses build scalable, high-performance websites and SaaS products. From sleek landing pages to full-featured platforms, I deliver clean code, responsive design, and real results.
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 glow-green-hover font-semibold px-8 py-3"
            >
              See My Work
            </Button>
          </div>
          <div className="relative lg:order-2">
            <div className="w-full max-w-sm sm:max-w-md lg:w-80 h-48 sm:h-56 lg:h-64 mx-auto overflow-hidden rounded-lg">
              <Spline
                scene="https://prod.spline.design/A2namyP8EL5iTVlO/scene.splinecode"
                style={{
                  width: "100%",
                  height: "140%",
                  transform: "translateY(-10px)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-orbitron)] text-center mb-12 sm:mb-16 text-accent">
            About Me
          </h2>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="border-glow-hover bg-card">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-[family-name:var(--font-orbitron)] text-accent">
                  Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  I help startups, small businesses, and digital agencies build scalable, high-performance websites and platforms from sleek landing pages to complex SaaS products.
                </p>
                <p className="text-muted-foreground">
                  With over 2 years of experience in software development, I specialize in creating robust, scalable
                  applications that solve real-world problems. My passion lies in exploring emerging technologies and
                  implementing innovative solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-glow-hover bg-card">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-[family-name:var(--font-orbitron)] text-accent">
                  Skills & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: Code, name: "Python, Java" },
                    { icon: Database, name: "PostgreSQL, MySQL" },
                    { icon: Globe, name: "Django, React" },
                    { icon: Smartphone, name: "DevOps" },
                  ].map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-accent/50 transition-colors"
                    >
                      <skill.icon className="w-5 h-5 text-accent" />
                      <span className="text-sm">{skill.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-accent">Experience Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        2023 -  Full Stack Developer - Freelance
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-orbitron)] text-center mb-16 text-accent">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <Card key={project.id} className="border-glow-hover bg-card group cursor-pointer">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-[family-name:var(--font-orbitron)] text-accent">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.demoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent flex-1 min-w-0"
                          asChild
                        >
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                            Demo
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent flex-1 min-w-0"
                          asChild
                        >
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2 flex-shrink-0" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState type="projects" />
            )}
          </div>
          <div className="text-center mt-12">
            <a href="/projects">
              <Button
                variant="outline"
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground glow-green-hover bg-transparent"
              >
                See More Projects
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-orbitron)] text-center mb-16 text-accent">
            Latest Blog Posts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <Card key={post.id} className="border-glow-hover bg-card group cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="border-accent/30 text-accent">
                        {post.readTime} min read
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-[family-name:var(--font-orbitron)] text-accent group-hover:text-accent/80 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-accent/20 text-accent border-accent/30 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4">
                      <a href={`/blog/${post.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent hover:text-accent-foreground hover:bg-accent/20 px-0 py-2 h-auto"
                        >
                          Read More →
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState type="blog" />
            )}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button
                variant="outline"
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground glow-green-hover bg-transparent"
              >
                See More Blogs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-orbitron)] text-center mb-16 text-accent">
            Get In Touch
          </h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-[family-name:var(--font-orbitron)] text-accent">
                Let&apos;s Build Something Amazing
              </h3>
              <p className="text-muted-foreground text-pretty">
                I&apos;m always interested in new opportunities and exciting projects. Whether you have a question or just
                want to say hi, I&apos;ll try my best to get back to you!
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Github, href: "https://github.com/saugat2003", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/saugat-bhattarai1/", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:saugatbhattarai00@gmail.com", label: "Email" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-3 border border-border rounded-lg hover:border-accent hover:text-accent transition-colors glow-green-hover"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center space-x-6 mb-4">
            {[
              { icon: Github, href: "https://github.com/saugat2003" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/saugat-bhattarai1/" },
              { icon: Mail, href: "mailto:saugatbhattarai00@gmail.com" },
              { icon: Instagram, href: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-muted-foreground hover:text-accent transition-colors glow-green-hover"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
            © 2025 Saugat Bhattarai. Built with <span aria-label="love" role="img">❤️</span> in Nepal.
            </p>
        </div>
      </footer>
    </div>
  )
}
