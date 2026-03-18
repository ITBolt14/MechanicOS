import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wrench, Mail, Lock, User, Building2, Phone } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const [form, setForm] = useState({
        // Step 1 - Company
        company_name: '',
        company_phone: '',
        company_email: '',
        // Step 2- Owner
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
    })

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

    const validateStep1 = () => {
        const e = {}
        if (!form.company_name) e.company_name = 'Company name is required'
        if (!form.company_email) e.company_email = 'Company email is required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const validateStep2 = () => {
        const e = {}
        if (!form.first_name) e.first_name = 'First name is required'
        if (!form.last_name) e.last_name = 'Last name is required'
        if (!form.email) e.email = 'Email is required'
        if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
        if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match'

       setErrors(e)
       return Object.keys(e).length === 0
    }

    const handleNext = () => {
        if (validateStep1()) setStep(2)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateStep2()) return
        setLoading(true)

        try {
            // 1. Create the company first
            const { data: companyId, error: companyError } = await supabase
              .rpc('register_workshop', {
                company_name: form.company_name,
                company_email: form.company_email,
                company_phone: form.company_phone || '',
              })

            if (companyError) {
                console.error('Company error:', companyError)
                throw companyError
            }   

            // 3. Register the user (trigger auto-create profiles)
            const { error: authError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        first_name: form.first_name,
                        last_name: form.last_name,
                        role: 'owner',
                        company_id: companyId,
                    }
                }
            })

            if (authError) {
                console.error('Auth error:', authError)
                throw authError
            }

            toast.success('Workshop registered! Please check your email to verify your account.')
            navigate('/login')

        } catch (err) {
            console.error('Full error:', err)
            toast.error(err.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">

                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 justify-center">
                    <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display text-xl font-bold text-white">MechanicOS</span>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-3 mb-8">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-3 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                              ${step >= s ? 'bg-brand-600 text-white' : 'bg-surface-800 text-surface-500'}`}>
                            {s}
                        </div>
                        <span className={`text-sm font-medium transition-all
                          ${step >= s ? 'text-white' : 'text-surface-500'}`}>
                          {s === 1 ? 'Your Workshop' : 'Your Account'}
                        </span>
                        {s <2 && <div className={`flex-1 h-px ${step > s ? 'bg-brand-600' : 'bg-surface-800'}`} />}
                    </div>
                    ))}
                </div>

                <div className="card">
                    {step === 1 ? (
                        <div className="space-y-5">
                            <div className="mb-6">
                                <h2 className="font-display text-2xl font-bold text-white mb-1">Register your workshop</h2>
                                <p className="text-surface-400 text-sm">Tell us about your business</p>
                            </div>

                            <Input
                              label="Workshop / Company Name"
                              placeholder="e.g. Smith's Auto Workshop"
                              icon={Building2}
                              value={form.company_name}
                              onChange={(e) => update('company_name', e.target.value)}
                              error={errors.company_name}
                            />
                            <Input
                              label="Company Email"
                              type="email"
                              placeholder="info@yourworkshop.co.za"
                              icon={Mail}
                              value={form.company_email}
                              onChange={(e) => update('company_email', e.target.value)}
                              error={errors.company_email}
                            />
                            <Input
                              label="Company Phone (optional)"
                              placeholder="+27 11 000 0000"
                              icon={Phone}
                              value={form.company_phone}
                              onChange={(e) => update('company_phone', e.target.value)}
                            />

                            <button onClick={handleNext} className="btn-primary w-full mt-2">
                                Continue
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="mb-6">
                                <h2 className="font-display text-2xl font-bold text-white mb-1">Create your account</h2>
                                <p className="text-surface-400 text-sm">You'll be the account owner</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                  label="First Name"
                                  placeholder="John"
                                  icon={User}
                                  value={form.first_name}
                                  onChange={(e) => update('first_name', e.target.value)}
                                  error={errors.first_name}
                                />
                                <Input
                                  label="Last Name"
                                  placeholder="Smith"
                                  icon={User}
                                  value={form.last_name}
                                  onChange={(e) => update('last_name', e.target.value)}
                                  error={errors.last_name}
                                />
                            </div>

                            <Input
                              label="Your Email"
                              type="email"
                              placeholder="john@yourworkshop.co.za"
                              icon={Mail}
                              value={form.email}
                              onChange={(e) => update('email', e.target.value)}
                              error={errors.email}
                            />
                            <Input
                              label="Password"
                              type="password"
                              placeholder="Min. 8 characters"
                              icon={Lock}
                              value={form.password}
                              onChange={(e) => update('password', e.target.value)}
                              error={errors.password}
                            />
                            <Input
                              label="Confirm Password"
                              type="password"
                              placeholder="Repeat your password"
                              icon={Lock}
                              value={form.confirm_password}
                              onChange={(e) => update('confirm_password', e.target.value)}
                              error={errors.confirm_password}
                            />

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                                    Back
                                </button>
                                <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    {loading ? <Spinner size="sm" /> : null}
                                    {loading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <p className="mt-6 text-center text-surface-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
                      Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}