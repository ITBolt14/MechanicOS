import { useState } from 'react'
import { X } from 'lucide-react'

const DAMAGE_AREAS = [
    { id: 'front bumper', label: 'Front Bumper', x: 47, y: 8 },
    { id: 'bonnet', label: 'Bonnet', x: 47, y18 },
    { id: 'windscreen', label: 'Windscreen', x: 47, y: 27 },
    { id: 'roof', label: 'Roof', x: 47, y: 37 },
    { id: 'rear_windscreen', label: 'Rear Windscreen', x: 47, y: 47 },
    { id: 'boot', label: 'Boot', x: 47, y: 57 },
    { id: 'rear_bumper', label: 'Rear Bumper', x: 47, y: 67 },
    { id: 'front_left_door', label: 'Front Left Door', x: 18, y: 35 },
    { id: 'rear_left_door', label: 'Rear Left Door', x: 18, y: 47 },
    { id: 'left_front_fender', label: 'Left Front Fender', x: 18, y: 22 },
    { id: 'left_rear_fender', label: 'Left Rear Fender', x: 18, y: 60 },
    { id: 'front_right_door', label: 'Front Right Door', x: 76, y: 35 },
    { id: 'rear_right_door', label: 'Rear Right Door', x: 76, y: 47 },
    { id: 'right_front_fender', label: 'Right Front Fender', x: 76, y: 22 },
    { id: 'right_rear_fender', label: 'Right Rear Fender', x: 76, y: 60 },
]

export function InspectionDiagram({ damagePoints = [], onChange }) {
    const [selectedArea, setSelectedArea] = useState(null)
    const [note, setNote] = useState('')

    const isMarked = (areaId) => damagePoints.some((p) => p.area === areaId)

    const handleAreaClick = (area) => {
        if (isMarked(area.id)) {
            const updated = damagePoints.filter((p) => p.area !== area.id)
            onChange(updated)
            return
        }
        setSelectedArea(area)
        setNote('')
    }

    const handleAddDamage = () => {
        if (!selectedArea) return
        const updated = [
            ...damagePoints,
            { area: selectedArea.id, label: selectedArea.label, description: note },
        ]
        onChange(updated)
        setSelectedArea(null)
        setNote('')
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-surface-400">
                Click on an area to mark damage. Click again to remove.
            </p>

            {/* Diagram */}
            <div className="relative bg-surface-800 rounded-xl border border-surface-700 overflow-hidden" style={{ paddingBottom: '80%' }}>
                <div className="absolute inset-0 flex items-center justify-center p-4">

                    {/* Car silhouette - top down view */}
                    <svg viewBox="0 0 200 320" className="w-full h-full max-w-xs" fill="none">
                        {/* Car body outline */}
                        <rect x="55" y="20" width="90" height="280" rx="20" fill="#1e2535" stroke="#3a4459" strokeWidth="2"/>
                        {/* Windscreens */}
                        <rect x="65" y="70" width="70" height="45" rx="5" fill="#252d3d" stroke="#4e5a73" strokeWidth="1.5"/>
                        <rect x="65" y="205" width="70" height="45" rx="5" fill="#252d3d" stroke="#4e5a73" strokeWidth="1.5"/>
                        {/* Doors */}
                        <rect x="57" y="120" width="30" height="40" rx="3" fill="#1e2535" stroke="#3a4459" strokeWidth="1"/>
                        <rect x="57" y="163" width="30" height="40" rx="3" fill="#1e2535" steroke="#3a4459" strokeWidth="1"/>
                        <rect x="113" y="120" width="30" height="40" rx="3" fill="#1e2535" stroke="#3a4459" strokeWidth="1"/>
                        <rect x="113" y="163" width="30" height="40" rx="3" fill="#1e2535" stroke="#3a4459" strokeWidth="1"/>
                        {/* Wheels */}
                        <rect x="30" y="60" width="25" height="45" rx="8" fill="#161c2a" stroke="#3a4459" strokeWidth="2"/>
                        <rect x="145" y="60" width="25" height="45" rx="8" fill="#161c2a" stroke="#3a4459" strokeWidth="2"/>
                        <rect x="30" y="215" width="25" height="45" rx="8" fill="#161c2a" stroke="#3a4459" strokeWidth="2"/>
                        <rect x="145" y="215" width="25" height="45" rx="8" fill="#161c2a" stroke="#3a4459" strokeWidth="2"/>
                    </svg>

                    {/* Clickable Damage Points */}
                    {DAMAGE_AREAS.map((area) => {
                        const marked = isMarked(area.id)
                        return (
                            <button
                              key={area.id}
                              onClick={() => handleAreaClick(area)}
                              title={area.label}
                              style={{ left: `${area.x}%`, top: `${area.y}%` }}
                              className={`absolute w-5 h-5 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 z-10
                                ${marked
                                    ? 'bg-red-500 border-red-300 shadow-lg shadow-red-500/50'
                                    : 'bg-surface-700 border-surface-500 hover:bg-amber-500 hover:border-amber-300'
                                }`}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Add damage note popup */}
            {selectedArea && (
                <div className="card border-amber-500 border-opacity-40 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{selectedArea.label}</p>
                        <button onClick={() => setSelectedArea(null)}>
                            <X className="m-4 h-4 text-surface-400" />
                        </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Describe the damage (optional)"
                      classname="input-field text-sm"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button onClick={() => setSelectedArea(null)} className="btn-secondary flex-1 text-sm py-2">Cancel</button>"
                        <button onClick={handleAddDamage} className="btn-primary flex-1 text-sm py-2">Mark Damage</button>
                    </div>
                </div>
            )}

            {/* Damage Summary */}
            {damagePoints.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Marked Damage Areas</p>
                    <div className="flex flex-wrap gap-2">
                        {damagePoints.map((point) => (
                            <div key={point.area} className="flex items-center gap-1.5 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg px-3 py-1.5">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="text-xs text-red-400">{point.label}</span>
                                {point.description && (
                                    <span className="text-xs text-surface-500">- {point.description}</span>
                                )}
                                <button
                                  onClick={() => onChange(damagePoints.filter((p) => p.area !== point.area))}
                                  className="ml-1 text-surface-500 hover:text-red-400"
                                >
                                    <X classname="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}