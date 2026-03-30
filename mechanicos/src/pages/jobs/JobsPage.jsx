import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ClipboardList, Plus, Search,
    RefreshCw, LayoutGrid, List
} from 'lucide-react'
import { useJobs } from '../../hooks/useJobs'
import { JobTable } from '../../components/jobs/JobTable'
import { JobStatusBadge, JOB_STATUSES } from '../../components/jobs/JobStatusBadge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner } from '../../components/ui/Spinner'

const STATUS_FILTERS = [
    { value: '', label: 'All Jobs' },
    ...Object.entries(JOB_STATUSES).map(([value, config]) => ({
        value,
        label: config.label,
    })),
]

export default function JobsPage() {
    const navigate = useNavigate()
    const [statusFilter, setStatusFilter] = useState('')
    const { jobs, loading, fetchJobs, deleteJob, searchJob } = useJobs(
        statusFilter ? { status: statusFilter } : {}
    )
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState(null)
    const [searching, setSearching] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const handleSearch = async (value) => {
        setSearch(value)
        if (!value.trim()) {
            setSearchResults(null)
            return
        }
        setSearching(true)
        const results = await searchJobs(value)
        setSearchResults(results)
        setSearching(false)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        await deleteJob(deleteTarget.id)
        setDeleting(false)
        setDeleteTarget(null)
    }

    const displayedJobs = searchResults !== null ? searchResults : jobs

    // Stats per status
    const statusCounts = Object.keys(JOB_STATUSES).reduce((acc, status) => {
        acc[status] = jobs.filter((j) => j.status === status).length
        return acc
    }, {})

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Job Cards</h1>
                    <p className="text-surface-400 mt-1">
                        {jobs.length} job{jobs.length !== 1 ? 's' : ''} total
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                      onClick={fetchJobs}
                      className="bt-ghost p-2.5"
                      title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/jobs/new')}
                      className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Job Card
                    </button>
                </div>
            </div>

            {/* Status Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.entries(JOB_STATUSES).map(([status, config]) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                      className={`card p-3 text-left transition-all hover:border-surface-600
                        ${statusFilter === status
                            ? 'border-brand-500 bg-brand-600 bg-opacity-10'
                            : ''
                        }`}
                    >
                        <p className="text-xl font-display font-bold text-white">
                            {statusCounts[status] || 0}
                        </p>
                        <div className="mt-1">
                            <JobStatusBadge status={status} size="sm" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {searching
                          ? <Spinner size="sm" />
                          : <Search className="w-4 h-4 text-surface-500" />
                        }
                    </div>
                    <input
                      type="text"
                      placeholder="Search by job number or description..."
                      className="input-field pl-10"
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {statusFilter && (
                    <button
                      onClick={() => setStatusFilter('')}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                        <JobStatusBadge status={statusFilter} size="sm" />
                        Clear Filter
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="flex items-center jjustify-center py-16">
                        <Spinner size="lg" />
                    </div>
                ) : displayedJobs.length === 0 ? (
                    <EmptyState
                      icon={ClipboardList}
                      title={search ? 'No jobs found' : statusFilter ? `No jobs with status "${JOB_STATUSES[statusFilter]?.label}"` : 'No job cards yet'}
                      description={search
                        ? `No results for "${search}".`
                        : 'Create your first job card to get started.'
                      }
                      action={!search && !statusFilter && (
                        <button
                          onClick={() => navigate('/jobs/new')}
                          className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Job Card
                        </button>
                      )}
                    />
                ) : (
                    <div className="p-6">
                        <JobTable
                          jobs={displayedJobs}
                          onDelete={setDeleteTarget}
                        />
                    </div>
                )}
            </div>

            {/* Delete Confirm */}
            <ConfirmDialog
              isOpen={!!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
              loading={deleting}
              title="Remove Job Card"
              message={`Are you sure you want to remove job ${deleteTarget?.job_number}? This action cannot be undone.`}
              confirmLabel="Remove Job Card"
            />
        </div>
    )
}