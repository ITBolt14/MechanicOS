import { useNavigate } from "react-router-dom"
import { Car, ChevronRight, Trash2, User } from 'lucide-react'
import { Badge } from '../ui/Badge'

export function VehicleTable({ vehicles, onDelete, showCustomer = true }) {
    const navigate = useNavigate()

    const getCustomerName = (customer) => {
        if (!customer) return '-'
        if (customer.customer_type === 'company') return customer.company_name
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }

    const getFuelBadge = (fuel) => {
        const map = {
            petrol : 'warning',
            diesel: 'info',
            electric: 'success',
            hybrid: 'purple',
        }
        return map[fuel] || 'default'
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-surface-800">
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Vehicle</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Registration</th>
                        {showCustomer && (
                            <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Owner</th>
                        )}
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Fuel</th>
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3 pr-4">Mileage</th>
                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                    {vehicles.map((vehicle) => (
                        <tr
                          key={vehicle.id}
                          className="hover:bg-surface-800 hover:bg-opacity-50 transition-colors cursor-pointer group"
                          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                        >
                            <td className="py-4 pr-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-emerald-500 bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Car className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {vehicle.year} {vehicle.make} {vehicle.model}
                                        </p>
                                        <p className="text-xs text-surface-500">{vehicle.colour || '-'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 pr-4">
                                <span className="font-mono text-sm text-white bg-surface-800 px-2.5 py-1 rounded-lg">
                                    {vehicle.registration_number || '-'}
                                </span>
                            </td>
                            {showCustomer && (
                                <td className="py-4 pr-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-surface-500" />
                                        <span className="text-sm text-surface-300">
                                            {getCustomerName(vehicle.customers)}
                                        </span>
                                    </div>
                                </td>
                            )}
                            <td className="py-4 pr-4">
                                <Badge variant={getFuelBadge(vehicle.fuel_type)}>
                                    {vehicle.fuel_type ? vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1) : '-'}
                                </Badge>
                            </td>
                            <td className="py-4 pr-4">
                                <span className="text-sm text-surface-400">
                                    {vehicle.current_mileage ? `${vehicle.current_mileage.toLocaleString()} km` : '-'}
                                </span>
                            </td>
                            <td className="py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(vehicle)
                                      }}
                                      className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-surface-800 transition-all opacity-0 group-hover:opacity-100"
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