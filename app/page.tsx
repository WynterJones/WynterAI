'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PromptComponent from './components/prompt-component'
import ApiKeyError from './components/api-key-error'
import RateLimitDialog from './components/rate-limit-dialog'
import ErrorDialog from './components/error-dialog'
import { TemplatesSlider } from '../components/templates-slider'
import { CreditsDropdown } from '../components/credits-dropdown'
import { UserMenuDropdown } from '../components/user-menu-dropdown'
import { TemplatesLibrary } from '../components/templates-library'
import { ManageToolsDialog } from '../components/tools-management'
import { useApiValidation } from '../lib/hooks/useApiValidation'
import { useAuth } from '../lib/hooks/useAuth'
import { AuthDialog } from '../components/auth'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '../components/ui/dialog'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [projectsLoaded, setProjectsLoaded] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
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
  const [authDialogMode, setAuthDialogMode] = useState<'login' | 'register'>(
    'login',
  )
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [showTemplatesLibrary, setShowTemplatesLibrary] = useState(false)
  const [showMyTools, setShowMyTools] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  // API validation on page load
  const { isValidating, showApiKeyError } = useApiValidation()
  const { user, profile, loading: authLoading } = useAuth()

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (user && profile && !profile.has_completed_onboarding) {
      router.push('/onboarding')
    }
  }, [user, profile, router])

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
    // Redirect to the selected project page
    router.push(`/projects/${newProjectId}`)
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
          ...(selectedTemplate && {
            templateZipUrl: selectedTemplate.zip_url,
            templateName: selectedTemplate.name,
          }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Check for API key error
        if (response.status === 401 && errorData.error === 'API_KEY_MISSING') {
          // API key error is now handled by useApiValidation hook
          setIsLoading(false)
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
          setIsLoading(false)
          return
        }

        setErrorMessage(errorData.error || 'Failed to generate app')
        setShowErrorDialog(true)
        setIsLoading(false)
        return
      }

      const data = await response.json()

      // Redirect to the new chat
      if (data.id || data.chatId) {
        const newChatId = data.id || data.chatId
        const projectId = data.projectId || 'default' // Fallback project
        router.push(`/projects/${projectId}/chats/${newChatId}`)
        // Keep loading state true during redirect
        return
      } else {
        // No chat ID returned
        setErrorMessage('Failed to create chat. Please try again.')
        setShowErrorDialog(true)
        setIsLoading(false)
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
      {/* Top Bar */}
      {!authLoading && (
        <>
          {/* Logo in Top Left */}
          <div className="absolute top-4 left-4 z-10">
            <Image
              src="/wynter-logo.png"
              alt="Wynter.AI"
              width={160}
              height={40}
              priority
            />
          </div>

          {/* Auth/Credits in Top Right */}
          <div className="absolute top-4 right-4 z-10">
            {user ? (
              <div className="flex items-center gap-2">
                <CreditsDropdown />
                <UserMenuDropdown userEmail={user.email || ''} />
              </div>
            ) : (
              <Button
                onClick={() => {
                  setAuthDialogMode('login')
                  setShowAuthDialog(true)
                }}
              >
                Login
              </Button>
            )}
          </div>
        </>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">
                Creating your tool...
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                This may take a few moments
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Homepage Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="w-full px-4 sm:px-6"
          style={{ transform: 'translateY(-20%)' }}
        >
          {/* Templates Slider */}
          <TemplatesSlider
            onSelectTemplate={(template) => {
              setSelectedTemplate(template)
              // If user is not authenticated, show auth dialog
              if (!user) {
                setAuthDialogMode('register')
                setShowAuthDialog(true)
              }
            }}
            selectedTemplateId={selectedTemplate?.id}
          />

          {/* Welcome Message */}
          <div className="text-center mt-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-pretty">
              Build an Embeddable Tool
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty mb-6">
              Describe any tools, build it and add to your site, works in
              ClickFunnels, Shopify, GHL, anywhere. Select a pre-made template
              or start from scratch and add value to your offer.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center mb-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowTemplatesLibrary(true)}
              >
                Browse Library
              </Button>
              {user && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowMyTools(true)}
                >
                  My Created Tools
                </Button>
              )}
            </div>

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
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
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
          <DialogTitle className="sr-only">
            Watch Introduction Video
          </DialogTitle>
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

      <TemplatesLibrary
        open={showTemplatesLibrary}
        onOpenChange={setShowTemplatesLibrary}
        onSelectTemplate={(template) => {
          setSelectedTemplate(template)
          // If user is not authenticated, show auth dialog
          if (!user) {
            setAuthDialogMode('register')
            setShowAuthDialog(true)
          }
        }}
        selectedTemplateId={selectedTemplate?.id}
      />

      <ManageToolsDialog
        open={showMyTools}
        onOpenChange={setShowMyTools}
      />
    </div>
  )
}
