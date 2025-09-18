import { useHotkeys } from 'react-hotkeys-hook'
import { useCallback } from 'react'

interface UseKeyboardShortcutsProps {
  onAddTask: () => void
  onSearch: () => void
  onToggleTheme?: () => void
  onNavigateColumn?: (direction: 'left' | 'right') => void
  onSelectTask?: (direction: 'up' | 'down') => void
  onDeleteTask?: () => void
  onEditTask?: () => void
  onCompleteTask?: () => void
  onArchive?: () => void
}

export function useKeyboardShortcuts({
  onAddTask,
  onSearch,
  onToggleTheme,
  onNavigateColumn,
  onSelectTask,
  onDeleteTask,
  onEditTask,
  onCompleteTask,
  onArchive,
}: UseKeyboardShortcutsProps) {
  // Add new task (Cmd/Ctrl + N)
  useHotkeys('ctrl+n, cmd+n', (e) => {
    e.preventDefault()
    onAddTask()
  }, { enableOnFormTags: false })

  // Search (Cmd/Ctrl + K or /)
  useHotkeys('ctrl+k, cmd+k, /', (e) => {
    e.preventDefault()
    onSearch()
  }, { enableOnFormTags: false })

  // Toggle theme (Cmd/Ctrl + Shift + D)
  useHotkeys('ctrl+shift+d, cmd+shift+d', (e) => {
    e.preventDefault()
    onToggleTheme?.()
  }, { enableOnFormTags: false })

  // Navigate columns (Arrow keys)
  useHotkeys('left', () => onNavigateColumn?.('left'), { enableOnFormTags: false })
  useHotkeys('right', () => onNavigateColumn?.('right'), { enableOnFormTags: false })

  // Select tasks (Up/Down arrows)
  useHotkeys('up', () => onSelectTask?.('up'), { enableOnFormTags: false })
  useHotkeys('down', () => onSelectTask?.('down'), { enableOnFormTags: false })

  // Delete selected task (Delete or Backspace)
  useHotkeys('delete, backspace', (e) => {
    e.preventDefault()
    onDeleteTask?.()
  }, { enableOnFormTags: false })

  // Edit selected task (Enter or E)
  useHotkeys('enter, e', (e) => {
    e.preventDefault()
    onEditTask?.()
  }, { enableOnFormTags: false })

  // Complete selected task (Space or C)
  useHotkeys('space, c', (e) => {
    e.preventDefault()
    onCompleteTask?.()
  }, { enableOnFormTags: false })

  // Archive completed tasks (Cmd/Ctrl + Shift + A)
  useHotkeys('ctrl+shift+a, cmd+shift+a', (e) => {
    e.preventDefault()
    onArchive?.()
  }, { enableOnFormTags: false })

  // Help/Show shortcuts (?)
  useHotkeys('shift+/', () => {
    // This will be handled by a keyboard shortcuts dialog
    console.log('Show keyboard shortcuts')
  }, { enableOnFormTags: false })
}

// Keyboard shortcuts list for help dialog
export const keyboardShortcuts = [
  { keys: ['⌘', 'N'], description: 'Add new task', windows: ['Ctrl', 'N'] },
  { keys: ['⌘', 'K'], description: 'Search tasks', windows: ['Ctrl', 'K'] },
  { keys: ['/'], description: 'Quick search', windows: ['/'] },
  { keys: ['⌘', '⇧', 'D'], description: 'Toggle dark mode', windows: ['Ctrl', 'Shift', 'D'] },
  { keys: ['←', '→'], description: 'Navigate columns', windows: ['←', '→'] },
  { keys: ['↑', '↓'], description: 'Select tasks', windows: ['↑', '↓'] },
  { keys: ['Delete'], description: 'Delete selected task', windows: ['Delete'] },
  { keys: ['Enter'], description: 'Edit selected task', windows: ['Enter'] },
  { keys: ['Space'], description: 'Complete selected task', windows: ['Space'] },
  { keys: ['⌘', '⇧', 'A'], description: 'Archive completed tasks', windows: ['Ctrl', 'Shift', 'A'] },
  { keys: ['?'], description: 'Show keyboard shortcuts', windows: ['?'] },
]