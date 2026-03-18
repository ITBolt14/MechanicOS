import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useCommunications() {
    const { company, profile } = useAuthStore()
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchLogs = async (customerId) => {
        if (!customerId) return
        setLoading(true)

        const { data, error } = await supabase
          .from('communication_logs')
          .select(`
            *,
            profiles (
              id,
              first_name,
              last_name
            )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

    if (error) {
        toast.error('Failed to load communication logs')
    } else {
        setLogs(data || [])
    }
    setLoading(false)
    }

    const addLog = async (customerId, logData) => {
        const { data, error } = await supabase
          .from('communication_logs')
          .insert({
            ...logData,
            customer_id: customerId,
            company_id: company.id,
            logged_by: profile.id,
          })
          .select()
          .single()

        if (error) {
            toast.error('Failed to save log')
            return null
        }
        toast.success('Log entry saved')
        await fetchLogs(customerId)
        return data
    }

    const deleteLog = async (id, customerId) => {
        const { error } = await supabase
          .from('communication_logs')
          .delete()
          .eq('id', id)

        if (error) {
            toast.error('Failed to delete log')
            return false
        }
        toast.success('Log entry deleted')
        await fetchLogs(customerId)
        return true
    }

    return {
        logs,
        loading,
        fetchLogs,
        addLog,
        deleteLog,
    }
}