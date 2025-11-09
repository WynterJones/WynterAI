"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCanvasSettings } from "@/lib/hooks/useCanvasSettings"

export function StyleControls() {
  const { settings, updateSettings } = useCanvasSettings()

  return (
    <div className="flex items-center gap-4">
      {/* Border Radius */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium whitespace-nowrap">Corners</Label>
        <Input
          type="number"
          min="0"
          max="50"
          value={settings.borderRadius}
          onChange={(e) => updateSettings({ borderRadius: parseInt(e.target.value) || 0 })}
          className="h-8 w-16"
        />
        <span className="text-xs text-muted-foreground">px</span>
      </div>

      {/* Shadow */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium whitespace-nowrap">Shadow</Label>
        <Select
          value={settings.shadow}
          onValueChange={(value: any) => updateSettings({ shadow: value })}
        >
          <SelectTrigger className="h-8 w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Border */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium whitespace-nowrap">Border</Label>
        <Input
          type="number"
          min="0"
          max="10"
          value={settings.borderWidth}
          onChange={(e) => updateSettings({ borderWidth: parseInt(e.target.value) || 0 })}
          className="h-8 w-16"
        />
        <span className="text-xs text-muted-foreground">px</span>
        <Input
          type="color"
          value={settings.borderColor}
          onChange={(e) => updateSettings({ borderColor: e.target.value })}
          className="h-8 w-12 p-1"
        />
      </div>
    </div>
  )
}
