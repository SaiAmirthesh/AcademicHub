import React from "react"
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Link, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { School, LayoutDashboard, Layers, BookOpen, Users, GraduationCap, Sliders } from "lucide-react"

// Contexts & Client
import { AuthProvider, useAuth } from "./context/AuthContext"

// Routing Components
import { ProtectedRoute } from "./components/ProtectedRoute"

// Page Components
import { LandingPage } from "./pages/LandingPage"
import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { Dashboard } from "./pages/dashboard/Dashboard"
import { Departments } from "./pages/departments/Departments"
import { Subjects } from "./pages/subjects/Subjects"
import { Teachers } from "./pages/teachers/Teachers"
import { Students } from "./pages/students/Students"
import { Classes } from "./pages/classes/Classes"
import { Profile } from "./pages/Profile"

const Layout: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col h-screen overflow-hidden">
      {/* Top navbar */}
      <header className="border-b bg-card py-4 px-6 flex justify-between items-center shadow-xs shrink-0 z-10">
        <div className="flex items-center gap-3">
          <School className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
            AcademicHub
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      {/* Main workspace containing Sidebar and Content */}
      <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card p-4 flex flex-col gap-1.5 shrink-0 overflow-y-auto">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground px-3 mb-2 block">
            Navigation Menu
          </span>

          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            <LayoutDashboard className="h-4.5 w-4.5 text-primary" />
            <span>Dashboard</span>
          </Link>

          {user?.role === "admin" && (
            <>
              <Link
                to="/departments"
                className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Layers className="h-4.5 w-4.5 text-primary" />
                <span>Departments</span>
              </Link>
              <Link
                to="/subjects"
                className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <BookOpen className="h-4.5 w-4.5 text-primary" />
                <span>Subjects</span>
              </Link>
              <Link
                to="/teachers"
                className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <School className="h-4.5 w-4.5 text-primary" />
                <span>Teachers</span>
              </Link>
            </>
          )}

          {user?.role !== "student" && (
            <Link
              to="/students"
              className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              <Users className="h-4.5 w-4.5 text-primary" />
              <span>Students</span>
            </Link>
          )}

          <Link
            to="/classes"
            className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            <GraduationCap className="h-4.5 w-4.5 text-primary" />
            <span>Classes</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            <Sliders className="h-4.5 w-4.5 text-primary" />
            <span>Profile</span>
          </Link>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 flex flex-col bg-background/40 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>
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
                <Route path="/profile" element={<Profile />} />
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


