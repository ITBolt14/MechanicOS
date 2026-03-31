import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useJobTimer(jobId) {
    const { company, profile } = useAuthStore()
    const [timeLogs, setTimeLogs] = useState([])
    const [activeLog, setActiveLog] = useState(null)
    const [elapsed, setElapsed] = useState(0)
    const intervalRef = useRef(null)

    const fetchTimeLogs = async () => {
        if (!jobId) return
        const { data, error } = await supabase
          .from('job_time_logs')
          .select(`
            *, 
            profiles (
              id,
              first_name,
              last_name
            )
          `)
          .eq('job_id', jobId)
          .order('clocked_in', { ascending: false })

        if (!error) {
            setTimeLogs(data || [])
            const active = (data || []).find(
                (log) => log.technician_id === profile?.id && !log.clocked_out
            )
            setActiveLog(active || null)
        }
    }

    const clockIn = async () => {
        if (activeLog) {
            toast.error('You are already clocked in to this job')
            return
        }

        const { data, error } = await supabase
          .from('job_time_logs')
          .insert({
            job_id: jobId,
            company_id: company.id,
            technician_id: profile.id,
            clocked_in: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) {
            toast.error('Failed to clock in')
            return
        }

        toast.success('Clocked in successfully')
        setActiveLog(data)
        await fetchTimeLogs()
    }

    const clockOut = async () => {
        if (!activeLog) {
            toast.error('You are not clocked in to this job')
            return
        }

        const clockedOut = new Date()
        const clockedIn = new Date(activeLog.clocked_in)
        const durationMinutes = Math.round((clockedOut - clockedIn) / 60000)

        const { error } = await supabase
          .from('job_time_logs')
          .update({
            clocked_out: clockedOut.toISOString(),
            duration_minutes: durationMinutes,
          })
          .eq('id', activeLog.id)

        if (error) {
            toast.error('Failed to clock out')
            return
        }

        toast.success(`Clocked out - ${durationMinutes} minutes logged`)
        setActiveLog(null)
        setElapsed(0)
        await fetchTimeLogs()
    }

    const getTotalMinutes = () => {
        return timeLogs
          .filter((log) => log.clocked_out)
          .reduce((sum, log) => sum + (log.duration_minutes || 0), 0)
    }

    const formatDuration = (minutes) => {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        if (h === 0) return `${m}m`
        return `${h}h ${m}m`
    }

    // Live timer
    useEffect(() => {
        if (activeLog) {
            intervalRef.current = setInterval(() => {
                const now = new Date()
                const start = new Date(activeLog.clocked_in)
                setElapsed(Math.round((now - start) / 60000))
            }, 60000)
        }
        return () => clearInterval(intervalRef.current)
    }, [activeLog])

    useEffect(() => {
        fetchTimeLogs()
    }, [jobId])

    return {
        timeLogs,
        activeLog,
        elapsed,
        fetchTimeLogs,
        clockIn,
        clockOut,
        getTotalMinutes,
        formatDuration,
    }
}