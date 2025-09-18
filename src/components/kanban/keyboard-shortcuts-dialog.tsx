'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Keyboard, Command } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { keyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ 
  open, 
  onOpenChange 
}: KeyboardShortcutsDialogProps) {
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these handy shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {keyboardShortcuts.map((shortcut, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <span className="text-sm font-medium">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {(isMac ? shortcut.keys : shortcut.windows).map((key, keyIndex) => (
                  <Badge
                    key={keyIndex}
                    variant="secondary"
                    className="font-mono text-xs px-2 py-1 min-w-[32px] text-center"
                  >
                    {key === '⌘' ? <Command className="h-3 w-3" /> : key}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Press <Badge variant="secondary" className="mx-1 font-mono text-xs">?</Badge> 
            anytime to show this help
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}