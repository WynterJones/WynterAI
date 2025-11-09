"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, X } from "lucide-react"

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
        className="!max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] overflow-hidden p-0"
        style={{ maxWidth: '90vw' }}
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

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-6 border-b bg-background shrink-0 pr-20">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {template.name}
              </h2>
              {template.description && (
                <p className="text-muted-foreground">
                  {template.description}
                </p>
              )}
            </div>
            <div className="shrink-0 pl-6">
              <Button
                onClick={handleToggleTemplate}
                size="lg"
                variant={isSelected ? "outline" : "default"}
              >
                {isSelected ? "Unselect Template" : "Use This Template"}
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-hidden bg-white relative">
            {template.preview_url ? (
              <>
                <iframe
                  src={template.preview_url}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
                  title={`${template.name} Preview`}
                />
                <div className="absolute top-4 right-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(template.preview_url!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </>
            ) : (
              // Fallback to screenshot if no preview URL
              <div className="relative w-full h-full">
                <img
                  src={template.screenshot_url}
                  alt={template.name}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white text-lg">
                    Preview not available
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
