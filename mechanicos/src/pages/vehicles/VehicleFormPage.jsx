import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useVehicles } from '../../hooks/useVehicles'
import { useCustomers } from '../../hooks/useCustomers'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { Spinner } from '../../components/ui/Spinner'

const MAKES = [
    'Audi','BMW','Chevrolet','Chrysler','Citroen','Datsun','Ferrari',
    'Fiat','Ford','Honda','Hyundai','Isuzu','Jaguar','Jeep','Kia',
    'Land Rover','Lexus','Mahindra','Mazda','Mercedes-Benz','Mini',
    'Mitsubishi','Nissan','Opel','Peugeot','Porsche','Renault','Subaru',
    'Suzuki','Toyota','Volkswagen','Volvo','Other'
].map((m) => ({ value: m, label: m }))

const YEARS = Array.from({ length:35 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { value: year, label: year.toString() }
})

const COLOURS = [
    'Black','White','Silver','Grey','Red','Blue','Green',
    'Yellow','Orange','Brown','Gold','Maroon','Navy','Other'
].map((c) => ({ value: c, label: c }))

export default function VehicleFormPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const preselectedCustomerId = searchParams.get('customer_id')
    const isEditing = !!id

    const { getVehicle, createVehicle, updateVehicle } = useVehicles()
    const { customers, loading: customersLoading } = useCustomers()

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEditing)
    const [errors, setErrors] = useState({})

    const [form, setForm] = useState({
        customer_id: preselectedCustomerId || '',
        registration_number: '',
        vin_number: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        colour: '',
        engine_size: '',
        transmission: 'automatic',
        fuel_type: 'petrol',
        current_mileage: '',
        notes: '',
    })

    useEffect(() => {
        if (isEditing) {
            getVehicle(id).then((vehicle) => {
                if (vehicle) {
                    setForm({
                        ...vehicle,
                        customer_id: vehicle.customer_id || '',
                        current_mileage: vehicle.current_mileage || '',
                    })
                }
                setFetching(false)
            })
        }
    }, [id])

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
    }

    const validate = () => {
        const e = {}
        if (!form.customer_id) e.customer_id = 'Please select a customer'
        if (!form.make) e.make = 'Make is required'
        if (!form.model) e.model = 'Model is required'
        if (!form.year) e.year = 'Year is required'
        if (!form.registration_number && !form.vin_number) {
            e.registration_number = 'At least a registration number or VIN is required'
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)

        const payload = {
            ...form,
            current_mileage: form.current_mileage ? parseInt(form.current_mileage) : null,
            year: parseInt(form.year),
        }

        const result = isEditing
          ? await updateVehicle(id, payload)
          : await createVehicle(payload)

        setLoading(false)
        if (result) {
            if (preselectedCustomerId) {
                navigate(`/customers/${preselectedCustomerId}`)
            } else {
                navigate(isEditing ? `/vehicles/${id}` : '/vehicles')
            }
        }
    }

    const getCustomerLabel = (customer) => {
        if (customer.customer_type === 'company') return customer.company_name
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="btn-ghost p-2">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="page-title">
                        {isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
                    </h1>
                    <p className="text-surface-400 mt-1">
                        {isEditing ? 'Update vehicle details' : 'Register a new Vehicle'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Owner */}
                <div className="card space-y-4">
                    <h2 className="section-title">Vehicle Owner</h2>
                    <Select
                      label="Customer"
                      placeholder={customersLoading ? 'Loading customers...' : 'Select a customer...'}
                      value={form.customer_id}
                      onChange={(e) => update('customer_id', e.target.value)}
                      error={errors.customer_id}
                      options={customers.map((c) => ({
                        value: c.id,
                        label: getCustomerLabel(c),
                      }))}
                    />
                    <p className="text-xs text-surface-500">
                        Customer not listed?{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/customers/new')}
                          className="text-brand-400 hover:text-brand-300"
                        >
                            Add a new customer first
                        </button>
                    </p>
                </div>

                {/* Vehicle Identity */}
                <div className="card space-y-4">
                    <h2 className="section-title">Vehicle Identity</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Registration Number"
                          placeholder="e.g. GP 123-456"
                          value={form.registration_number}
                          onChange={(e) => update('registration_number', e.target.value.toUpperCase())}
                          error={errors.registration_number}
                        />
                        <Input
                          label="VIN Number (optional)"
                          placeholder="17-character VIN"
                          value={form.vin_number}
                          onChange={(e) => update('vin_number', e.target.value.toUpperCase())}
                        />
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="card space-y-4">
                    <h2 className="section-title">Vehicle Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Make"
                          placeholder="Select make..."
                          value={form.make}
                          onChange={(e) => update('make', e.target.value)}
                          error={errors.make}
                          options={MAKES}
                        />
                        <Input
                          label="Model"
                          placeholder="e.g. Polo Vivo"
                          value={form.model}
                          onChange={(e) => update('model', e.target.value)}
                          error={errors.model}
                        />
                        <Select
                          label="Year"
                          value={form.year}
                          onChange={(e) => update('year', e.target.value)}
                          error={errors.year}
                          options={YEARS}
                        />
                        <Select
                          label="Colour"
                          placeholder="Select colour..."
                          value={form.colour}
                          onChange={(e) => update('colour', e.target.value)}
                          options={COLOURS}
                        />
                        <Input
                          label="Engine Size (optional)"
                          placeholder="e.g. 1.4, 2.0T"
                          value={form.engine_size}
                          onChange={(e) => update('engine_size', e.target.value)}
                        />
                        <Input
                          label="Current Mileage (km)"
                          type="number"
                          placeholder="e.g. 85000"
                          value={form.current_mileage}
                          onChange={(e) => update('current_mileage', e.target.value)}
                        />
                        <Select
                          label="Transmission"
                          value={form.transmission}
                          onChange={(e) => update('transmission', e.target.value)}
                          options={[
                            { value: 'automatic', label: 'Automatic' },
                            { value: 'manual', label: 'Manual' },
                          ]}
                        />
                        <Select
                          label="Fuel Type"
                          value={form.fuel_type}
                          onChange={(e) => update('fuel_type', e.target.value)}
                          options={[
                            { value: 'petrol', label: 'Petrol' },
                            { value: 'diesel', label: 'Diesel' },
                            { value: 'electric', label: 'Electric' },
                            { value: 'hybrid', label: 'Hybrid' },
                          ]}
                        />
                    </div>
                </div>

                {/* Notes */}
                <div className="card space-y-4">
                    <h2 className="section-title">Notes (optional)</h2>
                    <Textarea
                      placeholder="Any additional notes about this vehicle..."
                      rows={3}
                      value={form.notes}
                      onChange={(e) => update('notes', e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        {loading ? <Spinner size="sm" /> : null}
                        {loading
                          ? isEditing ? 'Saving...' : 'Adding...'
                          : isEditing ? 'Save Changes' : 'Add Vehicle'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}