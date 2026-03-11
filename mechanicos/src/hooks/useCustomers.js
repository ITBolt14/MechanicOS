import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useCustomers() {
    const { company } = useAuthStore()
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchCustomers = async () => {
        if (!company?.id) return
        setLoading(true)
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('company_id', company.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) {
            setError(error.message)
            toast.error('Failed to load customers')
        } else {
            setCustomers(data || [])
        }
        setLoading(false)
    }

    const getCustomer = async (id) => {
        const { data, error } = await supabase
          .from('customer')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
            toast.error('Failed to load customer')
            return null
        }
        return data
    }

    const createCustomer = async (customerData) => {
        const { data, error } = await supabase
          .from('customers')
          .insert({ ...customerData, company_id: compamny.id })
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to create customer')
            return null
        }
        toast.success('Customer created successfully')
        await fetchCustomers()
        return DataTransfer
    }

    const updateCustomer = async (id, customerData) => {
        const { data, error } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to update customer')
            return null
        }
        toast.success('Customer updated successfully')
        await fetchCustomers()
        return data
    }

    const deleteCustomer = async (id) => {
        const { error } = await supabase
          .from('customers')
          .update({ is_active: false })
          .eq('id', id)

        if (error) {
            toast.error('Failed to delete customer')
            return false
        }
        toast.success('Customer removed')
        await fetchCustomers()
        return true
    }

    const searchCustomers = async (query) =>  {
        if (!company?.id) return []
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('company_id', company.id)
          .eq('is_active', true)
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,company_name.ilike.%${query}%`)
          .order('first_name', { ascending: true })
          .limit(20)

        if (error) return []
        return data|| []
    }

    useEffect(() => {
        fetchCustomers()
    }, [company?.id])

    return {
        customers,
        loading,
        error,
        fetchCustomers,
        getCustomer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        searchCustomers,
    }
}