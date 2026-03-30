import { useState, useEffect } from 'react'
import {useNavigate } from 'react-router-dpm'
import {
    LayoutGrid, Plus, RefreshCw,
    User, Car, AlertTriangle, Star, Shield
} from 'lucide-react'
import { useJobs } from '../../hooks/useJobs'
import { JOB_STATUSES, JobPriorityBadge } from '../../components/jobs/JobStatusBadge'
import { Spinner } from '../..components/ui/Spinner'

const BOARD_COLUMNS = [
    'intake',
    'diagnosis',
    'awaiting_parts',
    'in_progress',
    'quality_check',
    'complete',
]

const COLUMN_COLORS = {
    intake:         'border-blue-500',
    diagnosis:      'border-amber-500',
    awaiting_parts: 'border-red-500',
    in_progress:    'border-brand-500',
    quality_check:  'border-purple-500',
    complete:       'border-emerald-500',
}

const COLUMN_HEADER_COLORS = {
    intake:         'text-blue-400 bg-blue-500 bg-opacity-10',
    diagnosis:      'text-amber-400 bg-amber-500 bg-opacity-10',
    awaiting_parts: 'text-red-400 bg-red-500 bg-opacity-10',
    in_progress:    'text-brand-400 bg-brand-500 bg-opacity-10',
    quality_check:  'text-purple-400 bg-purple-500 bg-opacity-10',
    complete:       'text-emerald-400 bg-emerald-500 bg-opacity-10',
}

