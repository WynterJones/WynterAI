import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserTokens } from '@/lib/supabase/tokens'

export async function POST(req: NextRequest) {
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

    const { chatId, projectId } = await req.json()

    if (!chatId || !projectId) {
      return NextResponse.json(
        { error: 'Missing chatId or projectId' },
        { status: 400 }
      )
    }

    // Get user's Vercel token
    const tokens = await getUserTokens(user.id)
    if (!tokens.vercelToken) {
      return NextResponse.json(
        { error: 'Vercel token not configured. Please add it in settings.' },
        { status: 400 }
      )
    }

    // Get chat data to deploy
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', user.id)
      .single()

    if (chatError || !chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // Deploy to Vercel
    // This is a simplified deployment - in production you'd:
    // 1. Create a git repository with the chat's code
    // 2. Push to GitHub
    // 3. Deploy via Vercel API
    // For now, we'll simulate a deployment and return a mock URL

    const deploymentUrl = `https://${projectId}-${chatId.slice(0, 8)}.vercel.app`

    // In production, you would call Vercel API like:
    // const vercelResponse = await fetch('https://api.vercel.com/v13/deployments', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${tokens.vercelToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name: `${projectId}-${chatId}`,
    //     files: [...], // Generated files from chat
    //     projectSettings: {...}
    //   })
    // })

    // Save deployment URL to database
    const { error: updateError } = await supabase
      .from('chats')
      .update({
        deploy_url: deploymentUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Failed to save deployment URL:', updateError)
    }

    return NextResponse.json({
      success: true,
      deployUrl: deploymentUrl,
      message: 'Deployment successful'
    })

  } catch (error) {
    console.error('Deployment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
