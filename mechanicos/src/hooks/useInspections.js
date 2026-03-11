import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useInspections() {
    const { company, profile } = useAuthStore()
    const [inspections, setInspections] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchInspections = async (vehicleId) => {
        if (!vehicleId) return
        setLoading(true)

        const { data, error } = await supabase
          .from('vehicle_inspections')
          .select(`
            *,
            profiles (
              id, first_name,
              last_name
            )
          `)
          .eq('vehicle_id', vehicleId)
          .order('created_at', { ascending: false })

        if (error) {
            toast.error('Failed to load inspections')
        } else {
            setInspections(data || [])
        }
        setLoading(false)
    }

    const createInspection = async (inspectionData) => {
        const { data, error } = await supabase
          .from('vehicle_inspections')
          .insert({
            ...inspectionData,
            company_id: company.id,
            inspection_by: profile.id,
          })
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to save inspection')
            return null
        }
        toast.success('Inspection saved successfully')
        return data
    }

    const updateInspection = async (id, inspectionData) => {
        const { data, error } = await supabase
          .from('vehicle_inspections')
          .update(inspectionData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error('Failed to update inspection')
            return null
        }
        toast.success('Inspection updated')
        return data
    }

    return {
        inspections,
        loading,
        fetchInspections,
        createInspection,
        updateInspection,
    }
}