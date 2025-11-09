"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StepActions } from "../step-actions"
import { ExternalLink } from "lucide-react"

interface V0ApiKeyStepProps {
  initialValue?: string
  onNext: (apiKey: string) => void
  onBack?: () => void
}

export function V0ApiKeyStep({ initialValue = "", onNext, onBack }: V0ApiKeyStepProps) {
  const [apiKey, setApiKey] = useState(initialValue)

  const handleNext = () => {
    onNext(apiKey.trim())
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="v0-api-key">v0 API Key</Label>
          <Input
            id="v0-api-key"
            type="password"
            placeholder="Enter your v0 API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This key enables AI-powered app generation using v0
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">How to get your v0 API key:</p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Sign in to v0.dev</li>
            <li>Go to Settings or API section</li>
            <li>Generate a new API key</li>
            <li>Copy and paste it here</li>
          </ol>
          <a
            href="https://v0.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
          >
            Open v0.dev
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <StepActions
        onNext={handleNext}
        onBack={onBack}
        nextDisabled={!apiKey.trim()}
      />
    </div>
  )
}
