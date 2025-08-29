"use client"

import type React from "react"

import { AuthProvider } from "@/contexts/auth-context"
import { AdminGuard } from "@/components/admin-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  )
}
