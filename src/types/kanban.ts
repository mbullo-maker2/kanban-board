export type TaskStatus = 'new' | 'learning' | 'completed'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  createdAt: Date
  completedAt?: Date
  timeSpent: number // in minutes
  tags: string[]
  notes?: string
}

export interface Column {
  id: TaskStatus
  title: string
  color: string
  tasks: Task[]
}

export interface KanbanBoard {
  columns: Column[]
}

export const COLUMN_CONFIG: Record<TaskStatus, { title: string; color: string; icon: string }> = {
  new: {
    title: 'New',
    color: 'oklch(0.6180 0.0778 65.5444)', // Primary theme color
    icon: 'plus-circle'
  },
  learning: {
    title: 'Learning',
    color: 'oklch(0.7264 0.0581 66.6967)', // Chart-5 theme color
    icon: 'book-open'
  },
  completed: {
    title: 'Completed',
    color: 'oklch(0.4851 0.0570 72.6827)', // Chart-3 theme color
    icon: 'check-circle'
  }
}