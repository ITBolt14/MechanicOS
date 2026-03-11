export function Input({ label, error, icon: Icon, ...props }) {
    return (
        <div className="w-full">
            {label && <label className="label">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="w-4 h-4 text-surface-500" />
                    </div>
                )}
                <input
                  className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                  {...props}
                />
            </div>
            {error && <p className="mt-1.5  text-xs text-red-400">{error}</p>}
        </div>
    )
}