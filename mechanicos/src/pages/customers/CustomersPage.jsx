import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Users, Plus, Search, RefreshCw } from 'lucide-react'
import { useCustomers } from "../../hooks/useCustomers"
import { CustomerTable } from "../../components/customers/CustomerTable"
import { EmptyState } from "../../components/ui/EmptyState"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import { Spinner } from "../../components/ui/Spinner"

export default function CustomersPage() {
    const navigate = useNavigate()
    const { customers, loading, fetchCustomers, deleteCustomer, searchCustomers } = useCustomers()
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
        const results = await searchCustomers(value)
        setSearchResults(results)
        setSearching(false)
    }

    const displayedCustomers = searchResults !== null ? searchResults : customers

    const getCustomerName = (customer) => {
        if (customer.customer_type === 'company') return customer.company_name
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }

    return (
        <div className="p-6 space-y-6">
            {/* Headers */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Customers</h1>
                    <p className="text-surface-400 mt-1">
                        {customers.length} customer{customers.length !== 1 ? 's' : ''} total
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                      onClick={fetchCustomers}
                      className="btn-ghost p-2.5"
                      title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/customers/new')}
                      className="btn-primary felx items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {searching
                      ? <Spinner size="sm" />
                      : <Search className="w-4 h-4 text-surface-500" />
                    }
                </div>
                <input
                  type="text"
                  placeholder="Search by name, phone or email..."
                  className="input-field pl-10"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Spinner size="lg" />
                    </div>
                ) : displayedCustomers.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title={search ? 'No customers found' : 'No customers yet'}
                      description={search
                        ? `No results for "${search}". Try a different search.`
                        : 'Add your first customer to get started.'
                      }
                      action={!search && (
                        <button
                          onClick={() => navigate('/customers/new')}
                          className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Customer
                        </button>
                      )}
                    />
                ) : (
                    <div className="p-6">
                        <CustomerTable
                          customers={displayedCustomers}
                          onDelete={setDeleteTarget}
                        />
                    </div>
                )}
            </div>

            {/* Delete Confirm */}
            <ConfirmDialog
              isOpen={!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
              loading={deleting}
              title="Remove Customer"
              message={`Are you sure you want to remove ${deleteTarget ? getCustomerName(deleteTarget) : ''}? This action cannot be undone.`}
              confirmLabel="Remove Customer"
            />
        </div>
    )
}