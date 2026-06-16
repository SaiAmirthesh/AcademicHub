import React, { createContext, useContext } from "react"
import { authClient } from "../lib/authClient.js"

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role: "admin" | "teacher" | "student"
  departmentId?: number | null
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, isPending, refetch } = authClient.useSession()
  const user = (session?.user as unknown as User) || null

  const logout = async () => {
    await authClient.signOut()
    await refetch()
  }

  const refresh = async () => {
    await refetch()
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading: isPending, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
