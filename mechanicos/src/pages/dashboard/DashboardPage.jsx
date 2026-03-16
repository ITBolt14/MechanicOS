import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ClipboardList, Users, Car,
    TrendingUp, Plus, ArrowRight
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useCustomers } from '../../hooks/useCustomers'
import { useVehicles } from '../../hooks/useVehicles'
import { Spinner } from '../../components/ui/Spinner'

export default function DashboardPage() {
    const navigate = useNavigate()
    const { profile, company } = useAuthStore()
    const { customers, loading: customersLoading } = useCustomers()
    const { vehicles, loading: vehiclesLoading } = useVehicles()

    const stats = [
        { 
            label: 'Active Jobs',
            value: '0',
            icon: ClipboardList,
            color: 'text-brand-400',
            bg: 'bg-brand-600 bg-opacity-10',
            to: '/jobs',
        },
        { 
            label: 'Customers',
            value: customersLoading ? '...' : customers.length,
            icon: Users,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500 bg-opacity-10',
            to: '/customers',
        },
        {
            label: 'Vehicles',
            value: vehiclesLoading ? '...' : vehicles.length,
            icon: Car,
            color: 'text-amber-400',
            bg: 'bg-amber-500 bg-opacity-10',
            to: '/vehicles',
        },
        { 
            label: 'Revenue (Month)',
            value: 'R 0',
            icon: TrendingUp,
            color: 'text-purple-400',
            bg: 'bg-purple-500 bg-opacity-10',
            to: '/reports',
        },
    ]

    const quickActions = [
        { label: 'New Customer', icon: Users, to: '/customers/new', color: 'text-emerald-400' },
        { label: 'Add Vehicle', icon: Car, to: '/vehicles/new', color: 'text-amber-400' },
        { label: 'New Job Card', icon: ClipboardList, to: '/jobs/new', color: 'text-brand-400' },
    ]

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="page-title">
                    Good day, {profile?.first_name} 👋
                </h1>
                <p className="text-surface-400 mt-1">
                    {company?.name} - Workshop Overview
                </p>
            </div>
            <div className="text-right">
                <p className="text-sm text-surface-400">
                    {new Date().toLocaleDateString('en-ZA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </p>
            </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <button
                      key={stat.label}
                      onClick={() => navigate(stat.to)}
                      className="card flex items-center gap-4 hover:border-surface-600 hover:bg-surface-800 transition-all text-left"
                    >
                        <div className={`p-3 ${stat.bg} rounded-xl ${stat.color} flex-shrink-0`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-display font-bold text-white">
                                {stat.value}
                            </div>
                            <div className="text-surface-400 text-sm">{stat.label}</div>
                        </div>
                    </button>
                ))}
            </div>
            
            {/* Quick Actions */}
            <div className="card space-y-4">
                <h2 className="section-title">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {quickActions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => navigate(action.to)}
                          className="flex items-center gap-3 p-4 bg-surface-800 hover:bg-surface-700 border border-surface-700 hover:border-surface-600 rounded-xl transition-all group"
                        >
                            <div className={`p-2 bg-surface-900 rounded-lg ${action.color}`}>
                                <action.icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-surface-300 group-hover:text-white transition-colors">
                                {action.label}
                            </span>
                            <ArrowRight className="w-4 h-4 text-surface-600 group-hover:text-surface-300 ml-auto transition-colors" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Customers & Vehicles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Customers */}
                <div className="card space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="section-title">Recent Customers</h2>
                        <button
                          onClick={() => navigate('/customers')}
                          className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                        >
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    {customersLoading ? (
                        <div className="flex justify-center py-6"><Spinner /></div>
                    ) : customers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-surface-500 text-sm mb-3">No customers yet</p>
                            <button
                              onClick={() => navigate('/customers/new')}
                              className="btn-primary flex items-center gap-2 mx-auto text-sm py-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Customer
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {customers.slice(0, 5).map((customer) => (
                                <button
                                  key={customer.id}
                                  onClick={() => navigate(`/customers/${customer.id}`)}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800 transition-all group"
                                >
                                    <div className="w-9 h-9 bg-brand-600 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Users className="w-4 h-4 text-brand-400" />
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {customer.company_type === 'company'
                                              ? customer.company_name
                                            : `${customer.first_name} ${customer.last_name}`
                                            }
                                        </p>
                                        <p className="text-xs text-surface-500 truncate">
                                            {customer.phone || customer.email || 'No contact'}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-surface-600 group-hover:text-surface-300 flex-shrink-0 transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Vehicles */}
                <div className="card space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="section-title">Recent Vehicles</h2>
                        <button
                          onClick={() => navigate('/vehicles')}
                          className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    {vehiclesLoading ? (
                        <div className="flex justify-center pu-6"><Spinner /></div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-surface-500 text-sm mb-3">No vehicles yet</p>
                            <button
                              onClick={() => navigate('/vehicles/new')}
                              className="btn-primary flex items-center gap-2 mx-auto text-sm py-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Vehicle
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {vehicles.slice(0, 5).map((vehicles) => (
                                <button
                                  key={vehicles.id}
                                  onClick={() => navigate(`/vehicles/${vehicles.id}`)}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800 transition-all group"
                                >
                                    <div className="w-9 h-9 bg-emerald-500 bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Car className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {vehicles.year} {vehicles.make} {vehicles.model}
                                        </p>
                                        <p className="text-xs font-mono text-surface-500">
                                            {vehicles.registration_number || 'No Plate'}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-surface-600 group-hover:text-surface-300 flex-shrink-0 transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}