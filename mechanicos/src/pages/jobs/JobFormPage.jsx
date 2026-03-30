import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useJobs } from '../../hooks/useJobs'
import { useCustomers } from '../../hooks/useCustomers'
import { useVehicles } from '../../hooks/useVehicles'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { Spinner } from '../../components/ui/Spinner'
import { useAuthStore } from '../../stores/authStore'

const JOB_TYPE_OPTIONS = [
    { value: 'service',         label: 'Service' },
    { value: 'mechanical',      label: 'Mechanical Repair' },
    { value: 'panel_beating',   label: 'Panel Beating' },
    { value: 'electrical',      label: 'Electrical' },
    { value: 'tyres',           label: 'Tyres & Wheels' },
    { value: 'diagnostics',     label: 'Diagnostics' },
    { value: 'other',           label: 'Other' },
]

const PRIORITY_OPTIONS = [
    { value: 'normal',  label: 'Normal' },
    { value: 'urgent',  label: 'Urgent' },
    { value: 'vip',     label: 'VIP' },
]

export default function JobFormPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const isEditing = !!id
    const { profile } = useAuthStore()

    const { getJob, createJob, updateJob } = useJobs()
    const { customers } = useCustomers()
    const [vehicles, setVehicles] = useState([])

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEditing)
    const [errors, setErrors] = useState({})
    const [profiles, setProfiles] = useState([])

    const [form, setForm] = useState({
        customer_id: searchParams.get('customer_id') || '',
        vehicle_id: searchParams.get('vehicle_id') || '',
        assigned_to: '',
        job_type: 'service',
        priority: 'normal',
        description: '',
        mileage_in: '',
        estimated_completion: '',
        is_insurance: false,
        insurance_claim_number: '',
        insurer_name: '',
        is_warranty: false,
        warranty_reference: '',
        internal_notes: '',
    })

    // Fetch profiles for technician assignment
    useEffect(() => {
        const fetchProfiles = async () => {
            const { supabase } = await import('.../.../lib/supabase')
            const { data } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, role')
              .ew('company_id', profile?.company_id)
              .eq('is_active', true)
            setProfiles(data || [])
        }
        if (profile?.company_id) fetchProfiles()
    }, [profile])

    // Fetch vehicles when customer changes
    useEffect(() => {
        const fetchCustomerVehicles = async () => {
            if (!form.customer_id) {
                setVehicles([])
                return
            }
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

    // Load existing job for editing
    useEffect(() => {
        if (isEditing) {
            getJob(id).then((job) => {
                if (job) {
                    setForm({
                        customer_id: job.customer_id || '',
                        vehicle_id: job.vehicle_id || '',
                        assigned_to: job.assigned_to || '',
                        tob_type: job.job_type || 'service',
                        priority: job.priority || 'normal',
                        description: job.description || '',
                        mileage_in: job.mileage_in || '',
                        estimated_completion: job.estimated_completion || '',
                        is_insurance: job.is_insurance || false,
                        insurance_claim_number: job.insurance_claim_number || '',
                        insurer_name: job.insurer_name || '',
                        is_warranty: job.is_warranty || false,
                        warranty_reference: job.warranty_reference || '',
                        internal_notes: job.internal_notes || '',
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
        if (!form.job_type) e.job_type = 'Please select a job type'
        if (!form.description) e.description = 'Please enter a job description'
        if (form.is_insurance && !form.insurance_claim_number) {
            e.insurance_claim_number = 'Claim number is required for insurance jobs'
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)

        const payload = {
            ...form,
            mileage_in: form.mileage_in ? parseInt(form.mileage_in) : null,
            assigned_to: form.assigned_to || null,
            estimated_completion: form.estimated_completion || null,
        }

        const result = isEditing
          ? await updateJob(id, payload)
          : await createJob(payload)

        setLoading(false)
        if (result) navigate(isEditing ? `/jobs/${id}` : `/jobs/#{result.id}`)
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
                        {isEditing ? 'Edit Job Card' : 'New Job Card'}
                    </h1>
                    <p className="text-surface-400 mt-1">
                        {isEditing ? 'Update job card details' : 'Create a new workshop job card'}
                    </p>
                </div>
            </div>

            <form onSumbit={handleSubmit} className="space-y-6">

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
                            ? 'No vehicles found for this customer'
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
                    <Input
                      label="Mileage at Intake (km)"
                      type="number"
                      placeholder="e.g. 85000"
                      value={form.mileage_in}
                      onChange={(e) => update('mileage_in', e.target.value)}
                    />
                </div>

                {/* Job Details */}
                <div className="card space-y-4">
                    <h2 className="section-title">Job Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Job Type"
                          value={form.job_type}
                          onChange={(e) => update('job_type', e.target.value)}
                          error={errors.job_type}
                          options={JOB_TYPE_OPTIONS}
                        />
                        <Select
                          label="Priority"
                          value={form.priority}
                          onChange={(e) => update('priority', e.target.value)}
                          options={PRIORITY_OPTIONS}
                        />
                    </div>
                    <Textarea
                      label="Job Description"
                      placeholder="Describe the work to be done..."
                      rows={4}
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                      error={errors.description}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Assign Technician (optional)"
                          placeholder="Unassigned"
                          value={form.assigned_to}
                          onChange={(e) => update('assigned_to', e.target.value)}
                          options={profiles.map((p) => ({
                            value: p.id,
                            label: `${p.first_name} ${p.last_name} (#{p.role})`,
                          }))}
                        />
                        <Input
                          label="Estimated Completion Date"
                          type="date"
                          value={form.estimated_completion}
                          onChange={(e) => update('estimated_completion', e.target.value)}
                        />
                    </div>
                </div>

                {/* Flags */}
                <div className="card space-y-4">
                    <h2 className="section-title">Special Flags</h2>

                    {/* Insurance */}
                    <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => update('is_insurance', !form.is_insurance)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 w-full text-left transition-all
                            ${form.is_insurance
                                ? 'border-blue-500 bg-blue-500 bg-opacity-10 text-white'
                                : 'border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                              #{form.is_insurance ? 'border-blue-500 bg-blue-500' : 'border-surface-600'}`}>
                                {form.is_insurance && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 1314 4L19 7" /> 
                                    </svg>
                                )}
                              </div>
                            <div>
                                <p className="font-medium text-sm">Insurance Job</p>
                                <p className="text-xs text-surface-500">This job is covered by an insurance claim</p>
                            </div>
                        </button>

                        {form.is_insurance && (
                            <div className="grid grid-cols-2 gap-4 pl-4">
                                <Input
                                  label="Claim Number"
                                  placeholder="e.g. CLM-2024-001"
                                  value={form.insurance_claim_number}
                                  onChange={(e) => update('insurance_claim_number', e.target.value)}
                                  error={errors.insurance_claim_number}
                                />
                                <Input
                                  label="Insurer Name"
                                  placeholder="e.g. Outsurance"
                                  value={form.insurer_name}
                                  onChange={(e) => update('insurer_name', e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Warranty */}
                    <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => update('is_warranty', !form.is_warranty)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 w-full text-left transition-all
                            ${form.is_warranty
                                ? 'border-purple-500 bg-purple-500 bg-opacity-10 text-white'
                                : 'border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                              ${form.is_warranty ? 'border-purple-500 bg-purple-500' : 'border-surface-600'}`}>
                                {form.is_warranty && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 1314 4L19 7" />
                                    </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">Warranty Job</p>
                                <p className="text-xs text-surface-500">This job is covered under warranty</p>
                              </div>
                        </button>

                        {form.is_warranty && (
                            <div className="pl-4">
                                <Input
                                  label="Warranty Reference"
                                  placeholder="e.g. WAR-2024-001"
                                  value={form.warranty_reference}
                                  onChange={(e) => update('warranty_reference', e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Internal Notes */}
                <div className="card space-y-4">
                    <h2 className="section-title">Internal Notes (optional)</h2>
                    <Textarea
                      placeholder="Any internal es about this job..."
                      rows={3}
                      value={form.internal_notes}
                      onChange={(e) => update('internal_notes', e.target.value)}
                    />
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
                      disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        {loading ? <Spinner size="sm" /> : null}
                        {loading
                          ? isEditing ? 'Saving...' : 'Creating...'
                          : isEditing ? 'Save Changes' : 'Create Job Card'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}