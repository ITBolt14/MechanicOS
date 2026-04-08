import { useNavigate } from 'react-router-dom'
import { ChevronRight, Trash2, Copy, Car, User } from 'lucide-react'
import { EstimateStatusBadge } from './EstimateStatusBadge'

export function EstimateTable({ estimates, onDelete, onDuplicate }) {
    const navigate = useNavigate()

    const getCustomerName = (customer) => {
        if (!customer) return '-'
        if (customer.customer_type === 'company') return customer.company_name
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
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

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-surface-800">
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Estimate #</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Customer & Vehicle</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Job Card</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Status</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Rev</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Total (incl. VAT)</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Valid Until</th>
                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                    {estimates.map((estimate) => (
                        <tr
                          key={estimate.id}
                          className="hover:bg-surface-800 hover:bg-opacity-50 transition-colors cursor-pointer group"
                          onClick={() => navigate(`/estimates/${estimate.id}`)}
                        >
                            <td className="py-4 pr-4">
                                <span className="font-mono text-sm font-bold text-brand-400">
                                    {estimate.estimate_number}
                                </span>
                            </td>
                            <td className="py-4 pr-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3 h-3 text-surface-500" />
                                        <span className="text-sm font-medium text-white">
                                            {getCustomerName(estimate.customers)}
                                        </span>
                                    </div>
                                    {estimate.vehicles && (
                                        <div className="flex items-center gap-1.5">
                                            <Car className="w-3 h-3 text-surface-500" />
                                            <span className="text-xs text-surface-400">
                                                {estimate.vehicles.year} {estimate.vehicles.make} {estimate.vehicles.model}
                                            </span>
                                            <span className="font-mono text-xs text-surface-500">
                                                {estimate.vehicles.registration_number}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 pr-4">
                                {estimate.job_cards ? (
                                    <span className="font-mono text-xs text-surface-400">
                                        {estimate.job_cards.job_number}
                                    </span>
                                ) : (
                                    <span className="text-xs text-surface-600">No job card</span>
                                )}
                            </td>
                            <td className="py-4 pr-4">
                                <EstimateStatusBadge status={estimate.status} />
                            </td>
                            <td className="py-4 pr-4">
                                <span className="text-sm text-surface-400">
                                    v{estimate.revision}
                                </span>
                            </td>
                            <td className="py-4 pr-4">
                                <span className="text-sm font-mono font-semibold text-white">
                                    {formatAmount(estimate.total_amount)}
                                </span>
                            </td>
                            <td className="py-4 pr-4">
                                <span className="text-sm text-surface-400">
                                    {formatDate(estimate.valid_until)}
                                </span>
                            </td>
                            <td className="py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onDuplicate(estimate)
                                      }}
                                      className="p-2 rounded-lg text-surface-500 hover:text-brand-400 hover:bg-surface-800 transition-all opacity-0 group-hover:opacity-100"
                                      title="Duplicate estimate"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(estimate)
                                      }}
                                      className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-surface-800 transition-all opacity-0 group-hover:opacity-100"
                                      title="Delete estimate"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <ChevronRight className="w-4 h-4 text-surface-600 group-hover:text-surface-300 transition-colors" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}