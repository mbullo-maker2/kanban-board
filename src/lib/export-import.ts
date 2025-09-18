import { Task } from '@/types/kanban'

export interface ExportData {
  version: string
  exportDate: string
  tasks: Task[]
}

export function exportTasks(tasks: Task[]): string {
  const exportData: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    tasks: tasks
  }
  
  return JSON.stringify(exportData, null, 2)
}

export function downloadJSON(data: string, filename: string) {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadCSV(tasks: Task[], filename: string) {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Created At', 'Completed At', 'Time Spent (min)', 'Tags', 'Notes']
  
  const rows = tasks.map(task => [
    task.id,
    `"${task.title.replace(/"/g, '""')}"`,
    `"${task.description.replace(/"/g, '""')}"`,
    task.status,
    task.priority,
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    new Date(task.createdAt).toISOString(),
    task.completedAt ? new Date(task.completedAt).toISOString() : '',
    task.timeSpent.toString(),
    `"${task.tags.join(', ')}"`,
    task.notes ? `"${task.notes.replace(/"/g, '""')}"` : ''
  ])
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function importTasks(file: File): Promise<Task[]> {
  const text = await file.text()
  
  try {
    const data = JSON.parse(text) as ExportData
    
    // Validate structure
    if (!data.version || !data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('Invalid file format')
    }
    
    // Convert dates back to Date objects
    const tasks = data.tasks.map(task => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }))
    
    return tasks
  } catch (error) {
    throw new Error('Failed to parse import file. Please ensure it\'s a valid JSON export.')
  }
}

export function validateImportedTasks(tasks: Task[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  tasks.forEach((task, index) => {
    if (!task.id) errors.push(`Task ${index + 1}: Missing ID`)
    if (!task.title) errors.push(`Task ${index + 1}: Missing title`)
    if (!task.status) errors.push(`Task ${index + 1}: Missing status`)
    if (!task.priority) errors.push(`Task ${index + 1}: Missing priority`)
    if (!task.createdAt) errors.push(`Task ${index + 1}: Missing creation date`)
    if (!Array.isArray(task.tags)) errors.push(`Task ${index + 1}: Invalid tags`)
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}