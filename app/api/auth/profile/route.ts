import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { encrypt } from '@/lib/encryption'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, vercel_token, v0_api_key, has_completed_onboarding, tier } = body

    const updates: any = {}
    if (full_name !== undefined) updates.full_name = full_name
    // Encrypt sensitive tokens before storing
    if (vercel_token !== undefined) updates.vercel_token = vercel_token ? encrypt(vercel_token) : null
    if (v0_api_key !== undefined) updates.v0_api_key = v0_api_key ? encrypt(v0_api_key) : null
    if (has_completed_onboarding !== undefined) updates.has_completed_onboarding = has_completed_onboarding
    if (tier !== undefined) updates.tier = tier

    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error in /api/auth/profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
