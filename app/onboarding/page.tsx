"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { useOnboarding, OnboardingProvider, ONBOARDING_STEPS } from "@/lib/hooks/useOnboarding"
import {
  OnboardingLayout,
  VercelTokenStep,
  V0ApiKeyStep,
  PaymentStep,
  CheckoutStep,
} from "@/components/onboarding"

function OnboardingContent() {
  const router = useRouter()
  const { user, profile, refreshProfile, loading } = useAuth()
  const { currentStep, data, updateData, nextStep, prevStep } = useOnboarding()

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  // Redirect if already completed onboarding
  useEffect(() => {
    if (profile?.has_completed_onboarding) {
      router.push("/")
    }
  }, [profile, router])

  const handleCompleteOnboarding = async () => {
    try {
      // Update profile with onboarding data
      const updates: any = {
        has_completed_onboarding: true,
      }

      if (data.vercelToken) {
        updates.vercel_token = data.vercelToken
      }

      if (data.v0ApiKey) {
        updates.v0_api_key = data.v0ApiKey
      }

      // Update to paid tier if they selected paid plan
      if (data.selectedPlan === "paid") {
        // In production, this would only happen after successful payment
        const response = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...updates, tier: "paid" }),
        })

        if (!response.ok) throw new Error("Failed to update profile")
      } else {
        // Free plan
        const response = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })

        if (!response.ok) throw new Error("Failed to update profile")
      }

      // Refresh profile to get updated data
      await refreshProfile()

      // Redirect to homepage
      router.push("/")
    } catch (error) {
      console.error("Error completing onboarding:", error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Connect Vercel",
          description: "Deploy your apps automatically with Vercel integration",
          content: (
            <VercelTokenStep
              initialValue={data.vercelToken}
              onNext={(token) => {
                updateData({ vercelToken: token })
                nextStep()
              }}
            />
          ),
        }

      case 2:
        return {
          title: "Add v0 API Key",
          description: "Enable AI-powered app generation",
          content: (
            <V0ApiKeyStep
              initialValue={data.v0ApiKey}
              onNext={(apiKey) => {
                updateData({ v0ApiKey: apiKey })
                nextStep()
              }}
              onBack={prevStep}
            />
          ),
        }

      case 3:
        return {
          title: "Choose Your Plan",
          description: "Select the plan that works best for you",
          content: (
            <PaymentStep
              onNext={(plan, includeTemplateLibrary) => {
                updateData({ selectedPlan: plan, includeTemplateLibrary })
                if (plan === "paid") {
                  nextStep()
                } else {
                  // Skip checkout for free plan
                  handleCompleteOnboarding()
                }
              }}
              onBack={prevStep}
            />
          ),
        }

      case 4:
        const amount = data.selectedPlan === "paid"
          ? (data.includeTemplateLibrary ? 300 : 100)
          : 0

        return {
          title: "Complete Payment",
          description: "Secure checkout to activate your Pro plan",
          content: (
            <CheckoutStep
              amount={amount}
              includeTemplateLibrary={data.includeTemplateLibrary}
              onComplete={handleCompleteOnboarding}
              onBack={prevStep}
            />
          ),
        }

      default:
        return {
          title: "Welcome",
          description: "",
          content: null,
        }
    }
  }

  const stepContent = getStepContent()

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={ONBOARDING_STEPS}
      title={stepContent.title}
      description={stepContent.description}
    >
      {stepContent.content}
    </OnboardingLayout>
  )
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  )
}
