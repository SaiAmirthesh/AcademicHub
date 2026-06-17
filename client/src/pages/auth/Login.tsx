import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authClient } from "../../lib/authClient.js"
import { useAuth } from "../../context/AuthContext"
import { School, AlertCircle } from "lucide-react"

export const Login: React.FC = () => {
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student")
  const [email, setEmail] = useState("student@university.edu")
  const [password, setPassword] = useState("Password123")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const handleRoleSelect = (selectedRole: "student" | "teacher" | "admin") => {
    setRole(selectedRole)
    if (selectedRole === "student") {
      setEmail("student@edu.in")
      setPassword("password123")
    } else if (selectedRole === "teacher") {
      setEmail("teacher@edu.in")
      setPassword("password123")
    } else if (selectedRole === "admin") {
      setEmail("admin@gmail.com")
      setPassword("password123")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await authClient.signIn.email({
        email: email.trim(),
        password,
      })

      if (response.error) {
        setError(response.error.message || "Invalid credentials")
      } else {
        const { data: session } = await authClient.getSession()
        if (session && session.user && (session.user as any).role === role) {
          await refresh()
          navigate("/")
        } else {
          await authClient.signOut()
          setError(`Invalid credentials. Registered role does not match selected role: ${role}`)
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-6 sm:px-6 lg:px-8 text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <div className="flex justify-center items-center gap-3">
          <School className="h-8 w-8 text-primary animate-pulse" />
          <span className="text-2xl font-extrabold tracking-tight">AcademicHub</span>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-card py-5 px-4 border shadow-sm sm:rounded-xl sm:px-6">
          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="flex bg-muted/40 p-1 rounded-xl border border-border/85 gap-1 shadow-inner">
                {(["student", "teacher", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer capitalize ${
                      role === r
                        ? "bg-primary text-primary-foreground shadow-sm scale-[1.01]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    }`}
                  >
                    {r === "admin" ? "Admin" : r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-1.5 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-1.5 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-1.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all cursor-pointer mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
