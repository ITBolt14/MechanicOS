import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useEstimateLines } from '../../hooks/useEstimateLines'
import { Spinner } from '../ui/Spinner'

const PANELS = [
    'Front Bumper', 'Rear Bumper', 'Bonnet', 'Boot Lid',
    'Roof', 'Left Front Door', 'Left Rear Door',
    'Right Front Door', 'Right Rear Door',
    'Left Front Fender', 'Left Rear Fender',
    'Right Front Fender', 'Right Rear Fender',
    'Left Sill', 'Right Sill', 'Other',
]

export function PaintCalculator({ estimateId, canEdit = true, onTotalsChange }) {
    const { paintLines, fetchPaint, addPaint, deletePaint } = useEstimateLines(estimateId)
    const [adding, setAdding] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        panel: '',
        paint_code: '',
        material_cost: '',
        labour_hours: '',
        labour_rate: '',
    })

    useEffect(() => { fetchPaint() }, [estimateId])

    const handleAdd = async () => {
        if (!form.panel || !form.material_cost) return
        setSaving(true)
        await addPaint({
            panel: form.panel,
            paint_code: form.paint_code || null,
            material_cost: parseFloat(form.material_cost),
            labour_hours: parseFloat(form.labour_hours) || 0,
            labour_rate: parseFloat(form.labour_rate) || 0,
        })
        setForm({ panel: '', paint_code: '', material_cost: '', labour_hours: '', labour_rate: '' })
        setAdding(false)
        setSaving(false)
        if (onTotalsChange) await onTotalsChange()
    }

    const formatAmount = (amount) =>
        `R ${parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`

    const paintTotal = paintLines.reduce((sum, p) => sum + (p.total || 0), 0)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="section-title">Paint & Materials</h3>
                {canEdit && (
                    <button
                      onClick={() => setAdding(!adding)}
                      className="btn-primary flex items-center gap-2 text-sm py-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add panel
                    </button>
                )}
            </div>

            {adding && (
                <div className="bg-surface-800 rounded-xl p-4 border border-brand-600 border-opacity-40 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                            <label className="label">Panel</label>
                            <select
                              className="input-field"
                              value={form.panel}
                              onChange={(e) => setForm({ ...form, panel: e.target.value })}
                            >
                                <option value="">Select panel...</option>
                                {PANELS.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">Paint Code</label>
                            <input
                              className="input-field"
                              placeholder="e.g. NH-578"
                              value={form.paint_code}
                              onChange={(e) => setForm({ ...form, paint_code: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Material Cost (R)</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="0.00"
                              value={form.material_cost}
                              onChange={(e) => setForm({ ...form, material_cost: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Labour Hours</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="0"
                              step="0.5"
                              value={form.labour_hours}
                              onChange={(e) => setForm({ ...form, labour_hours: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Labour Rate (R/hr)</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="0.00"
                              value={form.labour_rate}
                              onChange={(e) => setForm({ ...form, labour_rate: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end">
                            <div className="w-full bg-surface-900 rounded-xl p-3 border border-surface-700">
                                <p className="text-xs text-surface-500 mb-1">Line Total</p>
                                <p className="text-sm font-bold text-white">
                                    {formatAmount(
                                        parseFloat(form.material_cost || 0) +
                                        (parseFloat(form.labour_hours || 0) * parseFloat(form.labour_rate || 0))
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setAdding(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
                        <button
                          onClick={handleAdd}
                          disabled={saving || !form.panel || !form.material_cost}
                          className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                        >
                            {saving ? <Spinner size="sm" /> : null}
                            Add Panel
                        </button>
                    </div>
                </div>
            )}

            {paintLines.length === 0 ? (
                <div className="text-center py-6 text-surface-500 text-sm">
                    No paint lines added yet
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-800">
                                <th classname="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Panel</th>
                                <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Paint Code</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Materials</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Labour"</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Total</th>
                                {canEdit && <th className="pb-2 w-10" />}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-800">
                            {paintLines.map((line) => (
                                <tr key={line.id} className="group">
                                    <td className="py-3 pr-4">
                                        <p className="text-sm text-white">{line.panel}</p>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className="text-sm font-mono text-surface-400">
                                            {line.paint_code || '-'}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4 text-right text-sm text-surface-300">
                                        {formatAmount(line.material_cost)}
                                    </td>
                                    <td className="py-3 pr-4 text-right text-sm text-surface-300">
                                        {line.labour_hours > 0
                                          ? `${line.labour_hours}h @ ${formatAmount(line.labour_rate)}`
                                          : '-'
                                        }
                                    </td>
                                    <td className="py-3 pr-4 text-right text-sm font-semibold text-white">
                                        {formatAmount(line.total)}
                                    </td>
                                    {canEdit && (
                                        <td className="py-3">
                                            <button
                                              onClick={async (e) => {
                                                e.stopPropagation()
                                                await deletePaint(line.id)
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
                                <td colSpan={4} className="pt-3 text-sm font-semibold text-surface-400">Paint & Materials Total</td>
                                <td className="pt-3 text-right text-sm font-bold text-white">{formatAmount(paintTotal)}</td>
                                {canEdit && <td />}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    )
}