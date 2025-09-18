'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, SortAsc, Calendar, AlertCircle, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { useFilter, SortOption, FilterOption } from '@/contexts/filter-context'
import { TaskPriority } from '@/types/kanban'

interface FilterPanelProps {
  availableTags: string[]
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'newest', label: 'Newest First', icon: <SortAsc className="h-3 w-3" /> },
  { value: 'oldest', label: 'Oldest First', icon: <SortAsc className="h-3 w-3 rotate-180" /> },
  { value: 'priority', label: 'Priority', icon: <AlertCircle className="h-3 w-3" /> },
  { value: 'dueDate', label: 'Due Date', icon: <Calendar className="h-3 w-3" /> },
  { value: 'alphabetical', label: 'Alphabetical', icon: <SortAsc className="h-3 w-3" /> },
]

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'today', label: 'Due Today' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'high-priority', label: 'High Priority' },
  { value: 'has-notes', label: 'Has Notes' },
]

export function FilterPanel({ availableTags }: FilterPanelProps) {
  const { filters, setSortBy, setFilterBy, setPriorityFilter, setTagFilter, resetFilters } = useFilter()
  const [isExpanded, setIsExpanded] = React.useState(false)

  const hasActiveFilters = 
    filters.filterBy !== 'all' || 
    filters.priorityFilter !== 'all' || 
    filters.tagFilter.length > 0 ||
    filters.sortBy !== 'newest'

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Main Filter Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={hasActiveFilters ? "default" : "outline"} 
              size="sm"
              className="relative"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"
                />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.map(option => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setFilterBy(option.value)}
                className={filters.filterBy === option.value ? 'bg-accent' : ''}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
              <Tags className="h-4 w-4 mr-2" />
              Advanced Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={filters.sortBy === option.value ? 'bg-accent' : ''}
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filters Display */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              {filters.filterBy !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {filterOptions.find(o => o.value === filters.filterBy)?.label}
                </Badge>
              )}
              {filters.priorityFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {filters.priorityFilter} priority
                </Badge>
              )}
              {filters.tagFilter.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 z-50 bg-card border rounded-lg shadow-lg p-4 w-80"
          >
            <h3 className="font-semibold text-sm mb-3">Advanced Filters</h3>
            
            {/* Priority Filter */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-2 block">Priority</label>
              <div className="flex gap-2">
                {(['all', 'high', 'medium', 'low'] as const).map(priority => (
                  <Button
                    key={priority}
                    variant={filters.priorityFilter === priority ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriorityFilter(priority as TaskPriority | 'all')}
                    className="flex-1 text-xs"
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-1">
                {availableTags.map(tag => (
                  <Button
                    key={tag}
                    variant={filters.tagFilter.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (filters.tagFilter.includes(tag)) {
                        setTagFilter(filters.tagFilter.filter(t => t !== tag))
                      } else {
                        setTagFilter([...filters.tagFilter, tag])
                      }
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
              >
                Reset All
              </Button>
              <Button
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Apply
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}