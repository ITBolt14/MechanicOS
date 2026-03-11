import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
    user: null,
    profile: null,
    company: null,
    session: null,
    loading: true,

    setSession: (session) => set({ session, user: session?.user ?? null }),

    fetchProfile: async (userId) => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error || !profile) return

        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single()

        set({ profile, company })
    },

    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, profile: null, company: null, session: null })
    },

    setLoading: (loading) => set({ loading }),
}))