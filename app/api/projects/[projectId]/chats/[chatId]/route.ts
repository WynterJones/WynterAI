import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; chatId: string }> },
) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, chatId } = await params

    // Get chat and verify ownership
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single()

    if (chatError || !chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Error in GET /api/projects/[projectId]/chats/[chatId]:', error)
    return NextResponse.json(
      { error: 'Failed to get chat' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; chatId: string }> },
) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, chatId } = await params
    const body = await request.json()
    const { title, name, status, deploy_url, vercel_deployment_id, metadata } = body

    // Support both 'title' and 'name' for flexibility
    const chatTitle = title || name

    // Build update object with only provided fields
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (chatTitle !== undefined) {
      updates.title = chatTitle
    }
    if (status !== undefined) {
      updates.status = status
    }
    if (deploy_url !== undefined) {
      updates.deploy_url = deploy_url
    }
    if (vercel_deployment_id !== undefined) {
      updates.vercel_deployment_id = vercel_deployment_id
    }
    if (metadata !== undefined) {
      updates.metadata = metadata
    }

    // Update chat in Supabase
    const { data: chat, error: updateError } = await supabase
      .from('chats')
      .update(updates)
      .eq('id', chatId)
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating chat:', updateError)
      return NextResponse.json(
        { error: 'Failed to update chat' },
        { status: 500 }
      )
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Error in PATCH /api/projects/[projectId]/chats/[chatId]:', error)
    return NextResponse.json(
      { error: 'Failed to update chat' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; chatId: string }> },
) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, chatId } = await params

    // Delete the chat
    const { error: deleteError } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId)
      .eq('project_id', projectId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting chat:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete chat' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/projects/[projectId]/chats/[chatId]:', error)
    return NextResponse.json(
      { error: 'Failed to delete chat' },
      { status: 500 },
    )
  }
}
