import React from "react"
import { useAuth } from "../context/AuthContext"
import { useTheme, type ColorTheme } from "../context/ThemeContext"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Check, 
  Sun, 
  Moon, 
  Info,
  Sparkles
} from "lucide-react"

export const Profile: React.FC = () => {
  const { user } = useAuth()
  const { theme, setTheme, mode, setMode } = useTheme()

  // Theme definition with metadata for visualization in cards
  const themeMetadata: {
    name: ColorTheme
    label: string
    description: string
    primaryColor: string
    bgColor: string
    accentColor: string
    textColor: string
    font: string
  }[] = [
    {
      name: "modern-minimalism",
      label: "Modern Minimalism",
      description: "Monochrome slate interface with deep indigo branding accents.",
      primaryColor: "bg-[#4f46e5]", // Indigo
      bgColor: "bg-white border-neutral-200 dark:bg-neutral-900",
      accentColor: "bg-[#6366f1]",
      textColor: "text-neutral-900 dark:text-neutral-100",
      font: "Inter / JetBrains Mono"
    },
    {
      name: "supabase",
      label: "Supabase",
      description: "Atmospheric developer green branding with soft dark gradients.",
      primaryColor: "bg-[#10b981]", // Emerald
      bgColor: "bg-emerald-50/20 dark:bg-[#121815]",
      accentColor: "bg-[#34d399]",
      textColor: "text-emerald-950 dark:text-emerald-50",
      font: "Outfit / Monospace"
    },
    {
      name: "claude",
      label: "Claude",
      description: "Warm terracotta and cream tones designed for reading clarity.",
      primaryColor: "bg-[#d97706]", // Amber/Terracotta
      bgColor: "bg-[#fafaf9] dark:bg-[#1c1917]",
      accentColor: "bg-[#f59e0b]",
      textColor: "text-[#44403c] dark:text-[#f5f5f4]",
      font: "system-ui / serif"
    },
    {
      name: "amber-minimal",
      label: "Amber Minimal",
      description: "Stark high-contrast yellow highlights on absolute white/black.",
      primaryColor: "bg-[#fbbf24]", // Amber
      bgColor: "bg-white dark:bg-black",
      accentColor: "bg-[#f59e0b]",
      textColor: "text-black dark:text-white",
      font: "Geist / Geist Mono"
    },
    {
      name: "amethyst-haze",
      label: "Amethyst Haze",
      description: "Relaxed lavender hues and purple gradients for a creative look.",
      primaryColor: "bg-[#8b5cf6]", // Purple/Amethyst
      bgColor: "bg-[#fdf4ff] dark:bg-[#120d1e]",
      accentColor: "bg-[#a78bfa]",
      textColor: "text-[#3b0764] dark:text-[#f5f3ff]",
      font: "Geist / Fira Code"
    },
    {
      name: "graphite",
      label: "Graphite",
      description: "Sleek slate-grey monochrome theme with crisp contrast and solid structure.",
      primaryColor: "bg-[#6b7280]", // Slate grey
      bgColor: "bg-[#f3f4f6] dark:bg-[#1f2937]",
      accentColor: "bg-[#9ca3af]",
      textColor: "text-[#111827] dark:text-[#f9fafb]",
      font: "Montserrat / Fira Code"
    },
    {
      name: "vintage-paper",
      label: "Vintage Paper",
      description: "Warm sepia tones and serif typography designed to evoke classic print and literature.",
      primaryColor: "bg-[#b58a63]", // Warm paper brown
      bgColor: "bg-[#f4efe6] dark:bg-[#3d3a35]",
      accentColor: "bg-[#c2a688]",
      textColor: "text-[#38332c] dark:text-[#f4f1eb]",
      font: "Libre Baskerville / Lora"
    },
    {
      name: "claymorphism",
      label: "Claymorphism",
      description: "3D soft UI concept with deep volumetric shadows, pill-shaped edges, and friendly roundness.",
      primaryColor: "bg-[#9d4edd]", // Volumetric violet
      bgColor: "bg-[#ebebeb] dark:bg-[#2b2b2b]",
      accentColor: "bg-[#c77dff]",
      textColor: "text-[#10002b] dark:text-[#f7e1d7]",
      font: "Plus Jakarta Sans / Roboto Mono"
    }
  ]



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
      {/* Header Banner */}
      <div className="border-b pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">System Profile & Customization</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Manage your account credentials and dynamic visual studio themes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted-foreground uppercase">Mode Selection</span>
          <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className="px-4 py-2 border rounded-xl hover:bg-accent hover:text-accent-foreground transition-all flex items-center gap-2 font-bold text-sm cursor-pointer shadow-xs"
          >
            {mode === "light" ? (
              <>
                <Moon className="h-4 w-4 text-indigo-400" />
                Dark Mode
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                Light Mode
              </>
            )}
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-8 lg:grid-cols-3"
      >
        {/* User Profile Card */}
        <motion.div variants={itemVariants} className="p-6 bg-card border rounded-2xl shadow-xs space-y-6 self-start">
          <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
            <User className="h-5 w-5 text-primary" /> Profile Directory Card
          </h2>
          
          <div className="flex flex-col items-center text-center space-y-3 py-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 border flex items-center justify-center text-primary text-3xl font-black uppercase">
              {user?.name?.slice(0, 2)}
            </div>
            <div>
              <h3 className="font-extrabold text-lg">{user?.name}</h3>
              <span className="text-xs font-bold uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 mt-1 inline-block">
                {user?.role} Role
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs font-medium border-t pt-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-4.5 w-4.5 shrink-0 text-primary" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground/85">Email Address</span>
                <span className="text-foreground font-semibold">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Shield className="h-4.5 w-4.5 shrink-0 text-primary" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground/85">Authentication Security</span>
                <span className="text-foreground font-semibold">Better-Auth Session Guard</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4.5 w-4.5 shrink-0 text-primary" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground/85">System Verification</span>
                <span className="text-foreground font-semibold">Arcjet Protected Sign-in</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Theme customization container */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom oklch themes */}
          <motion.div variants={itemVariants} className="p-6 bg-card border rounded-2xl shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Premium OKLCH Themes
                </h2>
                <p className="text-xs text-muted-foreground font-medium">Dynamic palettes modifying fonts, borders, charts, and card properties.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {themeMetadata.map((themeItem) => {
                const isActive = theme === themeItem.name
                return (
                  <motion.div
                    key={themeItem.name}
                    whileHover={{ y: -3, scale: 1.01 }}
                    onClick={() => setTheme(themeItem.name)}
                    className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[180px] ${
                      isActive ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40 bg-muted/20"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm">{themeItem.label}</span>
                        {isActive && (
                          <span className="p-0.5 rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {themeItem.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Swatch Previews */}
                      <div className="flex gap-1.5 items-center">
                        <div className="text-[10px] text-muted-foreground font-bold mr-1">Palette:</div>
                        <div className={`w-5 h-5 rounded-full border border-border/80 ${themeItem.bgColor}`} title="Background" />
                        <div className={`w-5 h-5 rounded-full border border-border/80 ${themeItem.primaryColor}`} title="Primary" />
                        <div className={`w-5 h-5 rounded-full border border-border/80 ${themeItem.accentColor}`} title="Accent" />
                        <div className="w-5 h-5 rounded-full border border-border/80 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[9px] font-bold" title="Typography">
                          Aa
                        </div>
                      </div>
                      <div className="text-[9px] text-muted-foreground/80 font-mono">
                        Font Family: {themeItem.font}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>



          <motion.div variants={itemVariants} className="p-4 bg-muted/30 border rounded-xl text-xs text-muted-foreground flex gap-2.5 items-start">
            <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Dynamic Theme Engine</strong>: Under the hood, this dashboard is designed using Tailwind CSS v4 custom properties mapped to inline definitions. When you select a premium theme, all properties—from font spacing to box-shadow blur ratios—re-evaluate in real-time.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
