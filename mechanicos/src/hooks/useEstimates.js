import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useEstimates(filters = []) {
    const { company, profile } = useAuthStore()
    const [estimates, setEstimates] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchEstimates = async () => {
        if (!company?.id) return
        setLoading(true)

        let query = supabase
          .from('estimates')
          .select(`
            *,
            customers (
              id,
              first_name,
              last_name,
              company_name,
              customer_type,
              phone
            ),
            vehicles (
              id,
              make,
              model,
              year,
              registration_number
            ),
            job_cards (
              id,
              job_number,
            ),
            profiles (
              id,
              first_name,
              last_name
            )
          `)
          .eq('company_id', company.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (filters.status) {
            query = query.eq('status', filters.status)
        }

        const { data, error } = await query

        if (error) {
            setError(error.message)
            toast.error('Failed to load estimates')
        } else {
            setEstimates(data || [])
        }
        setLoading(false)
    }

    const getEstimate = async (id) => {
        const { data, error } = await supabase
          .from('estimates')
          .select(`
            *,
            customers (
              id,
              first_name,
              last_name,
              company_name,
              customer_type,
              phone,
              email,
              address_line1,
              address_line2,
              city,
              province,
              postal_code
            ),
            vehicles (
              id,
              make,
              model,
              year,
              registration_number,
              colour,
              vin_number
            ),
            job_cards (
              id,
              job_number,
              job_type
            ),
            profiles (
              id,
              first_name,
              last_name
            )
          `)
          .eq('id', id)
          .single()

        if (error) {
            toast.error('Failed to load estimate')
            return null
        }
        return data
    }

    const createEstimate = async (estimateData) => {
        const { data: estNumber } = await supabase
          .rpc('generate_estimate_number', { p_company_id: company.id })

        const { data, error } = await supabase
          .from('estimates')
          .insert({
            ...estimateData,
            company_id: company.id,
            created_by: profile.id,
            estimate_number: estNumber,
            status: 'draft',
            revision: 1,
          })
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to create estimate')
            return null
        }

        // Save initial revision snapshot
        await supabase.from('estimate_revisions').insert({
            company_id: company.id,
            estimate_id: data.id,
            revised_by: profile.id,
            revision_number: 1,
            snapshot: estimateData,
            notes: 'Initial estimate created',
        })

        toast.success(`Estimate ${estNumber} created`)
        await fetchEstimates()
        return data
    }

    const updateEstimate = async (id, estimateData) => {
        const { data: current } = await supabase
          .from('estimates')
          .select('revision')
          .eq('id', id)
          .single()

        const newRevision = (current?.revision || 1) + 1

        const { data, error } = await supabase
          .from('estimates')
          .update({
            ...estimateData,
            revision: newRevision,
          })
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to update estimate')
            return null
        }

        // Save revision snapshot
        await supabase.from('estimate_revisions').insert({
            company_id: company.id,
            estimate_id: id,
            revised_by: profile.id,
            revision_number: newRevision,
            snapshot: estimateData,
            notes: `Revision ${newRevision}`,
        })

        toast.success('Estimate updated')
        await fetchEstimates()
        return data
    }

    const updateEstimateStatus = async (id, newStatus, notes = '') => {
        const updateData = { status: newStatus }

        if (newStatus === 'sent') updateData.sent_at = new Date().toISOString()
        if (newStatus === 'approved') updateData.approved_at = new Date().toISOString()
        if (newStatus === 'rejected') {
            updateData.rejected_at = new Date().toISOString()
            updateData.rejection_reason = notes
        }

        const { data, error } = await supabase
          .from('estimates')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error('Failed to update estimate status')
            return null
        }

        toast.success(`Estimate marked as ${newStatus}`)
        await fetchEstimates()
        return data
    }

    const deleteEstimate = async (id) => {
        const { error } = await supabase
          .from('estimates')
          .update({ is_active: false })
          .eq('id', id)

        if (error) {
            toast.error('Failed to declare estimate')
            return false
        }
        toast.success('Estimate removed')
        await fetchEstimates()
        return true
    }

    const duplicateEstimate = async (id) => {
        const original = await getEstimate(id)
        if (!original) return null

        const { data: estNumber } = await supabase
          .rpc('generate_estimate_number', { p_company_id: company.id })

        const { data, error } = await supabase
          .from('estimates')
          .insert({
            company_id: company.id,
            created_by: profile.id,
            estimate_number: estNumber,
            job_id: original.job_id,
            customer_id: original.customer_id,
            vehicle_id: original.vehicle_id,
            job_type: original.job_type,
            description: original.description,
            status: 'draft',
            revision: 1,
            vat_rate: original.vat_rate,
            payment_terms: original.payment_terms,
            notes: original.notes,
          })
          .select()
          .single()

        if (error) {
            toast.error('Failed to duplicate estimate')
            return null
        }

        toast.success(`Estimate duplicated as ${estNumber}`)
        await fetchEstimates()
        return data
    }

    useEffect(() => {
        fetchEstimates()
    }, [company?.id, filters.status])

    return {
        estimates,
        loading,
        error,
        fetchEstimates,
        getEstimate,
        createEstimate,
        updateEstimate,
        updateEstimateStatus,
        deleteEstimate,
        duplicateEstimate,
    }
}