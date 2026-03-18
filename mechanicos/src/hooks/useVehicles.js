import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useVehicles(customerId = null) {
    const { company } = useAuthStore()
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchVehicles = async () => {
        if (!company?.id) return
        setLoading(true)

        let query = supabase
          .from('vehicles')
          .select(`
            *,
            customers (
              id,
              first_name,
              last_name,
              company_name,
              customer_type,
              phone,
              email
            )
          `)
          .eq('company_id', company.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (customerId) {
          query = query.eq('customer_id', customerId)
        }

         const { data, error } = await query

        if (error) {
          setError(error.message)
          toast.error('Failed to load vehicles')
        } else {
          setVehicles(data || [])
        }
        setLoading(false)
    }
    
    const getVehicle = async (id) => {
        const { data, error } = await supabase
          .from('vehicles')
          .select(`
            *,
            customers (
              id,
              first_name,
              last_name,
              company_name,
              customer_type,
              phone,
              email
            )
          `)
          .eq('id', id)
          .single()

        if (error) {
            toast.error('Failed to load vehicle')
            return null
        }
        return data
    }

    const createVehicle = async (vehicleData) => {
        const { data, error } = await supabase
          .from('vehicles')
          .insert({ ...vehicleData, company_id: company.id })
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to create vehicle')
            return null
        }
        toast.success('Vehicle added successfully')
        await fetchVehicles()
        return data
    }

    const updateVehicle = async (id, vehicleData) => {
        const { data, error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to update vehicle')
            return null
        }
        toast.success('Vehicle updated successfully')
        await fetchVehicles()
        return data
    }

    const deleteVehicle = async (id) => {
        const { error } = await supabase
          .from('vehicles')
          .update({ is_active: false })
          .eq('id', id)

        if (error) {
            toast.error('Failed to remove vehicle')
            return false
        }
        toast.success('Vehicle removed')
        await fetchVehicles()
        return true
    }

    const searchVehicles = async (query) => {
        if (!company?.id) return []
        const { data, error } = await supabase
          .from('vehicles')
          .select(`
            *,
            customers (
              id,
              first_name,
              last_name,
              company_name,
              customer_type
            )
        `)
        .eq('company_id', company.id)
        .eq('is_active', true)
        .or(`registration_number.ilike.%${query}%,vin_number.ilike.%${query}%,make.ilike.%${query}%,model.ilike.%${query}%`)
        .limit(20)

    if (error) return []
    return data || []
    }

    useEffect(() => {
        fetchVehicles()
    }, [company?.id, customerId])

    return {
        vehicles,
        loading,
        error,
        fetchVehicles,
        getVehicle,
        createVehicle,
        updateVehicle,
        deleteVehicle,
        searchVehicles,
    }
}