import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, User, Building2 } from 'lucide-react'
import { useCustomers } from '../../hooks/useCustomers'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { Spinner } from '../../components/ui/Spinner'

const PROVINCES = [
    { value: 'Gauteng', label: 'Gauteng' },
    { value: 'Western Cape', label: 'Western Cape' },
    { value: 'Kwazulu-Natal', label: 'Kwazulu-Natal' },
    { value: 'Eastern Cape', label: 'Eastern Cape' },
    { value: 'Limpopo', label: 'Limpopo' },
    { value: 'Mpumalanga', label: 'Mpumalanga' },
    { value: 'North West', label: 'North West' },
    { value: 'Free State', label: 'Free State' },
    { value: 'Northern Cape', label: 'Northern Cape' },
]

export default function CustomerFormPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = !!id
    const { getCustomer, createCustomer, updateCustomer } = useCustomers()

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEditing)
    const [errors, setErrors] = useState({})

    const [form, setForm] = useState({
        customer_type: 'individual',
        first_name: '',
        last_name: '',
        company_name: '',
        id_number: '',
        email: '',
        phone: '',
        alt_phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        province: '',
        postal_code: '',
        notes: '',
    })

    useEffect(() => {
        if (isEditing) {
            getCustomer(id).then((customer) => {
                if (customer) setForm(customer)
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
        if (form.customer_type === 'individual') {
            if (!form.first_name) e.first_name = 'First name is required'
            if (!form.last_name) e.last_name = 'Last name is required'
        } else {
            if (!form.company_name) e.company_name = 'Company name is required'
        }
        if (!form.phone && !form.email) {
            e.phone = 'At least a phone or email is required'
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)

        const result = isEditing
          ? await updateCustomer(id, form)
          : await createCustomer(form)

        setLoading(false)
        if (result) navigate(isEditing ? '/customers/${id}' : '/customers')
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
                        {isEditing ? 'Edit Customer' : 'New Customer'}
                    </h1>
                    <p className="text-surface-400 mt-1">
                        {isEditing ? 'Update customer information' : 'Add a new customer to your workshop'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Type */}
                <div className="card space-y-4">
                    <h2 className="section-title">Customer Type</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'individual', label: 'Individual', icon: User },
                            { value: 'company', label: 'Company', icon: Building2 },
                        ].map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => update('customer_type', type.value)}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                                ${form.customer_type === type.value
                                    ? 'border-brand-500 bg-brand-600 bg-opacity-10 text-white'
                                    : 'border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600'
                                }`}
                            >
                                <type.icon className="w-5 h-5" />
                                <span className="font-medium">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Personal / Company Info */}
                <div className="card space-y-4">
                    <h2 className="section-title">
                        {form.customer_type === 'company' ? 'Company Information' : 'Personal Information'}
                    </h2>

                    {form.customer_type === 'individual' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="First Name"
                              placeholder="John"
                              value={form.first_name}
                              onChange={(e) => update('first_name', e.target.value)}
                              error={errors.first_name}
                            />
                            <Input
                              label="Last Name"
                              placeholder="Smith"
                              value={form.last_name}
                              onChange={(e) => update('last_name', e.target.value)}
                              error={errors.last_name}
                            />
                            <Input
                              label="ID Number (optional)"
                              placeholder="8001015009087"
                              value={form.id_number}
                              onChange={(e) => update('id_number', e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Input
                                  label="Company Name"
                                  placeholder="ABC Motors (Pty) Ltd"
                                  value={form.company_name}
                                  onChange={(e) => update('company_name', e.target.value)}
                                  error={errors.company_name}
                                />
                            </div>
                            <Input
                              label="Contact Person (optional)"
                              placeholder="John Smith"
                              value={form.first_name}
                              onChange={(e) => update('first_name', e.target.value)}
                            />
                            <Input
                              label="Registration Number (optional)"
                              placeholder="2023/123456/07"
                              value={(e) => update('id_number', e.target.validate)}
                            />
                        </div>
                    )}
                </div>

                {/* Contact Details */}
                <div className="card space-y-4">
                    <h2 className="section-title">Contact Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Phone Number"
                          placeholder="+27 82 000 0000"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          error={errors.phone}
                        />
                        <Input
                          label="Alternative Phone (optional)"
                          placeholder="+27 11 000 0000"
                          value={form.alt_phone}
                          onChange={(e) => update('alt_phone', e.target.value)}
                        />
                        <div className="col-span-2">
                            <Input
                              label="Email Address (optional)"
                              type="email"
                              placeholder="customer@email.com"
                              value={form.email}
                              onChange={(e) => update('email', e.target.value)}
                            />
                        </div>
                    </div>
                </div>        

                {/* Address */}
                <div className="card space-y-4">
                    <h2 className="section-title">Address (optional)</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Input
                              label="Address Line 1"
                              placeholder="123 Main Street"
                              value={form.address_line1}
                              onChange={(e) => update('address_line1', e.target.value)}
                            />
                        </div>
                        <div className="col=span-2">
                            <Input
                              label="Address Line 2"
                              placeholder="Suburb"
                              value={form.address_line2}
                              onChange={(e) => update('address_line2', e.target.value)}
                            />
                        </div>
                        <Input
                          label="City"
                          placeholder="Johannesburg"
                          value={form.city}
                          onChange={(e) => update('city', e.target.value)}
                        />
                        <Select
                          label="Province"
                          placeholder="Select province..."
                          value={form.province}
                          onChange={(e) => update('province', e.target.value)}
                          options={PROVINCES}
                        />
                        <Input
                          label="Postal Code"
                          placeholder="2000"
                          value={form.postal_code}
                          onChange={(e) => update('postal_code', e.target.value)}
                        />
                    </div>
                </div>    

                {/* Notes */}
                <div className="card space-y-4">
                  <h2 className="section-title">Notes (optional)</h2>
                  <Textarea
                    placeholder="Any additional notes about this customer..."
                    rows={4}
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
                      ? isEditing ? 'Saving...' : 'Creating...'
                      : isEditing ? 'Save Changes' : 'Create Customer'
                    }
                </button>
              </div>    
            </form>
        </div>
    )
}