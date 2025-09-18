import { useCallback, useEffect, useRef } from 'react'
import { useLocalStorage } from './use-local-storage'

export interface SoundSettings {
  enabled: boolean
  volume: number // 0-1
  sounds: {
    taskComplete: boolean
    taskMove: boolean
    taskCreate: boolean
    taskDelete: boolean
    timerStart: boolean
    timerStop: boolean
  }
}

const DEFAULT_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.5,
  sounds: {
    taskComplete: true,
    taskMove: true,
    taskCreate: true,
    taskDelete: true,
    timerStart: true,
    timerStop: true
  }
}

// Sound URLs - These will be generated dynamically
const SOUNDS: Record<SoundType, string> = {
  taskComplete: '',
  taskMove: '',
  taskCreate: '',
  taskDelete: '',
  timerStart: '',
  timerStop: ''
}

export type SoundType = keyof typeof SOUNDS

export function useSound() {
  const [settings, setSettings] = useLocalStorage<SoundSettings>('sound-settings', DEFAULT_SETTINGS)
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({} as any)

  // Initialize audio elements with generated sounds
  useEffect(() => {
    // Generate sounds if running in browser
    if (typeof window !== 'undefined') {
      SOUNDS.taskComplete = createSound('complete')
      SOUNDS.taskMove = createSound('move')
      SOUNDS.taskCreate = createSound('create')
      SOUNDS.taskDelete = createSound('delete')
      SOUNDS.timerStart = createSound('start')
      SOUNDS.timerStop = createSound('stop')
      
      Object.entries(SOUNDS).forEach(([key, url]) => {
        const audio = new Audio(url)
        audio.volume = settings.volume
        audioRefs.current[key as SoundType] = audio
      })
    }

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause()
          audio.src = ''
        }
      })
    }
  }, [])

  // Update volume when settings change
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = settings.volume
      }
    })
  }, [settings.volume])

  const playSound = useCallback((type: SoundType) => {
    if (!settings.enabled || !settings.sounds[type]) return

    const audio = audioRefs.current[type]
    if (audio) {
      // Reset the audio to start
      audio.currentTime = 0
      // Play the sound
      audio.play().catch(error => {
        console.warn('Failed to play sound:', error)
      })
    }
  }, [settings])

  const updateSettings = useCallback((updates: Partial<SoundSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates,
      sounds: {
        ...prev.sounds,
        ...(updates.sounds || {})
      }
    }))
  }, [setSettings])

  return {
    playSound,
    settings,
    updateSettings
  }
}

// Create actual sound files with Web Audio API
export function createSound(type: 'complete' | 'move' | 'create' | 'delete' | 'start' | 'stop'): string {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const sampleRate = audioContext.sampleRate
  
  let frequency = 440
  let duration = 0.1
  let fadeIn = 0.01
  let fadeOut = 0.05
  
  switch (type) {
    case 'complete':
      frequency = 880
      duration = 0.2
      break
    case 'move':
      frequency = 660
      duration = 0.05
      break
    case 'create':
      frequency = 523.25
      duration = 0.15
      break
    case 'delete':
      frequency = 329.63
      duration = 0.1
      break
    case 'start':
      frequency = 587.33
      duration = 0.1
      break
    case 'stop':
      frequency = 493.88
      duration = 0.15
      break
  }
  
  const samples = duration * sampleRate
  const fadeInSamples = fadeIn * sampleRate
  const fadeOutSamples = fadeOut * sampleRate
  
  const buffer = audioContext.createBuffer(1, samples, sampleRate)
  const data = buffer.getChannelData(0)
  
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate
    let amplitude = 0.3
    
    // Apply fade in
    if (i < fadeInSamples) {
      amplitude *= i / fadeInSamples
    }
    // Apply fade out
    else if (i > samples - fadeOutSamples) {
      amplitude *= (samples - i) / fadeOutSamples
    }
    
    // Generate sine wave
    data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t)
    
    // Add harmonics for richer sound
    if (type === 'complete') {
      data[i] += amplitude * 0.3 * Math.sin(2 * Math.PI * frequency * 2 * t)
      data[i] += amplitude * 0.1 * Math.sin(2 * Math.PI * frequency * 3 * t)
    }
  }
  
  // Convert to WAV
  const length = samples * 2 + 44
  const arrayBuffer = new ArrayBuffer(length)
  const view = new DataView(arrayBuffer)
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  writeString(0, 'RIFF')
  view.setUint32(4, length - 8, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, samples * 2, true)
  
  // Convert float samples to 16-bit PCM
  let offset = 44
  for (let i = 0; i < samples; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]))
    view.setInt16(offset, sample * 0x7FFF, true)
    offset += 2
  }
  
  // Convert to base64
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  
  return 'data:audio/wav;base64,' + btoa(binary)
}