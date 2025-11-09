"use client"

import { useState, useEffect } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
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
import { MoreVertical, Pencil, Trash2, Wrench } from "lucide-react"
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
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all")
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

  // Filter chats based on selected project
  const filteredChats = selectedProjectId === "all"
    ? chats
    : chats.filter(chat => chat.project_id === selectedProjectId)

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[80vh]">
          <div className="mx-auto w-full max-w-4xl overflow-y-auto p-6">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-3xl">My Created Tools</DrawerTitle>
            </DrawerHeader>

            <div className="mt-6 space-y-6">
              {/* Project Filter */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-muted-foreground">Filter by project:</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="all">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title || project.name || "Untitled Project"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tools List */}
              <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-xl">Loading...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">{selectedProjectId === "all" ? "No tools yet" : "No tools in this project"}</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => !editingChat && handleOpenChat(chat)}
                >
                  {editingChat?.id === chat.id ? (
                    <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                        <h4 className="text-2xl font-semibold">{getChatTitle(chat)}</h4>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingChat(chat)
                              setEditName(getChatTitle(chat))
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeletingChat(chat)
                            }}
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
            </div>
          </div>
        </DrawerContent>
      </Drawer>

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
