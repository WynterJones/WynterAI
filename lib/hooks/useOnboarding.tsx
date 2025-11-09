"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface OnboardingData {
  vercelToken: string
  v0ApiKey: string
  selectedPlan: "free" | "paid"
  includeTemplateLibrary: boolean
}

interface OnboardingContextType {
  currentStep: number
  data: OnboardingData
  setCurrentStep: (step: number) => void
  updateData: (updates: Partial<OnboardingData>) => void
  nextStep: () => void
  prevStep: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const TOTAL_STEPS = 4

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    vercelToken: "",
    v0ApiKey: "",
    selectedPlan: "free",
    includeTemplateLibrary: false,
  })

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <OnboardingContext.Provider
      value={{ currentStep, data, setCurrentStep, updateData, nextStep, prevStep }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}

export const ONBOARDING_STEPS = TOTAL_STEPS
