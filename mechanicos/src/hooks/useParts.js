import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useParts() {
    const { company, profile } = useAuthStore()
    const [parts, setParts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchParts = async () => {
        if (!company?.id) return 
        setLoading(true)

        const { data, error } = await supabase
          .from('parts')
          .select(`
            *,
            suppliers (
              id,
              name
            )
          `)
          .eq('company_id', company.id)
          .eq('is_active', true)
          .order('description', { ascending: true })

        if (error) {
            setError(error.message)
            toast.error('Failed to load parts')
        } else {
            setParts(data || [])
        }
        setLoading(false)
    }

    const getPart = async (id) => {
        const { data, error } = await supabase
          .from('parts')
          .select(`
            *,
            supplier (
              id,
              name,
              phone,
              email
            )
          `)
          .eq('id', id)
          .single()

        if (error) {
            toast.error('Failed to load part')
            return null
        }
        return data
    }

    const createPart = async (partData) => {
        const { data, error } = await supabase
          .from('parts')
          .insert({ ...partData, company_id: company.id })
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to create part')
            return null
        }
        toast.success('Part created successfully')
        await fetchParts()
        return data
    }

    const updatePart = async (id, partData) => {
        const { data, error } = await supabase
          .from('parts')
          .update(partData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to update part')
            return null
        }
        toast.success('Part updated successfully')
        await fetchParts()
        return data
    }

    const deletePart = async (id) => {
        const { error } = await supabase
          .from('parts')
          .update({ is_active: false })
          .eq('id', id)

        if (error) {
            toast.error('Failed to delete part')
            return false
        }
        toast.success('Part removed')
        await fetchParts()
        return true
    }

    const adjustStock = async (partId, change, type, notes = '', referenceId = null) => {
        const part = await getPart(partId)
        if (!part) return false
        
        const quantityBadge = part.current_stock || 0
        const quantityAfter = quantityBefore + change

        const { error: adjError } = await supabase
          .from('stock_adjustments')
          .insert({
            company_id: company.id,
            part_id: partId,
            adjusted_by: profile.id,
            adjustment_type: type,
            quantity_before: quantityBefore,
            quantity_change: change,
            quantity_after: quantityAfter,
            reference_type: referenceId ? type : 'manual',
            reference_id: referenceId,
            notes,
          })

        if (adjError) {
            toast.error('Failed to record stock adjustment')
            return false
        }

        const { error: updateError } = await supabase
          .from('parts')
          .update({ current_stock: quantityAfter })
          .eq('id', partId)

        if (updateError) {
            toast.error('Failed to update stock level')
            return false
        }

        toast.success(`Stock updated: ${quantityBefore} → ${quantityAfter}`)
        await fetchParts()
        return true
    }

    const getStockHistory = async (partId) => {
        const { data, error } = await supabase
          .from('stock_adjustments')
          .select(`
            *,
            profiles (
              id,
              first_name,
              last_name
            )
          `)
          .eq('part_id', partId)
          .order('created_at', { ascending: false })

        if (error) return []
        return data || []
    }

    const searchParts = async (query) => {
        if (!company?.id) return []
        const { data, error } = await supabase
          .from('parts')
          .select('*')
          .eq('company_id', company.id)
          .eq('is_active', true)
          .or(`part_number.ilike.%${query}%,description.ilike.%${query}%,barcode.ilike.%${query}%`)
          .order('description', { ascending: true })
          .limit(20)

        if (error) return []
        return data || []
    }

    const getLowStockParts = () => {
        return parts.filter(
            (p) => p.minimum_stock > 0 && p.current_stock <= p.minimum_stock
        )
    }

    useEffect(() => {
        fetchParts()
    }, [company?.id])

    return {
        parts,
        loading,
        error,
        fetchParts,
        getPart,
        createPart,
        updatePart,
        deletePart,
        adjustStock,
        getStockHistory,
        searchParts,
        getLowStockParts,
    }
}