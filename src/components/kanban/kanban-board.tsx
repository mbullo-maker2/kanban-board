'use client'

import React, { useState, useMemo } from 'react'
import { Task, TaskStatus, COLUMN_CONFIG } from '@/types/kanban'
import { mockTasks, generateMockTask } from '@/lib/mock-data'
import { SimpleHeader } from './simple-header'
import { FloatingNavbar } from './floating-navbar'
import { DroppableColumn } from './droppable-column'
import { TaskForm } from './task-form'
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
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [activeTask, setActiveTask] = useState<Task | null>(null)

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

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks

    const query = searchQuery.toLowerCase()
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }, [tasks, searchQuery])

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
  }

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date() : undefined,
          }
        : task
    ))
  }

  const handleArchiveCompleted = () => {
    setTasks(prev => prev.filter(task => task.status !== 'completed'))
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
    setTasks(prev => prev.map(task => 
      task.id === activeTaskId 
        ? {
            ...task,
            status: overColumnId!,
            completedAt: overColumnId === 'completed' ? new Date() : undefined,
          }
        : task
    ))
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
        />

        <TaskForm
          open={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSave={handleSaveTask}
          task={editingTask}
          mode={formMode}
        />

        <DragOverlay dropAnimation={{
          duration: 500,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeTask ? (
            <div className="drag-overlay">
              <div className="bg-card border rounded-xl p-4 shadow-2xl backdrop-blur-sm">
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
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}