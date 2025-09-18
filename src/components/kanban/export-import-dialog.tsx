'use client'

import React, { useState } from 'react'
import { Task } from '@/types/kanban'
import { 
  exportTasks, 
  downloadJSON, 
  downloadCSV, 
  importTasks, 
  validateImportedTasks 
} from '@/lib/export-import'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Download, 
  Upload, 
  FileJson, 
  FileSpreadsheet, 
  AlertCircle,
  CheckCircle2,
  FileUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ExportImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tasks: Task[]
  onImport: (tasks: Task[]) => void
}

export function ExportImportDialog({ 
  open, 
  onOpenChange, 
  tasks, 
  onImport 
}: ExportImportDialogProps) {
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleExportJSON = () => {
    const data = exportTasks(tasks)
    const filename = `kanban-tasks-${new Date().toISOString().split('T')[0]}.json`
    downloadJSON(data, filename)
  }

  const handleExportCSV = () => {
    const filename = `kanban-tasks-${new Date().toISOString().split('T')[0]}.csv`
    downloadCSV(tasks, filename)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImportError(null)
      setImportSuccess(false)
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return

    try {
      const importedTasks = await importTasks(selectedFile)
      const validation = validateImportedTasks(importedTasks)
      
      if (!validation.valid) {
        setImportError(validation.errors.join('\n'))
        return
      }

      onImport(importedTasks)
      setImportSuccess(true)
      setSelectedFile(null)
      
      // Close dialog after successful import
      setTimeout(() => {
        onOpenChange(false)
        setImportSuccess(false)
      }, 1500)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import tasks')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export / Import Tasks</DialogTitle>
          <DialogDescription>
            Export your tasks to backup or share, or import tasks from a previous export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Export Tasks</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleExportJSON}
                className="justify-start"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="justify-start"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} will be exported
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Import Tasks</h3>
            <div className="space-y-2">
              <Label htmlFor="import-file" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <FileUp className="h-8 w-8 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </div>
                    <p className="text-xs text-muted-foreground">JSON files only</p>
                  </div>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </Label>

              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <span className="text-sm truncate">{selectedFile.name}</span>
                  <Button
                    size="sm"
                    onClick={handleImport}
                    disabled={importSuccess}
                  >
                    {importSuccess ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Imported
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              <AnimatePresence>
                {importError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2 p-2 bg-destructive/10 text-destructive rounded-md">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm whitespace-pre-line">{importError}</p>
                    </div>
                  </motion.div>
                )}

                {importSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 p-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <p className="text-sm">Tasks imported successfully!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-xs text-muted-foreground">
              Importing will replace all existing tasks
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}