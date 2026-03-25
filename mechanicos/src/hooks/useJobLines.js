import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useJobLines(jobId) {
    const { company, profile } = useAuthStore()
    const [labourLines, setLabourLines] = useState([])
    const [partsLines, setPartsLines] = useState([])
    const [notes, setNotes] = useState([])
    const [statusHistory, setStatusHistory] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchLabour = async () => {
      if (!jobId) return
      const { data, error } = await supabase
        .from('job_labour')
        .select(`
          *,
          profiles (
            id, 
            first_name,
            last_name
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: true })

      if (!error) setLabourLines(data || [])
    }

    const fetchParts = async () => {
        if (!jobId) return
        const { data, error } = await supabase
          .from('job_parts')
          .select('*')
          .eq('job_id', jobId)
          .order('created_at', { ascending: true })

        if (!error) setPartsLines(data || [])
    }

    const fetchNotes = async () => {
        if (!jobId) return
        const { data, error } = await supabase
          .from('job_notes')
          .select(`
            *,
            profiles (
              id,
              first_name,
              last_name
            )
          `)
          .eq('job_id', jobId)
          .order('created_at', { ascending: false })

        if (!error) setNotes(data || [])
    }

    const fetchStatusHistory = async () => {
        if (!jobId) return
        const { data, error } = await supabase
          .from('job_status_history')
          .select(`
            *,
            profiles (
              id,
              first_name,
              last_name
            )
          `)
          .eq('job_id', jobId)
          .order('created_at', { ascending: false })

        if (!error) setStatusHistory(data || [])
    }

    const fetchAll = async () => {
        setLoading(true)
        await Promise.all([
            fetchLabour(),
            fetchParts(),
            fetchNotes(),
            fetchStatusHistory(),
        ])
        setLoading(false)
    }

    // Labour
    const addLabour = async (labourData) => {
        const { data, error } = await supabase
          .from('job_labour')
          .insert({
            ...labourData,
            job_id: jobId,
            company_id: company.id,
          })
          .select()
          .single()

        if (error) {
            toast.error('Failed to add labour line')
            return null
        }
        toast.success('Labour line added')
        await fetchLabour()
        await updateJobTotals()
        return data
    }

    const updateLabour = async (id, labourData) => {
        const { data, error } = await supabase
          .from('job_labour')
          .update(labourData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error('Failed to update labour lines')
            return null
        }
        await fetchLabour()
        await updateJobTotals()
        return data
    }

    const deleteLabour = async (id) => {
        const { error } = await supabase
          .from('job_labour')
          .delete()
          .eq('id', id)

        if (error) {
            toast.error('Failed to remove labour line')
            return false
        }
        toast.success('Labour line removed')
        await fetchLabour()
        await updateJobTotals()
        return true
    }

    // Parts
    const addPart = async (partData) => {
        const { data, error } = await supabase
          .from('job_parts')
          .insert({
            ...partData,
            job_id: jobId,
            company_id: company.id,
          })
          .select()
          .single()

        if (error) {
            toast.error('Failed to add part')
            return null
        }
        toast.success('Part added')
        await fetchParts()
        await updateJobTotals()
        return data
    }

    const updatePart = async (id, partData) => {
        const { data, error } = await supabase
          .from('job_parts')
          .update(partData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast-error('Failed to update part')
            return null
        }
        await fetchParts()
        await updateJobTotals()
        return data
    }

    const deletePart = async (id) => {
        const { error } = await supabase
          .from('job_parts')
          .delete()
          .eq('id', id)

        if (error) {
            toast.error('Failed to remove part')
            return false
        }
        toast.success('Part removed')
        await fetchParts()
        await updateJobTotals()
        return true
    }

    // Notes
    const addNote = async (ContentVisibilityAutoStateChangeEvent, isInternal = true) => {
        const { data, error } = await supabase
          .from('job_notes')
          .insert({
            job_id: jobId,
            company_id: company.id,
            author_id: profile.id,
            content,
            is_internal: inInternal,
          })
          .select()
          .single()

        if (error) {
            toast.error('Failed to add note')
            return null
        }
        toast.success('Note added')
        await fetchNotes()
        return data
    }

    const deleteNote = async (id) => {
        const { error } = await supabase
          .from('job_notes')
          .delete()
          .eq('id', id)

        if (error) {
            toast.error('Failed to delete note')
            return false
        }
        await ffetchNotes()
        return true
    }

    // Update job totals
    const updateJobTotals = async () => {
        const { data: labour } = await supabase
          .from('job_labour')
          .select('total')
          .eq('job_id', jobId)

        const { data: parts } = await supabase
          .from('job_parts')
          .select('total')
          .eq('job_id', jobId)

        const labourTotal = (labour || []).reduce((sum, l) => sum + (l.total || 0), 0)
        const partsTotal = (parts || []).reduce((sum, p) => sum + (p.total || 0), 0)

        await supabase
          .from('job_cards')
          .update({
            labour_total: labourTotal,
            parts_total: partsTotal,
            total_amount: labourTotal + partsTotal,
          })
          .eq('id', jobId)
    }

    return {
        labourLines,
        partsLines,
        notes,
        statusHistory,
        loading,
        fetchAll,
        fetchLabour,
        fetchParts,
        fetchNotes,
        fetchStatusHistory,
        addLabour,
        updateLabour,
        deleteLabour,
        addPart,
        updatePart,
        deletePart,
        addNote,
        deleteNote,
    }
}