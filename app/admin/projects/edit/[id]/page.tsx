"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Project } from "@/lib/types"
import ImageUpload from "@/components/image-upload"

export default function EditProject() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [techInput, setTechInput] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    image: "",
    technologies: [] as string[],
    demoUrl: "",
    githubUrl: "",
    featured: false,
  })

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (response.ok) {
        const project: Project = await response.json()
        setFormData({
          title: project.title,
          description: project.description,
          longDescription: project.longDescription,
          image: project.image,
          technologies: project.technologies,
          demoUrl: project.demoUrl || "",
          githubUrl: project.githubUrl || "",
          featured: project.featured,
        })
      } else {
        alert("Project not found")
        router.push("/admin/projects")
      }
    } catch (error) {
      console.error("Failed to fetch project:", error)
      alert("Failed to load project")
    } finally {
      setInitialLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id, fetchProject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/projects")
      } else {
        alert("Failed to update project")
      }
    } catch (error) {
      console.error("Failed to update project:", error)
      alert("Failed to update project")
    } finally {
      setLoading(false)
    }
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput("")
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/projects" className="text-green-500 hover:text-green-400">
              ← Back to Projects
            </Link>
            <h1 className="text-2xl font-bold">Edit Project</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Same form fields as new project */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Short Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription" className="text-gray-300">
                  Detailed Description *
                </Label>
                <Textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                  rows={6}
                  required
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                label="Project Image"
              />

              <div className="space-y-2">
                <Label className="text-gray-300">Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                    className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                    placeholder="Add technology"
                  />
                  <Button type="button" onClick={addTechnology} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-gray-800 text-gray-300">
                      {tech}
                      <button type="button" onClick={() => removeTechnology(tech)} className="ml-2 hover:text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demoUrl" className="text-gray-300">
                  Demo URL
                </Label>
                <Input
                  id="demoUrl"
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl" className="text-gray-300">
                  GitHub URL
                </Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                />
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-700 rounded-lg">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => {
                    console.log('Featured changed:', checked) // Debug log
                    setFormData({ ...formData, featured: checked })
                  }}
                  className="data-[state=checked]:bg-green-600"
                />
                <div>
                  <Label htmlFor="featured" className="text-gray-300 cursor-pointer">
                    Featured Project
                  </Label>
                  <p className="text-sm text-gray-500">
                    Featured projects will be highlighted on the homepage
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                  {loading ? "Updating..." : "Update Project"}
                </Button>
                <Link href="/admin/projects" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
