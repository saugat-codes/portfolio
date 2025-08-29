import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, FolderOpen } from "lucide-react"

interface EmptyStateProps {
  type: 'projects' | 'blog'
  showAdminLink?: boolean
}

export default function EmptyState({ type, showAdminLink = false }: EmptyStateProps) {
  const config = {
    projects: {
      icon: FolderOpen,
      title: "No Projects Yet",
      description: "No projects have been published yet. Check back soon for exciting new developments!",
      adminText: "Add your first project",
      adminLink: "/admin/projects/new"
    },
    blog: {
      icon: FileText,
      title: "No Blog Posts Yet", 
      description: "No blog posts have been published yet. Check back soon for insights and tutorials!",
      adminText: "Write your first blog post",
      adminLink: "/admin/blog/new"
    }
  }

  const { icon: Icon, title, description, adminText, adminLink } = config[type]

  return (
    <div className="col-span-full flex items-center justify-center py-12">
      <Card className="border-dashed border-2 border-border/50 bg-card/50 max-w-md mx-auto text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <Icon className="w-12 h-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl font-[family-name:var(--font-orbitron)] text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
          {showAdminLink && (
            <Button 
              asChild
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <a href={adminLink}>
                <Plus className="w-4 h-4 mr-2" />
                {adminText}
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
