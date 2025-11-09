"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCanvasSettings } from "@/lib/hooks/useCanvasSettings"
import { Maximize2 } from "lucide-react"

const widthPresets = [
  { label: "Full Width", value: "full" },
  { label: "320px (Mobile S)", value: "320" },
  { label: "375px (Mobile M)", value: "375" },
  { label: "425px (Mobile L)", value: "425" },
  { label: "768px (Tablet)", value: "768" },
  { label: "800px (Default)", value: "800" },
  { label: "1024px (Desktop)", value: "1024" },
]

const heightPresets = [
  { label: "Auto Height", value: "auto" },
  { label: "400px", value: "400" },
  { label: "500px", value: "500" },
  { label: "600px (Default)", value: "600" },
  { label: "800px", value: "800" },
  { label: "1000px", value: "1000" },
]

export function DimensionControl() {
  const { settings, updateSettings } = useCanvasSettings()

  const getDisplayText = () => {
    const w = settings.width === "full" ? "Full" : `${settings.width}px`
    const h = settings.height === "auto" ? "Auto" : `${settings.height}px`
    return `${w} × ${h}`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <Maximize2 className="h-3 w-3" />
          <span className="text-xs">{getDisplayText()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Width</Label>
            <div className="grid grid-cols-2 gap-2">
              {widthPresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    (preset.value === "full" && settings.width === "full") ||
                    (preset.value !== "full" && settings.width === parseInt(preset.value))
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateSettings({
                      width: preset.value === "full" ? "full" : parseInt(preset.value),
                    })
                  }
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Custom width"
                value={typeof settings.width === "number" ? settings.width : ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (val > 0) updateSettings({ width: val })
                }}
                className="h-8"
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Height</Label>
            <div className="grid grid-cols-2 gap-2">
              {heightPresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    (preset.value === "auto" && settings.height === "auto") ||
                    (preset.value !== "auto" && settings.height === parseInt(preset.value))
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateSettings({
                      height: preset.value === "auto" ? "auto" : parseInt(preset.value),
                    })
                  }
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Custom height"
                value={typeof settings.height === "number" ? settings.height : ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (val > 0) updateSettings({ height: val })
                }}
                className="h-8"
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
