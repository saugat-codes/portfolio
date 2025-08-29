"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, FileText, FolderOpen } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-500">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Welcome, {user?.email}</span>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FolderOpen className="h-5 w-5 text-green-500" />
                Manage Projects
              </CardTitle>
              <CardDescription className="text-gray-400">Create, edit, and delete portfolio projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/projects">
                <Button className="w-full bg-green-600 hover:bg-green-700">Manage Projects</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-green-500" />
                Manage Blog Posts
              </CardTitle>
              <CardDescription className="text-gray-400">Create, edit, and delete blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/blog">
                <Button className="w-full bg-green-600 hover:bg-green-700">Manage Blog Posts</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
