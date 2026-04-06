import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Search, RefreshCw } from 'lucide-react'
import { useEstimates } from '../../hooks/useEstimates'
import { EstimateTable } from '../../components/estimates/EstimateTable'
import { EstimateStatusBadge, ESTIMATE_STATUSES } from '../../components/estimates/EstimateStatusBadge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner } from '../../components/ui/Spinner'

export default function EstimatesPage() {
    const navigate = useNavigate()
    const [statusFilter, setStatusFilter] = useState('')
    const { estimates, loading, fetchEstimates, deleteEstimate, duplicateEstimate } = useEstimates(
        statusFilter ? { status: statusFilter } : {}
    )
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [duplicating, setDuplicating] = useState(false)

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        await deleteEstimate(deleteTarget.id)
        setDeleting(false)
        setDeleteTarget(null)
    }

    const handleDuplicate = async (estimate) => {
        setDuplicating(true)
        const result = await duplicateEstimate(estimate.id)
        setDuplicating(false)
        if (result) navigate(`/estimates/${result.id}`)
    }

    const statusCounts = Object.keys(ESTIMATE_STATUSES).reduce((acc, status) => {
        acc[status] = estimates.filter((e) => e.status === status).length
        return acc
    }, {})

    const filteredEstimates = search
      ? estimates.filter((e) =>
        e.estimate_number?.toLowerCase().includes(search.toLowerCase()) ||
        e.customers?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        e.customers?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        e.customers?.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        e.vehicles?.registration_number?.toLowerCase().includes(search.toLowerCase())
      )
    : estimates

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 classname="page-title">Estimates</h1>
                    <p classname="text-surface-400 mt-1">
                        {estimates.length} estimate{estimates.length !== 1 ? 's' : ''} total
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchEstimates} className="btn-ghost p-2.5" title="Refresh">
                        <RefreshCw className="w-4 g-4" />
                    </button>
                    <button 
                      onClick={() => navigate('/estimates/new')}
                      className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Estimate
                    </button>
                </div>
            </div>

            {/* Status Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(ESTIMATE_STATUSES).map(([status, config]) => (
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
                            <EstimateStatusBadge status={status} size="sm" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-4 flew-wrap">
                <div className="relative flex-1 min-w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-surface-500" />
                    </div>
                    <input 
                      type="text"
                      placeholder="Search by estimate number, customer or plate..."
                      className="input-field pl-10"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {statusFilter && (
                    <button
                      onClick={() => setStatusFilter('')}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                        <EstimateStatusBadge status={statusFilter} size="sm" />
                        Clear Filter
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div classname="flex items-center justify-center py-16">
                        <Spinner size="lg" />
                    </div>
                ) : filteredEstimates.length === 0 ? (
                    <EmptyState
                      icon={FileText}
                      title={search ? 'No estimates found' : statusFilter ? `No ${ESTIMATE_STATUSES[statusFilter]?.label} estimates` : 'No estimates yet'}
                      description={search
                        ? `No results for "${search}".`
                        : 'Create your first estimate to get started.'
                      }
                      action={!search && !searchFilter && (
                        <button
                          onClick={() => navigate('/estimates/new')}
                          className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Estimate
                        </button>
                      )}
                    />
                ) : (
                    <div className="p-6">
                        <EstimateTable
                          estimates={filteredEstimates}
                          onDelete={setDeleteTarget}
                          onDuplicate={handleDuplicate}
                        />
                    </div>
                )}
            </div>

            <ConfirmDialog
              isOpen={!!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
              loading={deleting}
              title="Remove Estimate"
              message={`Are you sure you want to remove estimate ${deleteTarget?.estimate_number}?`}
              confirmLabel="Remove Estimate"
            />
        </div>
    )
}