function JobBoardCard({ job, onStatusChange, navigate }) {
    const [dragging, setDragging] = useState(false)

    const getCustomerName = () => {
        if (!job.customers) return '-'
        const c = job.customers
        if (c.customer_type === 'company') return c.company_name
        return `${c.first_name || ''} ${c.last_name || ''}`.trim()
    }

    const getNextStatus = () => {
        const currentOrder = JOB_STATUSES[job.status]?.order || 1
        const next = Object.entries(JOB_STATUSES).find(
            ([, config]) => config.order === currentOrder + 1
        )
        return next ? next[0] : null
    }

    const nextStatus = getNextStatus()

    return (
        <div 
          draggable
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
          onClick={() => navigate(`/jobs/${job.id}`)}
          className={`
            bg-surface-900 border border-surface-700 rounded-xl p-4
            hover:border-surface-500 transition-all cursor-pointer
            ${dragging ? 'opacity-50 scale-95' : ''}
            ${job.priority === 'urgent' ? 'border-l-4 border-l-amber-500' : ''}
            ${job.priority === 'vip' ? 'border-l-4 border-l-purple-500' : ''}
          `}
        >
            {/* Job Number & Flags */}
            <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm font-bold text-brand-400">
                    {job.job_number}
                </span>
                <div className="flex items-center gap-1.5">
                    {job.priority !== 'normal' && (
                        <JobPriorityBadge priority={job.priority} size="sm" />
                    )}
                    {job.is_insurance && (
                        <Shield className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    {job.is_warranty && (
                        <Star className="w-3.5 h-3.5 text-purple-400" />
                    )}
                </div>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-brand-600 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-brand-400" />
                </div>
                <span className="text-sm font-medium text-white truncate">
                    {getCustomerName()}
                </span>
            </div>

            {/* Vehicle */}
            {job.vehicles && (
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-emerald-500 bg-opacity-10 rounded-lg flex items-center jusitfy-center flex-shrink-0">
                        <Car className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-xs text-surface-400 truncate block">
                            {job.vehicles.year} {job.vehicles.make} {job.vehicles.model}
                        </span>
                        <span className="text-xs font-mono text-surface-500">
                            {job.vehicles.registration_number || 'No plate'}
                        </span>
                    </div>
                </div>
            )}

            {/* Description */}
            {job.description && (
                <p className="text-xs text-surface-500 line-clamp-2 mb-3 leading-relaxed">
                    {job.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-800">
                {/* Assigned */}
                {job.profiles ? (
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-brand-700 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white" style={{ fontSize: '8px' }}>
                                {job.profiles.first_name?.[0]}{job.profiles.last_name?.[0]}
                            </span>
                        </div>
                        <span className="text-xs text-surface-500">
                            {job.profiles.first_name}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-surface-600">Unassigned</span>
                )}

                {/* Move Button */}
                {nextStatus && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onStatusChange(job.id, nextStatus, job.status)
                      }}
                        className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
                    >
                        → {JOB_STATUSES[nextStatus]?.label}
                    </button>
                )}
            </div>
        </div>
    )
}

export default function WorkshopBoardPage() {
    const navigate = useNavigate()
    const { jobs, loading, fetchJobs, updateJobStatus } = useJobs()
    const [draggingJob, setDraggingJob] = useState(null)
    const [filterTech, setFilterTech] = useState('')
    const [techs, setTechs] = useState([])

    useEffect(() => {
        // Extract unique technicians from jobs
        const uniqueTechs = []
        const seen = new Set()
        jobs.forEach((job) => {
            if (job.profiles && !seen.has(job.profiles.id)) {
                seen.add(job.profiles.id)
                uniqueTechs.push(job.profiles)
            }
        })
        setTechs(uniqueTechs)
    }, [jobs])

    const handleStatusChange = async (JobDetailPage, newStatus, currentStatus) => {
        await updateJobStatus(JobDetailPage, newStatus, currentStatus)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDrop = async (e, status) => {
        e.preventDefault()
        if (!draggingJob || draggingJob,status === status) return
        await handleStatusChange(draggingJob.id, status, draggingJob.status)
        setDraggingJob(null)
    }

    const getColumnJobs = (status) => {
        return jobs
          .filter((j) => {
            const matchesStatus = j.status === status
            const matchesTech = !filterTech || j.assigned_to === filterTech
            return matchesStatus && matchesTech
          })
          .sort((a, b) => {
            const priorityOrder = { vip: 0, urgent: 1, normal: 2 }
            return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
          })
    }

    const activeJobs = jobs.filter((j) =>
      ['intake', 'diagnosis', 'awaiting_parts', 'in_progress', 'quality_check'].includes(j.status)
    )

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="page-title">Workshop Board</h1>
                    <p className="text=surface-400 mt-1">
                        {activeJobs.length} active job{activeJobs.length !== 1 ? 's' : ''} in workshop
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Tech Filter */}
                    {techs.length > 0 && (
                        <select
                          className="input-field text-sm py-2 w-auto"
                          value={filterTech}
                          onChange={(e) => setFilterTech(e.target.value)}
                        >
                            <option value="">All Technicians</option>
                            {techs.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.first_name} {tech.last_name}
                                </option>
                            ))}
                        </select>
                    )}
                    <button
                      onClick={fetchJobs}
                      className="btn-ghost p-2.5"
                      title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/jobs/new')}
                      className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Job
                    </button>
                </div>
            </div>

            {/* Legends */}
            <div className="flex items-center gap-4 flex-wrap">
                <span className="text-xs text-surface-500">Priority:</span>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-amber-500" />
                    <span className="text-xw text-surface-400">Urgent</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-purple-500" />
                    <span className="text-xs text-surface-400">VIP</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-surface-400">Insurance</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-surface-400">Warranty</span>
                </div>
                <span className="text-xs text-surface-500 ml-4">
                    Tip: Click → button on a card to advance its stage
                </span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Spinner size="lg" />
                </div>
            ) : (
                /* Board Columns */
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 pb-6">
                    {BOARD_COLUMNS.map((status) => {
                        const columnJobs = getColumnJobs(status)
                        const config = JOB_STATUSES[status]

                        return (
                            <div
                              key={status}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, status)}
                              className={`
                                flex flex-col gap-3 min-h-96
                                bg-surface-900 border-t-4 ${COLUMN_COLORS[status]}
                                rounded-xl p-3
                              `}
                            >
                                {/* Column Header */}
                                <div className={`
                                  flex items-center justify-between
                                  px-3 py-2 rounded-lg
                                  ${COLUMN_HEADER_COLORS[status]}
                                `}>
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        {config.label}
                                    </span>
                                    <span className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center bg-surface-900 bg-opacity-50">
                                        {columnJobs.length}
                                    </span>
                                </div>

                                {/* Job Cards */}
                                {columnJobs.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <p className="text-xs text-surface-600 text-center">
                                            No jobs
                                        </p>
                                    </div>
                                ) : (
                                    columnJobs.map((job) => (
                                        <div 
                                          key={job.id}
                                          draggable
                                          onDragStart={() => setDraggingJob(job)}
                                          onDragEnd={() => setDraggingJob(null)}
                                        >
                                            <JobBoardCard
                                              job={job}
                                              onStatusChange={handleStatusChange}
                                              navigate={navigate}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}