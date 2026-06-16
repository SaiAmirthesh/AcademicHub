import React from "react"
import { type ColorTheme, useTheme } from "../context/ThemeContext"
import { Sun, Moon } from "lucide-react"

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, mode, setMode } = useTheme()

  const themes: { name: ColorTheme; label: string; colorClass: string }[] = [
    { name: "slate", label: "Slate", colorClass: "bg-slate-500" },
    { name: "zinc", label: "Zinc", colorClass: "bg-zinc-500" },
    { name: "indigo", label: "Indigo", colorClass: "bg-indigo-500" },
    { name: "violet", label: "Violet", colorClass: "bg-violet-500" },
    { name: "emerald", label: "Emerald", colorClass: "bg-emerald-500" },
    { name: "rose", label: "Rose", colorClass: "bg-rose-500" },
    { name: "amber", label: "Amber", colorClass: "bg-amber-500" },
    { name: "orange", label: "Orange", colorClass: "bg-orange-500" },
    { name: "cyan", label: "Cyan", colorClass: "bg-cyan-500" },
    { name: "red", label: "Red", colorClass: "bg-red-500" },
  ]

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Customize Theme</span>
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="p-2 border rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
          title={`Switch to ${mode === "light" ? "Dark" : "Light"} Mode`}
        >
          {mode === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-2">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${t.colorClass} ${
              theme === t.name ? "border-primary scale-110 shadow-md" : "border-transparent hover:scale-105"
            }`}
            title={t.label}
          />
        ))}
      </div>
    </div>
  )
}
