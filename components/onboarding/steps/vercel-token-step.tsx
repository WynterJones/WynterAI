"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StepActions } from "../step-actions"
import { ExternalLink } from "lucide-react"

interface VercelTokenStepProps {
  initialValue?: string
  onNext: (token: string) => void
  onBack?: () => void
}

export function VercelTokenStep({ initialValue = "", onNext, onBack }: VercelTokenStepProps) {
  const [token, setToken] = useState(initialValue)

  const handleNext = () => {
    onNext(token.trim())
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vercel-token">Vercel Token</Label>
          <Input
            id="vercel-token"
            type="password"
            placeholder="Enter your Vercel API token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This token allows us to deploy your apps directly to Vercel
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">How to get your Vercel token:</p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Go to Vercel Settings</li>
            <li>Navigate to Tokens</li>
            <li>Create a new token with deployment permissions</li>
            <li>Copy and paste it here</li>
          </ol>
          <a
            href="https://vercel.com/account/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
          >
            Open Vercel Tokens
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <StepActions
        onNext={handleNext}
        onBack={onBack}
        nextDisabled={!token.trim()}
      />
    </div>
  )
}
