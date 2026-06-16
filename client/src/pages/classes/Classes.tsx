import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { GraduationCap, Plus, Trash2, Calendar, Users, Copy, Check, AlertCircle, CheckCircle } from "lucide-react"

interface ClassItem {
  id: number
  name: string
  subjectId: number
  teacherId: string
  joinCode: string
  capacity: number
  schedule: string
  status: string
  subject?: {
    name: string
  }
  teacher?: {
    name: string
  }
  enrollments?: any[]
}

interface Subject {
  id: number
  name: string
  code: string
}

interface Teacher {
  id: string
  name: string
}

export const Classes: React.FC = () => {
  const { user } = useAuth()
  const [classesList, setClassesList] = useState<ClassItem[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Clipboard copy state
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // Add Form
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const [capacity, setCapacity] = useState("30")
  const [schedule, setSchedule] = useState("")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch subjects & teachers for dropdowns (only needed if admin)
      if (user?.role === "admin") {
        const subResponse = await fetch("http://localhost:3000/api/subjects?limit=100")
        const subJson = await subResponse.json()
        if (subJson.success && subJson.data && subJson.data.data) {
          setSubjects(subJson.data.data)
        }

        const teachResponse = await fetch("http://localhost:3000/api/teachers?limit=100")
        const teachJson = await teachResponse.json()
        if (teachJson.success && teachJson.data && teachJson.data.data) {
          setTeachers(teachJson.data.data)
        }
      }

      // Fetch classes
      const response = await fetch("http://localhost:3000/api/classes?limit=100")
      const resJson = await response.json()
      if (resJson.success && resJson.data && resJson.data.data) {
        setClassesList(resJson.data.data)
      } else {
        setError(resJson.error || "Failed to load classes")
      }
    } catch (err: any) {
      setError(err.message || "Network error loading classes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const handleCopyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!subjectId || !teacherId) {
      setError("Please select a subject and teacher")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          subjectId: Number(subjectId),
          teacherId,
          capacity: Number(capacity),
          schedule
        })
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Class section created successfully!")
        setName("")
        setSubjectId("")
        setTeacherId("")
        setCapacity("30")
        setSchedule("")
        setShowAddForm(false)
        fetchData()
      } else {
        setError(resJson.error || "Failed to create class section")
      }
    } catch (err: any) {
      setError(err.message || "Network error creating class")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this class? This will also remove student enrollments.")) return
    setError(null)
    setMessage(null)
    try {
      const response = await fetch(`http://localhost:3000/api/classes/${id}`, {
        method: "DELETE"
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Class section deleted successfully!")
        fetchData()
      } else {
        setError(resJson.error || "Failed to delete class")
      }
    } catch (err: any) {
      setError(err.message || "Network error deleting class")
    }
  }

  if (loading && classesList.length === 0) {
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
            <GraduationCap className="h-8 w-8 text-primary" /> Classes & Enrollment
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "student"
              ? "View your active enrolled classes and class timetables."
              : "Manage university classes, schedulers, teacher allocations, and enrollment join codes."}
          </p>
        </div>
        {user?.role === "admin" && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-5 w-5" /> Create Class
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
          <h2 className="text-lg font-bold">Create New Class Section</h2>
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-3 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground">Class Name / Section</label>
              <input
                type="text"
                required
                placeholder="e.g. Section A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Subject</label>
              <select
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Assigned Teacher</label>
              <select
                required
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a teacher</option>
                {teachers.map((teach) => (
                  <option key={teach.id} value={teach.id}>
                    {teach.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Class Capacity</label>
              <input
                type="number"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground">Schedule Window</label>
              <input
                type="text"
                required
                placeholder="e.g. Mon 10:00 - 12:00, Room 302"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2">
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
                Save Class
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classesList.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 p-12 text-center border rounded-xl bg-card text-muted-foreground text-sm">
            No active classes found.
          </div>
        ) : (
          classesList.map((cls) => (
            <div key={cls.id} className="p-6 bg-card border rounded-xl shadow-sm space-y-4 relative flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg leading-tight">{cls.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 capitalize">
                    {cls.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-semibold">
                    {cls.subject?.name}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>Instructor: {cls.teacher?.name || "Unassigned"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{cls.schedule || "Not scheduled"}</span>
                </p>
                <p className="text-xs">Capacity limit: {cls.capacity} students</p>
              </div>

              {/* Action row (Join Code & Delete) */}
              <div className="pt-4 border-t flex items-center justify-between gap-2">
                {user?.role !== "student" ? (
                  <div className="flex items-center gap-2 bg-background border px-3 py-1.5 rounded-lg text-xs font-mono select-all">
                    <span>Code: {cls.joinCode}</span>
                    <button
                      onClick={() => handleCopyCode(cls.joinCode, cls.id)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Copy Join Code"
                    >
                      {copiedId === cls.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-emerald-500">Enrolled ✔</span>
                )}

                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="p-2 border border-destructive/20 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Delete Class"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
