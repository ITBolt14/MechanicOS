import { useState } from 'react'
import { Link, useNavigate }from 'react-router-dom'
import { Wrench, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = () => {
        const e = {}
        if (!form.email) e.email = 'Email is required'
        if (!form.password) e.password = 'Password is required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        toast.success('Welcome back!')
        navigate('/dashboard')
    }

    return (
        <div className="min-h-screen bg-surface-950 flex">

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface-900 via-surface-950 to-brand-950 flex-col justify-between p-12 border-r border-surface-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-xl font-bold text-white">MechanicOS</span>
              </div>

              <div>
                <h1 className="font-display text-5xl font-bold text-white leading-tight mb-6">
                    Run your workshop.<br />
                    <span className="text-brand-400">Smarter.</span>
                </h1>
                <p className="text-surface-400 text-lg leading-relaxed max-w-md">
                    The complete workshop management system built for modern mechanical and panel beating businesses.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Job Cards', value: 'Live' },
                    { label: 'Estimating', value: 'Built-in' },
                    { label: 'Multi-Branch', value: 'Ready' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-surface-800 bg-opacity-50 rounded-xl p-4 border border-surface-700">
                        <div className="text-brand-400 font-display font-bold text-lg">{stat.value}</div>
                        <div className="text-surface-400 text-sm mt-1">{stat.label}</div>
                    </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="flex items-center gap-3 mb-10 lg:hidden">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display text-xl font-bold text-white">MechanicOS</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h2>
                        <p className="text-surface-400">Sign in to your workshop account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                          label="Email address"
                          type="email"
                          placeholder="you@workshop.com"
                          icon={Mail}
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          error={errors.email}
                        />

                        <div className="w-full">
                            <label className="label">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-4 h-4 text-surface-500" />
                                </div>
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="••••••••••••"
                                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                  value={form.password}
                                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword
                                      ? <EyeOff className="w-4 h-4 text-surface-500 hover:text-surface-300" />
                                      : <Eye className="w-4 h-4 text-surface-500 hover:text-surface-300" />
                                    }
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-end">
                            <Link to="/forgot-password" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                              Forgot password?
                            </Link>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                            {loading ? <Spinner size="sm" /> : null}
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-surface-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                          Register your workshop
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}