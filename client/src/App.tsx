import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Link, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { School, LayoutDashboard, Lock, Mail } from "lucide-react"

// Contexts & Client
import { AuthProvider, useAuth } from "./context/AuthContext"
import { authClient } from "./lib/authClient"

// Routing Components
import { ProtectedRoute } from "./components/ProtectedRoute"

// Page Components
import { LandingPage } from "./pages/LandingPage"
import { Register } from "./pages/auth/Register"
import { Dashboard } from "./pages/dashboard/Dashboard"
import { Departments } from "./pages/departments/Departments"
import { Subjects } from "./pages/subjects/Subjects"
import { Teachers } from "./pages/teachers/Teachers"
import { Students } from "./pages/students/Students"
import { Classes } from "./pages/classes/Classes"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin" | "teacher" | "student">("student")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authClient.signIn.email({
        email,
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
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-card border rounded-xl shadow-md space-y-6">
        <div className="text-center space-y-2">
          <School className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold tracking-tight">Sign In to AcademicHub</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your dashboard</p>
        </div>

        {error && <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg text-left">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="login-role" className="text-sm font-medium">Sign In As</label>
            <select
              id="login-role"
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "teacher" | "student")}
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">Demo Admin: admin@hub.com / admin123</p>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const Layout: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top navbar */}
      <header className="border-b bg-card py-4 px-6 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <School className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
            AcademicHub
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-primary flex items-center gap-1 hover:opacity-80 transition-opacity">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>

          {user?.role === "admin" && (
            <>
              <Link to="/departments" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Departments
              </Link>
              <Link to="/subjects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Subjects
              </Link>
              <Link to="/teachers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Teachers
              </Link>
            </>
          )}

          {user?.role !== "student" && (
            <Link to="/students" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Students
            </Link>
          )}

          <Link to="/classes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Classes
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          Sign Out
        </button>
      </header>

      {/* Content wrapper */}
      <main className="flex-1 flex flex-col bg-background/50">
        <Outlet />
      </main>
    </div>
  )
}

const HomeRouteWrapper: React.FC = () => {
  const { user } = useAuth()
  if (user) {
    return <Layout />
  }
  return <LandingPage />
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeRouteWrapper />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/departments" element={<Departments />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/students" element={<Students />} />
                <Route path="/classes" element={<Classes />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App


