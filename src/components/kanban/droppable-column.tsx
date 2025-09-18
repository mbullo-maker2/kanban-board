import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { 
  SortableContext, 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'framer-motion'
import { Task, TaskStatus, COLUMN_CONFIG } from '@/types/kanban'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Plus, Archive, TrendingUp } from 'lucide-react'
import { DraggableTaskCard } from './draggable-task-card'
import { cn } from '@/lib/utils'

interface DroppableColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask?: () => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void
  onTimeUpdate?: (taskId: string, minutes: number) => void
  onArchive?: () => void
}

export function DroppableColumn({ 
  status, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onTaskStatusChange,
  onTimeUpdate,
  onArchive 
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

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
  const taskIds = tasks.map(task => task.id)

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex flex-col gap-3 p-4 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">{config.title}</h2>
            <motion.div
              key={tasks.length}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <Badge variant="secondary" className="text-xs">
                {tasks.length}
              </Badge>
            </motion.div>
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
      <div 
        ref={setNodeRef}
        className={cn(
          'flex-1 p-4 space-y-3 overflow-y-auto min-h-[200px] custom-scrollbar drop-zone',
          isOver && 'is-over'
        )}
      >
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
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    layout: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                  className="stagger-item"
                >
                  <DraggableTaskCard
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onTaskStatusChange}
                    onTimeUpdate={onTimeUpdate}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>
        )}
      </div>
    </div>
  )
}