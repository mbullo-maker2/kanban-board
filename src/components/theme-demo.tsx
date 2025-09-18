'use client'

import React from 'react'
import { useTheme } from '@/contexts/theme-context'
import { ThemeSelector } from '@/components/ui/theme-selector'

export function ThemeDemo() {
  const { theme, availableThemes } = useTheme()
  const currentTheme = availableThemes.find(t => t.name === theme)

  return (
    <div className="p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Theme System Demo</h1>
        <p className="text-muted-foreground">
          Current theme: <span className="font-semibold">{currentTheme?.displayName}</span>
        </p>
        <p className="text-sm text-muted-foreground">{currentTheme?.description}</p>
      </div>

      <div className="flex justify-center">
        <ThemeSelector />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="font-semibold mb-2">Card Example</h3>
          <p className="text-muted-foreground text-sm">
            This is a card component showing how the theme affects different elements.
          </p>
        </div>

        <div className="bg-primary text-primary-foreground p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Primary Color</h3>
          <p className="text-sm opacity-90">
            This shows the primary color scheme for the current theme.
          </p>
        </div>

        <div className="bg-secondary p-6 rounded-lg border">
          <h3 className="font-semibold mb-2">Secondary Color</h3>
          <p className="text-muted-foreground text-sm">
            This demonstrates the secondary color palette.
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Click the palette icon above to change themes and see the colors update in real-time!
        </p>
      </div>
    </div>
  )
}