import React from "react"
import { type ColorTheme, useTheme } from "../context/ThemeContext"
import { Sun, Moon, Palette } from "lucide-react"
import { Link } from "react-router-dom"

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, mode, setMode } = useTheme()

  const themes: { name: ColorTheme; label: string; colorClass: string }[] = [
    { name: "modern-minimalism", label: "Modern Minimalism", colorClass: "bg-neutral-800 dark:bg-neutral-200" },
    { name: "supabase", label: "Supabase", colorClass: "bg-emerald-500" },
    { name: "claude", label: "Claude", colorClass: "bg-orange-400" },
    { name: "amber-minimal", label: "Amber Minimal", colorClass: "bg-amber-500" },
    { name: "amethyst-haze", label: "Amethyst Haze", colorClass: "bg-purple-500" },
    { name: "graphite", label: "Graphite", colorClass: "bg-neutral-500" },
    { name: "vintage-paper", label: "Vintage Paper", colorClass: "bg-[#d8c3a5]" },
    { name: "claymorphism", label: "Claymorphism", colorClass: "bg-violet-500" },
  ]

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-xl shadow-xs bg-card text-card-foreground min-w-[240px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Theme</span>
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="p-1.5 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          title={`Switch to ${mode === "light" ? "Dark" : "Light"} Mode`}
        >
          {mode === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center cursor-pointer ${t.colorClass} ${
              theme === t.name ? "ring-2 ring-primary scale-110 shadow-md" : "border-border hover:scale-105"
            }`}
            title={t.label}
          />
        ))}
      </div>
      
      <div className="border-t pt-2 mt-1">
        <Link 
          to="/profile" 
          className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1"
        >
          <Palette className="h-3.5 w-3.5" /> Customise Themes
        </Link>
      </div>
    </div>
  )
}
