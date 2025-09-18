import { Task } from '@/types/kanban'

const STORAGE_KEY = 'kanban-tasks'

// Helper to serialize dates in tasks
export const serializeTasks = (tasks: Task[]): string => {
  return JSON.stringify(tasks)
}

// Helper to deserialize dates in tasks
export const deserializeTasks = (tasksString: string): Task[] => {
  const parsed = JSON.parse(tasksString)
  return parsed.map((task: any) => ({
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    createdAt: new Date(task.createdAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  }))
}

// Migration function to handle any future storage schema changes
export const migrateTaskData = (tasks: Task[]): Task[] => {
  // Add any future migration logic here
  // For now, just return as-is
  return tasks
}

// Export storage key for consistency
export { STORAGE_KEY }