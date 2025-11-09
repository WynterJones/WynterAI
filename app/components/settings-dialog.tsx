'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DropdownMenuItem as DialogDropdownMenuItem } from '@/components/ui/dropdown-menu'
import { SettingsIcon, ChevronDownIcon, CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { Settings, ModelType, useSettings } from '../../lib/hooks/useSettings'
import { useAuth } from '../../lib/hooks/useAuth'

interface SettingsDialogProps {
  trigger?: React.ReactNode
}

export default function SettingsDialog({ trigger }: SettingsDialogProps) {
  const { settings, updateSettings } = useSettings()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [tempSettings, setTempSettings] = useState<Settings>(settings)
  const [vercelToken, setVercelToken] = useState('')
  const [v0ApiKey, setV0ApiKey] = useState('')
  const [showVercelToken, setShowVercelToken] = useState(false)
  const [showV0ApiKey, setShowV0ApiKey] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      // Reset temp settings when opening
      setTempSettings(settings)
      setVercelToken('')
      setV0ApiKey('')
      setShowVercelToken(false)
      setShowV0ApiKey(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Update settings
      updateSettings(tempSettings)

      // Update tokens if provided
      if (user && (vercelToken || v0ApiKey)) {
        const response = await fetch('/api/auth/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...(vercelToken && { vercel_token: vercelToken }),
            ...(v0ApiKey && { v0_api_key: v0ApiKey }),
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update tokens')
        }
      }

      setOpen(false)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setTempSettings(settings)
    setVercelToken('')
    setV0ApiKey('')
    setOpen(false)
  }

  const modelOptions = [
    {
      value: 'v0-1.5-sm' as ModelType,
      label: 'v0-1.5-sm',
      description: 'Fast and efficient for simple apps',
    },
    {
      value: 'v0-1.5-md' as ModelType,
      label: 'v0-1.5-md',
      description: 'Balanced performance and quality (default)',
    },
    {
      value: 'v0-1.5-lg' as ModelType,
      label: 'v0-1.5-lg',
      description: 'Best quality for complex applications',
    },
  ]

  const currentModel = modelOptions.find(
    (option) => option.value === tempSettings.model,
  )

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      aria-label="Settings"
    >
      <SettingsIcon className="h-4 w-4" />
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your preferences for app generation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Model Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Model</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="font-medium">{currentModel?.label}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[400px]">
                {modelOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() =>
                      setTempSettings({
                        ...tempSettings,
                        model: option.value,
                      })
                    }
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </div>
                      {tempSettings.model === option.value && (
                        <CheckIcon className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Image Generations */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium">Image Generations</h3>
              <p className="text-xs text-muted-foreground">
                Enable AI-generated images in your apps
              </p>
            </div>
            <Switch
              checked={tempSettings.imageGenerations}
              onCheckedChange={(checked) =>
                setTempSettings({
                  ...tempSettings,
                  imageGenerations: checked,
                })
              }
            />
          </div>

          {/* Thinking */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium">Thinking</h3>
              <p className="text-xs text-muted-foreground">
                Show AI reasoning process during generation
              </p>
            </div>
            <Switch
              checked={tempSettings.thinking}
              onCheckedChange={(checked) =>
                setTempSettings({
                  ...tempSettings,
                  thinking: checked,
                })
              }
            />
          </div>

          {/* API Tokens Section */}
          <div className="border-t pt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">API Tokens</h3>
              <p className="text-xs text-muted-foreground">
                Update your API keys (leave blank to keep existing)
              </p>
            </div>

            {/* Vercel Token */}
            <div className="space-y-2">
              <Label htmlFor="vercel-token" className="text-sm">
                Vercel Token
              </Label>
              <div className="relative">
                <Input
                  id="vercel-token"
                  type={showVercelToken ? 'text' : 'password'}
                  placeholder="Enter new Vercel token..."
                  value={vercelToken}
                  onChange={(e) => setVercelToken(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowVercelToken(!showVercelToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showVercelToken ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* v0 API Key */}
            <div className="space-y-2">
              <Label htmlFor="v0-api-key" className="text-sm">
                v0 API Key
              </Label>
              <div className="relative">
                <Input
                  id="v0-api-key"
                  type={showV0ApiKey ? 'text' : 'password'}
                  placeholder="Enter new v0 API key..."
                  value={v0ApiKey}
                  onChange={(e) => setV0ApiKey(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowV0ApiKey(!showV0ApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showV0ApiKey ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
