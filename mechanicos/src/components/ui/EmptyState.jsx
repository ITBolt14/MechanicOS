export function EmptyState({ icon: Icon, title, description, action}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {Icon && (
                <div className="w-16 h-16 bg-surface-800 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-surface-500" />
                </div>
            )}
            <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-surface-400 text-sm max-w-sm mb-6">{description}</p>
            )}
            {action && action}
        </div>
    )
}