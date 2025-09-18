'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useTheme, THEMES, type Theme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'

interface ThemeSelectorProps {
  className?: string
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("rounded-full", className)}>
          <Palette className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Choose Theme
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {Object.values(THEMES).map((themeConfig) => (
            <ThemeOption
              key={themeConfig.name}
              themeConfig={themeConfig}
              isSelected={theme === themeConfig.name}
              onSelect={() => handleThemeSelect(themeConfig.name as Theme)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ThemeOptionProps {
  themeConfig: typeof THEMES[keyof typeof THEMES]
  isSelected: boolean
  onSelect: () => void
}

function ThemeOption({ themeConfig, isSelected, onSelect }: ThemeOptionProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        "relative p-4 rounded-lg border-2 transition-all duration-200",
        "hover:scale-105 hover:shadow-md",
        isSelected 
          ? "border-primary shadow-md" 
          : "border-border hover:border-primary/50"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Theme Preview */}
      <div className="space-y-2 mb-3">
        {/* Header bar */}
        <div 
          className="h-3 rounded-sm"
          style={{ backgroundColor: themeConfig.colors.primary }}
        />
        
        {/* Content area */}
        <div className="space-y-1">
          <div 
            className="h-2 rounded-sm"
            style={{ backgroundColor: themeConfig.colors.card }}
          />
          <div 
            className="h-2 rounded-sm w-3/4"
            style={{ backgroundColor: themeConfig.colors.secondary }}
          />
          <div 
            className="h-2 rounded-sm w-1/2"
            style={{ backgroundColor: themeConfig.colors.accent }}
          />
        </div>
      </div>

      {/* Theme Info */}
      <div className="text-left">
        <div className="font-medium text-sm">{themeConfig.displayName}</div>
        <div className="text-xs text-muted-foreground">{themeConfig.description}</div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        </motion.div>
      )}
    </motion.button>
  )
}