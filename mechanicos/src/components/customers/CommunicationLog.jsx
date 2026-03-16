import { useState } from "react"
import { Phone, Mail, MessageSquare, FileText, Plus, Trash2 } from 'lucide-react'
import { useCommunications } from "../../hooks/useCommunications"
import { Badge } from "../ui/Badge"
import { Textarea } from "../ui/Textarea"
import { Select } from "../ui/Select"
import { Spinner } from "../ui/Spinner"

const typeConfig = {
    call:       { icon: Phone,          label: 'Call',      variant: 'success' },
    email:      { icon: Mail,           label:'Email',      variant: 'info' },
    sms:        { icon: MessageSquare,  label: 'SMS',       variant: 'warning' },
    whatsapp:   { icon: MessageSquare,  label: 'WhatsApp',  variant: 'success' },
    note:       { icon: FileText,       label: 'Note',      variant: 'default' },
}

export function CommunicationLog({ customerId }) {
    const { logs, loading, fetchLogs, addLog, deleteLog } = useCommunications()
    const [showForm, setShowForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        type: 'note',
        direction: 'outbound',
        subject: '',
        content: '',
    })

    const handleSubmit = async () => {
        if (!form.content.trim()) return
        setSubmitting(true)
        await addLog(customerId, form)
        setForm({ type: 'note', direction: 'outbound', subject: '', content: '' })
        setShowForm(false)
        setSubmitting(false)
    }

    useState(() => {
        fetchLogs(customerId)
    }, [customerId])

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-ZA', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="space-y-4">
            {/* Add Log Button */}
            <div classname="flex items-center justify-between">
                <h3 className="section-title">Communication History</h3>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="btn-primary flex items-center gap-2 text-sm py-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Log
                </button>
            </div>

            {/* Add Log Form */}
            {showForm && (
                <div className="card border-brand-600 border-opacity-50 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Type"
                          value={form.type}
                          onChange={(e) => setForm({ ...form, type: e.target.value })}
                          options={[
                            { value: 'note',        label: 'Note' },
                            { value: 'call',        label: 'Call' },
                            { value: 'email',       label: 'Email' },
                            { value: 'sms',         label: 'SMS' },
                            { value: 'whatsapp',    label: 'WhatsApp' },
                          ]}
                        />
                        <Select
                          label="Direction"
                          value={form.direction}
                          onChange={(e) => setForm({ ...form, direction: e.target.value })}
                          options={[
                            { value: 'outbound',    label: 'Outbound' },
                            { value: 'inbound',     label: 'Inbound' },
                          ]}
                        />
                    </div>
                    <Textarea
                      label="Notes"
                      placeholder="Enter details..."
                      rows={3}
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                    />
                    <div className="flex gap-3">
                        <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                        <button
                          onClick={handleSubmit}
                          disabled={submitting || !form.content.trim()}
                          className="btn-primary flex-3 flex items-center justify-center gap-2"
                        >
                            {submitting ? <Spinner size="sm" /> : null}
                            Save Log
                        </button>
                    </div>
                </div>
    )}

    {/* Log Timeline} */}
    {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
    ) : logs.length === 0 ? (
      <div className="text-center py-8 text-surface-500 text-sm">
        No Communication history yet
      </div>
    ) : (
        <div className="space-y-3">
            {logs.map((log) => {
                const config = typeConfig[log.type] || typeConfig.note
                const Icon = config.icon
                return (
                    <div key={log.id} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="m-8 h-8 bg-surface-800 rounded-full flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-surface-400" />
                            </div>
                            <div className="flex-1 w-px bg-surface-800 mt-2" />
                        </div>
                        <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Badge variant={config.variant} size="sm">{config.label}</Badge>
                                {log.direction && (
                                    <Badge variant="default" size="sm">{log.direction}</Badge>
                                )}
                                <span className="text-xs text-surface-500">{formatDate(log.created_at)}</span>
                                {log.profiles && (
                                    <span className="text-xs text-surface-500">
                                        by {log.profiles.first_name} {log.profiles.last_name}
                                    </span>
                                )}
                                <button
                                  onClick={() => deleteLog(log.id, customerId)}
                                  className="ml-auto p-1 rounded text-surface-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="m-3.5 h-3.5" />
                                </button>
                            </div>
                            <p className="text-sm text-surface-300 leading-relaxed">{log.content}</p>
                        </div>
                    </div>
                )
            })}
        </div>
     )}
  </div>
 )
}