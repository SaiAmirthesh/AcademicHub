import React, { useState, useEffect } from "react"
import { BookOpen, Plus, Trash2, Edit2, AlertCircle, CheckCircle } from "lucide-react"

interface Subject {
  id: number
  department_id: number
  code: string
  name: string
  description?: string
  department?: {
    id: number
    name: string
  }
}

interface Department {
  id: number
  code: string
  name: string
}

export const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Filtering
  const [filterDept, setFilterDept] = useState("")

  // Form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [departmentId, setDepartmentId] = useState("")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch departments first
      const deptResponse = await fetch("http://localhost:3000/api/departments?limit=100")
      const deptResJson = await deptResponse.json()
      if (deptResJson.success && deptResJson.data && deptResJson.data.data) {
        setDepartments(deptResJson.data.data)
      }

      // Fetch subjects
      let url = "http://localhost:3000/api/subjects?limit=100"
      if (filterDept) {
        url += `&departmentId=${filterDept}`
      }
      const response = await fetch(url)
      const resJson = await response.json()
      if (resJson.success && resJson.data && resJson.data.data) {
        // Since subjects might not have department object join on the server, we enrich it on the client
        const enriched = resJson.data.data.map((subj: any) => {
          const matchedDept = deptResJson.data?.data?.find((d: any) => d.id === subj.department_id)
          return {
            ...subj,
            department: matchedDept ? { id: matchedDept.id, name: matchedDept.name } : undefined
          }
        })
        setSubjects(enriched)
      } else {
        setError(resJson.error || "Failed to load subjects")
      }
    } catch (err: any) {
      setError(err.message || "Network error loading subjects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterDept])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!departmentId) {
      setError("Please select a department")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          name,
          description,
          department_id: Number(departmentId)
        })
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Subject created successfully!")
        setCode("")
        setName("")
        setDescription("")
        setDepartmentId("")
        setShowAddForm(false)
        fetchData()
      } else {
        setError(resJson.error || "Failed to create subject")
      }
    } catch (err: any) {
      setError(err.message || "Network error creating subject")
    }
  }

  const handleStartEdit = (subject: Subject) => {
    setEditingId(subject.id)
    setCode(subject.code)
    setName(subject.name)
    setDescription(subject.description || "")
    setDepartmentId(String(subject.department_id))
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setCode("")
    setName("")
    setDescription("")
    setDepartmentId("")
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    setError(null)
    setMessage(null)
    try {
      const response = await fetch(`http://localhost:3000/api/subjects/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          department_id: Number(departmentId)
        })
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Subject updated successfully!")
        setEditingId(null)
        setCode("")
        setName("")
        setDescription("")
        setDepartmentId("")
        fetchData()
      } else {
        setError(resJson.error || "Failed to update subject")
      }
    } catch (err: any) {
      setError(err.message || "Network error updating subject")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return
    setError(null)
    setMessage(null)
    try {
      const response = await fetch(`http://localhost:3000/api/subjects/${id}`, {
        method: "DELETE"
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Subject deleted successfully!")
        fetchData()
      } else {
        setError(resJson.error || "Failed to delete subject. Verify that no classes are assigned to this subject.")
      }
    } catch (err: any) {
      setError(err.message || "Network error deleting subject")
    }
  }

  if (loading && subjects.length === 0) {
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
            <BookOpen className="h-8 w-8 text-primary" /> Subjects
          </h1>
          <p className="text-muted-foreground mt-1">Manage curriculum courses and subject categories.</p>
        </div>
        {!showAddForm && !editingId && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-5 w-5" /> Add Subject
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

      {/* Filter and Add button row */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-card border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <label htmlFor="filterDept" className="text-sm font-medium text-muted-foreground">
            Filter by Department:
          </label>
          <select
            id="filterDept"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-1.5 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Add New Subject</h2>
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-4 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground">Code (Unique)</label>
              <input
                type="text"
                required
                placeholder="e.g. CS101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Subject Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Algorithms"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Department</label>
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
            <div>
              <label className="block text-sm font-medium text-foreground">Description</label>
              <input
                type="text"
                placeholder="e.g. Core curriculum course"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
                Save Subject
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingId && (
        <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Edit Subject: {code}</h2>
          <form onSubmit={handleSaveEdit} className="grid gap-4 sm:grid-cols-3 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground">Subject Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Department</label>
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
            <div>
              <label className="block text-sm font-medium text-foreground">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 cursor-pointer"
              >
                Update Subject
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground bg-muted/30">
                <th className="py-3 px-4 font-semibold text-left">Code</th>
                <th className="py-3 px-4 font-semibold text-left">Subject Name</th>
                <th className="py-3 px-4 font-semibold text-left">Department</th>
                <th className="py-3 px-4 font-semibold text-left">Description</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No subjects found. Add one above or adjust filters.
                  </td>
                </tr>
              ) : (
                subjects.map((subj) => (
                  <tr key={subj.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold">{subj.code}</td>
                    <td className="py-3 px-4">{subj.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        {subj.department?.name || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{subj.description || "-"}</td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(subj)}
                        className="p-1.5 hover:bg-muted rounded text-primary transition-colors cursor-pointer"
                        title="Edit Subject"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(subj.id)}
                        className="p-1.5 hover:bg-muted rounded text-destructive transition-colors cursor-pointer"
                        title="Delete Subject"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
