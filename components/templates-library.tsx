"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { TemplatePreviewDialog } from "./template-preview-dialog"

interface Template {
  id: string
  name: string
  description: string
  screenshot_url: string
  preview_url?: string
  zip_url: string
}

interface TemplatesLibraryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate?: (template: Template) => void
  selectedTemplateId?: string
}

export function TemplatesLibrary({
  open,
  onOpenChange,
  onSelectTemplate,
  selectedTemplateId,
}: TemplatesLibraryProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (open) {
      loadTemplates()
    }
  }, [open])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/templates")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error("Error loading templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectTemplate = (template: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template)
    }
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="px-8 pt-8 pb-6 border-b">
            <DialogTitle className="text-2xl">Template Library</DialogTitle>
            <DialogDescription className="text-base">
              Choose a pre-made template to get started quickly
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="px-8 py-6 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="px-8 py-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading templates...
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? "No templates found matching your search"
                : "No templates available"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "group relative border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer",
                    selectedTemplateId === template.id &&
                      "ring-4 ring-blue-500"
                  )}
                  onClick={() => handleSelectTemplate(template)}
                >
                  {/* Template Screenshot */}
                  <div className="aspect-video relative bg-muted overflow-hidden">
                    <img
                      src={template.screenshot_url}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {selectedTemplateId === template.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Selected
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-1 line-clamp-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {template.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {template.preview_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreviewTemplate(template)
                            setShowPreview(true)
                          }}
                        >
                          Preview
                        </Button>
                      )}
                      <Button
                        className="flex-1"
                        size="sm"
                        variant={
                          selectedTemplateId === template.id
                            ? "default"
                            : "outline"
                        }
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectTemplate(template)
                        }}
                      >
                        {selectedTemplateId === template.id
                          ? "Selected"
                          : "Use Template"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>

    <TemplatePreviewDialog
      template={previewTemplate}
      open={showPreview}
      onOpenChange={setShowPreview}
      onUseTemplate={(template) => {
        if (template && onSelectTemplate) {
          onSelectTemplate(template)
        }
      }}
      isSelected={previewTemplate?.id === selectedTemplateId}
    />
    </>
  )
}
