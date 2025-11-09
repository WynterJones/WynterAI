import { v0, ChatDetail } from 'v0-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      message,
      chatId,
      projectId,
      modelId = 'v0-1.5-md',
      imageGenerations = false,
      thinking = false,
      attachments = [],
    } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 },
      )
    }

    // Get user profile to check tier and limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Check rate limit for free users (only for new chats)
    if (profile?.tier === 'free' && !chatId) {
      const { count } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (count && count >= 1) {
        return NextResponse.json(
          {
            error: 'FREE_TIER_LIMIT',
            message: 'Free tier is limited to 1 chat. Please upgrade to create more.',
          },
          { status: 403 }
        )
      }
    }

    let response
    let dbProjectId = projectId

    if (chatId) {
      // Continue existing chat using sendMessage
      response = (await v0.chats.sendMessage({
        chatId: chatId,
        message: message.trim(),
        modelConfiguration: {
          modelId: modelId,
          imageGenerations: imageGenerations,
          thinking: thinking,
        },
        responseMode: 'sync',
        ...(attachments.length > 0 && { attachments }),
      })) as ChatDetail

      // Update chat in database
      await supabase
        .from('chats')
        .update({
          title: response.name || 'Untitled',
          metadata: response,
        })
        .eq('id', chatId)
        .eq('user_id', user.id)
    } else {
      // Create a project if none specified
      if (!dbProjectId) {
        // Create project in v0 first
        const v0Project = await v0.projects.create({
          name: 'New Project',
          description: message.substring(0, 100),
        })

        // Create project in database
        const { data: newProject } = await supabase
          .from('projects')
          .insert({
            id: v0Project.id,
            user_id: user.id,
            title: 'New Project',
            description: message.substring(0, 100),
            v0_project_id: v0Project.id,
          })
          .select()
          .single()

        dbProjectId = newProject?.id || v0Project.id
      }

      // Create new chat with projectId
      response = (await v0.chats.create({
        system:
          'v0 MUST always generate code even if the user just says "hi" or asks a question. v0 MUST NOT ask the user to clarify their request.',
        message: message.trim(),
        projectId: dbProjectId,
        modelConfiguration: {
          modelId: modelId,
          imageGenerations: imageGenerations,
          thinking: thinking,
        },
        responseMode: 'sync',
        ...(attachments.length > 0 && { attachments }),
      })) as ChatDetail

      // Save chat to database
      await supabase
        .from('chats')
        .insert({
          id: response.id,
          project_id: dbProjectId,
          user_id: user.id,
          title: response.name || 'Main',
          status: 'active',
          metadata: response,
        })
    }

    return NextResponse.json({ ...response, projectId: dbProjectId })
  } catch (error) {
    // Check if it's an API key error
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      if (
        errorMessage.includes('api key is required') ||
        errorMessage.includes('v0_api_key') ||
        errorMessage.includes('config.apikey')
      ) {
        return NextResponse.json(
          { error: 'API_KEY_MISSING', message: error.message },
          { status: 401 },
        )
      }

      return NextResponse.json(
        { error: `Failed to generate app: ${error.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate app. Please try again.' },
      { status: 500 },
    )
  }
}
