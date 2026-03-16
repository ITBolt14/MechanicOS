import { NavLink, useNavigate } from 'react-router-dom'
import {
    Wrench, LayoutDashboard, ClipboardList,
    Users, Car, Package, FileText,
    Calendar, BarChart3, Settings,
    LogOut, ChevronDown, ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

const navItems = [
    { 
        to: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
    },
    { 
        label: 'Workshop',
        icon: Wrench,
        children: [
          { to: '/jobs', icon: ClipboardList, label: 'Job Cards' },
          { to: '/schedule', icon: Calendar, label: 'Schedule' },
        ],
    },
    {
        label: 'Customers',
        icon: Users,
        children: [
            { to: '/customers', icon: Users, label: 'All Customers' },
            { to: '/vehicles', icon: Car, label: 'Vehicles' },
        ],
    },
    {
        label: 'Finance',
        icon: FileText,
        children: [
            { to: '/invoices', icon: FileText, label: 'Invoicing' },
            { to: '/parts', icon: Package, label: 'Parts & Stock' },
        ],
    },
    {
        to: '/reports',
        icon: BarChart3,
        label: 'Reports',
    },
]

function NavGroup({ item, collapsed }) {
    const [open, setOpen] = useState(true)

    if (item.to) {
        return (
            <NavLink
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 reounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800'
                }
              `}
            >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
            </NavLink>
        )
    }

    return (
        <div>
            {/* Group Header */}
            {!collapsed && (
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-surface-500 hover:text-surface-300 transition-all text-xs font-semibold uppercase tracking-wider"
                >
                    <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                    </div>
                    {open
                      ? <ChevronDown className="w-3.5 h-3.5" />
                      : <ChevronRight className="w-3.5 h-3.5" />
                    }
                </button>
            )}

            {/* Group Children */}
            {(open || collapsed) && (
                <div className={`space-y-1 ${!collapsed ? 'ml-2 pl-2 border-1 border-surface-800' : ''}`}>
                    {item.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                            transition-all duration-200
                            ${isActive
                                ? 'bg-brand-600 text-white'
                                : 'text-surface-400 hover:text-white hover:bg-surface-800'
                            }
                          `}
                        >
                            <child.icon className="w-4 h-4 flex-shrink-0" />
                            {!collapsed && <span>{child.label}</span>}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    )
}

export function Sidebar({ collapsed }) {
    const { profile, company, signOut } = useAuthStore()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <aside className={`
            h-screen bg-surface-900 border-r border-surface-800 flex flex-col
            transition-all duration-300 flex-shrink-0
            ${collapsed ? 'w-16' : 'w-64'}
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-4 border-b border-surface-800 flex-shrink-0">
                    <div className="m-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-4 h-4 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                          <span className="font-display font-bold text-white text-lg block truncate">
                            MechanicOS
                          </span>
                        </div>
                    )}
                </div>

                {/* Company Badge */}
                {!collapsed && company && (
                    <div className="mx-3 mt-3 p-3 bg-surface-800 rounded-lg border border-surface-700">
                        <p className="text-xs text-surface-400 mb-0.5">Workshop</p>
                        <p className="text-sm font-semibold text-white truncate">{company.name}</p>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => (
                        <NavGroup key={index} item={item} collapsed={collapsed} />
                    ))}
                </nav>

                {/* Bottom  Section */}
                <div className="px-2 pb-4 space-y-1 border-t border-surface-800 pt-3 flex-shrink-0">
                    <NavLink
                      to="/settings"
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-brand-600 text-white' 
                          : 'text-surface-400 hover:text-white hover:bg-surface-800'
                        }
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
                        <div className="flex items-center gap-3 px-3 py-2.5 mt-2 border-t border-surface-800 pt-3">
                            <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-white">
                                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {profile.first_name} {profile.last_name}
                                </p>
                                <p className="text-xs text-surface-400 capitalize">{profile.role}</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
    )
}