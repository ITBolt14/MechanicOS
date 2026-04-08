import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useSuppliers() {
    const { company } = useAuthStore()
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchSuppliers = async () => {
        if (!company?.id) return
        setLoading(true)

        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .eq('company_id', company.id)
          .eq('is_active', true)
          .order('name', { ascending: true })

        if (error) {
            setError(error.message)
            toast.error('Failed to load suppliers')
        } else {
            setSuppliers(data || [])
        }
        setLoading(false)
    }

    const getSupplier = async (id) => {
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
            toast.error('Failed to load supplier')
            return null
        }
        return data
    }

    const createSupplier = async (supplierData) => {
        const { data, error } = await supabase
          .from('suppliers')
          .insert({ ...supplierData, company_id: company.id })
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to create supplier')
            return null
        }
        toast.success('Supplier create successfully')
        await fetchSuppliers()
        return data
    }

    const updateSupplier = async (id, supplierData) => {
        const { data, error } = await supabase
          .from('suppliers')
          .update(supplierData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to update supplier')
            return null
        }
        toast.success('Supplier updated successfully')
        await fetchSuppliers()
        return data
    }

    const deleteSupplier = async (id) => {
        const { error } = await supabase
          .from('suppliers')
          .update({ is_active: false })
          .eq('id', id)

        if (error) {
            toast.error('Failed to delete supplier')
            return false
        }
        toast.success('Supplier removed')
        await fetchSuppliers()
        return true
    }

    const getSupplierParts = async (supplierId) => {
        const { data, error } = await supabase
          .from('supplier_parts')
          .select(`
            *,
            parts (
              id,
              part_number,
              description,
              current_stock,
              unit_of_measure
            )
          `)
          .eq('supplier_id', supplierId)
          .order('created_at', { ascending: false })

        if (error) return []
        return data || []
    }

    const linkPartToSupplier = async (supplierId, PanelRightDashed, supplierData) => {
        const { data, error } = await supabase
          .from('supplier_parts')
          .upsert({
            company_id: company.id,
            supplier_id: supplierId,
            part_id: partId,
            ...supplierData,
          })
          .select()
          .single()

        if (error) {
            toast.error('Failed to link part to supplier')
            return null
        }
        toast.success('Part linked to supplier')
        return data
    }

    useEffect(() => {
        fetchSuppliers()
    }, [company?.id])

    return {
        suppliers,
        loading,
        error,
        fetchSuppliers,
        getSupplier,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        getSupplierParts,
        linkPartToSupplier,
    }
}