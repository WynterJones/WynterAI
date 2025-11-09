"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { LogOut, HelpCircle, ChevronDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UserMenuDropdownProps {
  userEmail: string
}

export function UserMenuDropdown({ userEmail }: UserMenuDropdownProps) {
  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoggingOut(false)
      setOpen(false)
    }
  }

  const handleHelpCenter = () => {
    window.open('https://help.wynter.ai', '_blank')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          {userEmail}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-1">
          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>

          {/* Help Center */}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleHelpCenter}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help Center
          </Button>

          <div className="border-t my-2" />

          {/* Small Links */}
          <div className="px-2 py-1 space-y-1">
            <a
              href="https://wynter.ai/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline block"
            >
              Terms of Service
            </a>
            <a
              href="https://wynter.ai/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline block"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
