import React, { createContext, useContext, useEffect, useState } from "react"

export type ColorTheme =
  | "slate"
  | "zinc"
  | "indigo"
  | "violet"
  | "emerald"
  | "rose"
  | "amber"
  | "orange"
  | "cyan"
  | "red"

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
    return (localStorage.getItem("app-color-theme") as ColorTheme) || "slate"
  })

  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("app-theme-mode") as ThemeMode) || "light"
  })

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all old theme classes
    const themes: ColorTheme[] = [
      "slate",
      "zinc",
      "indigo",
      "violet",
      "emerald",
      "rose",
      "amber",
      "orange",
      "cyan",
      "red",
    ]
    themes.forEach((t) => {
      root.classList.remove(`theme-${t}`)
    })

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
