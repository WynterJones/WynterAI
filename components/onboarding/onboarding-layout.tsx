"use client"

import { ReactNode } from "react"

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
  title: string
  description?: string
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  description,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      index + 1 === currentStep
                        ? "bg-primary text-primary-foreground"
                        : index + 1 < currentStep
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-colors ${
                        index + 1 < currentStep ? "bg-primary/20" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
