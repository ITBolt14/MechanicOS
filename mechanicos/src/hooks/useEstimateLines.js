import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from  'react-hot-toast'

export function useEstimateLines(estimateId) {
    const { company } = useAuthStore()
    const [labourLines, setLabourLines] = useState([])
    const [partsLines, setPartsLines] = useState([])
    const [paintLines, setPaintLines] = useState([])
    const [subletLines, setSubletLines] = useState([])
    const [revisions, setRevisions] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchLabour = async () => {
        if (!estimateId) return
        const { data, error } = await supabase
          .from('estimate_labour')
          .select('*')
          .eq('estimate_id', estimateId)
          .order('created_at', { ascending: true })
        if (!error) setLabourLines(data || [])
    }

    const fetchParts = async () => {
        if (!estimateId) return
        const { data, error } = await supabase
          .from('estimate_parts')
          .select('*')
          .eq('estimate_id', estimateId)
          .order('created_at', { ascending: true })
        if (!error) setPartsLines(data || [])
    }

    const fetchPaint = async () => {
        if (!estimateId) return
        const { data, error } = await supabase
          .from('estimate_paint')
          .select('*')
          .eq('estimate_id', estimateId)
          .order('created_at', { ascending: true })
        if (!error) setPaintLines(data || [])
    }

    const fetchSublets = async () => {
        if (!estimateId) return
        const { data, error } = await supabase
          .from('estimate_sublets')
          .select('*')
          .eq('estimate_id', estimateId)
          .order('created_at', { ascending: true })
        if (!error) setSubletLines(data || [])
    }

    const fetchRevisions = async () => {
        if (!estimateId) return
        const { data, error } = await supabase
          .from('estimate_revisions')
          .select(`
            *,
            profiles (
              id,
              first_name,
              last_name
            )
          `)
          .eq('estimate_id', estimateId)
          .order('revision_number', { ascending: false })
        if (!error) setRevisions(data || [])
    }

    const fetchAll = async () => {
        setLoading(true)
        await Promise.all([
            fetchLabour(),
            fetchParts(),
            fetchPaint(),
            fetchSublets(),
            fetchRevisions(),
        ])
        setLoading(false)
    }

    // Labour
    const addLabour = async (labourData) => {
        const { total, ...safe } = labourData
        const { data, error } = await supabase
          .from('estimate_labour')
          .insert({ ...safe, estimate_id: estimateId, company_id: company.id })
          .select()
          .single()
        if (error) { toast.error('Failed to add labour'); return null }
        toast.success('Labour line added')
        await fetchLabour()
        await updateTotals()
        return data
    }

    const updateLabour = async (id, labourData) => {
        const { total, ...safe } = labourData
        const { data, error } = await supabase
          .from('estimate_labour')
          .update(safe)
          .eq('id', id)
          .select()
          .single()
        if (error) { toast.error('Failed to update labour'); return null }
        await fetchLabour()
        await updateTotals()
        return data
    }

    const deleteLabour = async (id) => {
        const { error } = await supabase
          .from('estimate_labour' )
          .delete()
          .eq('id', id)
        if (error) { toast.error('Failed to remove labour'); return false }
        toast.success('Labour line removed')
        await fetchLabour()
        await updateTotals()
        return true
    }

    // Parts
    const addPart = async (partData) => {
        const { total, ...safe } = partData
        const { data, error } = await supabase
          .from('estimate_parts')
          .insert({ ...safe, estimate_id: estimateId, company_id: company.id })
          .select()
          .single()
        if (error) { toast.error('Failed to add part'); return null }
        toast.success('Part added')
        await fetchParts()
        await updateTotals()
        return data
    }

    const updatePart = async (id, partData) => {
        const { total, ...safe } = partData
        const { data, error } = await supabase
          .from('estimate_parts')
          .update(safe)
          .eq('id', id)
          .select()
          .single()
        if (error) { toast.error('Failed to update part'); return null }
        await fetchParts()
        await updateTotals()
        return data
    }

    const deletePart = async (id) => {
        const { error } = await supabase
          .from('estimate_parts')
          .delete()
          .eq('id', id)
        if (error) { toast.error('Failed to remove part'); return false }
        toast.success('Part removed')
        await fetchParts()
        await updateTotals()
        return true
    }

    // Paint
    const addPaint = async (paintData) => {
        const { total, ...safe } = paintData
        const { data, error } = await supabase 
          .from('estimate_paint')
          .insert({ ...safe, estimate_id: estimateId, company_id: company.id })
          .select()
          .single()
        if (error) { toast.error('Failed to add paint line'); return null }
        toast.success('Paint line added')
        await fetchPaint()
        await updateTotals()
        return data
    }

    const updatePaint = async (id, paintData) => {
        const { total, ...safe } = paintData
        const { data, error } = await supabase
          .from('estimate_paint')
          .update(safe)
          .eq('id', id)
          .select()
          .single()
        if (error) { toast.error('Failed to update paint line'); return null }
        await fetchPaint()
        await updateTotals()
        return data
    }

    const deletePaint = async (id) => {
        const { error } = await supabase
          .from('estimate_paint')
          .delete()
          .eq('id', id)
        if (error) { toast.error('Failed to remove paint line'); return false }
        toast.success('Paint line removed')
        await fetchPaint()
        await updateTotals()
        return true
    }

    // Sublets
    const addSublet = async (subletData) => {
        const cost = parseFloat(subletData.cost || 0)
        const markup = parseFloat(subletData.markup_percent || 0)
        const total = cost + (cost * markup / 100)

        const { data, error } = await supabase
          .from('estimate_sublets')
          .insert({
            ...subletData,
            estimate_id: estimateId,
            company_id: company.id,
            total,
          })
          .select()
          .single()
        if (error) { toast.error('Failed to add sublet'); return null }
        toast.success('Sublet added')
        await fetchSublets()
        await updateTotals()
        return data
    }

    const deleteSublet = async (id) => {
        const { error } = await supabase
          .from('estimate_sublets')
          .delete()
          .eq('id', id)
        if (error) { toast.error('Failed to remove sublet'); return false }
        toast.success('Sublet removed')
        await fetchSublets()
        await updateTotals()
        return true
    }

    // Update estimate totals
    const updateTotals = async (discountAmount = null, vatRate = null) => {
        const [
            { data: labour },
            { data: parts },
            { data: paint },
            { data: sublets },
            { data: currentEstimate },
        ] = await Promise.all([
            supabase.from('estimate_labour').select('total').eq('estimate_id', estimateId),
            supabase.from('estimate_parts').select('total').eq('estimate_id', estimateId),
            supabase.from('estimate_paint').select('total').eq('estimate_id', estimateId),
            supabase.from('estimate_sublets').select('total').eq('estimate_id', estimateId),
            supabase.from('estimates').select('discount_amount, vat_rate').eq('id', estimateId).single(),
        ])

        const labourTotal = (labour || []).reduce((s, l) => s + (l.total || 0), 0)
        const partsTotal = (parts || []).reduce((s, p) => s + (p.total || 0), 0)
        const paintTotal = (paint || []).reduce((s, p) => s + (p.total || 0), 0)
        const subletTotal = (sublets || []).reduce((s, sub) => s + (sub.total || 0), 0)

        const discount = discountAmount !== null ? discountAmount : (currentEstimate?.discount_amount || 0)
        const vat = vatRate !== null ? vatRate : (currentEstimate?.vat_rate || 15)

        const subtotal = labourTotal + partsTotal + paintTotal + subletTotal - discount
        const vatAmount = subtotal * (vat / 100)
        const totalAmount = subtotal + vatAmount

        await supabase
          .from('estimates')
          .update({
            labour_total: labourTotal,
            parts_total: partsTotal,
            paint_total: paintTotal,
            sublet_total: subletTotal,
            subtotal,
            vat_amount: vatAmount,
            total_amount: totalAmount,
          })
          .eq('id', estimateId)
    }

    return {
        labourLines,
        partsLines,
        paintLines,
        subletLines,
        revisions,
        loading,
        fetchAll,
        fetchLabour,
        fetchParts,
        fetchPaint,
        fetchSublets,
        fetchRevisions,
        addLabour,
        updateLabour,
        deleteLabour,
        addPart,
        updatePart,
        deletePart,
        addPaint,
        updatePaint,
        deletePaint,
        addSublet,
        deleteSublet,
        updateTotals,
    }
}