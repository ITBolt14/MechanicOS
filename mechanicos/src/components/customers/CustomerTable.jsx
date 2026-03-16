import { useNavigate } from "react-router-dom"
import { User, Building2, Phone, Mail, Car, ChevronRight, Trash2 } from 'lucide-react'
import { Badge } from "../ui/Badge"

export function CustomerTable({ customers, onDelete }) {
    const navigate = useNavigate()

    const getCustomerName = (customer) => {
        if (customer.customer_type === 'company') return customer.company_name
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }

    return (
        <div className="overflow-x-auto">
            <table className="w.full">
                <thead>
                    <tr className="border-b border-surface-800">
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Customer</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Type</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Contact</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">City</th>
                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                    {customers.map((customer) => {
                        <tr
                          key={customer.id}
                          className="hover:bg-surface-800 hover:bg-opacity-50 transition-colors curson-pointer group"
                          onClick={() => navigate(`/customer/${customer.id}`)}
                        >
                            <td className="py-4 pr-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-brand-600 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        {customer.customer_type === 'company'
                                          ? <Building2 className="w-4 h-4 text-brand-400" />
                                          : <User className="w-4 h-4 text-brand-400" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{getCustomerName(customer)}</p>
                                        {customer.id_number && (
                                            <p className="text-xs text-surface-500">ID: {customer.id_number}</p>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 pr-4">
                                <Badge variant={customer.customer_type === 'company' ? 'purple' : 'info'}>
                                    {customer.customer_type === 'company' ? 'Company' : 'Individual'}
                                </Badge>
                            </td>
                            <td className="py-4 pr-4">
                                <div className="space-y--1">
                                    {customer.phone && (
                                        <div className="flex items-center gap-1.5 text-xs text-surface-400">
                                            <Phone className="w-3 h-3" />
                                            {customer.phone}
                                        </div>
                                    )}
                                    {customer.email && (
                                        <div className="flex items-center gap-1.5 text-xs text-surface-400">
                                            <Mail className="w-3 h-3" />
                                            {customer.email}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 pr-4">
                                <span className="text-sm text-surface-400">{customer.city || '-'}</span>
                            </td>
                            <td className="py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(customer)
                                      }}
                                      className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-surface-800 transition-all opacity-0 group-hover:opcaity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <ChevronRight className="w-4 h-4 text-surface-600 group-hover:text-surface-300 transition-colors" />
                                </div>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}