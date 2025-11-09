import { requireAdmin } from '@/lib/admin/middleware'
import { createClient } from '@/lib/supabase/server'
import { Users, MessageSquare, Folder, Package } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()

  const [usersResult, chatsResult, projectsResult, templatesResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('chats').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('templates').select('*', { count: 'exact', head: true }),
  ])

  // Get tier breakdown
  const { data: tierData } = await supabase
    .from('profiles')
    .select('tier')

  const tierBreakdown = tierData?.reduce((acc: Record<string, number>, profile) => {
    acc[profile.tier] = (acc[profile.tier] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return {
    totalUsers: usersResult.count || 0,
    totalChats: chatsResult.count || 0,
    totalProjects: projectsResult.count || 0,
    totalTemplates: templatesResult.count || 0,
    tierBreakdown,
  }
}

export default async function AdminDashboard() {
  await requireAdmin()
  const stats = await getStats()

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Chats',
      value: stats.totalChats,
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      name: 'Total Projects',
      value: stats.totalProjects,
      icon: Folder,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Templates',
      value: stats.totalTemplates,
      icon: Package,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your WynterAI platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className={`absolute ${stat.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value.toLocaleString()}
                </p>
              </dd>
            </div>
          )
        })}
      </div>

      {/* Tier Breakdown */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            User Tier Breakdown
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.tierBreakdown).map(([tier, count]) => (
              <div key={tier} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="capitalize text-sm font-medium text-gray-700">
                    {tier}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-900 font-semibold mr-3">
                    {count}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / stats.totalUsers) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="ml-3 text-sm text-gray-500">
                    {((count / stats.totalUsers) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/hq/users"
              className="text-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Users className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                Manage Users
              </span>
            </a>
            <a
              href="/hq/templates"
              className="text-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Package className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                Manage Templates
              </span>
            </a>
            <a
              href="/"
              className="text-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                View App
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
