import { useState, useEffect } from 'react'
import { Plus, Trash2, Lock, Globe } from 'lucide-react'
import { useJobLines } from '../../hooks/useJobLines'
import { Spinner } from '../ui/Spinner'
import { useAuthStore } from '../../stores/authStore'

export function JobNotes({ jobId }) {
    const { profile } = useAuthStore()
    const { notes, fetchNotes, addNote, deleteNote } = useJobLines(jobId)
    const [content, setContent] = useState('')
    const [isInternal, setIsInternal] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNotes().then(() => setLoading(false))
    }, [jobId])

    const handleSubmit = async () => {
        if (!content.trim()) return
        setSubmitting(true)
        await addNote(content.trim(), isInternal)
        setContent('')
        setSubmitting(false)
    }
    
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
            <h3 className="section-title">Job Notes</h3>

            {/* Add Note */}
            <div className="bg-surface-800 rounded-xl p-4 border border-surface-700 space-y-3">
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Add a note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="flez items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsInternal(true)}
                          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all
                            ${isInternal
                                ? 'bg-surface-700 text-white'
                                : 'text-surface-500 hover:text-surface-300'
                            }`}
                        >
                            <Lock className="w-3.5 h-3.5" />
                            Internal
                        </button>
                        <button
                          onClick={() => setIsInternal(false)}
                          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all
                            ${!isInternal
                                ? 'bg-surface-700 text-white'
                                : 'text-surface-500 hover:text-surface-300'
                            }`}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Customer Visible
                        </button>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !content.trim()}
                      className="btn-primary text-sm py-2 flex items-center gap-2"
                    >
                        {submitting ? <Spinner size="sm" /> : <Plus className="w-4 h-4" />}
                        Add Note
                    </button>
                </div>
            </div>

            {/* Notes List */}
            {loading ? (
                <div className="flex justify-center py-6"><Spinner /></div>
            ) : notes.length === 0 ? (
                <div className="text-center py-8 text-surface-500 text-sm">
                    No notes yet
                </div>
            ) : (
                <div className="space-y-3">
                    {notes.map((note) => (
                        <div 
                          key={note.id}
                          className={`rounded-xl p-4 border group ${
                            note.is_internal
                              ? 'bg-surface-800 border-surface-700'
                              : 'bg-brand-600 bg-opacity-5 border-brnad-600 border-opacity-20'
                          }`}
                        >
                            <div className="flec items-center jusitfy-between mb-2">
                                <div className="flex items-ccenter gap-2">
                                    {note.is_internal ? (
                                        <div className="flex items-center gap-1 text-xs text-surface-500">
                                            <Lock className="w-3 h-3" />
                                            Internal
                                        </div>
                                    ) : (
                                        <div className="felx items-center gap-1 text-xs text-brand-400">
                                            <Globe className="w-3 h-3" />
                                            Customer Visible
                                        </div>
                                    )}
                                    <span className="text-xs text-surface-500">•</span>
                                    <span className="text-xs text-surface-500">
                                        {note.profiles
                                          ? `${note.profiles.first_name} ${note.profiles.last_name}`
                                          : 'Unknown'
                                        }
                                    </span>
                                    <span className="text-xs text-surface-500">•</span>
                                    <span className="text-xs text-surface-500">
                                        {formatDate(note.created_at)}
                                    </span>
                                </div>
                                {note.author_id === profile?.id && (
                                    <button
                                      onClick={() => deleteNote(note.id)}
                                      className="p-1 rounded text-surface-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 clasNname="w-3.5 h-3.5" />
                                    </button>
                                )}
                              </div>
                                <p className="text-sm text-surface-200 leading-relaxed">
                                    {note.content}
                                </p>
                            </div>
                    ))}
                </div>
            )}
        </div>
    )
}