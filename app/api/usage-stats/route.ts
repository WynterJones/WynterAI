import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserTokens } from '@/lib/supabase/tokens'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's tokens
    const tokens = await getUserTokens(user.id)

    let v0PlanData = null
    let availableCredit = 0
    let totalCredit = 0

    // Fetch plan data from v0 API if token exists
    if (tokens.v0ApiKey) {
      try {
        const response = await fetch('https://api.v0.dev/v1/user/plan', {
          headers: {
            'Authorization': `Bearer ${tokens.v0ApiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          v0PlanData = await response.json()

          // Extract balance from v0 API response
          if (v0PlanData?.balance) {
            availableCredit = v0PlanData.balance.remaining || 0
            totalCredit = v0PlanData.balance.total || 0
          }
        } else {
          console.warn('Failed to fetch v0 plan data:', response.status, await response.text())
        }
      } catch (v0Error) {
        console.error('Error fetching v0 plan data:', v0Error)
      }
    }

    // Get recent usage history from our database (last 10 entries)
    const { data: usageHistory, error: historyError } = await supabase
      .from('usage_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (historyError) {
      console.error('Error fetching usage history:', historyError)
    }

    // Format usage history
    const formattedHistory = (usageHistory || []).map(entry => ({
      date: new Date(entry.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      amount: parseFloat(entry.amount),
      description: entry.description,
    }))

    return NextResponse.json({
      availableCredit,
      totalCost: totalCredit, // Total credits allocated (for backward compatibility)
      totalCredit, // Total credits allocated
      usageHistory: formattedHistory,
      v0PlanData, // Include raw v0 plan data for debugging
    })

  } catch (error) {
    console.error('Error in usage-stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
