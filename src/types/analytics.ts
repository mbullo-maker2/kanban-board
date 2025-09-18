import { Task, TaskStatus, TaskPriority } from './kanban'

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  new: number
  completionRate: number
  averageTimeToComplete: number // in days
  overdueTasks: number
}

export interface PriorityDistribution {
  high: number
  medium: number
  low: number
}

export interface TagAnalysis {
  tag: string
  count: number
  completedCount: number
  completionRate: number
}

export interface CompletionTrend {
  date: string
  completed: number
  created: number
  cumulative: number
}

export interface TimeAnalysis {
  taskId: string
  title: string
  timeSpent: number // in minutes
  status: TaskStatus
}

export interface AnalyticsData {
  stats: TaskStats
  priorityDistribution: PriorityDistribution
  topTags: TagAnalysis[]
  completionTrends: CompletionTrend[]
  timeAnalysis: TimeAnalysis[]
  tasksByStatus: Record<TaskStatus, number>
  averageTasksPerDay: number
  productivityScore: number
}