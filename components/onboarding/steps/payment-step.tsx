"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StepActions } from "../step-actions"
import { Check } from "lucide-react"

interface PaymentStepProps {
  onNext: (plan: "free" | "paid", includeTemplateLibrary: boolean) => void
  onBack?: () => void
}

export function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "paid">("free")
  const [includeTemplateLibrary, setIncludeTemplateLibrary] = useState(false)

  const handleNext = () => {
    onNext(selectedPlan, includeTemplateLibrary)
  }

  const handleSkip = () => {
    onNext("free", false)
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Free Plan */}
          <button
            onClick={() => setSelectedPlan("free")}
            className={`text-left p-6 rounded-lg border-2 transition-all ${
              selectedPlan === "free"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Free</h3>
                <p className="text-2xl font-bold mt-1">$0</p>
              </div>
              {selectedPlan === "free" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                1 free chat
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Basic features
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Community support
              </li>
            </ul>
          </button>

          {/* Paid Plan */}
          <button
            onClick={() => setSelectedPlan("paid")}
            className={`text-left p-6 rounded-lg border-2 transition-all relative ${
              selectedPlan === "paid"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold">
              POPULAR
            </div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Pro</h3>
                <p className="text-2xl font-bold mt-1">
                  $100
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    one-time
                  </span>
                </p>
              </div>
              {selectedPlan === "paid" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Unlimited chats
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Advanced features
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Priority support
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Vercel deployment
              </li>
            </ul>
          </button>
        </div>

        {/* Order Bump - Only show if paid plan selected */}
        {selectedPlan === "paid" && (
          <div
            onClick={() => setIncludeTemplateLibrary(!includeTemplateLibrary)}
            className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
              includeTemplateLibrary
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  includeTemplateLibrary
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}
              >
                {includeTemplateLibrary && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">Add Template Library</h4>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">
                    SAVE 50%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get instant access to 50+ pre-built embeddable tools. Save
                  hours of development time.
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">$200</span>
                  <span className="text-sm text-muted-foreground line-through">
                    $400
                  </span>
                  <span className="text-sm text-muted-foreground">one-time</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Total */}
        {selectedPlan === "paid" && (
          <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-bold">
              ${includeTemplateLibrary ? "300" : "100"}
            </span>
          </div>
        )}
      </div>

      <StepActions
        onNext={handleNext}
        onBack={onBack}
        onSkip={handleSkip}
        showSkip={selectedPlan === "free"}
        skipLabel="Continue with Free"
        nextLabel={selectedPlan === "paid" ? "Continue to Payment" : "Continue"}
      />
    </div>
  )
}
