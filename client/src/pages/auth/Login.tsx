import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authClient } from "../../lib/authClient.js"
import { School, AlertCircle } from "lucide-react"

export const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(signInError.message || "Invalid credentials")
      } else {
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (roleEmail: string) => {
    setError(null)
    setLoading(true)
    try {
      const { error: signInError } = await authClient.signIn.email({
        email: roleEmail,
        password: "Password123",
      })

      if (signInError) {
        setError(signInError.message || "Invalid credentials")
      } else {
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center gap-3">
          <School className="h-10 w-10 text-primary animate-pulse" />
          <span className="text-3xl font-extrabold tracking-tight">AcademicHub</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Or{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            register as a new student
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 border shadow-sm sm:rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
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
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
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
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-border">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
              Quick Demo Login
            </span>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin("admin@university.edu")}
                className="py-2 px-1 border rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer text-center"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickLogin("teacher@university.edu")}
                className="py-2 px-1 border rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer text-center"
              >
                Teacher
              </button>
              <button
                onClick={() => handleQuickLogin("student@university.edu")}
                className="py-2 px-1 border rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer text-center"
              >
                Student
              </button>
            </div>
            <p className="mt-2 text-[10px] text-center text-muted-foreground">
              Preset password: <code className="bg-muted px-1 rounded">Password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
