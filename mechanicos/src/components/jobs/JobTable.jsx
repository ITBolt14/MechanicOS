import { useNavigate } from 'react-router-dom'
import {ChevronRight, Trash2, Car, User, Clock } from 'lucide-react'
import { JobStatusBadge, JobPriorityBadge, JOB_TYPES } from './JobStatusBadge'

export function JobTable({ jobs, onDelete }) {
    const navigate = useNavigate()

    const getCustomerName = (customer) => {
        if (!customer) return '-'
        if (customer.customer_type === 'companny') return customer.company_name
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleDateString('en.ZA', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    const formatAmount = (amount) => {
        if (!amount) return 'R 0.00'
        return `R ${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-surface-800">
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Job #</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Customer & Vehicle</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Type</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Status</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Priority</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Assigned To</th>"
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Total</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Date</th>
                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3">Actions</th>"
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                    {jobs.map((job) => (
                        <tr
                          key={job.id}
                          className="hover:bg-surface-800 hover:bg-opacity-50 transition-colors cursor-pointer group"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                            <td className="py-4 pr-4">
                                <span className="font-mono text-sm font-bold text-brand-400">
                                    {job.job_number}
                                </span>
                                {job.is_insurance && (
                                    <span className="ml-2 text-xs bg-blue-500 bg-opacity-20 text-blue-400 px-1.5 py-0.5 rounded">
                                        INS
                                    </span>
                                )}
                                {job.is_warranty && (
                                    <span className="ml-2 text-xs bg-purple-500 bg-opacity-20 text-purple-400 px-1.5 py-0.5 rounded">
                                        WAR
                                    </span>
                                )}
                            </td>
                            <td className="py-4 pr-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3 h-3 text-surface-500" />
                                        <span className="text-sm font-medium text-white">
                                            {getCustomerName(job.customers)}
                                        </span>
                                    </div>
                                    {job.vehicles && (
                                        <div className="flex items-center gap-1.5">
                                            <Car className="w-3 h-3 text-surface-500" />
                                            <span className="text-xs text-surface-400">
                                                {job.vehicles.year} {job.vehicles.make} {job.vehicles.model}
                                            </span>
                                            <span className="font-mono text-xs text-surface-500">
                                                {job.vehicles.registration_number}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 pr-4">
                                <span className="text-sm text-surface-400">
                                    {JOB_TYPES[job.job_type]?.label || job.job_type}
                                </span>
                            </td>
                            <td className="py-4 pr-4">
                                <JobStatusBadge status={job.status} />
                            </td>
                            <td className="py-4 pr-4">
                                <JobPriorityBadge priority={job.priority} />
                            </td>
                            <td className="py-4 pr-4">
                                {job.profiles ? (
                                    <span className="text-sm text-surface-300">
                                        {job.profiles.first_name} {job.profiles.last_name}
                                    </span>
                                ) : (
                                    <span className="text-sm text-surface-600">Unassigned</span>
                                )}
                            </td>
                            <td className="py-4 pr-4">
                                <span className="text-sm font-mono text-white">
                                    {formatAmount(job.total_amount)}
                                </span>
                            </td>
                            <td className="py-4 pr-4">
                                <span className="text-sm text-surface-400">
                                    {formatDate(job.created_at)}
                                </span>
                            </td>
                            <td className="py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(job)
                                      }}
                                      className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-surface-800 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 classname="w-4 h-4" />
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