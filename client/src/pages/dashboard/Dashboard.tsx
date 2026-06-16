import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { ThemeSelector } from "../../components/ThemeSelector"
import {
  GraduationCap,
  BookOpen,
  Users,
  School,
  Calendar,
  Layers,
  Key,
  CheckCircle,
  AlertCircle
} from "lucide-react"

// Types matching analytics endpoint schema
interface AdminAnalytics {
  counts: {
    departments: number
    subjects: number
    teachers: number
    students: number
    activeClasses: number
  }
  departmentEnrollment: { name: string; students: number }[]
  teacherWorkload: { name: string; classesCount: number }[]
}

interface TeacherAnalytics {
  counts: {
    classesTaught: number
    uniqueStudents: number
  }
  classRosterDetails: { className: string; enrolled: number; capacity: number }[]
  timetable: { classId: number; className: string; schedule: string; subjectName: string; status: string }[]
}

interface StudentAnalytics {
  counts: {
    classesJoined: number
  }
  timetable: { classId: number; className: string; schedule: string; subjectName: string; teacherName: string }[]
}

const CustomBarChart: React.FC<{
  data: any[]
  dataKey: string
  nameKey: string
  label: string
}> = ({ data, dataKey, nameKey, label }) => {
  const maxVal = Math.max(...data.map((d) => d[dataKey]), 1)
  return (
    <div className="h-full flex flex-col justify-end">
      <div className="flex-1 flex items-end gap-6 pb-2 relative min-h-[220px]">
        {/* Y-Axis dashed grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full border-t border-dashed border-border h-0" />
          <div className="w-full border-t border-dashed border-border h-0" />
          <div className="w-full border-t border-dashed border-border h-0" />
          <div className="w-full border-t border-dashed border-border h-0" />
          <div className="w-full border-b border-border h-0" />
        </div>

        {/* Bar items */}
        {data.map((item, idx) => {
          const val = item[dataKey]
          const heightPercent = `${(val / maxVal) * 100}%`
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end z-10">
              <div
                style={{ height: heightPercent }}
                className="w-full max-w-[60px] bg-primary rounded-t-lg relative transition-all duration-300 hover:brightness-110 cursor-pointer shadow-xs min-h-[4px]"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded-md shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none font-semibold">
                  <span className="font-bold">{val}</span> {label}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between gap-6 pt-3 border-t border-border mt-1">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 text-center text-xs text-muted-foreground truncate font-medium"
            title={item[nameKey]}
          >
            {item[nameKey]}
          </div>
        ))}
      </div>
    </div>
  )
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [adminData, setAdminData] = useState<AdminAnalytics | null>(null)
  const [teacherData, setTeacherData] = useState<TeacherAnalytics | null>(null)
  const [studentData, setStudentData] = useState<StudentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Student join code widget states
  const [joinCode, setJoinCode] = useState("")
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)

  const fetchAnalytics = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:3000/api/analytics/${user.role}`, {
        headers: {
          // Send credentials via cookie jar automatically
        }
      })
      const resJson = await response.json()
      if (resJson.success) {
        if (user.role === "admin") setAdminData(resJson.data)
        else if (user.role === "teacher") setTeacherData(resJson.data)
        else if (user.role === "student") setStudentData(resJson.data)
      } else {
        setError(resJson.error || "Failed to load dashboard data")
      }
    } catch (err: any) {
      setError(err.message || "Network error loading analytics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [user])

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode.trim()) return
    setJoining(true)
    setJoinSuccess(null)
    setJoinError(null)
    try {
      const response = await fetch("http://localhost:3000/api/classes/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ joinCode: joinCode.trim().toUpperCase() })
      })
      const resJson = await response.json()
      if (resJson.success) {
        setJoinSuccess(`Enrolled successfully in ${resJson.data.class.name}!`)
        setJoinCode("")
        fetchAnalytics() // Reload timetable/counts
      } else {
        setJoinError(resJson.error || "Failed to join class")
      }
    } catch (err: any) {
      setJoinError(err.message || "Network error joining class")
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive flex items-center gap-3">
          <AlertCircle className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Error Loading Dashboard</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AcademicHub Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Logged in as <span className="font-semibold text-primary">{user?.name}</span> ({user?.role})
          </p>
        </div>
        <ThemeSelector />
      </div>

      {/* ADMIN DASHBOARD VIEW */}
      {user?.role === "admin" && adminData && (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">Departments</span>
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{adminData.counts.departments}</div>
            </div>

            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">Subjects</span>
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{adminData.counts.subjects}</div>
            </div>

            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">Teachers</span>
                <School className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{adminData.counts.teachers}</div>
            </div>

            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">Students</span>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{adminData.counts.students}</div>
            </div>

            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">Active Classes</span>
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{adminData.counts.activeClasses}</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Chart 1: Department Student Count */}
            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold">Students by Department</h2>
              <div className="h-72 w-full flex flex-col justify-end">
                {adminData.departmentEnrollment.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No data available
                  </div>
                ) : (
                  <CustomBarChart
                    data={adminData.departmentEnrollment}
                    dataKey="students"
                    nameKey="name"
                    label="Students"
                  />
                )}
              </div>
            </div>

            {/* Chart 2: Teacher Workload */}
            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold">Classes per Faculty Member</h2>
              <div className="h-72 w-full flex flex-col justify-end">
                {adminData.teacherWorkload.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No data available
                  </div>
                ) : (
                  <CustomBarChart
                    data={adminData.teacherWorkload}
                    dataKey="classesCount"
                    nameKey="name"
                    label="Classes"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER DASHBOARD VIEW */}
      {user?.role === "teacher" && teacherData && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">Classes Taught</span>
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{teacherData.counts.classesTaught}</div>
            </div>

            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">Unique Students</span>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{teacherData.counts.uniqueStudents}</div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Roster list */}
            <div className="md:col-span-2 p-6 bg-card border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold">Your Class Rosters</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="pb-3 font-semibold text-left">Class Section</th>
                      <th className="pb-3 font-semibold text-right">Enrolled Students</th>
                      <th className="pb-3 font-semibold text-right">Capacity</th>
                      <th className="pb-3 font-semibold text-right">Occupancy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {teacherData.classRosterDetails.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-muted-foreground">
                          No classes assigned
                        </td>
                      </tr>
                    ) : (
                      teacherData.classRosterDetails.map((roster, idx) => (
                        <tr key={idx} className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 font-medium">{roster.className}</td>
                          <td className="py-3 text-right">{roster.enrolled}</td>
                          <td className="py-3 text-right">{roster.capacity}</td>
                          <td className="py-3 text-right font-semibold">
                            {Math.round((roster.enrolled / roster.capacity) * 100)}%
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timetable schedule list */}
            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Timetable
              </h2>
              <div className="space-y-3">
                {teacherData.timetable.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No scheduled classes</p>
                ) : (
                  teacherData.timetable.map((slot) => (
                    <div key={slot.classId} className="p-3 border rounded-lg bg-background space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{slot.className}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {slot.subjectName}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{slot.schedule}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT DASHBOARD VIEW */}
      {user?.role === "student" && studentData && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Stats and Join card */}
            <div className="space-y-6">
              <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-sm font-medium">Joined Classes</span>
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{studentData.counts.classesJoined}</div>
              </div>

              {/* Join Class Widget */}
              <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" /> Join a Class
                  </h3>
                  <p className="text-xs text-muted-foreground">Enter an uppercase 8-character join code.</p>
                </div>

                {joinSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>{joinSuccess}</span>
                  </div>
                )}
                {joinError && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{joinError}</span>
                  </div>
                )}

                <form onSubmit={handleJoinClass} className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="e.g. X8K2PA"
                    className="flex-1 px-3 py-1.5 text-sm border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    disabled={joining}
                    className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    {joining ? "Joining..." : "Join"}
                  </button>
                </form>
              </div>
            </div>

            {/* Timetable */}
            <div className="md:col-span-2 p-6 bg-card border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Timetable
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {studentData.timetable.length === 0 ? (
                  <div className="sm:col-span-2 text-center py-6 text-muted-foreground text-sm">
                    You have not enrolled in any classes yet. Use a join code to get started.
                  </div>
                ) : (
                  studentData.timetable.map((slot) => (
                    <div key={slot.classId} className="p-4 border rounded-xl bg-background space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{slot.className}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {slot.subjectName}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Instructor: {slot.teacherName}</p>
                        <p className="text-xs text-muted-foreground font-semibold">{slot.schedule}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
