import { supabase } from "./supabase"
import type { User } from "./types"

export class AuthService {
  private static readonly AUTH_KEY = "portfolio_auth"

  static async login(email: string, password: string): Promise<User | null> {
    try {
      // Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError || !authData.user) {
        console.error("Auth error:", authError)
        return null
      }

      // Get user role from the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single()

      if (userError) {
        console.error("User data error:", userError)
        // If user doesn't exist in users table, sign them out
        await supabase.auth.signOut()
        return null
      }

      // Only allow admin users
      if (userData.role !== "admin") {
        await supabase.auth.signOut()
        return null
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        role: userData.role,
      }

      localStorage.setItem(this.AUTH_KEY, JSON.stringify(user))
      return user
    } catch (error) {
      console.error("Login error:", error)
      return null
    }
  }

  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem(this.AUTH_KEY)
    } catch (error) {
      console.error("Logout error:", error)
      localStorage.removeItem(this.AUTH_KEY)
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(this.AUTH_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  static isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === "admin"
  }

  // Check if current session is valid with Supabase
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        localStorage.removeItem(this.AUTH_KEY)
        return false
      }

      // Verify user still has admin role
      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (error || userData.role !== "admin") {
        await this.logout()
        return false
      }

      return true
    } catch (error) {
      console.error("Session validation error:", error)
      await this.logout()
      return false
    }
  }
}
