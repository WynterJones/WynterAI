import { requireAdmin } from '@/lib/admin/middleware'
import { createClient } from '@/lib/supabase/server'
import { UsersTable } from '@/components/admin/users-table'

async function getUsers(page: number = 1, pageSize: number = 20) {
  const supabase = await createClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data: users, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching users:', error)
    return { users: [], total: 0 }
  }

  return { users: users || [], total: count || 0 }
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  await requireAdmin()

  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 20
  const { users, total } = await getUsers(page, pageSize)

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage all users and their tiers
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <UsersTable
          users={users}
          total={total}
          currentPage={page}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}
