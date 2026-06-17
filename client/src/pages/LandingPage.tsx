import React, { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { School, LayoutDashboard, Users, GraduationCap, ChevronRight, CheckCircle2, ShieldAlert, Zap } from "lucide-react"
import * as THREE from "three"
import { gsap } from "gsap"
import { motion } from "framer-motion"

// Interactive Three.js particle node network background
const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.z = 25

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Particles (academic nodes)
    const particleCount = 120
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const speeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      speeds[i] = 0.01 + Math.random() * 0.03
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    // Create a circular particle texture
    const canvas = document.createElement("canvas")
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext("2d")
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
      gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.5)")
      gradient.addColorStop(1, "rgba(99, 102, 241, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 16, 16)
    }

    const texture = new THREE.CanvasTexture(canvas)

    const material = new THREE.PointsMaterial({
      size: 0.9,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: texture,
      color: 0x818cf8 // indigo-400
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Connective lines material
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4f46e5, // indigo-600
      transparent: true,
      opacity: 0.2
    })

    let lineSegments: THREE.LineSegments | null = null

    // Track mouse coordinates for parallax
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((event.clientX - rect.left) / width) * 2 - 1
      mouseY = -((event.clientY - rect.top) / height) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener("resize", handleResize)

    // Animation Loop
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Move particles slowly upwards
      const positionsArr = points.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        positionsArr[i * 3 + 1] += speeds[i] * 0.1
        if (positionsArr[i * 3 + 1] > 20) {
          positionsArr[i * 3 + 1] = -20
        }
      }
      points.geometry.attributes.position.needsUpdate = true

      // Inertial mouse rotation
      targetX += (mouseX - targetX) * 0.05
      targetY += (mouseY - targetY) * 0.05

      points.rotation.y = targetX * 0.4
      points.rotation.x = -targetY * 0.4

      // Dynamically connect close nodes
      if (lineSegments) {
        scene.remove(lineSegments)
        lineSegments.geometry.dispose()
      }

      const linePositions = []
      const threshold = 6.0
      for (let i = 0; i < particleCount; i++) {
        const x1 = positionsArr[i * 3]
        const y1 = positionsArr[i * 3 + 1]
        const z1 = positionsArr[i * 3 + 2]

        for (let j = i + 1; j < Math.min(i + 25, particleCount); j++) {
          const x2 = positionsArr[j * 3]
          const y2 = positionsArr[j * 3 + 1]
          const z2 = positionsArr[j * 3 + 2]

          const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2)
          if (dist < threshold) {
            linePositions.push(x1, y1, z1, x2, y2, z2)
          }
        }
      }

      if (linePositions.length > 0) {
        const lineGeometry = new THREE.BufferGeometry()
        lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3))
        lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial)
        scene.add(lineSegments)
        lineSegments.rotation.y = points.rotation.y
        lineSegments.rotation.x = points.rotation.x
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      lineMaterial.dispose()
      if (lineSegments) {
        lineSegments.geometry.dispose()
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0" />
}

export const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const actionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // GSAP load animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    tl.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(
      ".badge-reveal",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5 },
      "-=0.4"
    )
    .fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.3"
    )
    .fromTo(
      subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.5"
    )
    .fromTo(
      actionRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.5"
    )
    .fromTo(
      ".stat-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 },
      "-=0.4"
    )
    .fromTo(
      ".feature-card",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8 },
      "-=0.3"
    )
  }, [])

  const features = [
    {
      title: "Admin Governance",
      description: "Create and manage departments, register faculty members, orchestrate university subjects, and maintain global campus directories.",
      icon: LayoutDashboard,
      color: "from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30",
      glowColor: "group-hover:shadow-indigo-500/10",
      badge: "Global Control"
    },
    {
      title: "Teacher Classrooms",
      description: "Access student directories, monitor course roster sizes, review active classes, and track your teaching schedules in real-time.",
      icon: GraduationCap,
      color: "from-purple-500/20 to-violet-500/20 text-violet-400 border-violet-500/30",
      glowColor: "group-hover:shadow-violet-500/10",
      badge: "Schedules & Roster"
    },
    {
      title: "Student Hub",
      description: "Enroll in classes using secure Join Codes, check classroom capacity in real-time, and view your weekly timetable schedules.",
      icon: Users,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      glowColor: "group-hover:shadow-emerald-500/10",
      badge: "Join Code Registry"
    }
  ]

  const stats = [
    { label: "Active Registrations", val: "99.9%", desc: "Arcjet protected endpoints", icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Response Latency", val: "< 45ms", desc: "Neon Serverless database query speed", icon: Zap, color: "text-amber-400" },
    { label: "Rate-Limiting Protection", val: "Active", desc: "Real-time threat mitigation", icon: ShieldAlert, color: "text-indigo-400" }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 overflow-x-hidden">
      {/* Top Navigation */}
      <header
        ref={headerRef}
        className="border-b bg-card/45 backdrop-blur-md sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center transition-all"
      >
        <div className="flex items-center gap-3">
          <School className="h-7 w-7 text-primary animate-pulse" />
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-indigo-300 to-indigo-500">
            AcademicHub
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            Login
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer block border border-primary/20"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-background via-indigo-950/10 to-background border-b border-border/40"
      >
        {/* Three.js interactive visualizer */}
        <ThreeBackground />

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none z-0" />

        <div className="max-w-4xl space-y-8 relative z-10">
          <span className="badge-reveal inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">
            <Zap className="h-3.5 w-3.5" /> Decoupled Campus Management Platform
          </span>

          <h1
            ref={titleRef}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none text-balance"
          >
            Empower Your Academic Journey with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-violet-500">
              AcademicHub
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A high-performance, security-first ERP system engineered for university governance, dynamic teacher class timetables, and student enrollment tools.
          </p>

          <div
            ref={actionRef}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer shadow-md"
              >
                Register Now <ChevronRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl border border-border bg-card/60 backdrop-blur-xs hover:bg-muted/50 font-bold transition-all cursor-pointer"
              >
                Access Portal
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Quick-view Banner */}
      <section className="py-12 bg-card/25 backdrop-blur-xs border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-6 sm:grid-cols-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className="stat-card p-6 bg-card/50 rounded-2xl border border-border/60 flex items-center gap-4 hover:border-primary/20 transition-all duration-300 shadow-xs text-left"
              >
                <div className={`p-3 rounded-xl bg-muted/70 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-black">{stat.val}</div>
                  <div className="text-sm font-semibold">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Designed for Integrated Campus Roles
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Experience role-specific environments customized with specialized tools for campus management.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                className="group relative"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className={`feature-card h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 flex flex-col gap-5 text-left shadow-xs hover:shadow-2xl ${feature.glowColor}`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-4.5 rounded-2xl bg-gradient-to-br ${feature.color} border`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-muted border text-muted-foreground">
                      {feature.badge}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6 md:px-12 bg-card/25 text-center text-xs text-muted-foreground mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 AcademicHub ERP. Powered by Better-Auth, Drizzle, and Arcjet security shield.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
