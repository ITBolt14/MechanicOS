import { useAuthStore } from '../../stores/authStore'
import { Wrench, ClipboardList, Users, Package, TremdingUp, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
    const { profile, company } = useAuthStore()

    const stats = [
        { label: 'Active Jobs', value: '0', icon: ClipboardList, color: 'text-brand-400' },
        { label: 'Customers', value: '0', icon: Users, color: 'text-emerald-400' },
        { label: 'Parts in Stock', value: '0', icon: Package, color: 'text-amber-400' },
        { label: 'Revenue (Month)', value: 'R 0', icon: TrendingUp, color: 'text-purple-400' },
    ]

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="page-title">
                    Good day, {profile?.first_name} 👋
                </h1>
                <p className="text-surface-400 mt-1">{company?.name} - Workshop Overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid frid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} classname="card flex items-center gap-4">
                        <div className={`p-3 bg-surface-800 rounded-xl ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                            <div className="text-surface-400 text-sm">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div classname="card">
                    <h2 className="section-title mb-4">Recent Jobs</h2>
                    <div className="flex flex-col items-center justify-center pu-12 text-surface-500">
                        <Wrench className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm">No jobs yet. Create your first job card.</p>
                    </div>
                </div>
                <div className="card">
                    <h2 className="section-title mb-4">Upcoming Bookings</h2>
                    <div classname="flex flex-col items-center justify-center py-12 text-surface-500">
                        <ClipboardList classname="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm">No booking scheduled.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}