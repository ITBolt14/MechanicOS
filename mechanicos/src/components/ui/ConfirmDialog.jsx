import { AlertTriangle } from "lucide-react"
import { Modal } from "./Modal"
import { Spinner } from './Spinner'


export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message,confirmLabel = 'Configure', loading = false, variant = 'danger' }) {
    const variants = {
        danger: 'bg-red-600 hover:bg-red-500',
        warning: 'bg-amber-600 hover:bg-amber-500',
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="felx flex-col items-center text-center gap-4">
                <div className="w-14 h-14 bg-red-500 bg-opacity-10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-surface-300 text-sm leading-relaxed">{message}</p>
                <div className="flex gap-3 w-full pt-2">
                    <button
                      onClick={onClose}
                      className="btn-secondary flex-1"
                      disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                      onClick={onConfig}
                      disabled={loading}
                      className={`flex-1 flex items-center justify-center gap-2 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 ${variants[variant]}`}
                    >
                        {loading ?  <Spinner size="sm" /> : null}
                        {loading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    )
}