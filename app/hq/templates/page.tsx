import { requireAdmin } from '@/lib/admin/middleware'
import { createClient } from '@/lib/supabase/server'
import { TemplatesManager } from '@/components/admin/templates-manager'

async function getTemplates() {
  const supabase = await createClient()

  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }

  return templates || []
}

export default async function TemplatesPage() {
  await requireAdmin()
  const templates = await getTemplates()

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage templates available to users
        </p>
      </div>

      <TemplatesManager initialTemplates={templates} />
    </div>
  )
}
