import { Badge } from '../ui/Badge'

export const ESTIMATE_STATUSES = {
    draft:    { label: 'Draft',     variant: 'default', order: 1 },
    sent:     { label: 'Sent',      variant: 'info',    order: 2 },
    approved: { label: 'Approved',  variant: 'success', order: 3 },
    rejected: { label: 'Rejected',  variant: 'danger',  order: 4 },
    invoiced: { label: 'Invoiced',  variant: 'purple',  order: 5 },
}

export function EstimateStatusBadge({ status, size = 'md' }) {
    const config = ESTIMATE_STATUSES[status] || ESTIMATE_STATUSES.draft
    return (
        <Badge variant={config.variant} size={size}>
            {config.label}
        </Badge>
    )
}