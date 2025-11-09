"use client"

import { useState, useEffect } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCanvasSettings } from "@/lib/hooks/useCanvasSettings"
import { Loader2, CheckCircle2, Copy, ExternalLink } from "lucide-react"

interface PublishDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatId?: string
  projectId?: string
  deployUrl?: string | null
  onDeploySuccess?: (deployUrl: string) => void
}

export function PublishDrawer({
  open,
  onOpenChange,
  chatId,
  projectId,
  deployUrl: initialDeployUrl,
  onDeploySuccess,
}: PublishDrawerProps) {
  const { settings } = useCanvasSettings()
  const [deployUrl, setDeployUrl] = useState(initialDeployUrl)
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState(!!initialDeployUrl)
  const [autoHeight, setAutoHeight] = useState(false)
  const [copied, setCopied] = useState(false)

  // Update state when prop changes
  useEffect(() => {
    setDeployUrl(initialDeployUrl)
    setDeployed(!!initialDeployUrl)
  }, [initialDeployUrl])

  const handleDeploy = async () => {
    if (!chatId || !projectId) return

    setDeploying(true)
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          projectId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Deployment failed')
      }

      const data = await response.json()
      setDeployUrl(data.deployUrl)
      setDeployed(true)

      // Notify parent of successful deployment
      if (onDeploySuccess && data.deployUrl) {
        onDeploySuccess(data.deployUrl)
      }
    } catch (error) {
      console.error('Deployment error:', error)
      alert(error instanceof Error ? error.message : 'Deployment failed')
    } finally {
      setDeploying(false)
    }
  }

  const generateIframeCode = () => {
    if (!deployUrl) return ''

    const width = settings.width === 'full' ? '100%' : typeof settings.width === 'number' ? `${settings.width}px` : 'auto'
    const height = settings.height === 'auto' || autoHeight ? 'auto' : `${settings.height}px`

    const shadowClass = {
      none: '',
      sm: 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);',
      md: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
      lg: 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
      xl: 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
    }[settings.shadow]

    const borderStyle = settings.borderWidth > 0
      ? `border: ${settings.borderWidth}px solid ${settings.borderColor};`
      : ''

    const autoHeightScript = autoHeight ? `
<script>
  // Auto-resize iframe to content height
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'iframe-height') {
      var iframe = document.querySelector('iframe[src*="${deployUrl}"]');
      if (iframe) {
        iframe.style.height = e.data.height + 'px';
      }
    }
  });
</script>` : ''

    return `<!-- Wynter.AI Embedded Tool -->
<iframe
  src="${deployUrl}"
  style="width: ${width}; height: ${height}; border-radius: ${settings.borderRadius}px; ${borderStyle} ${shadowClass} border: none;"
  ${autoHeight ? 'id="wynter-tool-iframe"' : ''}
  loading="lazy"
  title="Embedded Tool"
></iframe>${autoHeightScript}`
  }

  const handleCopyCode = () => {
    const code = generateIframeCode()
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh]">
        <div className="mx-auto w-full max-w-3xl overflow-y-auto p-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>Add to Your Site</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-6 mt-6">
            {/* Deploy Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Deployment Status</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {deployed
                      ? 'Your tool is live and ready to embed'
                      : 'Deploy your tool to Vercel to get an embed link'}
                  </p>
                </div>
                <Button
                  onClick={handleDeploy}
                  disabled={deploying || !chatId || !projectId}
                >
                  {deploying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying...
                    </>
                  ) : deployed ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Publish Changes
                    </>
                  ) : (
                    'Publish'
                  )}
                </Button>
              </div>

              {deployUrl && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Input
                    value={deployUrl}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(deployUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Embed Options */}
            {deployed && deployUrl && (
              <>
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-sm font-semibold">Embed Options</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-height">Auto Height</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically adjust iframe height to content
                      </p>
                    </div>
                    <Switch
                      id="auto-height"
                      checked={autoHeight}
                      onCheckedChange={setAutoHeight}
                    />
                  </div>
                </div>

                {/* Embed Code */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Embed Code</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs font-mono">
                      <code>{generateIframeCode()}</code>
                    </pre>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>How to use:</strong> Copy the code above and paste it into your
                      website's HTML where you want the tool to appear. Works with
                      ClickFunnels, Shopify, GHL, and any website that supports HTML.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
