import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft, Edit, Phone, Mail, MapPin,
    Car, Plus, User, Building2, Trash2
} from 'lucide-react'
import { useCustomers } from '../../hooks/useCustomers'
import { useVehicles } from '../../hooks/useVehicles'
import { CommunicationLog } from '../../components/customers/CommunicationLog'
import { VehicleTable } from '../../components/vehicles/VehicleTable'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner } from '../../components/ui/Spinner'

const TABS = ['Overview', 'Vehicles', 'Communications']

export default function CustomerDetailPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { getCustomer, deleteCustomer } = useCustomers()
    const { vehicles, loading: vehiclesLoading, deleteVehicle } = useVehicles(id)

    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Overview')
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [deleteVehicleTarget, setDeleteVehicleTarget] = useState(null)
    const [deletingVehicle, setDeletingVehicle] = useState(false)

    useEffect(() => {
        getCustomer(id).then((data) => {
            setCustomer(data)
            setLoading(false)
        })
    }, [id])

    const getCustomerName = () => {
        if (!customer) return ''
        if (customer.customer_type === 'company') return customer.company_name
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }

    const handleDeleteCustomer = async () => {
        setDeleting(true)
        await deleteCustomer(id)
        setDeleting(false)
        navigate('/customers')
    }

    const handleDeleteVehicle = async () => {
        if (!deleteVehicleTarget) return
        setDeletingVehicle(true)
        await deleteVehicle(deleteVehicleTarget.id)
        setDeletingVehicle(false)
        setDeleteVehicleTarget(null)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h- screen">
                <Spinner size="lg" />
            </div>
        )
    }

    if (!customer) {
        return (
            <div className="p-6">
                <EmptyState
                  icon={User}
                  title="Customer not found"
                  description="This customer may have been removed."
                  action={
                    <button onClick={() => navigate('/customers')} className="btn-primary">
                        Back to Customers
                    </button>
                  }
                />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/customers')} className="btn-ghost p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-brand-600 bg-opacity-20 rounded-2xl flex items-center justify-center">
                            {customer.customer_type === 'company'
                              ? <Building2 className="w-7 h-7 text-brand-400" />
                              : <User className="w-7 h-7 text-brand-400" />
                            }
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="page-title">{getCustomerName()}</h1>
                                <Badge variant={customer.customer_type === 'company' ? 'purple' : 'info'}>
                                    {customer.customer_type === 'company' ? 'Company' : 'Individual'}
                                </Badge>
                            </div>
                            <p className="text-surface-400 mt-0.5 text-sm">
                                Customer since {new Date(customer.created_at).toLocaleDateString('en-ZA')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteTarget(customer)}
                      className="btn-ghost p-2.5 text-surface-400 hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/customers/${id}/edit`)}
                      className="btn-secondary flex items-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                      onClick={() => navigate(`/vehicles/new?customer_id=${id}`)}
                      className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Vehicle
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-surface-900 border border-surface-800 rounded-xl p-1 w-fit">
                {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${activeTab === tab
                            ? 'bg-brand-600 text-white'
                            : 'text-surface-400 hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div className="card space-y-4">
                        <h2 className="section-title">Contact Information</h2>
                        <div className="space-y-3">
                            {customer.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-surface-800 rounded-lg flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-surface-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-surface-500">Phone</p>
                                        <p className="text-sm text-white">{customer.phone}</p>
                                    </div>
                                </div>
                            )}
                            {customer.alt_phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-surface-800 rounded-lg flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-surface-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-surface-500">Alt Phone</p>
                                        <p className="text-sm text-white">{customer.alt_phone}</p>
                                    </div>
                                </div>
                            )}
                            {customer.email && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-surface-800 rounded-lg flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-surface-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-surface-500">Email</p>
                                        <p className="text-sm text-white">{customer.email}</p>
                                    </div>
                                </div>
                            )}
                            {customer.address_line1 && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-surface-800 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-surface-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-surface-500">Address</p>
                                        <p className="text-sm text-white">
                                            {customer.address_line1}
                                            {customer.address_line2 && `, ${customer.address_line2}`}
                                            {customer.city && `, ${customer.city}`}
                                            {customer.province && `, ${customer.province}`}
                                            {customer.postal_code && ` ${customer.postal_code}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="card space-y-4">
                        <h2 className="section-title">Summary</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Vehicles', value: vehicles.length, icon: Car, color: 'text-emerald-400' },
                                { label: 'Total Jobs', value: '0', icon: Car, color: 'text-brand-400' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-surface-800 rounded-xl p-4">
                                    <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                                    <p className="text-sm text-surface-400 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        {customer.notes && (
                            <div>
                                <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">Notes</p>
                                <p className="text-sm text-surface-300 leading-relaxed">{customer.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'Vehicles' && (
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="section-title">Vehicles ({vehicles.length})</h2>
                        <button
                          onClick={() => navigate(`/vehicles/new?customer_id=${id}`)}
                          className="btn-primary flex items-center gap-2 text-sm py-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Vehicle
                        </button>
                    </div>
                    {vehiclesLoading ? (
                        <div className="flex justify-center py-8"><Spinner /></div>
                    ) : vehicles.length === 0 ? (
                        <EmptyState
                          icon={Car}
                          title="No vehicles yet"
                          description="Add a vehicle for this customer."
                          action={
                            <button
                              onClick={() => navigate(`/vehicles/new?customer_id=${id}`)}
                              className="btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Vehicle
                            </button>
                          }
                        />
                    ) : (
                        <VehicleTable
                          vehicles={vehicles}
                          showCustomer={false}
                          onDelete={setDeleteVehicleTarget}
                        />
                    )}
                </div>
            )}

            {activeTab === 'Communications' && (
                <div className="card">
                    <CommunicationLog customerId={id} />
                </div>
            )}

            {/* Delete Customer Confirm */}
            <ConfirmDialog
              isOpen={!!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDeleteCustomer}
              loading={deleting}
              title="Remove Customer"
              message={`Are you sure you want to remove ${getCustomerName()}? All their data will be archived.`}
              confirmLabel="Remove Customer"
            />

            {/* Delete Vehicle Confirm */}
            <ConfirmDialog
              isOpen={!!deleteVehicleTarget}
              onClose={() => setDeleteVehicleTarget(null)}
              onConfirm={handleDeleteVehicle}
              loading={deletingVehicle}
              title="Remove Vehicle"
              message={'Are you sure you want to remove this vehicle?'}
              confirmLabel="Remove Vehicle"
            />
        </div>
    )
}