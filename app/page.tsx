'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PromptComponent from './components/prompt-component'
import ApiKeyError from './components/api-key-error'
import RateLimitDialog from './components/rate-limit-dialog'
import ErrorDialog from './components/error-dialog'
import { useApiValidation } from '../lib/hooks/useApiValidation'
import { useAuth } from '../lib/hooks/useAuth'
import { AuthDialog } from '../components/auth'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '../components/ui/dialog'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [projectsLoaded, setProjectsLoaded] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState('new')
  const [selectedChatId, setSelectedChatId] = useState('new')
  const [projectChats, setProjectChats] = useState<any[]>([])
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false)
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    resetTime?: string
    remaining?: number
  }>({})
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authDialogMode, setAuthDialogMode] = useState<'login' | 'register'>('login')
  const [showVideoDialog, setShowVideoDialog] = useState(false)

  // API validation on page load
  const { isValidating, showApiKeyError } = useApiValidation()
  const { user, loading: authLoading } = useAuth()

  // Load projects on page mount (only if API is valid and user is authenticated)
  useEffect(() => {
    if (!isValidating && !showApiKeyError && user) {
      loadProjectsWithCache()
    }
  }, [isValidating, showApiKeyError, user])

  const loadProjectsWithCache = async () => {
    // First, try to load from sessionStorage for immediate display
    try {
      const cachedProjects = sessionStorage.getItem('projects')
      if (cachedProjects) {
        const parsedProjects = JSON.parse(cachedProjects)
        setProjects(parsedProjects)
        setProjectsLoaded(true)
      }
    } catch (err) {
      // Silently handle cache loading errors
    }

    // Then fetch fresh data in the background
    loadProjects()
  }

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        const projectsData = data.data || data || []
        setProjects(projectsData)
        setProjectsLoaded(true)

        // Store in sessionStorage for next time
        try {
          sessionStorage.setItem('projects', JSON.stringify(projectsData))
        } catch (err) {
          // Silently handle cache storage errors
        }
      } else if (response.status === 401) {
        const errorData = await response.json()
        if (errorData.error === 'API_KEY_MISSING') {
          // API key error is now handled by useApiValidation hook
          return
        }
      }
    } catch (err) {
      // Silently handle project loading errors
    } finally {
      // Mark as loaded even if there was an error
      setProjectsLoaded(true)
    }
  }

  const loadProjectChatsWithCache = async (projectId: string) => {
    // First, try to load from sessionStorage for immediate display
    try {
      const cachedChats = sessionStorage.getItem(`project-chats-${projectId}`)
      if (cachedChats) {
        const parsedChats = JSON.parse(cachedChats)
        setProjectChats(parsedChats)
      }
    } catch (err) {
      // Silently handle cache loading errors
    }

    // Then fetch fresh data in the background
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        const chatsData = data.chats || []
        setProjectChats(chatsData)

        // Store in sessionStorage for next time
        try {
          sessionStorage.setItem(
            `project-chats-${projectId}`,
            JSON.stringify(chatsData),
          )
        } catch (err) {
          // Silently handle cache storage errors
        }
      }
    } catch (err) {
      // Silently handle project chats loading errors
    }
  }

  const handleProjectChange = async (newProjectId: string) => {
    if (newProjectId === 'new') {
      // Stay on homepage for new project
      setSelectedProjectId('new')
      setSelectedChatId('new')
      setProjectChats([])
    } else {
      // Redirect to the selected project page
      router.push(`/projects/${newProjectId}`)
    }
  }

  const handleChatChange = (newChatId: string) => {
    setSelectedChatId(newChatId)
  }

  const handleSubmit = async (
    prompt: string,
    settings: { modelId: string; imageGenerations: boolean; thinking: boolean },
    attachments?: { url: string; name?: string; type?: string }[],
  ) => {
    // Check if user is authenticated
    if (!user) {
      setAuthDialogMode('register')
      setShowAuthDialog(true)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          modelId: settings.modelId,
          imageGenerations: settings.imageGenerations,
          thinking: settings.thinking,
          ...(attachments && attachments.length > 0 && { attachments }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Check for API key error
        if (response.status === 401 && errorData.error === 'API_KEY_MISSING') {
          // API key error is now handled by useApiValidation hook
          return
        }

        // Check for rate limit error
        if (
          response.status === 429 &&
          errorData.error === 'RATE_LIMIT_EXCEEDED'
        ) {
          setRateLimitInfo({
            resetTime: errorData.resetTime,
            remaining: errorData.remaining,
          })
          setShowRateLimitDialog(true)
          return
        }

        setErrorMessage(errorData.error || 'Failed to generate app')
        setShowErrorDialog(true)
        return
      }

      const data = await response.json()

      // Redirect to the new chat
      if (data.id || data.chatId) {
        const newChatId = data.id || data.chatId
        const projectId = data.projectId || 'default' // Fallback project
        router.push(`/projects/${projectId}/chats/${newChatId}`)
        return
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to generate app. Please try again.',
      )
      setShowErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Show API key error page if needed
  if (showApiKeyError) {
    return <ApiKeyError />
  }

  return (
    <div className="relative min-h-dvh bg-background">
      {/* Auth Button in Top Right */}
      {!authLoading && (
        <div className="absolute top-4 right-4 z-10">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            </div>
          ) : (
            <Button onClick={() => {
              setAuthDialogMode('login')
              setShowAuthDialog(true)
            }}>
              Login
            </Button>
          )}
        </div>
      )}

      {/* Homepage Welcome Message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="text-center px-4 sm:px-6"
          style={{ transform: 'translateY(-25%)' }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-pretty">
            Build an Embeddable Tool
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Describe any tools, build it and add to site (ClickFunnels, Shopify,
            GHL, anywhere). Select a pre-made template or start from scratch.
          </p>
          {!user && !authLoading && (
            <div className="flex gap-3 mt-6 justify-center">
              <Button
                onClick={() => {
                  setAuthDialogMode('register')
                  setShowAuthDialog(true)
                }}
                size="lg"
              >
                Create Account
              </Button>
              <Button
                onClick={() => setShowVideoDialog(true)}
                size="lg"
                variant="outline"
              >
                Watch Video
              </Button>
            </div>
          )}
        </div>
      </div>

      <PromptComponent
        onSubmit={handleSubmit}
        isLoading={isLoading}
        placeholder="Describe your micro-tool..."
        showDropdowns={projectsLoaded}
        projects={projects}
        projectChats={projectChats}
        currentProjectId={selectedProjectId}
        currentChatId={selectedChatId}
        onProjectChange={handleProjectChange}
        onChatChange={handleChatChange}
        isAuthenticated={!!user}
        onPromptClick={() => {
          setAuthDialogMode('register')
          setShowAuthDialog(true)
        }}
      />

      <RateLimitDialog
        isOpen={showRateLimitDialog}
        onClose={() => setShowRateLimitDialog(false)}
        resetTime={rateLimitInfo.resetTime}
        remaining={rateLimitInfo.remaining}
      />

      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        message={errorMessage}
      />

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        defaultMode={authDialogMode}
      />

      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">Watch Introduction Video</DialogTitle>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
