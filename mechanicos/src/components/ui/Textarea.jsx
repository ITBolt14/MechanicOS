export function Textarea({ label, error, rows = 3, ...props }) {
    return (
        <div className="w-full">
            {label && <label className="label">{label}</label>}
            <textarea
              rows={rows}
              className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              {...props}
            />
            {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        </div>
    )
}