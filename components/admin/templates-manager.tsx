'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string | null
  screenshot_url: string
  zip_url: string
  preview_url: string | null
  category: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface TemplatesManagerProps {
  initialTemplates: Template[]
}

export function TemplatesManager({ initialTemplates }: TemplatesManagerProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [isCreating, setIsCreating] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    screenshot_url: '',
    zip_url: '',
    preview_url: '',
    category: '',
    is_active: true,
    sort_order: 0,
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      screenshot_url: '',
      zip_url: '',
      preview_url: '',
      category: '',
      is_active: true,
      sort_order: 0,
    })
    setIsCreating(false)
    setEditingTemplate(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const endpoint = editingTemplate
        ? '/api/admin/templates/update'
        : '/api/admin/templates/create'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          editingTemplate
            ? { id: editingTemplate.id, ...formData }
            : formData
        ),
      })

      if (!response.ok) {
        throw new Error('Failed to save template')
      }

      resetForm()
      // Force a full page refresh to show latest changes
      window.location.reload()
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/templates/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete template')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template')
    }
  }

  const handleToggleActive = async (template: Template) => {
    try {
      const response = await fetch('/api/admin/templates/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: template.id,
          is_active: !template.is_active,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update template')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating template:', error)
      alert('Failed to update template')
    }
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      description: template.description || '',
      screenshot_url: template.screenshot_url,
      zip_url: template.zip_url,
      preview_url: template.preview_url || '',
      category: template.category || '',
      is_active: template.is_active,
      sort_order: template.sort_order,
    })
    setIsCreating(true)
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {isCreating ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingTemplate ? 'Edit Template' : 'Add New Template'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="screenshot_url"
                className="block text-sm font-medium text-gray-700"
              >
                Screenshot URL *
              </label>
              <input
                type="url"
                id="screenshot_url"
                required
                value={formData.screenshot_url}
                onChange={(e) =>
                  setFormData({ ...formData, screenshot_url: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://example.com/screenshot.png"
              />
            </div>

            <div>
              <label
                htmlFor="zip_url"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP URL *
              </label>
              <input
                type="url"
                id="zip_url"
                required
                value={formData.zip_url}
                onChange={(e) =>
                  setFormData({ ...formData, zip_url: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://example.com/template.zip"
              />
            </div>

            <div>
              <label
                htmlFor="preview_url"
                className="block text-sm font-medium text-gray-700"
              >
                Preview URL
              </label>
              <input
                type="url"
                id="preview_url"
                value={formData.preview_url}
                onChange={(e) =>
                  setFormData({ ...formData, preview_url: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://example.com/preview"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="sort_order"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sort Order
                </label>
                <input
                  type="number"
                  id="sort_order"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Template
        </button>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="aspect-video bg-gray-200 relative">
              {template.screenshot_url && (
                <img
                  src={template.screenshot_url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              )}
              {!template.is_active && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium">Inactive</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {template.name}
                  </h3>
                  {template.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      {template.category}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  #{template.sort_order}
                </span>
              </div>
              {template.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {template.description}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(template)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {template.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm text-red-700 bg-white hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates yet. Add your first template!</p>
        </div>
      )}
    </div>
  )
}
