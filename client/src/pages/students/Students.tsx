import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { Users, Plus, Trash2, Calendar, User, Eye, X, AlertCircle, CheckCircle } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  departmentId?: number | null
  department?: {
    name: string
  }
  enrollments?: {
    id: number
    classId: number
    class?: {
      id: number
      name: string
      schedule: string
      subject?: {
        name: string
      }
    }
  }[]
}

interface Department {
  id: number
  code: string
  name: string
}

export const Students: React.FC = () => {
  const { user: currentUser } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Details Panel
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Add Form
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [departmentId, setDepartmentId] = useState("")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch departments
      const deptResponse = await fetch("http://localhost:3000/api/departments?limit=100")
      const deptResJson = await deptResponse.json()
      if (deptResJson.success && deptResJson.data && deptResJson.data.data) {
        setDepartments(deptResJson.data.data)
      }

      // Fetch students
      const response = await fetch("http://localhost:3000/api/students?limit=100")
      const resJson = await response.json()
      if (resJson.success && resJson.data && resJson.data.data) {
        setStudents(resJson.data.data)
      } else {
        setError(resJson.error || "Failed to load students")
      }
    } catch (err: any) {
      setError(err.message || "Network error loading students")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleViewDetails = async (id: string) => {
    setSelectedStudentId(id)
    setLoadingDetails(true)
    setSelectedStudent(null)
    try {
      const response = await fetch(`http://localhost:3000/api/students/${id}`)
      const resJson = await response.json()
      if (resJson.success) {
        setSelectedStudent(resJson.data)
      } else {
        setError(resJson.error || "Failed to load student profile")
      }
    } catch (err: any) {
      setError(err.message || "Network error loading student details")
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!departmentId) {
      setError("Department is required.")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password,
          departmentId: Number(departmentId)
        })
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Student manually registered successfully!")
        setName("")
        setEmail("")
        setPassword("")
        setDepartmentId("")
        setShowAddForm(false)
        fetchData()
      } else {
        setError(resJson.error || "Failed to create student profile")
      }
    } catch (err: any) {
      setError(err.message || "Network error registering student")
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student? This will also remove them from all enrolled classes.")) return
    setError(null)
    setMessage(null)
    try {
      const response = await fetch(`http://localhost:3000/api/students/${id}`, {
        method: "DELETE"
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Student deleted successfully!")
        if (selectedStudentId === id) setSelectedStudentId(null)
        fetchData()
      } else {
        setError(resJson.error || "Failed to delete student")
      }
    } catch (err: any) {
      setError(err.message || "Network error deleting student")
    }
  }

  if (loading && students.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" /> Student Directory
          </h1>
          <p className="text-muted-foreground mt-1">Manage and view student enrollments, details, and department assignments.</p>
        </div>
        {currentUser?.role === "admin" && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-5 w-5" /> Register Student
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center gap-2 text-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Register New Student Profile</h2>
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-4 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground">Student Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                placeholder="e.g. ada@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                required
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Department (Required)</label>
              <select
                required
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: list + Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Table list */}
        <div className="lg:col-span-2 bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground bg-muted/30">
                  <th className="py-3 px-4 font-semibold text-left">Name</th>
                  <th className="py-3 px-4 font-semibold text-left">Email</th>
                  <th className="py-3 px-4 font-semibold text-left">Department</th>
                  <th className="py-3 px-4 font-semibold text-right">Classes Joined</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((stud) => (
                    <tr key={stud.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold">{stud.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{stud.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                          {stud.department?.name || "Unassigned"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{stud.enrollments?.length ?? 0}</td>
                      <td className="py-3 px-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(stud.id)}
                          className="p-1.5 hover:bg-muted rounded text-primary transition-colors cursor-pointer"
                          title="View Profile Details & Classes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {currentUser?.role === "admin" && (
                          <button
                            onClick={() => handleDelete(stud.id)}
                            className="p-1.5 hover:bg-muted rounded text-destructive transition-colors cursor-pointer"
                            title="Delete Student"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* details column / Side Panel */}
        <div className="space-y-6">
          {selectedStudentId ? (
            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-6 sticky top-6">
              <div className="flex justify-between items-start border-b pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Student Profile
                </h2>
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {loadingDetails ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : selectedStudent ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                    <p className="text-xs mt-2 font-semibold">
                      Department:{" "}
                      <span className="text-primary font-bold">
                        {selectedStudent.department?.name || "Unassigned"}
                      </span>
                    </p>
                  </div>

                  {/* Joined classes timetable */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Enrolled Classes
                    </h4>
                    <div className="space-y-2">
                      {selectedStudent.enrollments?.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Not enrolled in any classes yet</p>
                      ) : (
                        selectedStudent.enrollments?.map((enroll: any) => (
                          <div key={enroll.id} className="p-3 border rounded-lg bg-background text-xs space-y-1">
                            <div className="flex items-center justify-between font-semibold">
                              <span>{enroll.class?.name}</span>
                              <span className="text-[10px] uppercase text-muted-foreground">
                                {enroll.class?.subject?.name}
                              </span>
                            </div>
                            <p className="text-muted-foreground font-medium">{enroll.class?.schedule}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="p-6 bg-card border rounded-xl shadow-sm text-center py-12 text-muted-foreground text-sm sticky top-6">
              Select a student from the list to view their enrolled classes, department details, and profile.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
