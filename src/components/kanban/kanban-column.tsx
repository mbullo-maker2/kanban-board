import React from 'react'
import { Plus, Archive, TrendingUp } from 'lucide-react'
import { Task, TaskStatus, COLUMN_CONFIG } from '@/types/kanban'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TaskCard } from './task-card'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask?: () => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void
  onArchive?: () => void
}

export function KanbanColumn({ 
  status, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onTaskStatusChange,
  onArchive 
}: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status]
  
  const getProgressStats = () => {
    if (status !== 'learning') return null
    
    const totalTasks = tasks.length
    if (totalTasks === 0) return null
    
    const avgProgress = tasks.reduce((acc, task) => {
      const progress = task.timeSpent > 0 ? Math.min((task.timeSpent / 240) * 100, 95) : 10
      return acc + progress
    }, 0) / totalTasks
    
    return avgProgress
  }

  const progressStats = getProgressStats()

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex flex-col gap-3 p-4 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">{config.title}</h2>
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            {status === 'new' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onAddTask}
                className="h-8 px-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            )}
            
            {status === 'completed' && tasks.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onArchive}
                className="h-8 px-2"
              >
                <Archive className="h-3 w-3 mr-1" />
                Archive
              </Button>
            )}
          </div>
        </div>

        {/* Progress indicator for Learning column */}
        {status === 'learning' && progressStats !== null && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Average Progress
              </span>
              <span>{Math.round(progressStats)}%</span>
            </div>
            <Progress value={progressStats} className="h-2" />
          </div>
        )}
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
            <div className="text-sm">No tasks yet</div>
            {status === 'new' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onAddTask}
                className="mt-2 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Create your first task
              </Button>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onTaskStatusChange}
            />
          ))
        )}
      </div>
    </div>
  )
}