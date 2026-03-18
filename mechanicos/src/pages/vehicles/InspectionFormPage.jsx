import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { useVehicles } from '../../hooks/useVehicles'
import { useInspections } from '../../hooks/useInspections'
import { InspectionDiagram } from '../../components/vehicles/InspectionDiagram'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { Spinner } from '../../components/ui/Spinner'
import { Badge } from '../../components/ui/Badge'

const CHECKLIST_ITEMS = [
    { id: 'spare_wheel', label: 'Spare Wheel' },
    { id: 'jack', label: 'Jack & Wheel Spanner' },
    { id: 'floor_mats', label: 'Floor Mats' },
    { id: 'radio', label: 'Radio / Head unit' },
    { id: 'aerial', label: 'Aerial' },
    { id: 'hubcaps', label: 'Hubcaps' },
    { id: 'warning_triangle', label: 'Warning Triangle' },
    { id: 'fire_extinguisher', label: 'Fire Extinguisher' },
    { id: 'first_aid', label: 'First Aid Kit' },
    { id: 'battery_ok', label: 'Battery OK' },
    { id: 'wipers_ok', label: 'Wipers OK' },
    { id: 'lights_ok', label: 'All Lights OK' },
]

export default function InspectionFormPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { getVehicle } = useVehicles()
    const { createInspection } = useInspections()

    const [vehicle, setVehicle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [form, setForm] = useState({
        mileage_at_inspection: '',
        fuel_level: 'full',
        general_condition: 'good',
        damage_points: [],
        checklist: {},
        notes: '',
    })

    useEffect(() => {
        getVehicle(id).then((data) => {
            setVehicle(data)
            if (data?.current_mileage) {
                setForm((prev) => ({
                    ...prev,
                    mileage_at_inspection: data.current_mileage,
                }))
            }
            setLoading(false)
        })
    }, [id])

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const toggleChecklist = (itemId) => {
        setForm((prev) => ({
            ...prev,
            checklist: {
                ...prev.checklist,
                [itemId]: !prev.checklist[itemId],
            },
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        const result = await createInspection({
            vehicle_id: id,
            customer_id: vehicle.customer_id,
            mileage_at_inspection: form.mileage_at_inspection
              ? parseInt(form.mileage_at_inspection)
              : null,
            fuel_level: form.fuel_level,
            general_condition: form.general_condition,
            damage_points: form.damage_points,
            checklist: form.checklist,
            notes: form.notes,
        })

        setSubmitting(false)
        if (result) navigate(`/vehicles/${id}`)
    }

    const getFuelPercentage = (level) => {
        const map = {
            empty: 0,
            quarter: 25,
            half: 50,
            three_quarter: 75,
            full: 100,
        }
        return map[level] || 0
    }

    const getFuelColor = (level) => {
        const pct = getFuelPercentage(level)
        if (pct <= 25) return 'bg-red-500'
        if (pct <= 50) return 'bg-amber-500'
        return 'bg-emerald-500'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    const getCustomerName = () => {
        if (!vehicle?.customers) return '-'
        const c = vehicle.customers
        if (c.customer_type === 'company') return c.company_name
        return `${c.first_name || ''} ${c.last_name || ''}`.trim()
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="btn-ghost p-2">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="page-title">Vehicle Inspection</h1>
                    <p className="text-surface-400 mt-1">
                        {vehicle?.year} {vehicle?.make} {vehicle?.model} -{' '}
                        <span className="font-mono">{vehicle?.registration_number || 'No Plate'}</span>
                    </p>
                </div>
            </div>

            {/* Vehicle Summary Card */}
            <div className="card bg-surface-800 border-surface-700">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                            <ClipboardList className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">
                                {vehicle?.year} {vehicle?.make} {vehicle?.model}
                            </p>
                            <p className="text-sm text-surface-400">Owner: {getCustomerName()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="default">
                            {vehicle?.colour || 'No colour'}
                        </Badge>
                        <Badge variant="info">
                            {vehicle?.transmission
                              ? vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1)
                              : '-'
                            }
                        </Badge>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Intake Details */}
                <div className="card space-y-6">
                    <h2 className="section-title">Intake Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Mileage at  Intake (km)"
                          type="number"
                          placeholder="e.g. 85000"
                          value={form.mileage_at_inspection}
                          onChange={(e) => update('mileage_at_inspection', e.target.value)}
                        />
                        <Select
                          label="General Condition"
                          value={form.general_condition}
                          onChange={(e) => update('general_condition', e.target.value)}
                          options={[
                            { value: 'excellent', label: 'Excellent' },
                            {  value: 'good', label: 'Good' },
                            { value: 'fair', label: 'Fair' },
                            { value: 'poor', label: 'Poor' },
                          ]}
                        />
                        <Select
                          label="Fuel Level"
                          value={form.fuel_level}
                          onChange={(e) => update('fuel_level', e.target.value)}
                          options={[
                            { value: 'empty', label: 'Empty' },
                            { value: 'quarter', label: '1/4 Tank' },
                            { value: 'half', label: '1/2 Tank' },
                            { value: 'three_quarter', label: '3/4 Tank' },
                            { value: 'full', label: 'Full Tank' },
                          ]}
                        />
                    </div>

                    {/* Fuel Level Visual */}
                    <div className="space-y-2">
                        <p className="label">Fuel Level Indicator</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-4 bg-surface-800 rounded-full overflow-hidden border border-surface-700">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${getFuelColor(form.fuel_level)}`}
                                  style={{ width: `${getFuelPercentage(form.fuel_level)}%` }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-white w-12 text-right">
                                {getFuelPercentage(form.fuel_level)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Damage Diagram */}
                <div className="card space-y-4">
                    <div>
                        <h2 className="section-title">Damage Assessment</h2>
                        <p className="text-sm text-surface-400 mt-1">
                            Mark all pre-existing damage on the vehicle diagram below
                        </p>
                    </div>
                    <InspectionDiagram
                      damagePoints={form.damage_points}
                      onChange={(points) => update('damage_points', points)}
                    />
                </div>

                {/* Checklist */}
                <div className="card space-y-4">
                    <div>
                        <h2 className="section-title">Vehicle Checklist</h2>
                        <p className="text-sm text-surface-400 mt-1">
                            Tick all items present in the vehicle
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {CHECKLIST_ITEMS.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleChecklist(item.id)}
                              className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                                ${form.checklist[item.id]
                                    ? 'border-emerald-500 bg-emerald-500 bg-opacity-10 text-emerald-400'
                                    : 'border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                                ${form.checklist[item.id]
                                    ? 'border-emerald-500 bg-emerald-500'
                                    : 'border-surface-600'
                                }`}
                            >
                                {form.checklist[item.id] && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span  className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-surface-500">
                        {Object.values(form.checklist).filter(Boolean).length} of {CHECKLIST_ITEMS.length} items present
                    </p>
                </div>

                {/* Notes */}
                <div className="card space-y-4">
                    <h2 className="section-title">Additional Notes</h2>
                    <Textarea
                      placeholder="Any additional observations or notes about the vehicle condition..."
                      rows={4}
                      value={form.notes}
                      onChange={(e) => update('notes', e.target.value)}
                    />
                </div>

                {/* Summary before submit */}
                <div className="card bg-surface-800 border-surface-700">
                    <h2 className="section-title mb-4">Inspection Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                label: 'Condition',
                                value: form.general_condition.charAt(0).toUpperCase() + form.general_condition.slice(1),
                                color: form.general_condition === 'excellent' ? 'text-emerald-400'
                                  : form.general_condition === 'good' ? 'text-brand-400'
                                  : form.general_condition === 'fair' ? 'text-amber-400'
                                  : 'text-red-400'
                            },
                            {
                                label: 'Fuel level',
                                value: `${getFuelPercentage(form.fuel_level)}%`,
                                color: getFuelPercentage(form.fuel_level) <= 25 ? 'text-red-400'
                                  : getFuelPercentage(form.fuel_level) <= 50 ? 'text-amber-400'
                                  : 'text-emerald-400'
                            },
                            {
                                label: 'Damage Areas',
                                value: form.damage_points.length,
                                color: form.damage_points.length > 0 ? 'text-red-400' : 'text-emerald-400'
                            },
                            {
                                label: 'Items Present',
                                value: `${Object.values(form.checklist).filter(Boolean).length}/${CHECKLIST_ITEMS.length}`,
                                color: 'text-brand-400'
                            },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-surface-900 rounded-xl p-3 text-center">
                                <p className={`text-xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-xs text-surface-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        {submitting ? <Spinner size="sm" /> : null}
                        {submitting ? 'Saving Inspection...' : 'Save inspection'}
                    </button>
                </div>
            </form>
        </div>
    )
}