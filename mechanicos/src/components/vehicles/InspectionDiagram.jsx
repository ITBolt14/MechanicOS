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
        setSelectedArea(null)
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
                              fill="#161c2a" stroke="#3a4459" strokeWidth="2" />

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
                            <DamageArea
                              id="left_rear_fender" label="L. Rear Fender"
                              x="82" y="298" width="45" height="62" rs="3"
                              marked={isMarked('left_rear_fender')}
                              hovered={hoveredArea === 'left_rear_fender'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Right Rear Fender */}
                            <DamageArea
                              id="right-front-fender" label="R. Rear Fender"
                              x="173" y="298" width="45" height="62" rx="3"
                              marked={isMarked('right_front_fender')}
                              hovered={hoveredArea === 'right_rear_fender'}
                              onClick={handleAreaClick}
                              onHover={setHoveredArea}
                            />

                            {/* Labels */}
                            <text x="150" y="57" textAnchor="middle" fontSize="9" fill="#6b7691">Front Bumper</text>
                            <text x="150" y="102" textAnchor="middle" fontSize="9" fill="#6b7691">Bonnet</text>
                            <text x="150" y="255" textAnchor="middle" fontSize="9" fill="#6b7691">Roof</text>
                            <text x="150" y="372" textAnchor="middle" fontSize="9" fill="#6b7691">Boot</text>
                            <text x="150" y="422" textAnchor="middle" fontSize="9" fill="#6b7691">Rear Bumper</text>
                            <text x="104" y="145" textAnchor="middle" fontSize="7.5" fill="#6b7691">L.Fr Fender</text>
                            <text x="196" y="145" textAnchor="middle" fontSize="7.5" fill="#6b7691">R.Fr Fender</text>
                            <text x="104" y="210" textAnchor="middle" fontSize="7.5" fill="#6b7691">Fr.L Door</text>
                            <text x="196" y="210" textAnchor="middle" fontSize="7.5" fill="#6b7691">Fr.R Door</text>
                            <text x="104" y="272" textAnchor="middle" fontSize="7.5" fill="#6b7691">Re.L Door</text>
                            <text x="196" y="272" textAnchor="middle" fontSize="7.5" fill="#6b7691">Re.R Door</text>
                            <text x="104" y="333" textAnchor="middle" fontSize="7.5" fill="#6b7691">L.Re Fender</text>
                            <text x="196" y="333" textAnchor="middle" fontSize="7.5" fill="#6b7691">R.Re Fender</text>

                            {/* FRONT / REAR labels */}
                            <text x="150" t="22" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4169ee">FRONT</text>
                            <text x="150" y="490" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4169ee">REAR</text>
                            <text x="22" y="255" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4169ee"
                              transform="rotate(-90, 22, 255)">LEFT</text>
                            <text x="278" y="255" textAnchor="middle" fontSize="10" fontWeight="bold" fill="4169ee"
                              transform="rotate(90, 278, 255)">RIGHT</text>
                        </svg>
                    </div>
                </div>

                {/* SIDE VIEW + FRONT/REAR */}
                <div className="space-y-4">

                    {/* Side View */}
                    <div>
                        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                            Side View
                        </p>
                        <div className="bg-surface-800 border border-surface-700 rounded-xlp-4">
                            <svg viewBox="0 0 400 180" className="w-full">

                                {/* Car side silhouette body */}
                                <rect x="30" y="70" width="340" height="80" rx="8"
                                  fill="#1e2535" stroke="#3a4459" strokeWidth="2" />

                                {/* Cabin */}
                                <path d="M100 70 L130 25 L270 25 L300 70 Z"
                                  fill="#252d3d" stroke="#4e5a73" strokeWidth="1.5" />

                                {/* Windscreen */}
                                <path d="M108 68 L135 28 L175 28 L160 68 Z"
                                  fill="#1a2030" stroke="#4e5a73" strokeWidth="1" />

                                {/* Rear screen */}
                                <path d="M240 68 L225 28 L265 28 L292 68 Z"
                                  fill="#1a2030" stroke="#4e5a73" strokeWidth="1" />

                                {/* Front wheel */}
                                <circle cx="100" cy="150" r="28" fill="#161c2a" stroke="#3a4459" strokeWidth="2" />
                                <circle cx="100" cy="150" r="14" fill="#1e2535" stroke="#4e5a73" strokeWidth="1" />

                                {/* Rear wheel */}
                                <circle cx="300" cy="150" r="28" fill="#161c2a" stroke="#3a4459" strokeWidth="2" />
                                <circle cx="300" cy="150" r="14" fill="#1e2535" stroke="#4e5a73" strokeWidth="1" />

                                {/* Clickable Side Areas */}

                                {/* Front bumper side */}
                                <DamageAreaPath
                                  id="front_bumper" label="Front Bumper"
                                  d="M30 90 L60 70 L60 150 L30 150 Z"
                                  marked={isMarked('front_bumper')}
                                  hovered={hoveredArea === 'front_bumper'}
                                  onClick={handleAreaClick}
                                  onHover={setHoveredArea}
                                />

                                {/* Bonnet side */}
                                <DamageAreaPath
                                  id="bonnet" label="Bonnet"
                                  d="M60 70 L130 70 L130 90 L60 90 Z"
                                  marked={isMarked('bonnet')}
                                  hovered={hoveredArea === 'bonnet'}
                                  onClick={handleAreaClick}
                                  onHover={setHoveredArea}
                                />

                                {/* Front Left fender side */}
                                <DamageAreaPath
                                  id="left_front_fender" label="L. Front Fender"
                                  d="M60 90 L130 90 L130 148 L62 148 Z"
                                  marked={isMarked('left_front_fender')}
                                  hovered={hoveredArea === 'left_front_fender'}
                                  onClick={handleAreaClick}
                                  onHover={setHoveredArea}
                                />
                                
                                {/* Front door side */}
                                <DamageAreaPath
                                  id="front_left_door" label="Front Left Door"
                                  d="M138 68 L200 68 L200 148 L138 148 Z"
                                  marked={isMarked('front_left_door')}
                                  hovered={hoveredArea === 'front_left_door'}
                                  onClick={handleAreaClick}
                                  onHover={setHoveredArea}
                                />

                                {/* Rear door side */}
                                <DamageAreaPath
                                  id="rear_left_door" label="Rear Left Door"
                                  d="M200 68 L262 68 L262 148 L200 148 Z"
                                  marked={isMarked('rear_left_door')}
                                  hovered={hoveredArea === 'rear_left_door'}
                                  onClick={handleAreaClick}
                                  onHover={setHoveredArea}
                                />

                                {/* Rear fender side */}
                                <DamageAreaPath
                                  id="left_rear_fender" label="L. Rear Fender"
                                  d="M262 90 L338 90 L338 148 L262 148 Z"
                                  marked={isMarked('left_rear_fender')}
                                  hovered={hoveredArea === 'left_rear_fender'}
                                  onClick={handleAreaClick}
                                  onHover={setHoveredArea}
                                />

                                {/* Boot side */}
                                <DamageAreaPath
                                  id="boot" label="Boot"
                                  d="M270 70 L338 70 L338 90 L270 90 Z"
                                  marked={isMarked('boot')}
                                  hovered={hoveredArea === 'boot'}
                                  onClick={handleAreaClick}
                                  onHover={setHoveredArea}
                                />

                                {/* Rear bumper side */}
                                <DamageAreaPath
                                  id="rear_bumper" label="Rear Bumper"
                                  d="M338 90 L370 90 L370 150 L338 150 Z"
                                  marked={isMarked('rear_bumper')}
                                  hovered={hoveredArea === 'rear_bumper'}
                                  onClick={handleAreaClick}
                                  onHover={setHoveredArea}
                                />

                                {/* Roof side */}
                                <DamageAreaPath
                                  id="roof" label="Roof"
                                  d="M130 25 L270 25 L270 68 L130 68 Z"
                                  marked={isMarked('roof')}
                                  hovered={hoveredArea === 'roof'}
                                  onClick={handleAreaClick}
                                  onHover={setHoveredArea}
                                />

                                {/* Side labels */}
                                <text x="45" y="125" textAnchor="middle" fontSize="7" fill="#6b7691">Fr. Bumper</text>
                                <text x="95" y="83" textAnchor="middle" fontSize="7" fill="#6b7691">Bonnet</text>
                                <text x="95" y="122" textAnchor="middle" fontSize="7" fill="#6b7691">Fr. Fender</text>
                                <text x="169" y="112" textAnchor="middle" fontSize="8" fill="#6b7691">Fr. Door</text>
                                <text x="231" y="112" textAnchor="middle" fontSize="8" fill="#6b7691">Re. Door</text>
                                <text x="300" y="122" textAnchor="middle" fontSize="7" fill="#6b7691">Re. Fender</text>
                                <text x="304" y="83" textAnchor="middle" fontSize="7" fill="#6b7691">Boot</text>
                                <text x="354" y="125" textAnchor="middle" fontSize="7" fill="#6b7691">Re. Bumper</text>
                                <text x="200" y="50" textAnchor="middle" fontSize="8" fill="#6b7691">Roof</text>

                                <text x="12" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#4169ee"
                                  transform="rotate(-90, 12, 115)">FRONT</text>
                                <text x="388" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#4169ee"
                                  transform="rotate(90, 388m 115)">REAR</text>
                            </svg>
                        </div>
                    </div>

                    {/* Front & Rear Views */}
                    <div className="grid grid-cols2 gap-4">

                        {/* Front View */}
                        <div>
                            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                                Front View
                            </p>
                            <div className="bg-surface-800 border border-surface-700 rounded-xl p-3">
                                <svg viewBox="0 0 200 160" className="w-full">
                                    {/* Body */}
                                    <rect x="25" y="40" width="150" height="90" rx="8"
                                      fill="#1e2535" stroke="#3a4459" strokeWidth="2" />
                                    
                                    {/* Cabin */}
                                    <rect x="45" y="10" width="110" height="32" rx="5"
                                      fill="#252d3d" stroke="#4e5a73" strokeWidth="1.5" />
                                    
                                    {/* Grille */}
                                    <rect x="60" y="95" width="80" height="28" rx="4"
                                      fill="#161c2a" stroke="#4e5a73" strokeWidth="1" />

                                    {/* Headlights */}
                                    <rect x="28" y="55" width="35" height="20" rx="4"
                                      fill="#252d3d" stroke="#4e5a73" strokeWidth="1" />
                                    <rect x="137" y="55" width="35" height="20" rx="4"
                                      fill="#252d3d" stroke="#4e5a73" strokeWidth="1" />

                                    {/* Wheels */}
                                    <circle cx="52" cy="142" r="16" fill="#161c2a" stroke="#3a4459" strokeWidth="2" />
                                    <circle cx="148" cy="142" r="16" fill="#161c2a" stroke="#3a4459" strokeWidth="2" />

                                    {/* Clickable areas */}
                                    <DamageAreaRect
                                      id="front_bumper" label="Front Bumper"
                                      x="25" y="90" width="150" height="38" rx="4"
                                      marked={isMarked('front_bumper')}
                                      hovered={hoveredArea === 'front_bumper'}
                                      onClick={handleAreaClick}
                                      onHover={setHoveredArea}
                                    />
                                    <DamageAreaRect
                                      id="bonnet" label="Bonnet"
                                      x="25" y="40" width="150" height="48" rx="4"
                                      marked={isMarked('bonnet')}
                                      hovered={hoveredArea === 'bonnet'}
                                      onClick={handleAreaClick}
                                      onHover={setHoveredArea}
                                    />
                                    <DamageAreaRect
                                      id="left_front_fender" label="L. Front Fender"
                                      x="25" y="40" width="30" height="88" rx="4"
                                      marked={isMarked('left_froot_fender')}
                                      hovered={hoveredArea === 'left_front_fender'}
                                      onClick={handleAreaClick}
                                      onHover={setHoveredArea}
                                    />
                                    <DamageAreaRect
                                      id="right_front_fender" label="R. Front Fender"
                                      x="145" y="40" width="30" height="88" rx="4"
                                      marked={isMarked('right_front_fender')}
                                      hovered={hoveredArea === 'right_front_fender'}
                                      onClick={handleAreaClick}
                                      onHover={setHoveredArea}
                                    />

                                    <text x="100" y="115" textAnchor="middle" fontSize="7" fill="#6b7691">Front Bumper</text>
                                    <text x="100" y="62" textAnchor="middle" fontSize="7" fill="#6b7691">Bonnet</text>
                                    <text x="40" y="85" textAnchor="middle" fontSize="6" fill="#6b7691"
                                      transform="rotate(-90, 40, 85)">L. Fender</text>
                                    <text x="160" y="85" textAnchor="middle" fontSize="6" fill="#6b7691"
                                      transform="rotate(90, 160, 85)">R. Fender</text>
                                    <text x="100" y="8" textAnchor="middle" fontSize="8" fontWeight="bold" fill="@4169ee">FRONT</text>
                                </svg>
                            </div>
                        </div>

                        {/* Rear View */}
                        <div>
                            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                                Rear View
                            </p>
                            <div className="bg-surface-800 border border-surface-700 rounded-xl p-3">
                                <svg ViewBox="0 0 200 160" className="w-full">
                                  {/* Body */}
                                    <rect x="25" y="40" width="150" height="90" rx="8"
                                      fill="#1e2535" stroke="#3a4459" strokeWidth="2" />

                                  {/* Cabin */}
                                    <rect x="45" y="10" width="110" height="32" rx="5"
                                      fill="#252d3d" stroke="#4e5a73" strokeWidth="1.5" />

                                  {/* Tail lights */}
                                    <rect x="28" y="55" width="35" height="20" rx="4"
                                      fill="#2d1a1a" stroke="#7a3a3a" strokeWidth="1" />
                                    <rect x="137" y="55" width="35" height="20" rx="4"
                                      fill="#2d1a1a" stroke="#7a3a3a" strokeWidth="1" />

                                  {/* Bumper detail */}
                                    <rect x="60" y="95" width="80" height="28" rx="4"
                                      fill="#161c2a" stroke="#4e5a73" strokeWidth="1" />

                                  {/* Wheels */}
                                    <circle cx="52" cy="142" r="16" fill="#161c2a" stroke="#3a4459" strokeWidth="2" />
                                    <circle cx="148" cy="142" r="16" fill="#161c2a" stroke="#3a4459" strokeWidth="2" />

                                  {/* Clickable areas */}
                                    <DamageAreaRect
                                      id="rear_bumper" label="Rear Bumper"
                                      x="25" y="90" width="150" height="38" rx="4"
                                      marked={isMarked('rear_bumper')}
                                      hovered={hoveredArea === 'rear_bumper'}
                                      onClick={handleAreaClick}
                                      onHover={setHoveredArea}
                                    />
                                    <DamageAreaRect
                                      id="boot" label="Boot"
                                      x="25" y="40" width="150" height="48" rx="4"
                                      marked={isMarked('boot')}
                                      hovered={hoveredArea === 'boot'}
                                      onClick={handleAreaClick}
                                      onHover={setHoveredArea}
                                    />
                                    <DamageAreaRect
                                      id="left_rear_fender" label="L. Rear Fender"
                                      x="25" y="40" width="30" height="88" rx="4"
                                      marked={isMarked('left_rear_fender')}
                                      hovered={hoveredArea === 'left_rear_fender'}
                                      onClick={handleAreaClick}
                                      onHover={setHoveredArea}
                                    />
                                    <DamageAreaRect
                                      id="right_rear_fender" label="R. Rear Fender"
                                      x="145" y="40" width="30" height="88" rx="4"
                                      marked={isMarked('right_rear_fender')}
                                      hovered={hoveredArea === 'right_rear_fender'}
                                      onClick={handleAreaClick}
                                      onHover={setHoveredArea}
                                    />

                                    <text x="100" y="115" textAnchor="middle" fontSize="7" fill="#6b7691">Rear Bumper</text>
                                    <text x="100" y="62" textAnchor="middle" fontSize="7" fill="#6b7691">Boot</text>
                                    <text x="40" y="85" textAnchor="middle" fontSize="6" fill="#6b7691"
                                      transform="rotate(-90, 40, 85)">L.Fender</text>
                                    <text x="160" y="85" textAnchor="middle" fontSize="6" fill="#6b7691"
                                      transform="rotate(90, 160, 85)">R.Fender</text>
                                    <text x="100" y="8" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4169ee">REAR</text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Damage Note Dialog */}
            {selectedArea && (
                <div className="card border-amber-500 space-y-3"
                  style={{ borderColor: 'rgba(245,158,11,0.4)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-white">
                            Mark Damage - {selectedArea.label}
                        </p>
                        <p className="text-xs text-surface-400 mt-0.5">
                            Add a  description or just click Mark Damage to record it
                        </p>
                    </div>
                    <button onClick={handleCancel}>
                        <X className="w-4 h-4 text-surface-400 hover:text-white" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Scratch, dent, crack... (optional)"
                    className="input-field text-sm"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDamage()}
                    autoFocus
                />
                <div className="flex gap-2">
                    <button onClick={handleCancel} className="btn-secondary flex-1 text-sm py-2">
                        Cancel
                    </button>
                    <button onClick={handleAddDamage} className="btn-primary flex-1 text-sm py-2">
                        Mark Damage
                    </button>
                </div>
            </div>
            )}

            {/* Damage Summary */}
            {damagePoints.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                        Marked Damage Areas ({damagePoints.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {damagePoints.map((point) => (
                            <div key={point.area}
                              className="flex items-center gap-1.5 bg-red-500 px-3 py-1.5 rounded-lg"
                              style={{ backgroundColor: 'rgba(239,68,68,0.1',
                                border: '1px solid rgba(239,68,68,0.3)' }}>
                              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                              <span className="text-xs text-red-400 font-medium">{point.label}</span>
                              {point.description && (
                                <span className="text-xs text-surface-500">- {point.description}</span>
                              )}
                              <button
                                onClick={() => onChange(damagePoints.filter((p) => p.area !== point.area))}
                                className="ml-1 text-surface-500 hover:text-red-400 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// -- SVG Helper Components --

function DamageArea({ id, label, x, y, width, height, rx, marked, hovered, onClick, onHover }) {
    return (
        <g
          onClick={() => onClick({ id, label })}
          onMouseEnter={() => onHover(id)}
          onMouseLeave={() => onHover(null)}
          style={{ cursor: 'pointer' }}
        >
            <rect
              x={x} y={y} width={width}height={height} rx={rx}
              fill={marked ? 'rgba(239,68,68,0.35)' : hovered ? 'rgba(65,105,238,0.25)' : 'transparent'}
              stroke={marked ? '#ef4444' : hovered ? '#4169ee' : 'transparent'}
              strokeWidth="2"
              strokeDasharray={marked ? '0' : '4,3'}
            />
            {marked && (
                <text
                  x={parseFloat(x) + parseFloat(width) / 2}
                  y={parseFloat(y) + parseFloat(height) / 2 + 4}
                  textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold"
                  >x</text>
            )}
        </g>
    )
}

function DamageAreaPath({ id, label, d, marked, hovered, onClick, onHover }) {
    return (
        <g
          onClick={() => onClick({ id, label })}
          onMouseEnter={() => onHover(id)}
          onMouseLeave={() => onHover(null)}
          style={{ cursor: 'pointer' }}
        >
            <path
              d={d}
              fill={marked ? 'rgba(239,68,68,0.35)' : hovered ? 'rgba(65,105,238,0.25)' : 'transparent'}
              stroke={marked ? '#ef4444' : hovered ? '#4169ee' : 'transparent'}
              strokeWidth="2"
            />
        </g>
    )
}

function DamageAreaRect({ id, label, x, y, width, height, rx, marked, hovered, onClick, onHover }) {
    return (
        <g
          onClick={() => onClick({ id, label })}
          onMouseEnter={() => onHover(id)}
          onMouseLeave={() => onHover(null)}
          style={{ cursor: 'pointer' }}
        >
            <rect
              x={x} y={y} width={width} height={height} rx={rx}
              fill={marked ? 'rgba(239,68,68,0.35)' : hovered ? 'rgba(65,105,238,0.25)' : 'transparent'}
              stroke={marked ? '#ef4444' : hovered ? '#4169ee' : 'transparent'}
              strokeWidth="2"
            />
        </g>
    )
}