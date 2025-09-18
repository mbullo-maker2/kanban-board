import { Task, TaskStatus, TaskPriority } from '@/types/kanban'
import { 
  TaskStats, 
  PriorityDistribution, 
  TagAnalysis, 
  CompletionTrend,
  TimeAnalysis,
  AnalyticsData 
} from '@/types/analytics'

export function calculateTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length
  const completed = tasks.filter(t => t.status === 'completed').length
  const inProgress = tasks.filter(t => t.status === 'learning').length
  const newTasks = tasks.filter(t => t.status === 'new').length
  const completionRate = total > 0 ? (completed / total) * 100 : 0

  // Calculate average time to complete (in days)
  const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt)
  const avgTimeToComplete = completedTasks.length > 0
    ? completedTasks.reduce((sum, task) => {
        const days = task.completedAt 
          ? (task.completedAt.getTime() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24)
          : 0
        return sum + days
      }, 0) / completedTasks.length
    : 0

  // Count overdue tasks
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdueTasks = tasks.filter(t => 
    t.status !== 'completed' && 
    t.dueDate && 
    new Date(t.dueDate) < today
  ).length

  return {
    total,
    completed,
    inProgress,
    new: newTasks,
    completionRate,
    averageTimeToComplete,
    overdueTasks
  }
}

export function calculatePriorityDistribution(tasks: Task[]): PriorityDistribution {
  return {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  }
}

export function calculateTagAnalysis(tasks: Task[]): TagAnalysis[] {
  const tagMap = new Map<string, { count: number; completedCount: number }>()

  tasks.forEach(task => {
    task.tags.forEach(tag => {
      const existing = tagMap.get(tag) || { count: 0, completedCount: 0 }
      existing.count++
      if (task.status === 'completed') {
        existing.completedCount++
      }
      tagMap.set(tag, existing)
    })
  })

  return Array.from(tagMap.entries())
    .map(([tag, data]) => ({
      tag,
      count: data.count,
      completedCount: data.completedCount,
      completionRate: (data.completedCount / data.count) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10 tags
}

export function calculateCompletionTrends(tasks: Task[], days: number = 30): CompletionTrend[] {
  const trends: CompletionTrend[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let cumulativeCompleted = 0

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const completed = tasks.filter(t => 
      t.completedAt && 
      t.completedAt >= date && 
      t.completedAt < nextDate
    ).length

    const created = tasks.filter(t => 
      t.createdAt >= date && 
      t.createdAt < nextDate
    ).length

    cumulativeCompleted += completed

    trends.push({
      date: date.toISOString().split('T')[0],
      completed,
      created,
      cumulative: cumulativeCompleted
    })
  }

  return trends
}

export function calculateTimeAnalysis(tasks: Task[]): TimeAnalysis[] {
  return tasks
    .filter(t => t.timeSpent > 0)
    .map(task => ({
      taskId: task.id,
      title: task.title,
      timeSpent: task.timeSpent,
      status: task.status
    }))
    .sort((a, b) => b.timeSpent - a.timeSpent)
    .slice(0, 10) // Top 10 tasks by time spent
}

export function calculateProductivityScore(tasks: Task[]): number {
  if (tasks.length === 0) return 0

  const stats = calculateTaskStats(tasks)
  const recentTasks = tasks.filter(t => {
    const daysSinceCreation = (Date.now() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceCreation <= 30
  })

  // Factors for productivity score
  const completionFactor = stats.completionRate / 100
  const velocityFactor = recentTasks.length > 0 
    ? recentTasks.filter(t => t.status === 'completed').length / recentTasks.length 
    : 0
  const overdueRatio = stats.total > 0 ? 1 - (stats.overdueTasks / stats.total) : 1
  const timeFactor = stats.averageTimeToComplete > 0 
    ? Math.min(1, 7 / stats.averageTimeToComplete) // Bonus for completing tasks within a week
    : 0

  // Calculate weighted score
  const score = (
    completionFactor * 0.3 +
    velocityFactor * 0.3 +
    overdueRatio * 0.2 +
    timeFactor * 0.2
  ) * 100

  return Math.round(score)
}

export function generateAnalyticsData(tasks: Task[]): AnalyticsData {
  const stats = calculateTaskStats(tasks)
  const priorityDistribution = calculatePriorityDistribution(tasks)
  const topTags = calculateTagAnalysis(tasks)
  const completionTrends = calculateCompletionTrends(tasks)
  const timeAnalysis = calculateTimeAnalysis(tasks)
  
  const tasksByStatus: Record<TaskStatus, number> = {
    new: stats.new,
    learning: stats.inProgress,
    completed: stats.completed
  }

  // Calculate average tasks per day (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentTasks = tasks.filter(t => t.createdAt >= thirtyDaysAgo)
  const averageTasksPerDay = recentTasks.length / 30

  const productivityScore = calculateProductivityScore(tasks)

  return {
    stats,
    priorityDistribution,
    topTags,
    completionTrends,
    timeAnalysis,
    tasksByStatus,
    averageTasksPerDay,
    productivityScore
  }
}