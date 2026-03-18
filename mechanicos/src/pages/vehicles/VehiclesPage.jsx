import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Car, Plus, Search, RefreshCw } from 'lucide-react'
import { useVehicles } from "../../hooks/useVehicles"
import { VehicleTable } from "../../components/vehicles/VehicleTable"
import { EmptyState } from "../../components/ui/EmptyState"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import { Spinner } from "../../components/ui/Spinner"

export default function VehiclesPage() {
    const navigate = useNavigate()
    const { vehicles, loading, fetchVehicles, deleteVehicle, searchVehicles } = useVehicles()
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
        const results = await searchVehicles(value)
        setSearchResults(results)
        setSearching(false)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        await deleteVehicle(deleteTarget.id)
        setDeleting(false)
        setDeleteTarget(null)
    }

    const displayedVehicles = searchResults !== null ? searchResults : vehicles

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Vehicles</h1>
                    <p className="text-surface-400 mt-1">
                        {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                      onClick={fetchVehicles}
                      className="btn-ghost p-2.5"
                      title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/vehicles/new')}
                      className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Vehicle
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
                  placeholder="Search by plate, VIN, make or model..."
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
                ) : displayedVehicles.length === 0 ? (
                    <EmptyState
                      icon={Car}
                      title={search ? 'No vehicles found' : 'No vehicles yet'}
                      description={search
                        ? `No results for "${search}". Try searching by plate number or make.`
                        : 'Add your first vehicle to get started.'
                      }
                      action={!search && (
                        <button
                          onClick={() => navigate('/vehicles/new')}
                          className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Vehicle
                        </button>
                      )}
                    />
                ) : (
                    <div className="p-6">
                        <VehicleTable
                          vehicles={displayedVehicles}
                          onDelete={setDeleteTarget}
                          showCustomer={true}
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
              title="Remove Vehicle"
              message={`Are you sure you want to remove ${deleteTarget
                ? `${deleteTarget.year} ${deleteTarget.make} ${deleteTarget.model}`
                : 'this vehicle'}? This action cannot be undone.`}
              confirmLabel="Remove Vehicle"
            />
        </div>
    )
}