'use client'

import { useState, useEffect } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ExternalLink, RefreshCw } from 'lucide-react'

interface UsageStats {
  totalCost: number
  totalCredit: number
  availableCredit: number
  usageHistory: {
    date: string
    amount: number
    description: string
  }[]
  v0PlanData?: any
}

export function CreditsDropdown() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const loadStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/usage-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load usage stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load stats on mount
  useEffect(() => {
    loadStats()
  }, [])

  // Reload stats when dropdown is opened
  useEffect(() => {
    if (open) {
      loadStats()
    }
  }, [open])

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const displayAmount = stats?.availableCredit ?? 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="font-mono text-sm">
          {formatCurrency(displayAmount)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Usage & Credits</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={loadStats}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>

          {loading && !stats ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : stats ? (
            <>
              {/* Credit Balance */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Available Credit
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatCurrency(stats.availableCredit)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Usage
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(stats.totalCost)}
                  </span>
                </div>
              </div>

              {/* Recent Usage */}
              {stats.usageHistory && stats.usageHistory.length > 0 && (
                <>
                  <div className="border-t" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Usage</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {stats.usageHistory.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-medium">
                              {item.description}
                            </div>
                            <div className="text-muted-foreground">
                              {item.date}
                            </div>
                          </div>
                          <span className="font-mono">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="border-t" />

              {/* Buy More Credits Link */}
              <Button
                variant="default"
                className="w-full"
                onClick={() => window.open('https://v0.dev/pricing', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Buy More Credits
              </Button>
            </>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Failed to load usage stats
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
