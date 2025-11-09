"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCanvasSettings } from "@/lib/hooks/useCanvasSettings"
import { Square, RectangleHorizontal, Circle, ChevronDown } from "lucide-react"
import { useState } from "react"

const cornerPresets = [
  { label: "Square", value: 0, icon: Square },
  { label: "Rounded", value: 8, icon: RectangleHorizontal },
  { label: "Circle", value: 24, icon: Circle },
]

const shadowPresets = [
  { label: "None", value: "none" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
]

const borderPresets = [
  { label: "None", value: 0 },
  { label: "Thin", value: 1 },
  { label: "Med", value: 2 },
  { label: "Thick", value: 4 },
]

export function StyleControls() {
  const { settings, updateSettings } = useCanvasSettings()
  const [cornerOpen, setCornerOpen] = useState(false)
  const [shadowOpen, setShadowOpen] = useState(false)
  const [borderOpen, setBorderOpen] = useState(false)

  const getShadowLabel = () => {
    return settings.shadow.toUpperCase()
  }

  const getBorderLabel = () => {
    const preset = borderPresets.find(p => p.value === settings.borderWidth)
    return preset?.label || `${settings.borderWidth}px`
  }

  const shadowToValue = (shadow: string) => {
    const index = shadowPresets.findIndex(p => p.value === shadow)
    return index >= 0 ? index : 0
  }

  const valueToShadow = (value: number) => {
    return shadowPresets[value]?.value || "none"
  }

  return (
    <div className="flex items-center gap-2">
      {/* Corners */}
      <Popover open={cornerOpen} onOpenChange={setCornerOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <span className="text-xs">Corners: {settings.borderRadius}px</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Corner Radius</Label>
            <div className="space-y-2">
              <Slider
                value={[settings.borderRadius]}
                onValueChange={([value]) => updateSettings({ borderRadius: value })}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Radius"
                  value={settings.borderRadius}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    if (val >= 0) updateSettings({ borderRadius: val })
                  }}
                  className="h-8"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Shadows */}
      <Popover open={shadowOpen} onOpenChange={setShadowOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <span className="text-xs">Shadow: {getShadowLabel()}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Box Shadow</Label>
            <div className="space-y-2">
              <Slider
                value={[shadowToValue(settings.shadow)]}
                onValueChange={([value]) => updateSettings({ shadow: valueToShadow(value) as any })}
                max={4}
                step={1}
                className="w-full"
              />
              <div className="grid grid-cols-5 gap-1">
                {shadowPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={settings.shadow === preset.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSettings({ shadow: preset.value as any })}
                    className="text-xs h-7 px-1"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Border */}
      <Popover open={borderOpen} onOpenChange={setBorderOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <span className="text-xs">Border: {getBorderLabel()}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Border Width</Label>
            <div className="space-y-2">
              <Slider
                value={[settings.borderWidth]}
                onValueChange={([value]) => updateSettings({ borderWidth: value })}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="grid grid-cols-4 gap-2">
                {borderPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={settings.borderWidth === preset.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSettings({ borderWidth: preset.value })}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Custom"
                  value={settings.borderWidth}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    if (val >= 0) updateSettings({ borderWidth: val })
                  }}
                  className="h-8"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
              {settings.borderWidth > 0 && (
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.borderColor}
                    onChange={(e) => updateSettings({ borderColor: e.target.value })}
                    className="h-8 w-16 p-1 cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">Border Color</span>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
