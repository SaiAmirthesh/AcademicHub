import React, { createContext, useContext, useEffect, useState } from "react"

export type ColorTheme =
  | "supabase"
  | "amber-minimal"
  | "amethyst-haze"
  | "modern-minimalism"
  | "claude"
  | "graphite"
  | "vintage-paper"
  | "claymorphism"

export type ThemeMode = "light" | "dark"

interface ThemeContextType {
  theme: ColorTheme
  setTheme: (theme: ColorTheme) => void
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem("app-color-theme")
    if (stored === "vercel") return "modern-minimalism"
    return (stored as ColorTheme) || "modern-minimalism"
  })

  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("app-theme-mode") as ThemeMode) || "light"
  })

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all old theme classes
    const themes: ColorTheme[] = [
      "supabase",
      "amber-minimal",
      "amethyst-haze",
      "modern-minimalism",
      "claude",
      "graphite",
      "vintage-paper",
      "claymorphism"
    ]
    themes.forEach((t) => {
      root.classList.remove(`theme-${t}`)
    })
    // Also remove legacy name just in case
    root.classList.remove("theme-vercel")

    // Add new theme class
    root.classList.add(`theme-${theme}`)
    localStorage.setItem("app-color-theme", theme)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement

    if (mode === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("app-theme-mode", mode)
  }, [mode])

  const setTheme = (newTheme: ColorTheme) => {
    setThemeState(newTheme)
  }

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
