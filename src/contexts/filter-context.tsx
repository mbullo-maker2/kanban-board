'use client'

import React, { createContext, useContext, useState } from 'react'
import { TaskPriority } from '@/types/kanban'

export type SortOption = 'newest' | 'oldest' | 'priority' | 'dueDate' | 'alphabetical'
export type FilterOption = 'all' | 'today' | 'overdue' | 'high-priority' | 'has-notes'

interface FilterState {
  sortBy: SortOption
  filterBy: FilterOption
  priorityFilter: TaskPriority | 'all'
  tagFilter: string[]
}

interface FilterContextType {
  filters: FilterState
  setSortBy: (sort: SortOption) => void
  setFilterBy: (filter: FilterOption) => void
  setPriorityFilter: (priority: TaskPriority | 'all') => void
  setTagFilter: (tags: string[]) => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  sortBy: 'newest',
  filterBy: 'all',
  priorityFilter: 'all',
  tagFilter: []
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const setSortBy = (sort: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy: sort }))
  }

  const setFilterBy = (filter: FilterOption) => {
    setFilters(prev => ({ ...prev, filterBy: filter }))
  }

  const setPriorityFilter = (priority: TaskPriority | 'all') => {
    setFilters(prev => ({ ...prev, priorityFilter: priority }))
  }

  const setTagFilter = (tags: string[]) => {
    setFilters(prev => ({ ...prev, tagFilter: tags }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <FilterContext.Provider value={{
      filters,
      setSortBy,
      setFilterBy,
      setPriorityFilter,
      setTagFilter,
      resetFilters
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}