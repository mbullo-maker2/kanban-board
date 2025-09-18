'use client'

import React from 'react'
import { useSound } from '@/hooks/use-sound'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Volume2, VolumeX, Music, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

interface SoundSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SoundSettingsDialog({ open, onOpenChange }: SoundSettingsDialogProps) {
  const { settings, updateSettings, playSound } = useSound()

  const handleVolumeChange = (value: number[]) => {
    updateSettings({ volume: value[0] })
  }

  const handleSoundToggle = (sound: keyof typeof settings.sounds) => {
    updateSettings({
      sounds: {
        [sound]: !settings.sounds[sound]
      }
    })
  }

  const testSound = (type: any) => {
    playSound(type)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Sound Settings
          </DialogTitle>
          <DialogDescription>
            Customize sound effects for different actions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Master Enable */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled" className="flex items-center gap-2">
              {settings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Sound Effects
            </Label>
            <Switch
              id="sound-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSettings({ enabled: checked })}
            />
          </div>

          {/* Volume Slider */}
          <motion.div
            animate={{ opacity: settings.enabled ? 1 : 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="volume">Volume: {Math.round(settings.volume * 100)}%</Label>
            <Slider
              id="volume"
              min={0}
              max={1}
              step={0.1}
              value={[settings.volume]}
              onValueChange={handleVolumeChange}
              disabled={!settings.enabled}
              className="w-full"
            />
          </motion.div>

          {/* Individual Sound Settings */}
          <motion.div
            animate={{ opacity: settings.enabled ? 1 : 0.5 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-medium">Individual Sounds</h4>
            
            <div className="space-y-3">
              {/* Task Complete */}
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-complete" className="flex items-center gap-2 flex-1">
                  <Bell className="h-4 w-4 text-green-500" />
                  Task Complete
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => testSound('taskComplete')}
                    disabled={!settings.enabled || !settings.sounds.taskComplete}
                  >
                    Test
                  </Button>
                  <Switch
                    id="sound-complete"
                    checked={settings.sounds.taskComplete}
                    onCheckedChange={() => handleSoundToggle('taskComplete')}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>

              {/* Task Move */}
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-move" className="flex items-center gap-2 flex-1">
                  <Bell className="h-4 w-4 text-blue-500" />
                  Task Move
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => testSound('taskMove')}
                    disabled={!settings.enabled || !settings.sounds.taskMove}
                  >
                    Test
                  </Button>
                  <Switch
                    id="sound-move"
                    checked={settings.sounds.taskMove}
                    onCheckedChange={() => handleSoundToggle('taskMove')}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>

              {/* Task Create */}
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-create" className="flex items-center gap-2 flex-1">
                  <Bell className="h-4 w-4 text-purple-500" />
                  Task Create
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => testSound('taskCreate')}
                    disabled={!settings.enabled || !settings.sounds.taskCreate}
                  >
                    Test
                  </Button>
                  <Switch
                    id="sound-create"
                    checked={settings.sounds.taskCreate}
                    onCheckedChange={() => handleSoundToggle('taskCreate')}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>

              {/* Task Delete */}
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-delete" className="flex items-center gap-2 flex-1">
                  <Bell className="h-4 w-4 text-red-500" />
                  Task Delete
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => testSound('taskDelete')}
                    disabled={!settings.enabled || !settings.sounds.taskDelete}
                  >
                    Test
                  </Button>
                  <Switch
                    id="sound-delete"
                    checked={settings.sounds.taskDelete}
                    onCheckedChange={() => handleSoundToggle('taskDelete')}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>

              {/* Timer Start */}
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-timer-start" className="flex items-center gap-2 flex-1">
                  <Bell className="h-4 w-4 text-yellow-500" />
                  Timer Start
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => testSound('timerStart')}
                    disabled={!settings.enabled || !settings.sounds.timerStart}
                  >
                    Test
                  </Button>
                  <Switch
                    id="sound-timer-start"
                    checked={settings.sounds.timerStart}
                    onCheckedChange={() => handleSoundToggle('timerStart')}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>

              {/* Timer Stop */}
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-timer-stop" className="flex items-center gap-2 flex-1">
                  <Bell className="h-4 w-4 text-orange-500" />
                  Timer Stop
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => testSound('timerStop')}
                    disabled={!settings.enabled || !settings.sounds.timerStop}
                  >
                    Test
                  </Button>
                  <Switch
                    id="sound-timer-stop"
                    checked={settings.sounds.timerStop}
                    onCheckedChange={() => handleSoundToggle('timerStop')}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}