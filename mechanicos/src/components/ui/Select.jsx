export function Select({ label, error, options = [], placeholder, ...props }) {
    return (
        <div className="w-full">
            {label && <label className="label">{label}</label>}
            <select
              className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              {...props}
            >
                {placeholder && (
                    <option value="" disabled>{placeholder}</option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        </div>
    )
}