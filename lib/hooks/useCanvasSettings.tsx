"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface CanvasSettings {
  width: 'full' | 'auto' | number
  height: 'auto' | number
  borderRadius: number
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  borderWidth: number
  borderColor: string
}

interface CanvasSettingsContextType {
  settings: CanvasSettings
  updateSettings: (updates: Partial<CanvasSettings>) => void
  resetSettings: () => void
}

const defaultSettings: CanvasSettings = {
  width: 'full',
  height: 600,
  borderRadius: 8,
  shadow: 'md',
  borderWidth: 1,
  borderColor: '#e5e7eb',
}

const CanvasSettingsContext = createContext<CanvasSettingsContextType | undefined>(undefined)

export function CanvasSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CanvasSettings>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('canvasSettings')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return defaultSettings
        }
      }
    }
    return defaultSettings
  })

  const updateSettings = (updates: Partial<CanvasSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates }
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('canvasSettings', JSON.stringify(newSettings))
      }
      return newSettings
    })
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('canvasSettings')
    }
  }

  return (
    <CanvasSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </CanvasSettingsContext.Provider>
  )
}

export function useCanvasSettings() {
  const context = useContext(CanvasSettingsContext)
  if (context === undefined) {
    throw new Error("useCanvasSettings must be used within a CanvasSettingsProvider")
  }
  return context
}
