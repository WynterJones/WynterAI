"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StepActions } from "../step-actions"
import { CreditCard, Lock } from "lucide-react"

interface CheckoutStepProps {
  amount: number
  includeTemplateLibrary: boolean
  onComplete: () => void
  onBack?: () => void
}

export function CheckoutStep({
  amount,
  includeTemplateLibrary,
  onComplete,
  onBack,
}: CheckoutStepProps) {
  const [loading, setLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async () => {
    setLoading(true)

    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setLoading(false)
    onComplete()
  }

  const isValid = cardNumber.length >= 16 && expiry.length >= 5 && cvc.length >= 3 && name.trim().length > 0

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(" ").substring(0, 19)
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4)
    }
    return cleaned
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span>Pro Plan</span>
            <span>$100.00</span>
          </div>
          {includeTemplateLibrary && (
            <div className="flex justify-between text-sm">
              <span>Template Library</span>
              <span>$200.00</span>
            </div>
          )}
          <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${amount}.00</span>
          </div>
        </div>

        {/* Mock Payment Form */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Lock className="w-4 h-4" />
            <span>Secure checkout (Mock - Stripe integration pending)</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-name">Cardholder Name</Label>
            <Input
              id="card-name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <div className="relative">
              <Input
                id="card-number"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                disabled={loading}
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 4))}
                maxLength={4}
                disabled={loading}
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Test Mode:</strong> This is a mock payment. Use any card
              number (e.g., 4242 4242 4242 4242) to simulate a successful payment.
            </p>
          </div>
        </div>
      </div>

      <StepActions
        onNext={handleSubmit}
        onBack={onBack}
        nextLabel={loading ? "Processing..." : `Pay $${amount}`}
        nextDisabled={!isValid}
        loading={loading}
      />
    </div>
  )
}
