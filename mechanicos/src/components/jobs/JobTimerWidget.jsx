import { Clock, Play, Square } from 'lucide-react'
import { useJobTimer } from '../../hooks/useJobTimer'
import { Spinner } from '../ui/Spinner'

export function JobTimerWidget({ jobId }) {
    const {
        timeLogs, activeLog, elapsed,
        clockIn, clockOut,
        getTotalMinutes, formatDuration,
    } = useJobTimer(jobId)

    const totalMinutes = getTotalMinutes()

    return (
        <div className="card space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="section-title">Time Tracking</h3>
                <div className="flex items-center gap-2">
                    {activeLog ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-sm text-emerald-400">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                {elapsed > 0 ? `${elapsed}m` : 'Active'}
                            </div>
                            <button
                              onClick={clockOut}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all"
                            >
                                <Square className="w-3.5 h-3.5" />
                                Clock Out
                            </button>
                        </div>
                    ) : (
                        <button
                          onClick={clockIn}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all"
                        >
                            <Play className="w-3.5 h-3.5" />
                            Clock In
                        </button>
                    )}
                </div>
            </div>

            {/* Total */}
            <div className="flex items-center gap-3 bg-surface-800 rounded-xl p-3">
                <div className="w-10 h-10 bg-brand-600 bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                    <p className="text-xl font-display font-bold text-white">
                        {formatDuration(totalMinutes)}
                    </p>
                    <p className="text-xs text-surface-400">Total time logged</p>
                </div>
            </div>

            {/* Log Entries */}
            {timeLogs.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                        Time Entries
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {timeLogs.map((log) => (
                            <div
                              key={log.id}
                              className={`flex items-center justify-between text-xs p-2.5 rounded-lg
                                ${!log.clocked_out
                                    ? 'bg-emerald-500 bg-opacity-10 border border-emerald-500 border-opacity-20'
                                    : 'bg-surface-800'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {!log.clocked_out && (
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    )}
                                    <span className="text-surface-300">
                                        {log.profiles
                                          ? `${log.profiles.first_name} ${log.profiles.last_name}`
                                          : 'Unknown'
                                        }
                                    </span>
                                    <span className="text-surface-500">
                                        {new Date(log.clocked_in).toLocaleTimeString('en-ZA',{
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                        {log.clocked_out && ` → ${new Date(log.clocked_out).toLocaleTimeString('en-ZA', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}`}
                                    </span>
                                </div>
                                <span className={`font-semibold ${!log.clocked_out ? 'text-emerald-400' : 'text-white'}`}>
                                    {log.clocked_out
                                      ? formatDuration(log.duration_minutes)
                                      : 'Active'
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}