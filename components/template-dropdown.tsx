'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, CheckIcon, XIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  description?: string
}

interface TemplateDropdownProps {
  selectedTemplate: Template | null
  onTemplateChange?: (template: Template | null) => void
}

// Hook to detect mobile screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

export function TemplateDropdown({
  selectedTemplate,
  onTemplateChange,
}: TemplateDropdownProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isMobile = useIsMobile()

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/templates')
        if (response.ok) {
          const data = await response.json()
          setTemplates(data.templates || data || [])
        }
      } catch (error) {
        console.error('Failed to load templates:', error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      loadTemplates()
    }
  }, [open])

  const handleTemplateSelect = (template: Template | null) => {
    setOpen(false)
    if (onTemplateChange) {
      onTemplateChange(template)
    }
  }

  const triggerButton = (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 justify-start max-w-[180px] sm:max-w-[220px]"
      role="combobox"
      aria-expanded={open}
    >
      <span className="text-sm text-gray-900 dark:text-white truncate">
        {selectedTemplate ? selectedTemplate.name : 'Selected Template'}
      </span>
      {selectedTemplate && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleTemplateSelect(null)
          }}
          className="ml-1 hover:bg-muted rounded p-0.5"
        >
          <XIcon className="h-3 w-3" />
        </button>
      )}
      <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-white flex-shrink-0" />
    </Button>
  )

  const commandContent = (
    <Command>
      <CommandInput placeholder="Search templates..." />
      <CommandList className="max-h-[200px]">
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading templates...
          </div>
        ) : (
          <>
            <CommandEmpty>No templates found.</CommandEmpty>
            <CommandGroup>
              {templates.map((template) => (
                <CommandItem
                  key={template.id}
                  value={template.name}
                  onSelect={() => handleTemplateSelect(template)}
                  className="justify-between"
                >
                  <div className="flex flex-col">
                    <span>{template.name}</span>
                    {template.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {template.description}
                      </span>
                    )}
                  </div>
                  {selectedTemplate?.id === template.id && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Template</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{commandContent}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        {commandContent}
      </PopoverContent>
    </Popover>
  )
}
