import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'

export function AppLayout() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-surface-950">
            <Sidebar collapsed={collapsed} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-surface-900 border-b border-surface-800 flex  items-center px-6 flex-shrink-0">
                    <button
                      onClick={() => setCollapsed(!collapsed)}
                      className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}