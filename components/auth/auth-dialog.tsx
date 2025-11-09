"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultMode?: "login" | "register"
  onSuccess?: () => void
}

export function AuthDialog({
  open,
  onOpenChange,
  defaultMode = "login",
  onSuccess
}: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode)

  // Update mode when dialog opens with new defaultMode
  useEffect(() => {
    if (open) {
      setMode(defaultMode)
    }
  }, [open, defaultMode])

  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Sign in to access your projects and continue building"
              : "Get started with your account to create amazing micro tools"
            }
          </DialogDescription>
        </DialogHeader>

        {mode === "login" ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
