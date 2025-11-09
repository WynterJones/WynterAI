'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TemplatePreviewDialog } from './template-preview-dialog'

interface Template {
  id: string
  name: string
  screenshot_url: string
  zip_url: string
  preview_url?: string | null
  description?: string
  category?: string
  is_active?: boolean
  sort_order?: number
}

interface TemplatesSliderProps {
  onSelectTemplate?: (template: Template | null) => void
  selectedTemplateId?: string | null
}

export function TemplatesSlider({
  onSelectTemplate,
  selectedTemplateId,
}: TemplatesSliderProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying || templates.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % templates.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, templates.length])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || data || [])
      } else {
        setTemplates([])
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % templates.length)
  }

  const handleTemplateClick = (template: Template) => {
    setPreviewTemplate(template)
    setShowPreviewDialog(true)
  }

  const handleUseTemplate = (template: Template | null) => {
    if (onSelectTemplate) {
      onSelectTemplate(template)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full mb-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="relative">
            {/* Loading skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-gray-400 dark:text-gray-600 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Empty state (no templates loaded yet)
  if (templates.length === 0) {
    return (
      <div className="w-full mb-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="relative">
            {/* Placeholder templates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Lead Magnet', color: 'from-blue-500 to-purple-600' },
                { name: 'Calculator', color: 'from-green-500 to-teal-600' },
                { name: 'Quiz Tool', color: 'from-orange-500 to-pink-600' },
              ].map((placeholder, i) => (
                <div
                  key={i}
                  className={cn(
                    'relative aspect-video bg-gradient-to-br rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl',
                    placeholder.color,
                  )}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <Sparkles className="h-12 w-12 mb-4 opacity-80" />
                    <h3 className="text-xl font-semibold mb-2">
                      {placeholder.name}
                    </h3>
                    <p className="text-sm opacity-90 text-center">
                      Coming Soon
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Actual slider with templates
  const visibleTemplates =
    templates.length >= 3
      ? [
          templates[(currentIndex - 1 + templates.length) % templates.length],
          templates[currentIndex],
          templates[(currentIndex + 1) % templates.length],
        ]
      : templates

  return (
    <div className="w-full mb-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="relative">
          {/* Navigation buttons */}
          {templates.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 rounded-full bg-white shadow-lg"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 rounded-full bg-white shadow-lg"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Templates grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleTemplates.map((template, i) => {
              const isCenter = templates.length >= 3 ? i === 1 : false
              const isSelected = template.id === selectedTemplateId

              return (
                <div
                  key={template.id}
                  className={cn(
                    'relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:shadow-2xl',
                    isCenter && 'md:scale-110 z-10',
                    isSelected && 'ring-4 ring-blue-500',
                  )}
                  onClick={() => handleTemplateClick(template)}
                >
                  <img
                    src={template.screenshot_url}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            })}
          </div>

          {/* Dots indicator */}
          {templates.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {templates.map((_, i) => (
                <button
                  key={i}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-gray-300 dark:bg-gray-700',
                  )}
                  onClick={() => {
                    setCurrentIndex(i)
                    setIsAutoPlaying(false)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        template={previewTemplate}
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        onUseTemplate={handleUseTemplate}
        isSelected={previewTemplate?.id === selectedTemplateId}
      />
    </div>
  )
}
