import { Task, TaskStatus, TaskPriority } from '@/types/kanban'

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Learn React Hooks',
    description: 'Deep dive into useState, useEffect, and custom hooks',
    status: 'new',
    priority: 'high',
    dueDate: new Date('2025-01-30'),
    createdAt: new Date('2025-01-15'),
    timeSpent: 0,
    tags: ['react', 'javascript', 'frontend'],
  },
  {
    id: '2',
    title: 'Build Kanban Board',
    description: 'Create a drag-and-drop kanban board with React and TypeScript',
    status: 'learning',
    priority: 'high',
    dueDate: new Date('2025-01-25'),
    createdAt: new Date('2025-01-10'),
    timeSpent: 120, // 2 hours
    tags: ['react', 'typescript', 'project'],
    notes: 'Making good progress, implemented basic card structure'
  },
  {
    id: '3',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2025-01-20'),
    createdAt: new Date('2025-01-05'),
    completedAt: new Date('2025-01-18'),
    timeSpent: 240, // 4 hours
    tags: ['devops', 'github', 'automation'],
  },
  {
    id: '4',
    title: 'Study TypeScript Generics',
    description: 'Understand advanced TypeScript concepts and generic types',
    status: 'new',
    priority: 'medium',
    createdAt: new Date('2025-01-16'),
    timeSpent: 0,
    tags: ['typescript', 'learning'],
  },
  {
    id: '5',
    title: 'Implement User Authentication',
    description: 'Add login/logout functionality with JWT tokens',
    status: 'learning',
    priority: 'high',
    dueDate: new Date('2025-02-01'),
    createdAt: new Date('2025-01-12'),
    timeSpent: 180, // 3 hours
    tags: ['auth', 'security', 'backend'],
    notes: 'JWT implementation is working, need to add refresh tokens'
  },
  {
    id: '6',
    title: 'Write Unit Tests',
    description: 'Add comprehensive test coverage for component library',
    status: 'completed',
    priority: 'low',
    createdAt: new Date('2025-01-08'),
    completedAt: new Date('2025-01-14'),
    timeSpent: 300, // 5 hours
    tags: ['testing', 'jest', 'quality'],
  }
]

export const generateMockTask = (overrides?: Partial<Task>): Task => {
  const id = Math.random().toString(36).substr(2, 9)
  const now = new Date()
  
  return {
    id,
    title: 'New Task',
    description: 'Task description',
    status: 'new',
    priority: 'medium',
    createdAt: now,
    timeSpent: 0,
    tags: [],
    ...overrides,
  }
}