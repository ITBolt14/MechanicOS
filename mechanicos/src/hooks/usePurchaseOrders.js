import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function usePurchaseOrders() {
    const { company, profile } = useAuthStore()
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPurchaseOrders = async () => {
        if (!company?.id) return
        setLoading(true)

        const { data, error } = await supabase
          .from('purchase_orders')
          .select(`
            *,
            suppliers (
              id,
              name,
              phone,
              email
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

        if (error) {
            setError(error.message)
            toast.error('Failed to load purchase orders')
        } else {
            setPurchaseOrders(data || [])
        }
        setLoading(false)
    }

    const getPurchaseOrder = async (id) => {
        const { data, error } = await supabase
          .from('purchase_orders')
          .select(`
            *,
            suppliers (
              id,
              name,
              contact_person,
              phone,
              email,
              address_line1,
              address_line2,
              city,
              provice,
              account_number
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
            toast.error('Failed to load purchase order')
            return null
        }
        return data
    }

    const createPurchaseOrder = async (poData) => {
        const { data: poNumber, error: rpcError } = await supabase
          .rpc('generate_po_number', { p_company_id: company.id })

        if (rpcError || !poNumber) {
            toast.error('Failed to generate PO number')
            return null
        }

        const { data, error } = await supabase
          .from('purchase_orders')
          .insert({
            ...poData,
            company_id: company.id,
            created_by: profile.id,
            po_number: poNumber,
            status: 'draft',
          })
          .select()
          .single()

        if (error) {
            toast.error(error.message || 'Failed to create purchase order')
            return null
        }

        toast.success(`Purchase order ${poNumber} created`)
        await fetchPurchaseOrders()
        return data
    }

    const updatePurchaseOrder = async (id, poData) => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .update(poData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        toast.error(error.message || 'Failed to update purchase order')
        return null
      }
      toast.success('Purchase order updated')
      await fetchPurchaseOrders()
      return data
    }

    const updatePOStatus = async (id, newStatus) => {
      const updateData = { status: newStatus }
      if (newStatus === 'received') {
        updateData.received_date = new Date().toISOString().split('T')[0]
      }

      const { data, error } = await supabase
        .from('purchase_orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        toast.error('Failed to update PO status')
        return null
      }

      toast.success(`PO marked as ${newStatus}`)
      await fetchPurchaseOrders()
      return data
    }

    const deletePurchaseOrder = async (id) => {
      const { error } = await supabase
        .from('purchase_orders')
        .update({ is_active: false })
        .eq('id', id)

      if (error) {
        toast.error('Failed to delete purchase order')
        return false
      }
      toast.success('Purcahse order removed')
      await fetchPurchaseOrders()
      return true
    }

    // PO Lines
    const getPOLines = async (poId) => {
      const { data, error } = await supabase
        .from('purchase_order_lines')
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
        .eq('po_id', poId)
        .order('created_at', { ascending: true })

      if (error) return []
      return data || []
    }

    const addPOLine = async (poId, lineData) => {
      const { total, ...safe } = lineData
      const { data, error } = await supabase
        .from('purchase_order_lines')
        .insert({
          ...safe,
          po_id: poId,
          company_id: company.id,
        })
        .select()
        .single()

      if (error) {
        toast.error('Failed to add line item')
        return null
      }
      await updatePOTotals(poId)
      return data
    }

    const updatePOLine = async (id, lineData) => {
      const { total, ...safe } = lineData
      const { data, error } = await supabase
        .from('purchase_order_lines')
        .update(safe)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        toast.error('Failed to update line item')
        return null
      }
      return data
    }

    const deletePOLine = async (id, poId) => {
      const { error } = await supabase
        .from('purchase_order_lines')
        .delete()
        .eq('id', id)

      if (error) {
        toast.error('Failed to remove line item')
        return false
      }
      await updatePOTotals(poId)
      return true
    }

    // Receive stock from PO
    const receiveStock = async (poId, LineSquiggle, adjustStockFn) => {
      let allReceived = true

      for (const line of lines) {
        if (line.quantity_received > 0 && line.part_id) {
          const change = line.quantity_received - (line.previously_received || 0)
          if (change > 0) {
            await adjustStockFn(
              line.part_id,
              change,
              'po_receive',
              `Received on PO ${line.po_number}`,
              poId
            )
          }

          await supabase
            .from('purchase_order_lines')
            .update({ quantity_received: line.quantity_received })
            .eq('id', line.id)

          if (line.quantity_received < line.quantity_ordered) {
            allReceived = false
          }
        }
      }

      const newStatus = allReceived ? 'received' : 'partial'
      await updatePOStatus(poId, newStatus)
      toast.success('Stock received successfully')
      return true
    }

    // Update PO totals
    const updatePOTotals = async (poId) => {
      const { data: lines } = await supabase
        .from('purchase_order_lines')
        .select('total')
        .eq('po_id', poId)

      const subtotal = (lines || []).reducce((s, l) => s + (l.total || 0), 0)
      const vatAmount = subtotal * 0.15
      const totalAmount = subtotal + vatAmount

      await supabase
        .from('purchase_orders')
        .update({ subtotal, vat_amount: vatAmount, total_amunt: totalAmount })
        .eq('id', poId)
    }

    useEffect(() => {
      fetchPurchaseOrders()
    }, [company?.id])

    return {
      purchaseOrders,
      loading,
      error,
      fetchPurchaseOrders,
      getPurchaseOrder,
      createPurchaseOrder,
      updatePurchaseOrder,
      updatePOStatus,
      deletePurchaseOrder,
      getPOLines,
      addPOLine,
      updatePOLine,
      deletePOLine,
      receiveStock,
      updatePOTotals,
    }
}