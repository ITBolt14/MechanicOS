import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { useEstimateLines } from '../../hooks/useEstimateLines'
import { Spinner } from '../ui/Spinner'

export function EstimateLabourLines({ estimateId, defaultRate = 450, canEdit = true, onTotalsChange }) {
    const { labourLines, fetchLabour, addLabour, updateLabour, deleteLabour } = useEstimateLines(estimateId)
    const [adding, setAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ description: '', hours: '', rate: defaultRate.toString() })
    const [editForm, setEditForm] = useState({})
    const [saving, setSaving] = useState(false)

    useEffect(() => { fetchLabour() }, [estimateId])

    const handleAdd = async () => {
        if (!form.description || !form.hours || !form.rate) return
        setSaving(true)
        await addLabour({
            description: form.description,
            hours: parseFloat(form.hours),
            rate: parseFloat(form.rate),
        })
        setForm({ description: '', hours: '', rate: defaultRate.toString() })
        setAdding(false)
        setSaving(false)
        if (onTotalsChange) await onTotalsChange()
    }

    const handleEdit = async (id) => {
        setSaving(true)
        await updateLabour(id, {
            description: editForm.description,
            hours: parseFloat(editForm.hours),
            rate: parseFloat(editForm.rate),
        })
        setEditingId(null)
        setSaving(false)
        if (onTotalsChange) await onTotalsChange()
    }

    const startEdit = (line) => {
        setEditingId(line.id)
        setEditForm({
            description: line.description,
            hours: line.hours,
            rate: line.rate,
        })
    }

    const formatAmount = (amount) =>
        `R ${parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`

    const labourTotal = labourLines.reduce((sum, l) => sum + (l.total || 0), 0)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="section-title">Labour</h3>
                {canEdit && (
                    <button
                      onClick={() => setAdding(!adding)}
                      className="btn-primary flex items-center gap-2  text-sm py-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Labour
                    </button>
                )}
            </div>

            {adding && (
                <div className="bg-surface-800 rounded-xl p-4 border border-brand-600 border-opacity-40 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-1">
                            <label className="label">Description</label>
                            <input
                              className="input-field"
                              placeholder="e.g. Strip and replace bumper"
                              value={form.description}
                              onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Hours</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="2.5"
                              step="0.5"
                              value={form.hours}
                              onChange={(e) => setForm({ ...form, hours: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Rate (R/hr)</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="450.00"
                              value={form.rate}
                              onChange={(e) => setForm({ ...form, rate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-400">
                            Line total: <span className="text-white font-semibold">
                                {formatAmount(parseFloat(form.hours || 0) * parseFloat(form.rate || 0))}
                            </span>
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => setAdding(false)} className="btn-secondary text-sm py-2 px-4">
                                Cancel
                            </button>
                            <button
                              onClick={handleAdd}
                              disabled={saving || !form.description || !form.hours || !form.rate}
                              className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                            >
                                {saving ? <Spinner size="sm" /> : null}
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {labourLines.length === 0 ? (
                <div className="text-center py-6 text-surface-500 text-sm">
                    No labour lines added yet
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-800">
                                <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Description</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Hours</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Rate</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Total</th>
                                {canEdit && <th className="pb-2 w-16" />}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-800">
                            {labourLines.map((line) => (
                                <tr key={line.id} className="group">
                                    {editingId === line.id ? (
                                        <>
                                          <td className="py-3 pr-4">
                                            <input
                                              className="input-field text-sm py-1.5"
                                              value={editForm.description}
                                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            />
                                          </td>
                                          <td className="py-3 pr-4">
                                            <input
                                              className="input-field text-sm py-1.5 text-right"
                                              type="number"
                                              step="0.5"
                                              value={editForm.hours}
                                              onChange={(e) => setEditForm({ ...editForm, hours: e.target.value })}
                                            />                                            
                                          </td>
                                          <td className="py-3 pr-4">
                                            <input
                                              className="input-field text-sm py-1.5 text-right"
                                              type="number"
                                              value={editForm.rate}
                                              onChange={(e) => setEditForm({ ...editForm, rate: e.target.value })}
                                            />
                                          </td>
                                          <td className="py-3 pr-4 text-right text-sm text-surface-400">
                                            {formatAmount(parseFloat(editForm.hours || 0) * parseFloat(editForm.rate || 0))}
                                          </td>
                                          <td className="py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleEdit(line.id)} className="p-1.5 rounded-lg text-emerald-400 hover:bg-surface-700">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-700">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                          </td>
                                        </>
                                    ) : (
                                        <>
                                          <td className="py-3 pr-4">
                                            <p className="text-sm text-white">{line.description}</p>
                                          </td>
                                          <td className="py-3 pr-4 text-right text-sm text-surface-300">{line.hours}h</td>
                                          <td className="py-3 pr-4 text-right text-sm text-surface-300">{formatAmount(line.rate)}</td>
                                          <td className="py-3 pr-4 text-right text-sm font-semibold text-white">{formatAmount(line.total)}</td>
                                          {canEdit && (
                                            <td className="py-3">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => startEdit(line)} className="p-1.5 rounded-lg text-surface-400 hover:text-brand-400 hover:bg-surface-700">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                      onClick={async (e) => {
                                                        e.stopPropagation()
                                                        await deleteLabour(line.id)
                                                        if (onTotalsChange) await onTotalsChange()
                                                      }}
                                                    className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-surface-700"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                            </td>
                                          )}
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-surface-700">
                                <td colSpan={3} className="pt-3 text-sm font-semibold text-surface-400">Labour Total</td>
                                <td className="pt-3 text-right text-sm font-bold text-white">{formatAmount(labourTotal)}</td>
                                {canEdit && <td />}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    )
}