'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Task, TaskStatus, COLUMN_CONFIG } from '@/types/kanban'
import { mockTasks, generateMockTask } from '@/lib/mock-data'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { STORAGE_KEY, serializeTasks, deserializeTasks, migrateTaskData } from '@/lib/storage'
import { SimpleHeader } from './simple-header'
import { FloatingNavbar } from './floating-navbar'
import { DroppableColumn } from './droppable-column'
import { TaskForm } from './task-form'
import { CompletionCelebration } from './completion-celebration'
import { KeyboardShortcutsDialog } from './keyboard-shortcuts-dialog'
import { ExportImportDialog } from './export-import-dialog'
import { SoundSettingsDialog } from './sound-settings-dialog'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useSound } from '@/hooks/use-sound'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTheme } from '@/contexts/theme-context'
import { useFilter } from '@/contexts/filter-context'
import { FilterPanel } from './filter-panel'
import { motion } from 'framer-motion'
import { 
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  closestCenter,
  rectIntersection,
} from '@dnd-kit/core'

export function KanbanBoard() {
  // Use local storage for tasks with mock data as initial value
  const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>(
    STORAGE_KEY,
    mockTasks,
    {
      serializer: serializeTasks,
      deserializer: deserializeTasks,
    }
  )
  
  // Initialize tasks with stored data, applying any necessary migrations
  const [tasks, setTasksState] = useState<Task[]>(() => migrateTaskData(storedTasks))
  const [searchQuery, setSearchQuery] = useState('')
  
  // Wrapper for setTasks that also updates local storage
  const setTasks = (newTasks: Task[] | ((prev: Task[]) => Task[])) => {
    setTasksState(newTasks)
    if (typeof newTasks === 'function') {
      setStoredTasks((prev) => newTasks(prev))
    } else {
      setStoredTasks(newTasks)
    }
  }
  
  // Sync tasks with storage when they change
  useEffect(() => {
    setStoredTasks(tasks)
  }, [tasks, setStoredTasks])
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showExportImport, setShowExportImport] = useState(false)
  const [showSoundSettings, setShowSoundSettings] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus>('new')
  const { theme } = useTheme()
  const { filters } = useFilter()
  const { playSound } = useSound()

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px to prevent accidental drags
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Reduced delay for better responsiveness
        tolerance: 5,
      },
    })
  )

  // Get all available tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    tasks.forEach(task => task.tags.forEach(tag => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [tasks])

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply quick filters
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    switch (filters.filterBy) {
      case 'today':
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() === today.getTime()
        })
        break
      case 'overdue':
        filtered = filtered.filter(task => {
          if (!task.dueDate || task.status === 'completed') return false
          return new Date(task.dueDate) < today
        })
        break
      case 'high-priority':
        filtered = filtered.filter(task => task.priority === 'high')
        break
      case 'has-notes':
        filtered = filtered.filter(task => task.notes && task.notes.trim() !== '')
        break
    }

    // Apply priority filter
    if (filters.priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priorityFilter)
    }

    // Apply tag filter
    if (filters.tagFilter.length > 0) {
      filtered = filtered.filter(task => 
        filters.tagFilter.some(tag => task.tags.includes(tag))
      )
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        break
      case 'dueDate':
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    return filtered
  }, [tasks, searchQuery, filters])

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      new: [],
      learning: [],
      completed: []
    }

    filteredTasks.forEach(task => {
      // Ensure the task has a valid status before pushing
      if (task.status && grouped[task.status]) {
        grouped[task.status].push(task)
      }
    })

    // Sort tasks within each column
    Object.keys(grouped).forEach(status => {
      grouped[status as TaskStatus].sort((a, b) => {
        // Sort by priority first, then by creation date
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const aPriority = priorityOrder[a.priority]
        const bPriority = priorityOrder[b.priority]
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority // High priority first
        }
        
        return b.createdAt.getTime() - a.createdAt.getTime() // Most recent first
      })
    })

    return grouped
  }, [filteredTasks])

  const handleAddTask = () => {
    setFormMode('create')
    setEditingTask(null)
    setIsTaskFormOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setFormMode('edit')
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'timeSpent' | 'completedAt'>) => {
    if (formMode === 'create') {
      const newTask: Task = {
        ...generateMockTask(taskData),
        ...taskData,
      }
      setTasks(prev => [...prev, newTask])
      playSound('taskCreate')
    } else if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? {
              ...task,
              ...taskData,
              // Update completion date if status changed to completed
              completedAt: taskData.status === 'completed' && task.status !== 'completed' 
                ? new Date() 
                : task.completedAt,
            }
          : task
      ))
    }
    setIsTaskFormOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    playSound('taskDelete')
  }

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const previousTask = tasks.find(t => t.id === taskId)
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date() : undefined,
          }
        : task
    ))
    
    // Show celebration when a task is marked as completed
    if (previousTask && previousTask.status !== 'completed' && newStatus === 'completed') {
      setShowCelebration(true)
      playSound('taskComplete')
    } else if (previousTask && previousTask.status !== newStatus) {
      playSound('taskMove')
    }
  }

  const handleTimeUpdate = (taskId: string, minutes: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, timeSpent: minutes }
        : task
    ))
  }

  const handleArchiveCompleted = () => {
    setTasks(prev => prev.filter(task => task.status !== 'completed'))
  }

  const handleImportTasks = (importedTasks: Task[]) => {
    setTasks(importedTasks)
  }

  // Drag and Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = filteredTasks.find(t => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeTaskId = active.id as string
    let overColumnId: TaskStatus | null = null

    // Check if we're over a column directly or over a task in a column
    if (['new', 'learning', 'completed'].includes(over.id as string)) {
      overColumnId = over.id as TaskStatus
    } else {
      // If over a task, find which column it belongs to
      const overTask = tasks.find(task => task.id === over.id)
      if (overTask) {
        overColumnId = overTask.status
      }
    }

    if (!overColumnId) return

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeTaskId)
    if (!activeTask || activeTask.status === overColumnId) return

    // Update task status when moving to different column
    const previousStatus = activeTask.status
    setTasks(prev => prev.map(task => 
      task.id === activeTaskId 
        ? {
            ...task,
            status: overColumnId!,
            completedAt: overColumnId === 'completed' ? new Date() : undefined,
          }
        : task
    ))
    
    // Show celebration when dragging to completed
    if (previousStatus !== 'completed' && overColumnId === 'completed') {
      setShowCelebration(true)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    setActiveTask(null)

    if (!over) return

    const activeTaskId = active.id as string
    let finalColumnId: TaskStatus | null = null

    // Determine final column
    if (['new', 'learning', 'completed'].includes(over.id as string)) {
      finalColumnId = over.id as TaskStatus
    } else {
      const overTask = tasks.find(task => task.id === over.id)
      if (overTask) {
        finalColumnId = overTask.status
      }
    }

    if (!finalColumnId) return

    // Final update to ensure task is in correct column
    setTasks(prev => prev.map(task => 
      task.id === activeTaskId 
        ? {
            ...task,
            status: finalColumnId!,
            completedAt: finalColumnId === 'completed' ? new Date() : undefined,
          }
        : task
    ))
  }

  // Calculate totals for header
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'completed').length

  // Keyboard shortcuts
  useHotkeys('shift+/', () => setShowKeyboardShortcuts(true), { enableOnFormTags: false })

  useKeyboardShortcuts({
    onAddTask: handleAddTask,
    onSearch: () => {
      const searchButton = document.querySelector('[data-search-trigger]') as HTMLElement
      searchButton?.click()
    },
    onToggleTheme: () => {
      // Theme toggle is now handled by the theme selector component
      // This is kept for keyboard shortcut compatibility but does nothing
    },
    onNavigateColumn: (direction) => {
      const columns: TaskStatus[] = ['new', 'learning', 'completed']
      const currentIndex = columns.indexOf(selectedColumn)
      if (direction === 'left' && currentIndex > 0) {
        setSelectedColumn(columns[currentIndex - 1])
      } else if (direction === 'right' && currentIndex < columns.length - 1) {
        setSelectedColumn(columns[currentIndex + 1])
      }
    },
    onSelectTask: (direction) => {
      const columnTasks = tasksByStatus[selectedColumn]
      if (columnTasks.length === 0) return
      
      const currentIndex = selectedTaskId 
        ? columnTasks.findIndex(t => t.id === selectedTaskId)
        : -1
        
      if (direction === 'up' && currentIndex > 0) {
        setSelectedTaskId(columnTasks[currentIndex - 1].id)
      } else if (direction === 'down' && (currentIndex < columnTasks.length - 1 || currentIndex === -1)) {
        setSelectedTaskId(columnTasks[currentIndex + 1].id)
      }
    },
    onDeleteTask: () => {
      if (selectedTaskId) {
        handleDeleteTask(selectedTaskId)
        setSelectedTaskId(null)
      }
    },
    onEditTask: () => {
      if (selectedTaskId) {
        const task = tasks.find(t => t.id === selectedTaskId)
        if (task) handleEditTask(task)
      }
    },
    onCompleteTask: () => {
      if (selectedTaskId) {
        handleTaskStatusChange(selectedTaskId, 'completed')
        setSelectedTaskId(null)
      }
    },
    onArchive: handleArchiveCompleted,
  })

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-background">
        <SimpleHeader 
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          availableTags={availableTags}
        />
        
        <main className="flex-1 overflow-hidden pt-20 md:pt-24 pb-20 md:pb-24">
          <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
            {(Object.keys(COLUMN_CONFIG) as TaskStatus[]).map(status => (
              <div
                key={status}
                className="flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden"
                style={{
                  borderTopColor: COLUMN_CONFIG[status].color,
                  borderTopWidth: '3px',
                }}
              >
                <DroppableColumn
                  status={status}
                  tasks={tasksByStatus[status]}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onTaskStatusChange={handleTaskStatusChange}
                  onTimeUpdate={handleTimeUpdate}
                  onArchive={status === 'completed' ? handleArchiveCompleted : undefined}
                />
              </div>
            ))}
          </div>
        </main>

        <FloatingNavbar
          onAddTask={handleAddTask}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onExportImport={() => setShowExportImport(true)}
          onSoundSettings={() => setShowSoundSettings(true)}
        />

        <TaskForm
          open={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSave={handleSaveTask}
          task={editingTask}
          mode={formMode}
        />

        <DragOverlay 
          dropAnimation={{
            duration: 500,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
          modifiers={[
            // Add custom modifier for smoother drag
            {
              active: {
                onDragStart: () => {
                  document.body.style.cursor = 'grabbing'
                },
                onDragEnd: () => {
                  document.body.style.cursor = ''
                }
              }
            }
          ]}
        >
          {activeTask ? (
            <motion.div 
              className="drag-overlay"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div 
                className="bg-card/95 backdrop-blur-md border-2 border-primary/20 rounded-xl p-4 shadow-2xl"
                animate={{
                  rotate: [0, -2, 2, -2, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <div className="relative">
                    <div className="font-semibold text-sm mb-1">{activeTask.title}</div>
                    {activeTask.description && (
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {activeTask.description}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {activeTask.priority}
                      </div>
                      {activeTask.tags.slice(0, 2).map((tag) => (
                        <div key={tag} className="text-xs px-2 py-1 bg-secondary rounded-full">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </DragOverlay>

        <CompletionCelebration 
          show={showCelebration} 
          onComplete={() => setShowCelebration(false)}
        />

        <KeyboardShortcutsDialog
          open={showKeyboardShortcuts}
          onOpenChange={setShowKeyboardShortcuts}
        />

        <ExportImportDialog
          open={showExportImport}
          onOpenChange={setShowExportImport}
          tasks={tasks}
          onImport={handleImportTasks}
        />

        <SoundSettingsDialog
          open={showSoundSettings}
          onOpenChange={setShowSoundSettings}
        />
      </div>
    </DndContext>
  )
}