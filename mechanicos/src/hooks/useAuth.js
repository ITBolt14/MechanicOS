import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export function useAuth() {
    const { setSession, fetchProfile, setLoading, user, profile, company, loading } = useAuthStore()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session?.user) {
                fetchProfile(session.user.id).finally(() => setLoading(false))
            } else {
                setLoading(false)
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session?.user) {
                fetchProfile(session.user.id)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return { user, profile, company, loading }
}