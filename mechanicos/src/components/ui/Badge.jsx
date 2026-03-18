export function Badge({ children, variant = 'default', size = 'md' }) {
    const variants = {
        default: 'bg-surface-800 text-surface-300 border border-surface-700',
        primary: 'bg-brand-600 bg-opacity-20 text-brand-400 border border-brand-600 border-opacity-30',
        success: 'bg-emerald-500 bg-opacity-20 text-emerald-400 border border-emerald-500 border-opacity-30',
        warning: 'bg-amber-500 bg-opacity-20 text-amber-400 border border-amber-500 border-opacity-30',
        danger:  'bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30',
        info:    'bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500 border-opacity-30',
        purple:  'bg-purple-500 bg-opacity-20 text-purple-400 border border-purple-500 border-opacity-30',
    }

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    }

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    )
}