import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useJobs(filters = {}) {
    const { company, profile } = useAuthStore()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchJobs = async () => {
         if (!company?.id) return
         setLoading(true)

         let query = supabase
           .from('job_cards')
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
              registration_number,
              colour
            ),
            profiles (
              id,
              first_name,
              last_name,
              role
            )
        `)
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (filters.status) {
        query = query.eq('status', filters.status)
    }
    if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to)
    }
    if (filters.priority) {
        query = query.eq('priority', filters.priority)
    }

    const { data, error } = await query

    if (error) {
        setError(error.message)
        toast.error('Failed to load job cards')
    } else {
        setJobs(data || [])
    }
    setLoading(false)
    }

    const getJob = async (id) => {
        const { data,error } = await supabase
          .from('job_cards')
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
            ),
            vehicles (
              id,
              make,
              model,
              year,
              registration_number,
              colour,
              fuel_type,
              transmission,
              vin_number
            ),
            profiles (
              id,
              first_name,
              last_name,
              role
            ),
        `)
        .eq('id', id)
        .single()

    if (error) {
        toast.error('Failed to load job card')
        return null
    }
    return data
    }

    const createJob = async (jobData) => {
        const jobNumber = await supabase
          .rpc('generate_job_number', { p_company_id: company.id })

        const { data, error } = await supabase
          .from('job_cards')
          .insert({
            ...jobData,
            company_id: company.id,
            job_number: jobNumber.data,
            status: 'intake',
          })
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to create job card')
            return null
        }

        // Record initial status history
        await supabase.from('job_status_history').insert({
            company_id: company.id,
            job_id: data.id,
            changed_by: profile.id,
            from_status: null,
            to_status: 'intake',
            notes: 'Job card created',
        })

        toast.success(`Job card ${jobNumber.data} created`)
        await fetchJobs()
        return data
    }

    const updateJob = async (id, jobData) => {
        const { data, error } = await supabase
          .from('job_cards')
          .update(jobData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to update job card')
            return null
        }
        toast.success('Job card updated')
        await fetchJobs()
        return data
    }

    const updateJobStatus = async (id, newStatus, surrentStatus, notes = '') => {
        const { data, error } = await supabase
          .from('job_cards')
          .update({ status: newStatus })
          .eq('id', id)
          .select()
          .single()

        if (error) {
            toast.error('Failed to update job status')
            return null
        }

        // Record status change in history
        await supabase.from('job_status_history').insert({
            company_id: company.id,
            job_id: id,
            changed_by: profile.id,
            from_status: currentStatus,
            to_status: newStatus,
            notes,
        })

        toast.success(`Job moved to ${newStatus.replace('_', ' ')}`)
        await fetchJobs()
        return data
    }

    const deleteJob = async (id) => {
        const { error } = await supabase
          .from('job_cards')
          .update({ is_active: false })
          .eq('id', id)

        if (error) {
            toast.error('Failed to delete job card')
            return false
        }
        toast.success('Job card removed')
        await fetchJobs()
        return true
    }

    const searchJobs = async (query) => {
        if (!company?.id) return []
        const { data, error } = await supabase  
          .from('job_cards')
          .select(`
            *,
            customers (
              id,
              first_name,
              last_name,
              company_name,
              customer_type
            ),
            vehicles (
              id,
              make,
              model,
              year,
              registration)number
            )
          `)
          .eq('company_id', company.id)
          .eq('is_active', true)
          .or(`job_number.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(20)

        if (error) return []
        return data || []
    }

    useEffect(() => {
        fetchJobs()
    }, [company?.id, filters.status, filters.assigned_to])

    return {
        jobs,
        loading,
        error,
        fetchJobs,
        getJob,
        createJob,
        updateJob,
        updateJobStatus,
        deleteJob,
        searchJobs,
    }
}