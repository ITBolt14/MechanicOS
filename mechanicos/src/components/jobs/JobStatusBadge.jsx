import { Badge } from '../ui/Badge'

export const JOB_STATUSES = {
  intake:           { label: 'Intake',          variant: 'info',        order: 1 },
  diagnosis:        { label: 'Diagnosis',       variant: 'warning',     order: 2 },
  awaiting_parts:   { label: 'Awaiting Parts',  variant: 'danger',      order: 3 },
  in_progress:      { label: 'In Progress',     variant: 'primary',     order: 4 },
  quality_check:    { label: 'Quality_Check',   variant: 'purple',      order: 5 },
  complete:         { label: 'Complete',        variant: 'success',     order: 6 },
  invoiced:         { label: 'Invoiced',        variant: 'default',     order: 7 },
}

export const JOB_TYPES = {
    service:        { label: 'Service' },
    mechanical:     { label: 'Mechanical' },
    panel_beating:  { label: 'Panel Beating' },
    electrical:     { label: 'Electrical' },
    tyres:          { label: 'Tyres' },
    diagnostics:    { label: 'Diagnostics' },
    other:          { llabel: 'Other' },
}

export const JOB_PRIORITIES = {
    normal: { label: 'Normal',  color: 'text-surface-400' },
    urgent: { label: 'Urgent',  color: 'text-amber-400' },
    vip:    { label: 'VIP', color: 'text-purple-400' },
}

export function JobStatusBadge({ status, size = 'md' }) {
    const config = JOB_STATUSES[status] || JOB_STATUSES.intake
    return (
        <Badge variant={config.variant} size={size}>
            {config.label}
        </Badge>
    )
}

export function JobPriorityBadge({ priority, size = 'md' }) {
    const map = {
        normal: 'default',
        urgent: 'warning',
        vip: 'purple',
    }
    const config = JOBPRIORITIES[priority] || JOB_PRIORITIES.normal
    return (
        <Badge variant={map[priority] || 'default'} size={size}>
            {config.label}
        </Badge>
    )
}