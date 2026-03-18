import { useState } from "react"
import { X } from "lucide-react"

export function InspectionDiagram({ damagePoints = [], onChange }) {
    const [hoveredArea, setHoveredArea] = useState(null)
    const [selectedArea, setSelectedArea] = useState(null)
    const [note, setNote] = useState('')

    const isMarked = (areaId) => damagePoints.some((p) => p.area === areaId)

    const handleAreaClick = (area) => {
        if (isMarked(area.id)) {
            // If already marked, remove it
            const updated = damagePoints.filter((p) => p.area !== area.id)
            onChange(updated)
            return
        }
        // Open note dialog without saving yet
        setSelectedArea(area)
        setNote('')
    }

    const handleAddDamage = () => {
        if (!selectedArea) return
        const updated = [
            ...damagePoints,
            { area: selectedArea.id,  label: selectedArea.label, description: note },
        ]
        onChange(updated)
        setSelectedArea(null)
        setNote('')
    }

    const handleCancel = () => {
        setSelectedArea(nnull)
        setNote('')
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-surface-400">
                Click on a panel to mark damage. Click a marked panel again to remove it.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* TOP DOWN VIEW */}
                <div>
                    <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                        Top View
                    </p>
                    <div className="relative bg-surface-800 border border-surface-700 rounded-xl p-4">
                        <svg viewBox="0 0 300 500" className="w-full" style={{ maxHeight: 420 }}>

                            {/* Car Body */}
                            <rect x="80" y="30" width="140" height="440" rx="30"
                              fill="#1e2535" stroke="#3a4459" strokeWidth="2" />

                            {/* Front windscreen */}
                            <rect x="95" y="95" width="110" height="65" rx="6"
                              fill="#252d3d" stroke="#4e5a73" strokeWidth="1.5" />

                            {/* Rear windscreen */}
                            <rect x="95" y="340" width="110" height="65" rx="6"
                              fill="#252d3d" stroke="#4e5a73" strokeWidth="1.5" />

                            {/* Front left door */}
                            <rect x="82" y="175" width="45" height="60" rx="3"
                              fill="#1e2535" stroke="#3a4459" strokeWidth="1" />

                            {/* Front right door */}
                            <rect x="173" y="175" width="45" height="60" rx="3"
                              fill="#1e2535" stroke="#3a4459" strokeWidth="1" />

                            {/* Rear left door */}
                            <rect x="82" y="240" width="45" height="55" rx="3"
                              fill="#1e2535" stroke="#3a4459" strokeWidth="1" />

                            {/* Rear right door */}
                            <rect x="173" y="240" width="45" height="55" rx="3"
                              fill="#1e2535" stroke="#3a4459" strokeWidth="1" />

                            {/* Front left wheel */}
                            <rect x="42" y="110" width="38" height="65" rx="10"
                              fill="#161c2a" stroke="#3a4459"strokeWidth="2" />

                            {/* Front right whee; */}
                            <rect x="220" y="110" width="38" height="65" rx="10"
                              fill="#161c2a" stroke="#3a4459" strokeWidth="2" />

                            {/* Rear left wheel */}
                            <rect x="42" y="325" width="38" height="65" rx="10"
                              fill="#161c2a" stroke="#3a4459" strokeWidth="2" />

                            {/* Rear right wheel */}
                            <rect x="220" y="325" width="38" height="65" rx="10"
                              fill="#161c2a" stroke="#3a4459" strokeWidth="2" />

                            {/* -- Clickable Damage Areas -- */}

                            {/* Front Bumper */}
                            <DamageArea
                              id="front_bumper" label="Front Bumper"
                              x="90" y="32" width="120" height="35" rx="8"
                              marked={isMarked('front_bumper')}
                              hovered={hoveredArea === 'front_bumper'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Bonnet */}
                            <DamageArea
                              id="bonnet" label="Bonnet"
                              x="90" y="70" width="120" height="55" rx="4"
                              marked={isMarked('bonnet')}
                              hovered={hoveredArea === 'bonnet'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Roof */}
                            <DamageArea
                              id="roof" label="Roof"
                              x="90" y="165" width="120" height="170" rx="4"
                              marked={isMarked('roof')}
                              hovered={hoveredArea === 'roof'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Boot */}
                            <DamageArea
                              id="boot" label="Boot"
                              x="90" y="340" width="120" height="55" rx="4"
                              marked={isMarked('boot')}
                              hovered={hoveredArea === 'boot'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Rear bumper */}
                            <DamageArea
                              id="rear_bumper" label="Rear Bumper"
                              x="90" y="398" width="120" height="35" rx="8"
                              marked={isMarked('rear_bumper')}
                              hovered={hoveredArea === 'rear_bumper'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Left Front Fender */}
                            <DamageArea
                              id="left_front_fender" label="L. Front Fender"
                              x="82" y="110" width="45" height="62" rx="3"
                              marked={isMarked('left_front_fender')}
                              hovered={hoveredArea === 'left_front_fender'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Right Front Fender */}
                            <DamageArea
                              id="right_front_fender" label="R. Front Fender"
                              x="173" y="110" width="45" height="62" rx="3"
                              marked={isMarked('right_front_fender')}
                              hovered={hoveredArea === 'right_front_fender'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Front Left Door */}
                            <DamageArea
                              id="front_left_door" label="Front Left Door"
                              x="82" y="175" width="45" height="60" rx="3"
                              marked={isMarked('front_left_door')}
                              hovered={hoveredArea === 'front_left_door'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Front Right Door */}
                            <DamageArea
                              id="front_right_door" label="Front RIght Door"
                              x="173" y="175" width="45" height="60" rx="3"
                              marked={isMarked('front_right_door')}
                              hovered={hoveredArea === 'front_right_door'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Rear Left Door */}
                            <DamageArea
                              id="rear_left_door" label="Rear Left Door"
                              x="82" y="240" width="45" height="55" rx="3"
                              marked={isMarked('rear_left_door')}
                              hovered={hoveredArea === 'rear_left_door'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Rear Right Door */}
                            <DamageArea
                              id="rear_right_door" label="Rear Right Door"
                              x="173" y="240" width="45" height="55" rx="3"
                              marked={isMarked('rear_right_door')}
                              hovered={hoveredArea === 'rear_right_door'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Left Rear Fender */}
                            
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}