import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useEstimateLines } from '../../hooks/useEstimateLines'
import { Spinner } from '../ui/Spinner'

export function SubletLines({ estimateId, canEdit = true, onTotalsChange }) {
    const { subletLines, fetchSublets, addSublet, deleteSublet } = useEstimateLines(estimateId)
    const [adding, setAdding] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        description: '', supplier: '',
        cost: '', markup_percent: '0',
    })

    useEffect(() => { fetchSublets() }, [estimateId])

    const calcTotal = () => {
        const cost = parseFloat(form.cost || 0)
        const markup = parseFloat(form.markup_percent || 0)
        return cost + (cost * markup / 100)
    }

    const handleAdd = async () => {
        if (!form.description || !form.cost) return
        setSaving(true)
        await addSublet({
            description: form.description,
            supplier: form.supplier || null,
            cost: parseFloat(form.cost),
            markup_percent: parseFloat(form.markup_percent) || 0,
        })
        setForm({ description: '', supplier: '', cost: '', markup_percent: '0' })
        setAdding(false)
        setSaving(false)
        if (onTotalsChange) await onTotalsChange()
    }

    const formatAmount = (amount) =>
        `R ${parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`

    const subletTotal = subletLines.reduce((sum, s) => sum + (s.total || 0), 0)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="section-title">Sublet Work</h3>
                {canEdit && (
                    <button
                      onClick={() => setAdding(!adding)}
                      className="btn-primary flex items-center gap-2 text-sm py-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Sublet
                    </button>
                )}
            </div>

            {adding && (
                <div className="bg-surface-800 rounded-xl p-4 border border-brand-600 border-opacity-40 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="label">Description</label>
                            <input
                              className="input-field"
                              placeholder="e.g. Wheel alignment"
                              value={form.description}
                              onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Supplier</label>
                            <input
                              className="input-field"
                              placeholder="e.g. Wheel World"
                              value={form.supplier}
                              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Cost (R)</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="0.00"
                              value={form.cost}
                              onChange={(e) => setForm({ ...form, cost: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Markup %</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="0"
                              value={form.markup_percent}
                              onChange={(e) => setForm({ ...form, markup_percent: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end">
                            <div className="w-full bg-surface-900 rounded-xl p-3 border border-surface-700">
                                <p className="text-xs text-surface-500 mb-1">Total</p>
                                <p className="text-sm font-bold text-white">{formatAmount(calcTotal())}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setAdding(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
                        <button
                          onClick={handleAdd}
                          disabled={saving || !form.description || !form.cost}
                          className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                        >
                            {saving ? <Spinner size="sm" /> : null}
                            Add Sublet
                        </button>
                    </div>
                </div>
            )}

            {subletLines.length === 0 ? (
                <div className="text-center py-6 text-surface-500 text-sm">
                    No sublet work added yet
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-800">
                                <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Description</th>
                                <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Supplier</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Cost</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Markup</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Total</th>
                                {canEdit && <th className="pb-2 w-10" />}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-800">
                            {subletLines.map((line) => (
                                <tr key={line.id} className="group">
                                    <td className="py-3 pr-4">
                                        <p className="text-sm text-white">{line.description}</p>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className="text-sm text-surface-300">{line.supplier || '-'}</span>
                                    </td>
                                    <td className="py-3 pr-4 text-right text-sm text-surface-300">
                                        {formatAmount(line.cost)}
                                    </td>
                                    <td className="py-3 pr-4 text-right text-sm text-surface-300">
                                        {line.markup_percent > 0 ? `${line.markup_percent}%` : '-'}
                                    </td>
                                    <td className="py-3 pr-4 text-right text-sm font-semibold text-white">
                                        {formatAmount(line.total)}
                                    </td>
                                    {canEdit && (
                                        <td className="py-3">
                                            <button
                                              onClick={async (e) => {
                                                e.stopPropagation()
                                                await deleteSublet(line.id)
                                                if (onTotalsChange) await onTotalsChange()
                                              }}
                                            className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-surface-700 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-surface-700">
                                <td colSpan={4} className="pt-3 text-sm font-semibold text-surface-400">Sublets Total</td>
                                <td className="pt-3 text-right text-sm font-bold text-white">{formatAmount(subletTotal)}</td>
                                {canEdit && <td />}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    )
}