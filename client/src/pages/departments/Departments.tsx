import React, { useState, useEffect } from "react"
import { Layers, Plus, Trash2, Edit2, AlertCircle, CheckCircle } from "lucide-react"

interface Department {
  id: number
  code: string
  name: string
  description?: string
}

export const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Forms
  const [editingId, setEditingId] = useState<number | null>(null)
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const fetchDepartments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:3000/api/departments?limit=100")
      const resJson = await response.json()
      if (resJson.success && resJson.data && resJson.data.data) {
        setDepartments(resJson.data.data)
      } else {
        setError(resJson.error || "Failed to load departments")
      }
    } catch (err: any) {
      setError(err.message || "Network error loading departments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    try {
      const response = await fetch("http://localhost:3000/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: code.toUpperCase(), name, description })
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Department created successfully!")
        setCode("")
        setName("")
        setDescription("")
        setShowAddForm(false)
        fetchDepartments()
      } else {
        setError(resJson.error || "Failed to create department")
      }
    } catch (err: any) {
      setError(err.message || "Network error creating department")
    }
  }

  const handleStartEdit = (dept: Department) => {
    setEditingId(dept.id)
    setCode(dept.code)
    setName(dept.name)
    setDescription(dept.description || "")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setCode("")
    setName("")
    setDescription("")
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    setError(null)
    setMessage(null)
    try {
      const response = await fetch(`http://localhost:3000/api/departments/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, description })
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Department updated successfully!")
        setEditingId(null)
        setCode("")
        setName("")
        setDescription("")
        fetchDepartments()
      } else {
        setError(resJson.error || "Failed to update department")
      }
    } catch (err: any) {
      setError(err.message || "Network error updating department")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return
    setError(null)
    setMessage(null)
    try {
      const response = await fetch(`http://localhost:3000/api/departments/${id}`, {
        method: "DELETE"
      })
      const resJson = await response.json()
      if (resJson.success) {
        setMessage("Department deleted successfully!")
        fetchDepartments()
      } else {
        setError(resJson.error || "Failed to delete department. Verify that no subjects are still in this department.")
      }
    } catch (err: any) {
      setError(err.message || "Network error deleting department")
    }
  }

  if (loading && departments.length === 0) {
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
            <Layers className="h-8 w-8 text-primary" /> Departments
          </h1>
          <p className="text-muted-foreground mt-1">Manage university departments and academic brackets.</p>
        </div>
        {!showAddForm && !editingId && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-5 w-5" /> Add Department
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
          <h2 className="text-lg font-bold">Add New Department</h2>
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-3 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground">Code (Unique)</label>
              <input
                type="text"
                required
                placeholder="e.g. CS"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Department Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Description</label>
              <input
                type="text"
                placeholder="e.g. CSE branch"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                Save Department
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingId && (
        <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Edit Department: {code}</h2>
          <form onSubmit={handleSaveEdit} className="grid gap-4 sm:grid-cols-2 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground">Department Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
            <div className="sm:col-span-2 flex justify-end gap-2">
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
                Update Department
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
                <th className="py-3 px-4 font-semibold text-left">Department Name</th>
                <th className="py-3 px-4 font-semibold text-left">Description</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No departments found. Add one above.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold">{dept.code}</td>
                    <td className="py-3 px-4">{dept.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{dept.description || "-"}</td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(dept)}
                        className="p-1.5 hover:bg-muted rounded text-primary transition-colors cursor-pointer"
                        title="Edit Department"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="p-1.5 hover:bg-muted rounded text-destructive transition-colors cursor-pointer"
                        title="Delete Department"
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
