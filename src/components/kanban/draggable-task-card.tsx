import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { Task } from '@/types/kanban'
import { TaskCard } from './task-card'
import { cn } from '@/lib/utils'

interface DraggableTaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onTimeUpdate?: (taskId: string, minutes: number) => void
}

export function DraggableTaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onTimeUpdate 
}: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-none drag-item',
        isDragging && 'is-dragging'
      )}
      {...attributes}
      {...listeners}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onTimeUpdate={onTimeUpdate}
      />
    </div>
  )
}