import { Check } from 'lucide-react'
import { JOB_STATUSES } from './JobStatusBadge'

const STAGES = [
    'intake',
    'diagnosis',
    'awaiting_parts',
    'in_progress',
    'quality_check',
    'complete',
    'invoiced',
]

export function JobStageBar({ currentStatus, onStageChange, canEdit = true }) {
    const currentOrder = JOB_STATUSES[currentStatus]?.order || 1

    return (
        <div className="w-full">
            <div className="flex items-center">
                {STAGES.map((stage, index) => {
                    const config = JOB_STATUSES[stage]
                    const stageOrder = config.order
                    const isComplete = stageOrder < currentOrder
                    const isCurrent = stage === currentStatus
                    const isNext = stageOrder === currentOrder + 1
                    const isClickable = canEdit && (isNext || (stageOrder < currentOrder))

                    return (
                        <div key={stage} className="flex items-center flex-1 last:flex-none">
                            {/* Stage Node */}
                            <div className="flex flex-col items-center">
                                <button
                                  onClick={() => isClickable && onStageChange(stage)}
                                  disabled={!isClickable}
                                  title={isNext ? `Move to ${config.label}` : config.label}
                                  className={`
                                    w-8 h-8 rounded-full flex items-center justify-center
                                    text-xs font-bold transition-all duration-200
                                    ${isCurrent
                                        ? 'bg-brand-600 text-white ring-4 ring-brand-600 ring-opacity-30'
                                        : isComplete
                                          ? 'bg-emerald-500 text-white'
                                          : isNext && canEdit
                                            ? 'bg-surface-700 text-surface-300 hover:bg-brand-600 hover:text-white cursor-pointer border-2 border-dashed border-surface-500'
                                            : 'bg-surface-800 text-surface-600 cursor-default'
                                    }
                                  `}
                                >
                                    {isComplete
                                      ? <Check className="w-4 h-4" />
                                      : <span>{stageOrder}</span>
                                    }
                                </button>
                                <span className={`
                                  text-xs mt-1.5 font-medium whitespace-nowrap hidden md:block
                                  ${isCurrent ? 'text-brand-400' : isComplete ? 'text-emerald-400' : 'text-surface-600'}
                                `}>
                                    {config.label}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < STAGES.length - 1 && (
                                <div className={`
                                    flex-1 h-0.5 mx-1 transition-all duration-300
                                    ${stageOrder < currentOrder ? 'bg-emerald-500' : 'bg-surface-700'}
                                `} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}