"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreVertical, Pencil, Trash2, Wrench, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface Chat {
  id: string
  project_id: string
  title?: string
  name?: string
  created_at?: string
  updated_at?: string
  status?: string
}

interface Project {
  id: string
  title?: string
  name?: string
}

interface ManageToolsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageToolsDialog({
  open,
  onOpenChange,
}: ManageToolsDialogProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [editingChat, setEditingChat] = useState<Chat | null>(null)
  const [editName, setEditName] = useState("")
  const [deletingChat, setDeletingChat] = useState<Chat | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      loadChats()
      loadProjects()
    }
  }, [open])

  const loadChats = async () => {
    setLoading(true)
    try {
      // Fetch all chats across all projects
      const projectsResponse = await fetch("/api/projects")
      if (!projectsResponse.ok) return

      const projectsData = await projectsResponse.json()
      const allProjects = projectsData.data || []

      // Fetch chats for each project
      const allChats: Chat[] = []
      for (const project of allProjects) {
        const response = await fetch(`/api/projects/${project.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.chats && data.chats.length > 0) {
            allChats.push(...data.chats)
          }
        }
      }

      // Sort by updated_at (most recent first)
      allChats.sort(
        (a, b) =>
          new Date(b.updated_at || 0).getTime() -
          new Date(a.updated_at || 0).getTime()
      )

      setChats(allChats)
    } catch (error) {
      console.error("Error loading chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.data || [])
      }
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.title || project?.name || "Unknown Project"
  }

  const getChatTitle = (chat: Chat) => {
    return chat.title || chat.name || "Untitled Tool"
  }

  const handleRename = async (chat: Chat) => {
    const currentName = getChatTitle(chat)
    if (!editName.trim() || editName === currentName) {
      setEditingChat(null)
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(
        `/api/projects/${chat.project_id}/chats/${chat.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editName.trim(),
          }),
        }
      )

      if (response.ok) {
        setEditingChat(null)
        loadChats() // Reload chats
      }
    } catch (error) {
      console.error("Error renaming chat:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (chat: Chat) => {
    setIsUpdating(true)
    try {
      const response = await fetch(
        `/api/projects/${chat.project_id}/chats/${chat.id}`,
        {
          method: "DELETE",
        }
      )

      if (response.ok) {
        setDeletingChat(null)
        loadChats() // Reload chats
      }
    } catch (error) {
      console.error("Error deleting chat:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleOpenChat = (chat: Chat) => {
    onOpenChange(false)
    router.push(`/projects/${chat.project_id}/chats/${chat.id}`)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Tools</DialogTitle>
            <DialogDescription>
              View, rename, or delete your tools.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tools yet</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  {editingChat?.id === chat.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRename(chat)
                          } else if (e.key === "Escape") {
                            setEditingChat(null)
                          }
                        }}
                        autoFocus
                        disabled={isUpdating}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleRename(chat)}
                        disabled={!editName.trim() || isUpdating}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingChat(null)}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{getChatTitle(chat)}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => handleOpenChat(chat)}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getProjectName(chat.project_id)}
                          {chat.updated_at && (
                            <>
                              {" • "}
                              Updated{" "}
                              {new Date(chat.updated_at).toLocaleDateString()}
                            </>
                          )}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingChat(chat)
                              setEditName(getChatTitle(chat))
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingChat(chat)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingChat}
        onOpenChange={(open) => !open && setDeletingChat(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tool</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingChat ? getChatTitle(deletingChat) : ''}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingChat && handleDelete(deletingChat)}
              disabled={isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUpdating ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
