"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useCanvasSettings } from "@/lib/hooks/useCanvasSettings"
import { Maximize2, Monitor } from "lucide-react"

export function DimensionControl() {
  const { settings, updateSettings } = useCanvasSettings()

  const isFullWidth = settings.width === 'full'
  const isAutoHeight = settings.height === 'auto'

  return (
    <div className="flex items-center gap-3">
      <Label className="text-sm font-medium whitespace-nowrap">Dimensions</Label>

      <div className="flex items-center gap-2">
        {/* Width */}
        <div className="flex items-center gap-1">
          <Button
            variant={isFullWidth ? "default" : "outline"}
            size="sm"
            onClick={() => updateSettings({ width: 'full' })}
            className="h-8"
          >
            <Maximize2 className="h-3 w-3 mr-1" />
            Full
          </Button>
          <Input
            type="number"
            placeholder="Width"
            value={typeof settings.width === 'number' ? settings.width : ''}
            onChange={(e) => updateSettings({ width: parseInt(e.target.value) || 800 })}
            className="h-8 w-20"
            disabled={isFullWidth}
          />
        </div>

        <span className="text-muted-foreground">×</span>

        {/* Height */}
        <div className="flex items-center gap-1">
          <Button
            variant={isAutoHeight ? "default" : "outline"}
            size="sm"
            onClick={() => updateSettings({ height: 'auto' })}
            className="h-8"
          >
            Auto
          </Button>
          <Input
            type="number"
            placeholder="Height"
            value={typeof settings.height === 'number' ? settings.height : ''}
            onChange={(e) => updateSettings({ height: parseInt(e.target.value) || 600 })}
            className="h-8 w-20"
            disabled={isAutoHeight}
          />
        </div>
      </div>
    </div>
  )
}
