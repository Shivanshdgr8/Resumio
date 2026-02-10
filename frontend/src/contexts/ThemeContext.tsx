import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

export type Theme = 'home' | 'builder' | 'ats' | 'cover-letter' | 'interview' | 'roaster'

interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    dark: string
    light: string
    gradient: string
    navbarBg: string
    navbarBorder: string
    navbarText: string
    navbarActive: string
  }
  navbarStyle: 'default' | 'minimal' | 'bold' | 'elegant' | 'modern' | 'floating' | 'sidebar' | 'ribbon' | 'circular' | 'diagonal' | 'playful'
}

const themes: Record<Theme, ThemeConfig> = {
  home: {
    name: 'Home',
    colors: {
      primary: '#4f46e5', // Indigo-600
      secondary: '#8b5cf6', // Violet-500
      accent: '#06b6d4', // Cyan-500
      dark: '#1e1b4b', // Indigo-950
      light: '#f8fafc', // Slate-50
      gradient: 'from-indigo-600 via-violet-600 to-cyan-500',
      navbarBg: 'bg-white',
      navbarBorder: 'border-indigo-100',
      navbarText: 'text-slate-700',
      navbarActive: 'from-indigo-600 to-violet-600',
    },
    navbarStyle: 'minimal',
  },
  builder: {
    name: 'Builder',
    colors: {
      primary: '#2563eb', // Blue-600 (Royal)
      secondary: '#4f46e5', // Indigo-600
      accent: '#38bdf8', // Sky-400
      dark: '#172554', // Blue-950
      light: '#eff6ff', // Blue-50
      gradient: 'from-blue-600 to-indigo-600',
      navbarBg: 'bg-white',
      navbarBorder: 'border-blue-100',
      navbarText: 'text-slate-700',
      navbarActive: 'from-blue-600 to-indigo-600',
    },
    navbarStyle: 'minimal',
  },
  ats: {
    name: 'ATS Checker',
    colors: {
      primary: '#059669', // Emerald-600
      secondary: '#0d9488', // Teal-600
      accent: '#34d399', // Emerald-400
      dark: '#022c22', // Emerald-950
      light: '#ecfdf5', // Emerald-50
      gradient: 'from-emerald-600 to-teal-600',
      navbarBg: 'bg-white',
      navbarBorder: 'border-emerald-100',
      navbarText: 'text-slate-700',
      navbarActive: 'from-emerald-600 to-teal-600',
    },
    navbarStyle: 'minimal',
  },
  'cover-letter': {
    name: 'Cover Letter',
    colors: {
      primary: '#e11d48', // Rose-600
      secondary: '#db2777', // Pink-600
      accent: '#fb7185', // Rose-400
      dark: '#881337', // Rose-900
      light: '#fff1f2', // Rose-50
      gradient: 'from-rose-600 to-pink-600',
      navbarBg: 'bg-white',
      navbarBorder: 'border-rose-100',
      navbarText: 'text-slate-700',
      navbarActive: 'from-rose-600 to-pink-600',
    },
    navbarStyle: 'minimal',
  },
  interview: {
    name: 'Interview Prep',
    colors: {
      primary: '#d97706', // Amber-600
      secondary: '#ea580c', // Orange-600
      accent: '#fbbf24', // Amber-400
      dark: '#78350f', // Amber-900
      light: '#fffbeb', // Amber-50
      gradient: 'from-amber-500 to-orange-600',
      navbarBg: 'bg-white',
      navbarBorder: 'border-amber-100',
      navbarText: 'text-slate-700',
      navbarActive: 'from-amber-500 to-orange-600',
    },
    navbarStyle: 'minimal',
  },
  roaster: {
    name: 'Resume Roaster',
    colors: {
      primary: '#c2410c', // Orange-700
      secondary: '#b91c1c', // Red-700
      accent: '#fdba74', // Orange-300
      dark: '#431407', // Orange-950
      light: '#fff7ed', // Orange-50
      gradient: 'from-orange-600 to-red-600',
      navbarBg: 'bg-white',
      navbarBorder: 'border-orange-100',
      navbarText: 'text-slate-700',
      navbarActive: 'from-orange-600 to-red-600',
    },
    navbarStyle: 'minimal',
  },
}

interface ThemeContextType {
  theme: Theme
  themeConfig: ThemeConfig
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [theme, setTheme] = useState<Theme>('home')

  useEffect(() => {
    const path = location.pathname
    if (path === '/') {
      setTheme('home')
    } else if (path.startsWith('/builder')) {
      setTheme('builder')
    } else if (path.startsWith('/ats-checker')) {
      setTheme('ats')
    } else if (path.startsWith('/cover-letter')) {
      setTheme('cover-letter')
    } else if (path.startsWith('/interview-questions')) {
      setTheme('interview')
    } else if (path.startsWith('/resume-roaster')) {
      setTheme('roaster')
    } else {
      setTheme('home')
    }
  }, [location.pathname])

  const themeConfig = themes[theme]

  // Apply CSS variables for theme colors
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-primary', themeConfig.colors.primary)
    root.style.setProperty('--theme-secondary', themeConfig.colors.secondary)
    root.style.setProperty('--theme-accent', themeConfig.colors.accent)
    root.style.setProperty('--theme-dark', themeConfig.colors.dark)
    root.style.setProperty('--theme-light', themeConfig.colors.light)
  }, [themeConfig])

  return (
    <ThemeContext.Provider value={{ theme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

