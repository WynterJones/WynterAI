'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Template {
  id: string
  name: string
  description?: string
  preview_url?: string | null
  screenshot_url: string
}

interface TemplatePreviewDialogProps {
  template: Template | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUseTemplate: (template: Template | null) => void
  isSelected?: boolean
}

export function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
  onUseTemplate,
  isSelected = false,
}: TemplatePreviewDialogProps) {
  const [iframeHeight, setIframeHeight] = useState<number | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Accept messages from any origin for iframe resize
      if (event.data?.type === 'iframe-resize' && typeof event.data.height === 'number') {
        setIframeHeight(event.data.height)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Reset iframe height when template changes
  useEffect(() => {
    setIframeHeight(null)
  }, [template?.id])

  if (!template) return null

  const handleToggleTemplate = () => {
    if (isSelected) {
      // Unselect by passing null
      onUseTemplate(null)
    } else {
      onUseTemplate(template)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-[1200px] max-h-[90vh] w-[1200px] overflow-y-auto p-0"
        style={{ maxWidth: '1200px' }}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{template.name} Preview</DialogTitle>

        {/* Custom Close Button - Fixed to Viewport */}
        <button
          onClick={() => onOpenChange(false)}
          className="fixed top-6 right-6 z-[100] h-12 w-12 rounded-full bg-background border-2 border-border shadow-xl flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity hover:scale-110"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-6 border-b bg-background shrink-0 pr-20">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {template.name}
              </h2>
              {template.description && (
                <p className="text-muted-foreground">{template.description}</p>
              )}
            </div>
            <div className="shrink-0 pl-6">
              <Button
                onClick={handleToggleTemplate}
                size="lg"
                variant={isSelected ? 'outline' : 'default'}
                className="text-lg font-bold"
              >
                {isSelected ? 'Unselect Template' : 'Use This Template'}
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-muted/30 p-6">
            {template.preview_url ? (
              <iframe
                ref={iframeRef}
                src={template.preview_url}
                className="w-full mx-auto max-w-[800px] border-0 rounded-lg shadow-2xl"
                style={{
                  height: iframeHeight ? `${iframeHeight}px` : '600px',
                  minHeight: '400px',
                }}
                sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
                title={`${template.name} Preview`}
              />
            ) : (
              // Fallback to screenshot if no preview URL
              <div className="relative w-full mx-auto max-w-[800px] rounded-lg shadow-2xl overflow-hidden">
                <img
                  src={template.screenshot_url}
                  alt={template.name}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white text-lg">Preview not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
