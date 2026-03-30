import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft, Edit, Trash2, Car, User,
    Calender, Gauge, AlertTriangle,
    Shield, Star, ClipboardList
} from 'lucide-react'
import { useJobs } from '../../hooks/useJobs'
import { JobStatusBadge, JobPriorityBadge, JOB_TYPES } from '../../components/jobs/JobStatusBadge'
import { JobStageBar } from '../../components/jobs/JobStageBar'
import { LabourLines } from '../../components/jobs/LabourLines'
import { PartsLines } from '../../components/jobs/PartsLines'
import { JobNotes } from '../../components/jobs/JobNotes'
import { JobTimerWidget } from '../../components/jobs/JobTimerWidget'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner } from '../../components/ui/Spinner'
import { useJobLines } from '../../hooks/useJobLines'

const TABS = ['Overview', 'Labour', 'Parts', 'Notes', 'History']

export default function JobDetailPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { getJob, updateJobStatus, deleteJob } = useJobs()
    const { statusHistory, fetchStatusHistory } = useJobLines(id)

    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Overview')
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [changingStatus, setChangingStatus] = useState(false)

    useEffect(() => {
        loadJob()
        fetchStatusHistory()
    }, [id])

    const loadJob = async () => {
        const data = await getJob(id)
        setJob(data)
        setLoading(false)
    }

    const handleStageChange = async (newStatus) => {
        setChangingStatus(true)
        await updateJobStatus(id, newStatus, job.status)
        await loadJob()
        setChangingStatus(false)
    }

    const handleDelete = async () => {
        setDeleting(true)
        await deleteJob(id)
        setDeleting(false)
        navigate('/jobs')
    }

    const getCustomerName = () => {
        if (!job?.customers) return '-'
        const c = job.customers
        if (c.customer_type === 'company') return c.company_name
        return `${c.first_name || ''} ${c.last_name || ''}`.trim()
    }

    const formatAmount = (amount) => {
        if (!amount) return 'R 0.00'
        return `R ${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleDateString('en-ZA', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    if (!job) {
        return (
            <div className="p-6">
                <EmptyState
                  icon={ClipboardList}
                  title="Job card not found"
                  description="This job card may have been removed."
                  action={<button onClick={() => navigate('/jobs')} className="btn-primary">
                    Back to Jobs
                  </button>
                  }
                />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/jobs')} className="btn-ghost p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="page-title font-mono">{job.job_number}</h1>
                            <JobStatusBadge status={job.status} />
                            <JobPriorityBadge priority={job.priority} />
                            {job.is_insurance && (
                                <Badge variant="info">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Insurance
                                </Badge>
                            )}
                            {job.is_warranty && (
                                <Badge variant="purple">
                                    <Star className="w-3 h-3 mr-1" />
                                    Warranty
                                </Badge>
                            )}
                        </div>
                        <p className="text-surface-400 mt-1 text-sm">
                            {JOB_TYPES[job.job_type]?.label || job.job_type} •{' '}
                            Created {formatDate(job.created_at)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteTarget(job)}
                      className="btn-ghost p-2.5 text-surface-400 hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/jobs/${id}/edit`)}
                      className="btn-secondary flex items-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="card">
                {changingStatus ? (
                    <div className="flex items-center justify-center py-4">
                        <Spinner />
                    </div>
                ) : (
                    <JobStageBar
                      currentStatus={job.status}
                      onStageChange={handleStageChange}
                      canEdit={true}
                    />
                )}
            </div>

            {/* Totals Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Labour Total', value: formatAmount(job.labour_total), color: 'text-brand-400' },
                    { label: 'Parts Total', value: formatAmount(job.parts_total), color: 'text-amber-400' },
                    { label: 'Total Amount', value: formatAmount(job.total_amount), color: 'text-emerald-400' },
                ].map((stat) => (
                    <div key={stat.label} className="card flex items-center gap-4">
                        <div>
                            <p classname={`text-2xl font-display font-bold ${stat.color}`}>
                                {stat.value}
                            </p>
                            <p className="text-surface-400 text-sm">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-surface-900 border border-surface-800 rounded-xl p-1 w-fit overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Job Description */}
                        <div className="card space-y-3">
                            <h2 className="section-title">Job Description</h2>
                            <p className="text-surface-300 leading-relaxed text-sm">
                                {job.description || 'No description provided.'}
                            </p>
                            {job.internal_notes && (
                                <div className="mt-4 pt-4 border-t border-surface-800">
                                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
                                        Internal Notes
                                    </p>
                                    <p className="text-surface-400 text-sm leading-relaxed">
                                        {job.internal_notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Customer & Vehicle */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Customer */}
                            <div className="card space-y-3">
                                <h2 className="section-title">Customer</h2>
                                <button
                                  onClick={() => navigate(`/customers/${job.customer_id}`)}
                                  className="flex items-center gap-3 w-full hover:bg-surface-800 p-2 rounded-xl transition-all"
                                >
                                    <div className="w-10 h-10 bg-brand-600 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <User className="2-5 h-5 text-brand-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-white">
                                            {getCustomerName()}
                                        </p>
                                        {job.customers?.phone && (
                                            <p className="text-xs text-surface-400">
                                                {job.customers.phone}
                                            </p>
                                        )}
                                    </div>
                                </button>

                                {job.is_insurance && (
                                    <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-xl p-3 space-y-1">
                                        <p className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                                            <Shield className="w-3 h-3" /> Insurance Details
                                        </p>
                                        {job.insurer_name && (
                                            <p className="text-xs text-surface-300">
                                                Insurer: {job.insurer_name}
                                            </p>
                                        )}
                                        {job.insurance_claim_number && (
                                            <p className="text-xs text-surface-300">
                                                Claim: {job.insurance_claim_number}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {job.is_warranty && (
                                    <div className="bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-20 rounded-xl p-3 space-y-1">
                                        <p className="text-xs font-smibold text-purple-400 flex items-center gap-1">
                                            <Star className="w-3 h-3" /> Warranty Details
                                        </p>
                                        {job.warranty_reference && (
                                            <p className="text-xs text-surface-300">
                                                Ref: {job.warranty_reference}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Vehicle */}
                            <div className="card space-y-3">
                                <h2 className="section-title">Vehicle</h2>
                                <button
                                  onClick={() => navigate(`/vehicles/${job.vehicle_id}`)}
                                  className="flex items-center gap-3 w-full hover:bg-surface-800 p-2 rounded-xl transition-all"
                                >
                                    <div className="w-10 h-10 bg-emerald-500 bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Car className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-white">
                                            {job.vehicles
                                              ? `${job.vehicles.year} ${job.vehicles.make} ${job.vehicles.model}`
                                              : '-'
                                            }
                                        </p>
                                        <p className="text-xsfont-mono text-surface-400">
                                            {job.vehicles?.registration_number || 'No plate'}
                                        </p>
                                    </div>
                                </button>

                                <div className="grid grid-cols-2 gap-2">
                                    {job.mileage_in && (
                                        <div className="bg-surface-800 rounded-lg p-2.5">
                                            <p className="text-xs text-surface-500 flex items-center gap-1">
                                                <Gauge className="w-3 h-3" /> Mileage In
                                            </p>
                                            <p className="text-sm font-semibold text-white mt-0.5">
                                                {job.mileage_in.toLocaleString()} km
                                            </p>
                                        </div>
                                    )}
                                    {job.estimated_completion && (
                                        <div className="bg-surface-800 rounded-lg p-2.5 col-span-2">
                                            <p className="text-xs text-surface-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Est. Completion
                                            </p>
                                            <p className="text-sm font-semibold text-white mt-0.5">
                                                {formatDate(job.estimated_completion)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Assigned Technician */}
                        <div className="card space-y-3">
                            <h2 className="section-title">Assigned To</h2>
                            {job.profiles ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-700 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-white">
                                            {job.profiles.first_name?.[0]}{job.profiles.last_name?.[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {job.profiles.first_name} {job.profiles.last_name}
                                        </p>
                                        <p className="text-xs text-surface-400 capitalize">
                                            {job.profiles.role}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-surface-500">Unassigned</p>
                                    <button
                                      onClick={() => navigate(`/jobs/${id}/edit`)}
                                      className="text-xs text.brand-400 hover:text-brand-300 mt-1"
                                    >
                                        Assign a technician
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Time Tracker */}
                        <JobTimerWidget jobId={id} />
                    </div>
                </div>
            )}

            {/* Labour Tab */}
            {activeTab === 'Labour' && (
                <div className="card">
                    <LabourLines jobId={id} canEdit={job.status !== 'invoiced'} />
                </div>
            )}

            {/* Parts Tab */}
            {activeTab === 'Parts' && (
                <div className="card">
                    <PartsLines jobId={id} canEdit={job.status !== 'invoiced'} />
                </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'Notes' && (
                <div className="card">
                    <JobNotes jobId={id} />
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'History' && (
                <div className="card space-y-4">
                    <h2 className="section-title">Status History</h2>
                    {statusHistory.length === 0 ? (
                        <div className="text-center py-8 text-surface-500 text-sm">
                            No history yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {statusHistory.map((entry) => (
                                <div key={entry.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                      <div className="w-8 h-8 bg-surface-800 rounded-full flex items-center justify-center flex-shrink-0">
                                        <ClipboardList className="w-3.5 h-3.5 text-surface-400" />
                                      </div>
                                      <div className="flex-1 w-px bg-surface-800 mt-2" />
                                    </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        {entry.from_status && (
                                            <>
                                              <JobStatusBadge status={entry.from_status} size="sm" />
                                              <span className="text-surface-500 text-xs">→</span>
                                            </>
                                        )}
                                        <JobStatusBadge status={entry.to_status} size="sm" />
                                        <span className="text-xs text-surface-500">
                                            {new Date(entry.created_at).toLocaleString('en-ZA', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                        {entry.profiles && (
                                            <span className="text-xs text-surface-500">
                                                by {entry.profiles.first_name} {entry.profiles.last_name}
                                            </span>
                                        )}
                                    </div>
                                    {entry.notes && (
                                        <p className="text-sm text-surface-400">{entry.notes}</p>
                                    )}
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirm */}
            <ConfirmDialog
              isOpen={!!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
              loading={deleting}
              title="Remove Job Card"
              message={`Are you sure you want to remove job ${job.job_number}? This action cannot be undone.`}
              confirmLabel="Remove Job Card"
            />
        </div>
    )
}