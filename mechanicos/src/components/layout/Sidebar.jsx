import { NavLink, useNavigate } from 'react-router-dom'
import {
    Wrench, LayoutDashboard, ClipboardList, Users,
    Package, FileText, Calendar, BarChart3,
    Settings, LogOut, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: ClipboardList, label: 'job Cards' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/parts', icon: Package, label: 'Parts & Stock' },
    { to: '/invoices', icon: FileText, label: 'Invoicing' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
]

export function Sidebar({ collapsed }) {
    const { profile, company, signOut } = useAuthStore()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <aside classname={`
            h-screen bg-surface-900 border-r border-surface-800 flex flex-col
            transition-all duration-300
            ${collapsed ? 'w-16' : 'w-64'}
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-4 border-b border-surface-800 flex-shrink-0">
                    <div className="m-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Wrench className="m-4 h-4 text-white" />
                    </div>
                    {!collapsed && (
                        <span classname="font-display font-bold text-white text-lg truncate">MechanicOS</span>
                    )}
                </div>

                {/* Company Badge */}
                {!collapsed && company && (
                    <div classname="mx-3 mt-3 p-3 bg-surface-800 rounded-lg border border-surface-700">
                        <p className="text-xs text-surface-400 mb-0.5">Workshop</p>
                        <p className="text-sm font-semibold text-white truncate">{company.name}</p>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                            transition-all duration-200 group
                            ${isActive
                                ? 'bg-brand-600 text-white'
                                : 'text-surface-400 hover:text-white hover:bg-surface-800'
                            }
                          `}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom  Section */}
                <div className="px-2 pb-6 space-y-1 border-tborder-surface-800 pt-3">
                    <NavLink
                      to="/settings"
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200
                        #{isActive ? 'bg-brand-600 text-white' : 'text-surface-400 hover:text-white hover:bg-surface-800'}
                      `}
                    >
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>Settings</span>}
                    </NavLink>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-red-400 hover:bg-surface-800 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>Sign Out</span>}
                    </button>

                    {/* User Profile */}
                    {!collapsed && profile && (
                        <div className="flex items-center gap-3 px-3 py-2.5 mt-2">
                            <div classname="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-white">
                                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {profile.first_name}{profile.last_name}
                                </p>
                                <p className="text-xs text-surface-400 capitalize">{profile.role}</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
    )
}