import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft, Edit, Trash2, Copy, FileText,
    Send, CheckCircle, XCircle, Car, User,
    Calendar, Hash, Download, Printer
} from 'lucide-react'
import { useEstimates } from '../../hooks/useEstimates'
import { useEstimateLines } from '../../hooks/useEstimateLines'
import { useEstimateSettings } from '../../hooks/useEstimateSettings'
import { EstimateStatusBadge, ESTIMATE_STATUSES } from '../../components/estimates/EstimateStatusBadge'
import { EstimateLabourLines } from '../../components/estimates/EstimateLabourLines'
import { EstimatePartsLines } from '../../components/estimates/EstimatePartsLines'
import { PaintCalculator } from '../../components/estimates/PaintCalculator'
import { SubletLines } from '../../components/estimates/SubletLines'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner } from '../../components/ui/Spinner'
import { Modal } from '../../components/ui/Modal'

const TABS = ['Summary', 'Labour', 'Parts', 'Paint & Materials', 'Sublets', 'Revisions']

export default function EstimateDetailPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { getEstimate, updateEstimateStatus, deleteEstimate, duplicateEstimate } = useEstimates()
    const { revisions, fetchRevisions } = useEstimateLines(id)
    const { settings, getRateForJobType } = useEstimateSettings()

    const [estimate, setEstimate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Summary')
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [rejectModal, setRejectModal] = useState(false)
    const [rejectReason, setRejectReason] = useState('')

    // Live totals state
    const [labourTotal, setLabourTotal] = useState(0)
    const [partsTotal, setPartsTotal] = useState(0)
    const [paintTotal, setPaintTotal] = useState(0)
    const [subletTotal, setSubletTotal] = useState(0)
    const [subtotal, setSubtotal] = useState(0)
    const [vatAmount, setVatAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)

    useEffect(() => {
        loadEstimate()
        fetchRevisions()
    }, [id])

    const loadEstimate = async () => {
        const data = await getEstimate(id)
        setEstimate(data)
        if (data) {
            setLabourTotal(data.labour_total || 0)
            setPartsTotal(data.parts_total || 0)
            setPaintTotal(data.paint_total || 0)
            setSubletTotal(data.sublet_total || 0)
            setSubtotal(data.subtotal || 0)
            setVatAmount(data.vat_amount || 0)
            setTotalAmount(data.total_amount || 0)
        }
        setLoading(false)
    }

    const refreshTotals = async () => {
        const data = await getEstimate(id)
        if (data) {
            setLabourTotal(data.labour_total || 0)
            setPartsTotal(data.parts_total || 0)
            setPaintTotal(data.paint_total || 0)
            setSubletTotal(data.sublet_total || 0)
            setSubtotal(data.subtotal || 0)
            setVatAmount(data.vat_amount || 0)
            setTotalAmount(data.total_amount || 0)
        }
    }

    const handleStatusChange = async (newStatus, notes = '') => {
        setUpdatingStatus(true)
        await updateEstimateStatus(id, newStatus, notes)
        await loadEstimate()
        setUpdatingStatus(false)
    }

    const handleDelete = async () => {
        setDeleting(true)
        await deleteEstimate(id)
        setDeleting(false)
        navigate('/estimates')
    }

    const handleDuplicate = async () => {
        const result = await duplicateEstimate(id)
        if (result) navigate(`/estimates/${result.id}`)
    }

    const handleRejectSubmit = async () => {
        await handleStatusChange('rejected', rejectReason)
        setRejectModal(false)
        setRejectReason('')
    }

    const getCustomerName = () => {
        if (!estimate?.customers) return '-'
        const c = estimate.customers
        if (c.customer_type === 'company') return c.company_name
        return `${c.first_name || ''} ${c.last_name || ''}`.trim()
    }

    const formatAmount = (amount) => {
        if (!amount && amount !== 0) return 'R 0.00'
        return `R ${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleDateString('en-ZA', {
            day: '2-digit', month: 'short', year: 'numeric',
        })
    }

    const canEdit = estimate?.status === 'draft'

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    if (!estimate) {
        return (
            <div className="p-6">
                <EmptyState
                  icon={FileText}
                  title="Estimate not found"
                  description="This estimate may have been removed."
                  action={
                    <button onClick={() => navigate('/estimates')} className="btn-primary">
                        Back to Estimates
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
                    <button onClick={() => navigate('/estimates')} className="btn-ghost p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="page-title font-mono">{estimate.estimate_number}</h1>
                            <EstimateStatusBadge status={estimate.status} />
                            <Badge variant="default" size="sm">v{estimate.revision}</Badge>
                        </div>
                        <p className="text-surface-400 mt-1 text-sm">
                            Created {formatDate(estimate.created_at)}
                            {estimate.valid_until && ` • Valid until ${formatDate(estimate.valid_until)}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Action Buttons */}
                    {estimate.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange('sent')}
                          disabled={updatingStatus}
                          className="btn-secondary flex items-center gap-2 text-sm"
                        >
                            <Send className="w-4 h-4" />
                            Mark as Sent
                        </button>
                    )}
                    {estimate.status === 'sent' && (
                        <>
                          <button
                            onClick={() => handleStatusChange('approved')}
                            disabled={updatingStatus}
                            className="flex items.center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                        </button>
                        <button
                          onClick={() => setRejectModal(true)}
                          disabled={updatingStatus}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all"
                        >
                            <XCircle className="w-4 h-4" />
                            Reject
                        </button>
                        </>
                    )}

                    <button
                      onClick={handleDuplicate}
                      className="btn-ghost p-2.5"
                      title="Duplicate estimate"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(estimate)}
                      className="btn-ghost p-2.5 text-surface-400 hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    {canEdit && (
                        <button
                          onClick={() => navigate(`/estimates/${id}/edit`)}
                          className="btn-secondary flex items-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    )}
                    <button
                      onClick={() => navigate(`/estimates/${id}/pdf`)}
                      className="btn-primary flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                </div>
            </div>

            {/* Totals Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Labour', value: formatAmount(labourTotal), color: 'text-brand-400' },
                    { label: 'Parts', value: formatAmount(partsTotal), color: 'text-amber-400' },
                    { label: 'Paint & Sublets', value: formatAmount(paintTotal + subletTotal), color: 'text-purple-400' },
                    { label: 'Total (incl. VAT)', value: formatAmount(totalAmount), color: 'text-emerald-400' },
                ].map((stat) => (
                    <div key={stat.label} className="card flex items-center gap-3">
                        <div>
                            <p className={`text-xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-surface-400 text-sm">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-surface-900 border border-surface-800 rounded-xl p-1 overflow-x-auto w-fit">
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

            {/* Summary Tab */}
            {activeTab === 'Summary' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Description */}
                        <div className="card space-y-3">
                            <h2 className="section-title">Description</h2>
                            <p className="text-surface-300 text-sm leading-relaxed">
                                {estimate.description || 'No description.'}
                            </p>
                            {estimate.notes && (
                                <div className="pt-3 border-t border-surface-800">
                                    <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">Customer Notes</p>
                                    <p className="text-surface-400 text-sm leading-relaxed">{estimate.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Customer & Vehicle */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="card space-y-3">
                                <h2 className="section-title">Customer</h2>
                                <button
                                  onClick={() => navigate(`/customers/${estimate.customer_id}`)}
                                  className="flex items-center gap-3 w-full hover:bg-surface-800 p-2 rounded-xl transition-all"
                                >
                                    <div className="w-10 h-10 bg-brand-600 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-brand-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-white">{getCustomerName()}</p>
                                        {estimate.customers?.phone && (
                                            <p className="text-xs text-surface-400">{estimate.customers.phone}</p>
                                        )}
                                    </div>
                                </button>
                            </div>

                            <div className="card space-y-3">
                                <h2 className="section-title">Vehicle</h2>
                                <button
                                  onClick={() => navigate(`/vehicles/${estimate.vehicle_id}`)}
                                  className="flex items-center gap-3 w-full hover:bg-surface-800 p-2 rounded-xl transition-all"
                                >
                                    <div className="w-10 h-10 bg-emerald-500 bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Car className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-white">
                                            {estimate.vehicles
                                              ? `${estimate.vehicles.year} ${estimate.vehicles.make} ${estimate.vehicles.model}`
                                              : '-'
                                            }
                                        </p>
                                        <p classname="text-xs font-mono text-surface-400">
                                            {estimate.vehicles?.registration_number || 'No plate'}
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Linked Job */}
                        {estimate.job_cards && (
                            <div className="card space-y-3">
                                <h2 className="section-title">Linked Job Card</h2>
                                <button
                                  onClick={() => navigate(`/jobs/${estimate.job_id}`)}
                                  className="flex items-center gap-3 hover:bg-surface-800 p-2 rounded-xl transition-all"
                                >
                                    <FileText className="w-5 h-5 text-brand-400" />
                                    <span className="font-mono text-sm text-brand-400">
                                        {estimate.job_cards.job_number}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Quote Summary */}
                    <div className="space-y-4">
                        <div className="card space-y-4">
                            <h2 className="section-title">Quote Summary</h2>
                            <div className="space-y-2">
                                {[
                                    { label: 'Labour', value: labourTotal },
                                    { label: 'Parts', value: partsTotal },
                                    { label: 'Paint & materials', value: paintTotal },
                                    { label: 'Sublet', value: subletTotal },
                                ].map((item) => {
                                    <div key={item.label} className="flex justify-between text-sm">
                                        <span className="text-surface-400">{item.label}</span>
                                        <span className="text-white">{formatAmount(item.value)}</span>
                                    </div>
                                })}

                                {estimate.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm text-red-400">
                                        <span>Discount</span>
                                        <span>- {formatAmount(estimate.discount_amount)}</span>
                                    </div>
                                )}

                                <div className="border-t border-surface-700 pt-2 mt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-surface-400">Subtotal (excl. VAT)</span>
                                        <span className="text-white font-semibold">{formatAmount(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-surface-400">VAT ({estimate.vat_rate}%)</span>
                                        <span className="text-amber-400">{formatAmount(vatAmount)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-surface-600 pt-3 mt-2">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-white">Total (incl. VAT)</span>
                                        <span className="text-xl font-display font-bold text-emerald-400">
                                            {formatAmount(totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quote Details */}
                        <div className="card space-y-3">
                            <h2 className="section-title">Quote Details</h2>
                            <div className="space-y-2">
                                {[
                                    { label: 'Payment Terms', value: estimate.payment_terms },
                                    { label: 'Valid Until', value: formatDate(estimate.valid_until) },
                                    { label: 'Sent', value: estimate.sent_at ? formatDate(estimate.sent_at) : 'Not sent' },
                                    { label: 'Approved', value: estimate.approved_at ? formatDate(estimate.approved_at) : '-' },
                                ].map((item) => {
                                    <div key={item.label} className="flex justify-between text-sm">
                                        <span className="text-surface-500">{item.label}</span>
                                        <span className="text-white">{item.value || '-'}</span>
                                    </div>
                                })}
                            </div>
                        </div>

                        {estimate.rejection_reason && (
                            <div className="card border-red-500 border-opacity-30 bg-red-500 bg-opacity-5">
                                <p className="text-xs font-semibold text-red-400 mb-1">Rejection Reason</p>
                                <p className="text-sm text-surface-300">{estimate.rejection_reason}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Labour Tab */}
            {activeTab === 'Labour' && (
                <div className="card">
                    <EstimateLabourLines
                      estimateId={id}
                      defaultRate={getRateForJobType(estimate.job_type)}
                      canEdit={canEdit}
                      onTotalsChange={refreshTotals}
                    />
                </div>
            )}

            {/* Parts Tab */}
            {activeTab === 'Parts' && (
                <div className="card">
                  <EstimatePartsLines
                    estimateId={id}
                    canEdit={canEdit}
                    onTotalsChange={refreshTotals}
                  />
                </div>
            )}

            {/* Paint Tab */}
            {activeTab === 'Paint & Materials' && (
                <div className="card">
                    <PaintCalculator
                      estimateId={id}
                      canEdit={canEdit}
                      onTotalsChange={refreshTotals}
                    />
                </div>
            )}

            {/* Sublets Tab */}
            {activeTab === 'Sublets' && (
                <div className="card">
                    <SubletLines
                      estimateId={id}
                      canEdit={canEdit}
                      onTotalsChange={refreshTotals}
                    />
                </div>
            )}

            {/* Revisions Tab */}
            {activeTab === 'Revisions' && (
                <div className="card space-y-4">
                    <h2 className="section-title">Revision History</h2>
                    {revisions.length === 0 ? (
                        <div className="text-center py-8 text-surface-500 text-sm">
                            No revisions yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {revisions.map((rev) => (
                                <div key={rev.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 bg-surface-800 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Hash className="w-3.5 h-3.5 text-surface-400" />
                                        </div>
                                        <div className="flex-1 w-px bg-surface-800 mt-2" />
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <Badge variant="default" size="sm">v{rev.revision_number}</Badge>
                                            <span className="text-xs text-surface-500">
                                                {new Date(rev.created_at).toLocaleString('en-ZA', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </span>
                                            {rev.profiles && (
                                                <span className="text-xs text-surface-500">
                                                    by {rev.profiles.first_name} {rev.profiles.last_name}
                                                </span>
                                            )}
                                        </div>
                                        {rev.notes && (
                                            <p className="text-sm text-surface-400">{rev.notes}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Reject Modal */}
            <Modal
              isOpen={rejectModal}
              onClose={() => setRejectModal(false)}
              title="Reject Estimate"
              size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-surface-400">
                        Please provide a reason for rejecting this estimate.
                    </p>
                    <textarea
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex gap-3">
                        <button onClick={() => setRejectModal(false)} className="btn-secondary flex-1">
                            Cancel
                        </button>
                        <button
                          onClick={handleRejectSubmit}
                          className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2.5 rounded-lg transition-all"
                        >
                            Reject Estimate
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm */}
            <ConfirmDialog
              isOpen={!!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
              loading={deleting}
              title="Remove Estimate"
              message={`Are you sure you want to remove estimate ${estimate.estimate_number}?`}
              confirmLabel="Remove Estimate"
            />
        </div>
    )
}