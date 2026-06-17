import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authClient } from "../../lib/authClient.js"
import { School, AlertCircle } from "lucide-react"

interface Department {
  id: number
  name: string
  code: string
}

export const Register: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin" | "teacher" | "student">("student")
  const [departmentId, setDepartmentId] = useState("")
  const [departmentsList, setDepartmentsList] = useState<Department[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch departments for dropdown
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/departments?limit=100")
        const resJson = await response.json()
        if (resJson.success && resJson.data && resJson.data.data) {
          setDepartmentsList(resJson.data.data)
        }
      } catch (err) {
        console.error("Failed to load departments:", err)
      }
    }
    fetchDepartments()
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (role !== "admin" && !departmentId) {
      setError("Department is required.")
      setLoading(false)
      return
    }

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        role,
        departmentId: (role !== "admin" && departmentId) ? Number(departmentId) : undefined,
      } as any)

      if (signUpError) {
        setError(signUpError.message || "Failed to register")
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
    <div className="min-h-screen bg-background flex flex-col justify-center py-6 sm:px-6 lg:px-8 text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <div className="flex justify-center items-center gap-3">
          <School className="h-8 w-8 text-primary" />
          <span className="text-2xl font-extrabold tracking-tight">AcademicHub</span>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Or{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-card py-5 px-4 border shadow-sm sm:rounded-xl sm:px-6">
          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Registering As
              </label>
              <div className="flex bg-muted/40 p-1 rounded-xl border border-border/85 gap-1 shadow-inner">
                {(["student", "teacher"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r)
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer capitalize ${
                      role === r
                        ? "bg-primary text-primary-foreground shadow-sm scale-[1.01]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-1.5 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
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
                placeholder="Min 8 characters"
                className="mt-1 block w-full px-3 py-1.5 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {role !== "admin" && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-foreground">
                  Department (Required)
                </label>
                <select
                  id="department"
                  required
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="mt-1 block w-full px-3 py-1.5 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">Select a department</option>
                  {departmentsList.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-1.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all cursor-pointer mt-2"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
