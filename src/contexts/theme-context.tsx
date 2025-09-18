'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple' | 'orange' | 'rose' | 'slate'

export interface ThemeConfig {
  name: string
  displayName: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    card: string
    muted: string
    border: string
  }
}

export const THEMES: Record<Theme, ThemeConfig> = {
  light: {
    name: 'light',
    displayName: 'Light',
    description: 'Clean and bright',
    colors: {
      primary: 'oklch(0.6180 0.0778 65.5444)',
      secondary: 'oklch(0.8846 0.0302 85.5655)',
      accent: 'oklch(0.8348 0.0426 88.8064)',
      background: 'oklch(0.9582 0.0152 90.2357)',
      foreground: 'oklch(0.3760 0.0225 64.3434)',
      card: 'oklch(0.9914 0.0098 87.4695)',
      muted: 'oklch(0.9239 0.0190 83.0636)',
      border: 'oklch(0.8606 0.0321 84.5881)',
    }
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    description: 'Easy on the eyes',
    colors: {
      primary: 'oklch(0.7264 0.0581 66.6967)',
      secondary: 'oklch(0.3795 0.0181 57.1280)',
      accent: 'oklch(0.4186 0.0281 56.3404)',
      background: 'oklch(0.2747 0.0139 57.6523)',
      foreground: 'oklch(0.9239 0.0190 83.0636)',
      card: 'oklch(0.3237 0.0155 59.0603)',
      muted: 'oklch(0.3237 0.0155 59.0603)',
      border: 'oklch(0.3795 0.0181 57.1280)',
    }
  },
  blue: {
    name: 'blue',
    displayName: 'Ocean',
    description: 'Calm and professional',
    colors: {
      primary: 'oklch(0.55 0.15 240)',
      secondary: 'oklch(0.85 0.05 240)',
      accent: 'oklch(0.75 0.08 200)',
      background: 'oklch(0.98 0.01 240)',
      foreground: 'oklch(0.15 0.02 240)',
      card: 'oklch(0.99 0.005 240)',
      muted: 'oklch(0.92 0.02 240)',
      border: 'oklch(0.88 0.03 240)',
    }
  },
  green: {
    name: 'green',
    displayName: 'Forest',
    description: 'Natural and fresh',
    colors: {
      primary: 'oklch(0.55 0.15 140)',
      secondary: 'oklch(0.85 0.05 140)',
      accent: 'oklch(0.75 0.08 120)',
      background: 'oklch(0.98 0.01 140)',
      foreground: 'oklch(0.15 0.02 140)',
      card: 'oklch(0.99 0.005 140)',
      muted: 'oklch(0.92 0.02 140)',
      border: 'oklch(0.88 0.03 140)',
    }
  },
  purple: {
    name: 'purple',
    displayName: 'Royal',
    description: 'Creative and elegant',
    colors: {
      primary: 'oklch(0.55 0.15 300)',
      secondary: 'oklch(0.85 0.05 300)',
      accent: 'oklch(0.75 0.08 280)',
      background: 'oklch(0.98 0.01 300)',
      foreground: 'oklch(0.15 0.02 300)',
      card: 'oklch(0.99 0.005 300)',
      muted: 'oklch(0.92 0.02 300)',
      border: 'oklch(0.88 0.03 300)',
    }
  },
  orange: {
    name: 'orange',
    displayName: 'Sunset',
    description: 'Warm and energetic',
    colors: {
      primary: 'oklch(0.65 0.15 40)',
      secondary: 'oklch(0.85 0.05 40)',
      accent: 'oklch(0.75 0.08 60)',
      background: 'oklch(0.98 0.01 40)',
      foreground: 'oklch(0.15 0.02 40)',
      card: 'oklch(0.99 0.005 40)',
      muted: 'oklch(0.92 0.02 40)',
      border: 'oklch(0.88 0.03 40)',
    }
  },
  rose: {
    name: 'rose',
    displayName: 'Blush',
    description: 'Soft and romantic',
    colors: {
      primary: 'oklch(0.55 0.15 350)',
      secondary: 'oklch(0.85 0.05 350)',
      accent: 'oklch(0.75 0.08 10)',
      background: 'oklch(0.98 0.01 350)',
      foreground: 'oklch(0.15 0.02 350)',
      card: 'oklch(0.99 0.005 350)',
      muted: 'oklch(0.92 0.02 350)',
      border: 'oklch(0.88 0.03 350)',
    }
  },
  slate: {
    name: 'slate',
    displayName: 'Monochrome',
    description: 'Minimal and focused',
    colors: {
      primary: 'oklch(0.45 0.02 0)',
      secondary: 'oklch(0.85 0.01 0)',
      accent: 'oklch(0.75 0.01 0)',
      background: 'oklch(0.98 0.005 0)',
      foreground: 'oklch(0.15 0.01 0)',
      card: 'oklch(0.99 0.002 0)',
      muted: 'oklch(0.92 0.01 0)',
      border: 'oklch(0.88 0.015 0)',
    }
  }
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  availableThemes: ThemeConfig[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setThemeState(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const themeConfig = THEMES[newTheme]
    
    // Apply CSS custom properties
    const root = document.documentElement
    root.style.setProperty('--background', themeConfig.colors.background)
    root.style.setProperty('--foreground', themeConfig.colors.foreground)
    root.style.setProperty('--card', themeConfig.colors.card)
    root.style.setProperty('--card-foreground', themeConfig.colors.foreground)
    root.style.setProperty('--popover', themeConfig.colors.card)
    root.style.setProperty('--popover-foreground', themeConfig.colors.foreground)
    root.style.setProperty('--primary', themeConfig.colors.primary)
    root.style.setProperty('--primary-foreground', themeConfig.colors.background)
    root.style.setProperty('--secondary', themeConfig.colors.secondary)
    root.style.setProperty('--secondary-foreground', themeConfig.colors.foreground)
    root.style.setProperty('--muted', themeConfig.colors.muted)
    root.style.setProperty('--muted-foreground', themeConfig.colors.foreground)
    root.style.setProperty('--accent', themeConfig.colors.accent)
    root.style.setProperty('--accent-foreground', themeConfig.colors.foreground)
    root.style.setProperty('--border', themeConfig.colors.border)
    root.style.setProperty('--input', themeConfig.colors.border)
    root.style.setProperty('--ring', themeConfig.colors.primary)
    
    // Update chart colors
    root.style.setProperty('--chart-1', themeConfig.colors.primary)
    root.style.setProperty('--chart-2', themeConfig.colors.secondary)
    root.style.setProperty('--chart-3', themeConfig.colors.accent)
    root.style.setProperty('--chart-4', themeConfig.colors.primary)
    root.style.setProperty('--chart-5', themeConfig.colors.secondary)
    
    // Update sidebar colors
    root.style.setProperty('--sidebar', themeConfig.colors.muted)
    root.style.setProperty('--sidebar-foreground', themeConfig.colors.foreground)
    root.style.setProperty('--sidebar-primary', themeConfig.colors.primary)
    root.style.setProperty('--sidebar-primary-foreground', themeConfig.colors.background)
    root.style.setProperty('--sidebar-accent', themeConfig.colors.accent)
    root.style.setProperty('--sidebar-accent-foreground', themeConfig.colors.foreground)
    root.style.setProperty('--sidebar-border', themeConfig.colors.border)
    root.style.setProperty('--sidebar-ring', themeConfig.colors.primary)
    
    // Update kanban column colors
    root.style.setProperty('--kanban-new', themeConfig.colors.primary)
    root.style.setProperty('--kanban-learning', themeConfig.colors.secondary)
    root.style.setProperty('--kanban-completed', themeConfig.colors.accent)
    
    // Update document class for dark mode compatibility
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const setTheme = (newTheme: Theme) => {
    setIsTransitioning(true)
    setThemeState(newTheme)
    
    // Save preference
    localStorage.setItem('theme', newTheme)
    
    // Apply theme with animation
    applyTheme(newTheme)
    
    // Reset transition state
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const availableThemes = Object.values(THEMES)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, availableThemes }}>
      {children}
      
      {/* Theme transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 20, opacity: 0.3 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-32 h-32 rounded-full"
              style={{ backgroundColor: THEMES[theme as Theme].colors.primary }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}