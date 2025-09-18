import React from 'react'
import { Badge } from '@/components/ui/badge'
import { FilterPanel } from './filter-panel'

interface SimpleHeaderProps {
  totalTasks: number
  completedTasks: number
  availableTags?: string[]
}

export function SimpleHeader({ totalTasks, completedTasks, availableTags = [] }: SimpleHeaderProps) {
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  return (
    <header className="fixed top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 z-40 bg-card/95 backdrop-blur-sm border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="flex h-14 md:h-16 items-center justify-between px-3 md:px-6">
        {/* Left section - Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">K</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Kanban Board</h1>
              <p className="text-sm text-muted-foreground">Learning Progress Tracker</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold">Kanban</h1>
            </div>
          </div>
        </div>

        {/* Right section - Stats and Filters */}
        <div className="flex items-center gap-4">
          <FilterPanel availableTags={availableTags} />
          <div className="text-right">
            <div className="text-sm text-muted-foreground hidden sm:block">Progress</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{completionPercentage}%</span>
              <Badge variant="outline" className="text-xs">
                {completedTasks}/{totalTasks}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}