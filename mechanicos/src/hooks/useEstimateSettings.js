import {useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function useEstimateSettings() {
    const { company } = useAuthStore()
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchSettings = async () => {
        if (!company?.id) return
        setLoading(true)

        const { data, error } = await supabase
          .from('estimate_settings')
          .select('*')
          .eq('company_id', company.id)
          .single()

        if (error) {
            // Create default settings if not found
            const { data: newSettings } = await supabase
              .from('estimate_settings')
              .insert({ company_id: company.id })
              .select()
              .single()
            setSettings(newSettings)
        } else {
            setSettings(data)
        }
        setLoading(false)
    }

    const updateSettings = async (settingsData) => {
        const { data, error } = await supabase
          .from('estimate_settings')
          .update(settingsData)
          .eq('company_id', company.id)
          .select()
          .single()

        if (error) {
            toast.error('Failed to update settings')
            return null
        }
        toast.success('Settings saved')
        setSettings(data)
        return data
    }

    const getRateForJobType = (jobType) => {
        if (!settings) return 450
        const rateMap = {
            service:            settings.rate_service,
            mechanical:         settings.rate_mechanical,
            panel_beating:      settings.rate_panel_beating,
            electrical:         settings.rate_electrical,
            tyres:              settings.rate_tyres,
            diagnostics:        settings.rate_diagnostics,
            other:              settings.rate_other,
        }
        return rateMMap[jobType] || settings.default_labour_rate || 450
    }

    useEffect(() => {
        fetchSettings()
    }, [company?.id])

    return {
        settings,
        loading,
        fetchSettings,
        updateSettings,
        getRateForJobType,
    }
}