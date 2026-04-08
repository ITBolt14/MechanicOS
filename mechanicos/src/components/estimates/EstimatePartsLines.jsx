import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { useEstimateLines } from '../../hooks/useEstimateLines'
import { Spinner } from '../ui/Spinner'

export function EstimatePartsLines({ estimateId, canEdit = true, onTotalsChange }) {
    const {partsLines, fetchParts, addPart, updatePart, deletePart } = useEstimateLines(estimateId)
    const [adding, setAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({
        part_number: '', description: '', quantity: '1',
        cost_price: '', markup_percent: '0', unit_price: '', supplier: '',
    })
    const [editForm, setEditForm] = useState({})
    const [saving, setSaving] = useState(false)

    useEffect(() => { fetchParts() }, [estimateId])

    const calcSellPrice = (cost, markup) => {
        const c = parseFloat(cost || 0)
        const m = parseFloat(markup || 0)
        return c + (c * m / 100)
    }

    const handleAdd = async () => {
        if (!form.description || !form.unit_price) return
        setSaving(true)
        await addPart({
            part_number: form.part_number || null,
            description: form.description,
            quantity: parseFloat(form.quantity) || 1,
            cost_price: parseFloat(form.cost_price) || 0,
            markup_percent: parseFloat(form.markup_percent) || 0,
            unit_price: parseFloat(form.unit_price),
            supplier: form.supplier || null,
        })
        setForm({ part_number: '', description: '', quantity: '1', cost_price: '', markup_percent: '0', unit_price: '', supplier: '' })
        setAdding(false)
        setSaving(false)
        if (onTotalsChange) await onTotalsChange()
    }

    const handleEdit = async (id) => {
        setSaving(true)
        await updatePart(id, {
            part_number: editForm.part_number || null,
            description: editForm.description,
            quantity: parseFloat(editForm.quantity),
            cost_price: parseFloat(editForm.cost_price) || 0,
            markup_percent: parseFloat(editForm.markup_percent) || 0,
            unit_price: parseFloat(editForm.unit_price),
            supplier: editForm.supplier || null,
        })
        setEditingId(null)
        setSaving(false)
        if (onTotalsChange) await onTotalsChange()
    }

    const startEdit = (line) => {
        setEditingId(line.id)
        setEditForm({
            part_number: line.part_number || '',
            description: line.description,
            quantity: line.quantity,
            cost_price: line.cost_price || '',
            markup_percent: line.markup_percent || '0',
            unit_price: line.unit_price,
            supplier: line.supplier,
        })
    }

    const formatAmount = (amount) =>
        `R ${parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`

    const partsTotal = partsLines.reduce((sum, p) => sum + (p.total || 0), 0)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="section-title">Parts</h3>
                {canEdit && (
                    <button
                      onClick={() => setAdding(!adding)}
                      className="btn-primary flex items-center gap-2 text-sm py-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Part
                    </button>
                )}
            </div>

            {adding && (
                <div className="bg-surface-800 rounded-xl p-4 border border-brand-600 border-opacity-40 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                            <label className="label">Part Number</label>
                            <input
                              className="input-field"
                              placeholder="Optional"
                              value={form.part_number}
                              onChange={(e) => setForm({ ...form, part_number: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="label">Description</label>
                            <input
                              className="input-field"
                              placeholder="e.g. Front bumper assembly"
                              value={form.description}
                              onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Qty</label>
                            <input
                              className="input-field"
                              type="number"
                              min="1"
                              value={form.quantity}
                              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Cost Price (R)</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="0.00"
                              value={form.cost_price}
                              onChange={(e) => {
                                const cost = e.target.value
                                const sell = calcSellPrice(cost, form.markup_percent)
                                setForm({ ...form, cost_price: cost, unit_price: sell.toFixed(2) })
                              }}
                            />
                        </div>
                        <div>
                            <label className="label">Markup %</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="0"
                              value={form.markup_percent}
                              onChange={(e) => {
                                const markup = e.target.value
                                const sell = calcSellPrice(form.cost_price, markup)
                                setForm({ ...form, markup_percent: markup, unit_price: sell.toFixed(2) })
                              }}
                            />
                        </div>
                        <div>
                            <label className="label">Sell Price (R)</label>
                            <input
                              className="input-field"
                              type="number"
                              placeholder="0.00"
                              value={form.unit_price}
                              onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Supplier</label>
                            <input
                              className="input-field"
                              placeholder="Optional"
                              value={form.supplier}
                              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-400">
                            Line total: <span className="text-white font-semibold">
                                {formatAmount(parseFloat(form.quantity || 1) * parseFloat(form.unit_price || 0))}
                            </span>
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => setAdding(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
                            <button
                              onClick={handleAdd}
                              disabled={saving || !form.description || !form.unit_price}
                              className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                            >
                                {saving ? <Spinner size="sm" /> : null}
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {partsLines.length === 0 ? (
                <div className="text-center py-6 text-surface-500 text-sm">No parts added yet</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-800">
                                <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Part</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Qty</th>
                                <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Unit Price</th>
                                <th classname="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider pb-2 pr-4">Total</th>
                                {canEdit && <th className="pb-2 w-16" />}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surfacce-800">
                            {partsLines.map((line) => (
                                <tr key={line.id} className="group">
                                    {editingId === line.id ? (
                                        <>
                                          <td className="py-3 pr-4">
                                            <div className="space-y-1.5">
                                                <input
                                                  className="input-field text-sm py-1.5"
                                                  placeholder="Description"
                                                  value={editForm.description}
                                                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                />
                                                <input
                                                  className="input-field text-sm py-1.5"
                                                  placeholder="Part number"
                                                  value={editForm.part_number}
                                                  onChange={(e) => setEditForm({ ...editForm, part_number: e.target.value })}
                                                />
                                            </div>
                                          </td>
                                          <td className="py-3 pr-4">
                                            <input
                                              className="input-field text-sm py-1.5 text-right w-20"
                                              type="number"
                                              value={editForm.quantity}
                                              onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                            />
                                          </td>
                                          <td className="py-3 pr-4">
                                            <input
                                              className="input-field text-sm py-1.5 text-right w-28"
                                              type="number"
                                              value={editForm.unit_price}
                                              onChange={(e) => setEditForm({ ...editForm, unit_price: e.target.value })}
                                            />
                                          </td>
                                          <td className="py-3 pr-4 text-right text-sm text-surface-400">
                                            {formatAmount(parseFloat(editForm.quantity || 1) * parseFloat(editForm.unit_price || 0))}
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
                                            <div className="flex items-center gap-3 mt-0.5">
                                                {line.part_number && (
                                                    <span className="text-xs font-mono text-surface-500">{line.part_number}</span>
                                                )}
                                                {line.supplier && (
                                                    <span className="text-xs text-surface-500">{line.supplier}</span>
                                                )}
                                                {line.markup_percent > 0 && (
                                                    <span className="text-xs text-surface-600">+{line.markup_percent}% markup</span>
                                                )}
                                            </div>
                                          </td>
                                          <td className="py-3 pr-4 text-right text-sm text-surface-300">{line.quantity}</td>
                                          <td className="py-3 pr-4 text-right text-sm text-surface-300">{formatAmount(line.unit_price)}</td>
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
                                                        await deletePart(line.id)
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
                                <td colSpan={3} className="pt-3 text-sm font-semibold text-surface-400">Parts Total</td>
                                <td className="pt-3 text-right text-sm font-bold text-white">{formatAmount(partsTotal)}</td>
                                {canEdit && <td />}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    )
}