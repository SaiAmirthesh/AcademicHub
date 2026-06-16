import React from "react"
import { Link } from "react-router-dom"
import { School, LayoutDashboard, Users, BookOpen, Shield, GraduationCap, ChevronRight } from "lucide-react"

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Top Navigation */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <School className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
            AcademicHub
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors cursor-pointer"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-background via-card/20 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <span className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary tracking-wide uppercase">
            Decoupled Campus Management Platform
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none">
            Empower Your Academic Journey with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
              AcademicHub
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A secure, role-based dashboard system engineered for university governance, curriculum orchestration, and campus schedule tracking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg"
            >
              Get Started Now <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-border bg-card hover:bg-muted/50 font-semibold transition-colors cursor-pointer"
            >
              Access Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-border">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Designed for Campus Roles
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experience role-based workspaces tailored with the tools you need for daily operations.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-card border hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 flex flex-col gap-4 text-left">
            <div className="p-3 w-fit rounded-lg bg-primary/10 text-primary">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Admin Governance</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create and manage departments, register faculty members, orchestrate university subjects, and maintain global campus directories.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-card border hover:border-indigo-500/30 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 flex flex-col gap-4 text-left">
            <div className="p-3 w-fit rounded-lg bg-indigo-500/10 text-indigo-500">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Teacher Classrooms</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Access student directories, monitor course roster sizes, review active classes, and track your teaching schedules in real-time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-card border hover:border-emerald-500/30 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 flex flex-col gap-4 text-left">
            <div className="p-3 w-fit rounded-lg bg-emerald-500/10 text-emerald-500">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Student Hub</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enroll in classes using secure Join Codes, check classroom capacity in real-time, and view your weekly timetable schedules.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 md:px-12 bg-card/20 text-center text-xs text-muted-foreground">
        <p>© 2026 AcademicHub. All rights reserved. Built with modern, security-first web standards.</p>
      </footer>
    </div>
  )
}
