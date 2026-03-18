import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft, Edit, Car, User,
    Gauge, Fuel, Settings, Trash2,
    Plus, ClipboardList
} from 'lucide-react'
import { useVehicles } from '../../hooks/useVehicles'
import { useInspections } from '../../hooks/useInspections'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner } from '../../components/ui/Spinner'

const TABS = ['Overview', 'Inspections', 'Service History']

export default function VehicleDetailPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { getVehicle, deleteVehicle } = useVehicles()
    const { inspections, loading: inspectionsLoading, fetchInspections } = useInspections()

    const [vehicle, setVehicle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Overview')
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        getVehicle(id).then((data) => {
            setVehicle(data)
            setLoading(false)
        })
        fetchInspections(id)
    }, [id])

    const getCustomerName = () => {
        if (!vehicle?.customers) return '-'
        const c = vehicle.customers
        if (c.customer_type === 'company') return c.company_name
        return `${c.first_name || ''} ${c.last_name || ''}`.trim()
    }

    const handleDelete = async () => {
        setDeleting(true)
        await deleteVehicle(id)
        setDeleting(false)
        navigate('/vehicles')
    }

    const getFuelVariant = (fuel) => {
        const map = {
            petrol: 'warning', diesel: 'info',
            electric: 'success', hybrid: 'purple'
        }
        return map[fuel] || 'default'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    if (!vehicle) {
        return (
            <div className="p-6">
                <EmptyState
                  icon={Car}
                  title="Vehicle not found"
                  description="This vehicle may have been removed."
                  action={<button onClick={() => navigate('/vehicles')} className="btn-primary">
                    Back to Vehicles
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
                    <button onClick={() => navigate(-1)} className="btn-ghost p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-500 bg-opacity-10 rounded-2xl flex items-center justify-center">
                            <Car className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="page-title">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </h1>
                                <Badge variant={getFuelVariant(vehicle.fuel_type)}>
                                    {vehicle.fuel_type
                                      ? vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1)
                                      : '-'
                                    }
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="font-mono text-sm text-white bg-surface-800 px-2.5 py-1 rounded-lg">
                                    {vehicle.registration_number || 'No Plate'}
                                </span>
                                {vehicle.colour && (
                                    <span className="text-sm text-surface-400">{vehicle.colour}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteTarget(vehicle)}
                      className="btn-ghost p-2.5 text-surface-400 hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/vehicles/${id}/edit`)}
                      className="btn-secondary flex items-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                      onClick={() => navigate(`/vehicles/${id}/inspection`)}
                      className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Inspection
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

            {/* Overview Tab */}
            {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Vehicle Specs */}
                    <div className="card space-y-4">
                        <h2 className="section-title">Vehicle Specifications</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Make', value: vehicle.make, icon: Car },
                                { label: 'Model', value: vehicle.model, icon: Car },
                                { label: 'Year', value: vehicle.year, icon: Settings },
                                { label: 'Colour', value: vehicle.colour || '-', icon: Settings },
                                { label: 'Engine', value: vehicle.engine_size || '-', icon: Settings },
                                { label: 'Transmission', value: vehicle.transmission 
                                    ? vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1)
                                    : '-', icon: Settings },
                                { label: 'Fuel Type', value: vehicle.fuel_type
                                    ? vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1)
                                    : '-', icon: Fuel },
                                { label: 'Mileage', value: vehicle.current_mileage
                                    ? `${vehicle.current_mileage.toLocaleString()} km}`
                                    : '-', icon: Gauge },
                            ].map((spec) => (
                                <div key={spec.label} className="bg-surface-800 rounded-xl p-3">
                                    <p className="text-xs text-surface-500 mb-1">{spec.label}</p>
                                    <p className="text-sm font-semibold text-white">{spec.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Owner & Identity */}
                    <div className="space-y-4">
                        <div className="card space-y-4">
                            <h2 className="section-title">Owner</h2>
                            <button
                              onClick={() => navigate(`/customers/${vehicle.customer_id}`)}
                              className="flex items-center gap-3 w-full hover:bg-surface-800 p-3 rounded-xl transition-all"
                            >
                                <div className="w-10 h-10 bg-brand-600 bg-opacity-20 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-brand-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-white">{getCustomerName()}</p>
                                    {vehicle.customers?.phone && (
                                        <p className="text-xs text-surface-400">{vehicle.customers.phone}</p>
                                    )}
                                </div>
                            </button>
                        </div>

                        <div className="card space-y-3">
                            <h2 className="section-title">Identity Numbers</h2>
                            <div>
                                <p className="text-xs text-surface-500 mb-1">Registration Number</p>
                                <p className="font-mono text-sm text-white bg-surface-800 px-3 py-2 rounded-lg">
                                    {vehicle.registration_number || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-surface-500 mb-1">VIN Number</p>
                                <p className="font-mono text-sm text-white bg-surface-800 px-3 py-2 rounded-lg">
                                    {vehicle.vin_number || '-'}
                                </p>
                            </div>
                        </div>

                        {vehicle.notes && (
                            <div className="card">
                                <h2 className="section-title mb-3">Notes</h2>
                                <p className="text-sm text-surface-300 leading-relaxed">{vehicle.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* InspectionsTab */}
            {activeTab === 'Inspections' && (
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="section-title">
                            Inspection Records ({inspections.length})
                        </h2>
                        <button
                          onClick={() => navigate(`/vehicles/${id}/inspection`)}
                          className="btn-primary flex items-center gap-2 text-sm py-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Inspection
                        </button>
                    </div>
                    {inspectionsLoading ? (
                        <div className="flex justify-center py-8"><Spinner /></div>
                    ) : inspections.length === 0 ? (
                        <EmptyState
                          icon={ClipboardList}
                          title="No inspections yet"
                          description="Record the first inspection for this vehicle."
                          action={
                            <button
                              onClick={() => navigate(`/vehicles/${id}/inspection`)}
                              className="btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                New Inspection
                            </button>
                          }
                        />
                    ) : (
                        <div className="space-y-3">
                            {inspections.map((inspection) => (
                                <div key={inspection.id} className="bg-surface-800 rounded-xl p-4 border border-surface-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Badge variant={
                                                inspection.general_condition === 'excellent' ? 'success' :
                                                inspection.general_condition === 'good' ? 'primary' :
                                                inspection.general_condition === 'fair' ? 'warning' : 'danger'
                                            }>
                                                {inspection.general_condition
                                                  ? inspection.general_condition.charAt(0).toUpperCase() + inspection.general_condition.slice(1)
                                                  : 'Unknown'
                                                }
                                            </Badge>
                                            <span className="text-sm text-surface-400">
                                                {new Date(inspection.created_at).toLocaleDateString('en-ZA')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {inspection.mileage_at_inspection && (
                                                <span className="text-sm text-surface-400">
                                                    {inspection.mileage_at_inspection.toLocaleString()} km
                                                </span>
                                            )}
                                            {inspection.profiles && (
                                                <span className="text-xs text-surface-500">
                                                    by {inspection.profiles.first_name} {inspection.profiles.last_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {inspection.damage_points?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {inspection.damage_points.map((point, i) => (
                                                <span key={i} className="text-xs bg-red-500 bg-opacity-10 text-red-400 border border-red-500 border-opacity-20 px-2 py-1 rounded-lg">
                                                    {point.label}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {inspection.notes && (
                                        <p className="text-sm text-surface-400 mt-2">{inspection.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Service History */}
            {activeTab === 'Service History' && (
                <div className="card">
                    <EmptyState
                      icon={ClipboardList}
                      title="No service history yet"
                      description="Service history will appear here once job cards are completed for this vehicle."
                    />
                </div>
            )}

            {/* Delete Confirm */}
            <ConfirmDialog
              isOpen={!!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
              loading={deleting}
              title="Remove Vehicle"
              message={`Are you sure you want to remove the ${vehicle.year} ${vehicle.make} ${vehicle.model}?`}
              confirmLabel="Remove Vehicle"
            />
        </div>
    )
}