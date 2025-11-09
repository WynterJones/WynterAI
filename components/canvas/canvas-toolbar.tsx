"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DimensionControl } from "./dimension-control"
import { StyleControls } from "./style-controls"
import { PublishDrawer } from "./publish-drawer"
import { Share2 } from "lucide-react"

interface CanvasToolbarProps {
  chatId?: string
  projectId?: string
  deployUrl?: string | null
  onDeploySuccess?: (deployUrl: string) => void
}

export function CanvasToolbar({ chatId, projectId, deployUrl, onDeploySuccess }: CanvasToolbarProps) {
  const [publishDrawerOpen, setPublishDrawerOpen] = useState(false)

  return (
    <>
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <DimensionControl />
            <div className="h-6 w-px bg-border" />
            <StyleControls />
          </div>

          <Button
            onClick={() => setPublishDrawerOpen(true)}
            variant="default"
            size="sm"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Add to Your Site
          </Button>
        </div>
      </div>

      <PublishDrawer
        open={publishDrawerOpen}
        onOpenChange={setPublishDrawerOpen}
        chatId={chatId}
        projectId={projectId}
        deployUrl={deployUrl}
        onDeploySuccess={onDeploySuccess}
      />
    </>
  )
}
