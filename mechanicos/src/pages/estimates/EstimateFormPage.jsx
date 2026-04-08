import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useEstimates } from '../../hooks/useEstimates'
import { useEstimateSettings } from '../../hooks/useEstimateSettings'
import { useCustomers } from '../../hooks/useCustomers'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { Spinner } from '../../components/ui/Spinner'

const JOB_TYPE_OPTIONS = [
    { value: 'service',         label: 'Service' },
    { value: 'mechanical',      label: 'Mechanical Repair' },
    { value: 'panel_beating',   label: 'Panel Beating' },
    { value: 'electrical',      label: 'Electrical' },
    { value: 'tyres',           label: 'Tyres & Wheels' },
    { value: 'diagnostics',     label: 'Diagnostics' },
    { value: 'other',           label: 'Other' },
]

export default function EstimateFormPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const isEditing = !!id

    const { getEstimate, createEstimate, updateEstimate } = useEstimates()
    const { settings } = useEstimateSettings()
    const { customers } = useCustomers()

    const [vehicles, setVehicles] = useState([])
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEditing)
    const [errors, setErrors] = useState({})

    const [form, setForm] = useState({
        customer_id: searchParams.get('customer_id') || '',
        vehicle_id: searchParams.get('vehicle_id') || '',
        job_id: searchParams.get('job_id') || '',
        job_type: 'service',
        description: '',
        payment_terms: '30 days',
        valid_until: '',
        vat_rate: '15',
        notes: '',
        internal_notes: '',
    })

    // Set valid_until default 30 days from now
    useEffect(() => {
        if (settings && !form.valid_until) {
            const date = new Date()
            date.setDate(date.getDate() + (settings.quote_validity_days || 30))
            const formatted = date.toISOString().split('T')[0]
            setForm((prev) => ({
                ...prev,
                valid_until: formatted,
                payment_terms: settings.default_payment_terms || '30 days',
                vat_rate: settings.default_vat_rate?.toString() || '15',
            }))
        }
    }, [settings])

    // Fetch vehicles when customer changes
    useEffect(() => {
        const fetchCustomerVehicles = async () => {
            if (!form.customer_id) { setVehicles([]); return }
            const { supabase } = await import('../../lib/supabase')
            const { data } = await supabase
              .from('vehicles')
              .select('id, make, model, year, registration_number')
              .eq('customer_id', form.customer_id)
              .eq('is_active', true)
            setVehicles(data || [])
        }
        fetchCustomerVehicles()
    }, [form.customer_id])

    // Fetch jobs when customer changes
    useEffect(() => {
        const fetchCustomerJobs = async () => {
            if (!form.customer_id) { setJobs([]); return }
            const { supabase } = await import('../../lib/supabase')
            const { data } = await supabase
              .from('job_cards')
              .select('id, job_number, job_type, description')
              .eq('customer_id', form.customer_id)
              .eq('is_active', true)
              .order('created_at', { ascending: false })
            setJobs(data || [])
        }
        fetchCustomerJobs()
    }, [form.customer_id])

    // Load existing estimate for editing
    useEffect(() => {
        if (isEditing) {
            getEstimate(id).then((estimate) => {
                if (estimate) {
                    setForm({
                        customer_id: estimate.customer_id || '',
                        vehicle_id: estimate.vehicle_id || '',
                        job_id: estimate.job_id || '',
                        job_type: estimate.job_type || 'service',
                        description: estimate.description || '',
                        payment_terms: estimate.payment_terms || '30 days',
                        valid_until: estimate.valid_until || '',
                        vat_rate: estimate.vat_rate?.toString() || '15',
                        notes: estimate.notes || '',
                        internal_notes: estimate.internal_notes || '',
                    })
                }
                setFetching(false)
            })
        }
    }, [id])

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
    }

    const validate = () => {
        const e = {}
        if (!form.customer_id) e.customer_id = 'Please select a customer'
        if (!form.vehicle_id) e.vehicle_id = 'Please select a vehicle'
        if (!form.description) e.description = 'Please enter a description'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)

        const payload = {
            ...form,
            job_id: form.job_id || null,
            vat_rate: parseFloat(form.vat_rate) || 15,
        }

        const result = isEditing
          ? await updateEstimate(id, payload)
          : await createEstimate(payload)

        setLoading(false)
        if (result) navigate(`/estimates/${result.id}`)
    }

    const getCustomerLabel = (customer) => {
        if (customer.customer_type === 'company') return customer.company_name
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="btn-ghost p-2">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="page-title">
                        {isEditing ? 'Edit Estimate' : 'New Estimate'}
                    </h1>
                    <p className="text-surface-400 mt-1">
                        {isEditing ? 'Update estimate details' : 'Create a professional quote'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Customer & Vehicle */}
                <div className="card space-y-4">
                    <h2 className="section-title">Customer & Vehicle</h2>
                    <Select
                      label="Customer"
                      placeholder="Select a customer..."
                      value={form.customer_id}
                      onChange={(e) => {
                        update('customer_id', e.target.value)
                        update('vehicle_id', '')
                        update('job_id', '')
                      }}
                      error={errors.customer_id}
                      options={customers.map((c) => ({
                        value: c.id,
                        label: getCustomerLabel(c),
                      }))}
                    />
                    <Select
                      label="Vehicle"
                      placeholder={
                        !form.customer_id
                          ? 'Select a customer first...'
                          : vehicles.length === 0
                            ? 'No vehicles for this customer'
                            : 'Select a vehicle...'
                      }
                      value={form.vehicle_id}
                      onChange={(e) => update('vehicle_id', e.target.value)}
                      error={errors.vehicle_id}
                      options={vehicles.map((v) => ({
                        value: v.id,
                        label: `${v.year} ${v.make} ${v.model} - ${v.registration_number || 'No Plate'}`,
                      }))}
                    />
                    {jobs.length > 0 && (
                        <Select
                          label="Link to Job Card (optional)"
                          placeholder="Select a job card..."
                          value={form.job_id}
                          onChange={(e) => update('job_id', e.target.value)}
                          options={jobs.map((j) => ({
                            value: j.id,
                            label: `${j.job_number} - ${j.description || j.job_type}`,
                          }))}
                        />
                    )}
                </div>

                {/* Estimate Details */}
                <div className="card space-y-4">
                    <h2 className="section-title">Estimate Details</h2>
                    <Select
                      label="Job Type"
                      value={form.job_type}
                      onChange={(e) => update('job_type', e.target.value)}
                      options={JOB_TYPE_OPTIONS}
                    />
                    <Textarea
                      label="Description"
                      placeholder="Describe the work to be quoted..."
                      rows={3}
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                      error={errors.description}
                    />
                </div>

                {/* Quote Settings */}
                <div className="card space-y-4">
                    <h2 className="section-title">Quote Settings</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Valid Until"
                          type="date"
                          value={form.valid_until}
                          onChange={(e) => update('valid_until', e.target.value)}
                        />
                        <Input
                          label="VAT Rate (%)"
                          type="number"
                          value={form.vat_rate}
                          onChange={(e) => update('vat_rate', e.target.value)}
                        />
                        <div className="col-span-2">
                            <Input
                              label="Payment Terms"
                              placeholder="e.g. 30 days"
                              value={form.payment_terms}
                              onChange={(e) => update('payment_terms', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="card space-y-4">
                    <h2 className="section-title">Notes</h2>
                    <Textarea
                      label="Customer Notes (Visible on quote)"
                      placeholder="Any notes to show the customer..."
                      rows={3}
                      value={form.notes}
                      onChange={(e) => update('notes', e.target.value)}
                    />
                    <Textarea
                      label="Internal Notes (not on quote)"
                      placeholder="Internal notes..."
                      rows={2}
                      value={form.internal_notes}
                      onChange={(e) => update('internal_notes', e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
                        Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        {loading ? <Spinner size="sm" /> : null}
                        {loading
                          ? isEditing ? 'Saving...' : 'Creating...'
                          : isEditing ? 'Save Changes' : 'Create Estimate'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}