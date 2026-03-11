import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Spinner } from '../ui/Spinner'
import { Children } from 'react'

export function ProtectedRoute({ children }) {
    const { user, loading } = useAuthStore()

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-950 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}