import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../../components/ui/chart"
import {
  GraduationCap,
  BookOpen,
  Users,
  School,
  Calendar,
  Layers,
  Key,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Bell,
  Activity,
  PlusCircle,
  FileText,
  ShieldAlert,
  Sliders,
  TrendingUp
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

  // Format current date nicely
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  // Simulated Alert Feed for Academics ERP feel
  const mockAlerts = [
    { id: 1, type: "system", message: "Better-Auth Session Shield: Active", color: "text-emerald-500 bg-emerald-500/10" },
    { id: 2, type: "alert", message: "Arcjet protected login & registration rate limits enabled", color: "text-indigo-500 bg-indigo-500/10" },
    { id: 3, type: "academic", message: "Final Course workload audit reports pending submission", color: "text-amber-500 bg-amber-500/10" }
  ]

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
  }, [user?.id, user?.role])

  // Transform department enrollment data for Recharts Donut chart
  const donutChartData = React.useMemo(() => {
    if (!adminData?.departmentEnrollment) return []
    return adminData.departmentEnrollment.map((dept) => {
      const key = dept.name.toLowerCase().replace(/[^a-z0-9]/g, "")
      return {
        name: dept.name,
        students: dept.students,
        fill: `var(--color-${key})`
      }
    })
  }, [adminData?.departmentEnrollment])

  const donutChartConfig = React.useMemo(() => {
    if (!adminData?.departmentEnrollment) return {} as ChartConfig
    const config: ChartConfig = {
      students: {
        label: "Students"
      }
    }
    adminData.departmentEnrollment.forEach((dept, idx) => {
      const key = dept.name.toLowerCase().replace(/[^a-z0-9]/g, "")
      config[key] = {
        label: dept.name,
        color: `var(--chart-${(idx % 5) + 1})`
      }
    })
    return config
  }, [adminData?.departmentEnrollment])

  const totalStudents = React.useMemo(() => {
    return donutChartData.reduce((acc, curr) => acc + curr.students, 0)
  }, [donutChartData])

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
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground font-semibold">Loading ERP system modules...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="p-5 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-4">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Error Loading ERP Dashboard</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  }

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full text-left">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/10 via-background to-card border p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Academics ERP Live Environment
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Welcome back, <span className="text-primary font-black">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5 font-medium">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {currentDate}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto z-10">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-muted-foreground block font-bold">System Authorization</span>
            <span className="text-sm font-extrabold text-foreground capitalize bg-muted px-2.5 py-1 rounded-lg border border-border">
              {user?.role} Role
            </span>
          </div>
        </div>
      </motion.div>

      {/* Grid Dashboard */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* ADMIN DASHBOARD VIEW */}
        {user?.role === "admin" && adminData && (
          <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { title: "Departments", val: adminData.counts.departments, icon: Layers, color: "text-indigo-400 bg-indigo-500/10", route: "/departments" },
                { title: "Subjects", val: adminData.counts.subjects, icon: BookOpen, color: "text-blue-400 bg-blue-500/10", route: "/subjects" },
                { title: "Teachers", val: adminData.counts.teachers, icon: School, color: "text-violet-400 bg-violet-500/10", route: "/teachers" },
                { title: "Students", val: adminData.counts.students, icon: Users, color: "text-emerald-400 bg-emerald-500/10", route: "/students" },
                { title: "Active Classes", val: adminData.counts.activeClasses, icon: GraduationCap, color: "text-pink-400 bg-pink-500/10", route: "/classes" }
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-6 bg-card border rounded-2xl shadow-xs space-y-4 hover:shadow-lg transition-all duration-300 relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-4 -translate-y-4 group-hover:scale-125 transition-transform" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</span>
                      <div className={`p-2.5 rounded-xl ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-black tracking-tight">{stat.val}</div>
                      <Link to={stat.route} className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline group-hover:translate-x-0.5 transition-transform">
                        Manage Directory <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Charts & Actions Panel */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Chart 1: Department Student Count Donut Chart */}
              <motion.div variants={itemVariants} className="lg:col-span-2 p-6 bg-card border rounded-2xl shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight">Student Enrollment by Department</h2>
                      <p className="text-xs text-muted-foreground font-medium">Headcount density metrics per branch</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-indigo-400" />
                  </div>

                  {donutChartData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm font-semibold">
                      No enrollment data available
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="h-64 w-full">
                        <ChartContainer config={donutChartConfig} className="mx-auto aspect-square max-h-[240px]">
                          <PieChart>
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                              data={donutChartData}
                              dataKey="students"
                              nameKey="name"
                              innerRadius={70}
                              outerRadius={95}
                              strokeWidth={4}
                              stroke="var(--card)"
                            >
                              <Label
                                content={({ viewBox }) => {
                                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                      <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                      >
                                        <tspan
                                          x={viewBox.cx}
                                          y={viewBox.cy}
                                          className="fill-foreground text-3xl font-black"
                                        >
                                          {totalStudents.toLocaleString()}
                                        </tspan>
                                        <tspan
                                          x={viewBox.cx}
                                          y={(viewBox.cy || 0) + 20}
                                          className="fill-muted-foreground text-xs font-bold uppercase tracking-wider"
                                        >
                                          Students
                                        </tspan>
                                      </text>
                                    )
                                  }
                                }}
                              />
                            </Pie>
                          </PieChart>
                        </ChartContainer>
                      </div>

                      {/* Legend details */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block border-b pb-1.5">
                          Department Headcount
                        </span>
                        <div className="max-h-[190px] overflow-y-auto space-y-2.5 pr-2">
                          {donutChartData.map((item) => {
                            const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, "")
                            const color = donutChartConfig[key]?.color
                            const percent = totalStudents > 0 ? ((item.students / totalStudents) * 100).toFixed(0) : "0"
                            return (
                              <div key={item.name} className="flex items-center justify-between text-xs font-semibold">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                  <span className="text-foreground font-bold truncate max-w-[140px]">{item.name}</span>
                                </div>
                                <div className="text-muted-foreground flex gap-2 font-mono">
                                  <span className="font-extrabold text-foreground">{item.students}</span>
                                  <span>({percent}%)</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Quick Admin Actions shortcut panel */}
              <motion.div variants={itemVariants} className="p-6 bg-card border rounded-2xl shadow-xs space-y-4 self-start h-full">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" /> Governance Shortcuts
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/departments" className="p-3 bg-muted/50 border hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer">
                    <Layers className="h-5 w-5 text-indigo-400" />
                    <span className="text-xs font-bold">New Dept</span>
                  </Link>
                  <Link to="/subjects" className="p-3 bg-muted/50 border hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <span className="text-xs font-bold">New Subject</span>
                  </Link>
                  <Link to="/teachers" className="p-3 bg-muted/50 border hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer">
                    <School className="h-5 w-5 text-violet-400" />
                    <span className="text-xs font-bold">Register Staff</span>
                  </Link>
                  <Link to="/classes" className="p-3 bg-muted/50 border hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer">
                    <PlusCircle className="h-5 w-5 text-pink-400" />
                    <span className="text-xs font-bold">Open Class</span>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Second Row: System Alerts & Security Profile */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* System Alerts */}
              <motion.div variants={itemVariants} className="lg:col-span-1 p-6 bg-card border rounded-2xl shadow-xs space-y-4">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> Live Alerts & Audit
                </h2>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex gap-3 text-xs p-2.5 rounded-lg bg-muted/55 border border-border/80 text-left items-start">
                      <Activity className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{alert.message}</p>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 ${alert.color}`}>
                          {alert.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Global Security Details */}
              <motion.div variants={itemVariants} className="lg:col-span-2 p-6 bg-card border rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2 pb-3 border-b">
                    <ShieldAlert className="h-4.5 w-4.5 text-primary" /> Security Shield Profile
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex justify-between items-center text-xs p-3 bg-muted/30 border rounded-xl">
                      <span className="text-muted-foreground font-semibold">Arcjet Bot Mitigation:</span>
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-3 bg-muted/30 border rounded-xl">
                      <span className="text-muted-foreground font-semibold">Rate Limiter Limit:</span>
                      <span className="font-extrabold text-foreground bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">120 req/min</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-3 bg-muted/30 border rounded-xl">
                      <span className="text-muted-foreground font-semibold">JWT Better-Auth Shield:</span>
                      <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-3 bg-muted/30 border rounded-xl">
                      <span className="text-muted-foreground font-semibold">PostgreSQL Host:</span>
                      <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[150px] bg-muted/50 px-2 py-0.5 rounded border border-border">Neon Serverless</span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t text-[11px] text-muted-foreground font-semibold flex items-center gap-1.5 bg-muted/20 p-3 rounded-xl mt-4">
                  🔒 System data is verified secure by Arcjet middleware logic.
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* TEACHER DASHBOARD VIEW */}
        {user?.role === "teacher" && teacherData && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="p-6 bg-card border rounded-2xl shadow-xs space-y-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Classes Assigned</span>
                  <div className="text-4xl font-black">{teacherData.counts.classesTaught}</div>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Course segments led by you</p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <GraduationCap className="h-8 w-8" />
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="p-6 bg-card border rounded-2xl shadow-xs space-y-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Unique Students</span>
                  <div className="text-4xl font-black">{teacherData.counts.uniqueStudents}</div>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Enrolled student footprint</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Users className="h-8 w-8" />
                </div>
              </motion.div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Roster list */}
              <motion.div variants={itemVariants} className="lg:col-span-2 p-6 bg-card border rounded-2xl shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h2 className="text-lg font-bold">Class Roster Analytics</h2>
                    <p className="text-xs text-muted-foreground font-medium">Student capacity occupancy tracking</p>
                  </div>
                  <Layers className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="pb-3 font-bold text-left">Class Section</th>
                        <th className="pb-3 font-bold text-right">Enrolled</th>
                        <th className="pb-3 font-bold text-right">Capacity</th>
                        <th className="pb-3 font-bold text-right">Status/Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {teacherData.classRosterDetails.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-muted-foreground font-semibold">
                            No classes assigned to your faculty profile.
                          </td>
                        </tr>
                      ) : (
                        teacherData.classRosterDetails.map((roster, idx) => {
                          const occupancy = Math.round((roster.enrolled / roster.capacity) * 100)
                          return (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                              <td className="py-4 font-bold text-foreground">{roster.className}</td>
                              <td className="py-4 text-right font-semibold">{roster.enrolled}</td>
                              <td className="py-4 text-right text-muted-foreground font-semibold">{roster.capacity}</td>
                              <td className="py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <div className="w-24 bg-muted h-2 rounded-full overflow-hidden hidden sm:block border">
                                    <div
                                      style={{ width: `${Math.min(occupancy, 100)}%` }}
                                      className={`h-full rounded-full ${occupancy >= 90 ? "bg-rose-500" : occupancy >= 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                                    />
                                  </div>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${occupancy >= 90 ? "text-rose-400 bg-rose-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>
                                    {occupancy}% Full
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Timetable schedule list */}
              <motion.div variants={itemVariants} className="p-6 bg-card border rounded-2xl shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <Calendar className="h-4.5 w-4.5 text-primary" /> Timetable Timeline
                  </h2>
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold uppercase">Today</span>
                </div>
                <div className="space-y-4">
                  {teacherData.timetable.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6 font-semibold">No scheduled classes</p>
                  ) : (
                    teacherData.timetable.map((slot) => (
                      <div key={slot.classId} className="p-4 border rounded-xl bg-muted/40 hover:bg-muted/70 transition-all space-y-2 text-left relative group">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm group-hover:text-primary transition-colors">{slot.className}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            {slot.subjectName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{slot.schedule}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* STUDENT DASHBOARD VIEW */}
        {user?.role === "student" && studentData && (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Stats and Join card */}
              <div className="space-y-6">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  className="p-6 bg-card border rounded-2xl shadow-xs space-y-3 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Enrolled Classes</span>
                    <div className="text-4xl font-black">{studentData.counts.classesJoined}</div>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Your registered courses</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                </motion.div>

                {/* Join Class Widget */}
                <motion.div variants={itemVariants} className="p-6 bg-card border rounded-2xl shadow-xs space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-bold flex items-center gap-2">
                      <Key className="h-4.5 w-4.5 text-primary animate-pulse" /> Register New Class
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">Enter class join code below to register instantly.</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {joinSuccess && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2"
                      >
                        <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                        <span className="font-semibold">{joinSuccess}</span>
                      </motion.div>
                    )}
                    {joinError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2"
                      >
                        <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                        <span className="font-semibold">{joinError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleJoinClass} className="flex gap-2">
                    <input
                      type="text"
                      required
                      maxLength={8}
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="e.g. X8K2PA"
                      className="flex-1 px-3.5 py-2 text-sm border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none uppercase font-mono tracking-widest"
                    />
                    <motion.button
                      type="submit"
                      disabled={joining}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-xs border border-primary/20"
                    >
                      {joining ? "Joining..." : "Join"}
                    </motion.button>
                  </form>
                </motion.div>

                {/* Simulated Academic Deadlines panel for student */}
                <motion.div variants={itemVariants} className="p-6 bg-card border rounded-2xl shadow-xs space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-primary" /> Active Calendar Notices
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-muted/40 border border-border/80 rounded-xl">
                      <span className="font-bold block text-foreground">Mid-Term Assessments</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">Begins next Monday • Check timetables</span>
                    </div>
                    <div className="p-3 bg-muted/40 border border-border/80 rounded-xl">
                      <span className="font-bold block text-foreground">Course Roster Enrollment</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">Join codes close at the end of the week</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Timetable Calendar */}
              <motion.div variants={itemVariants} className="lg:col-span-2 p-6 bg-card border rounded-2xl shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" /> Course Timetable Schedule
                  </h2>
                  <span className="text-xs bg-muted border font-bold px-2.5 py-1 rounded-lg">Weekly Schedule Matrix</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {studentData.timetable.length === 0 ? (
                    <div className="sm:col-span-2 text-center py-12 text-muted-foreground text-sm font-semibold">
                      You are not registered in any classes yet. Use a join code above to enroll and generate your timetable.
                    </div>
                  ) : (
                    studentData.timetable.map((slot) => (
                      <div key={slot.classId} className="p-5 border rounded-2xl bg-muted/30 hover:bg-muted/60 hover:border-primary/20 transition-all space-y-3 text-left relative group">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm group-hover:text-primary transition-colors">{slot.className}</span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {slot.subjectName}
                          </span>
                        </div>
                        <div className="space-y-2 pt-1">
                          <p className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            Instructor: {slot.teacherName}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-bold flex items-center gap-1 bg-muted px-2 py-1 rounded-lg w-fit border border-border/80">
                            <Clock className="h-3.5 w-3.5" />
                            {slot.schedule}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
