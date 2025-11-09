"use client"

import { Button } from "@/components/ui/button"

interface StepActionsProps {
  onNext: () => void
  onBack?: () => void
  onSkip?: () => void
  nextLabel?: string
  backLabel?: string
  skipLabel?: string
  nextDisabled?: boolean
  loading?: boolean
  showSkip?: boolean
}

export function StepActions({
  onNext,
  onBack,
  onSkip,
  nextLabel = "Continue",
  backLabel = "Back",
  skipLabel = "Skip",
  nextDisabled = false,
  loading = false,
  showSkip = false,
}: StepActionsProps) {
  return (
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
      <div>
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={loading}
          >
            {backLabel}
          </Button>
        )}
      </div>
      <div className="flex gap-3">
        {showSkip && onSkip && (
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={loading}
          >
            {skipLabel}
          </Button>
        )}
        <Button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || loading}
        >
          {loading ? "Loading..." : nextLabel}
        </Button>
      </div>
    </div>
  )
}
