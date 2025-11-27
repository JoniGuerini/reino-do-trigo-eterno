import React, { useState, useEffect, useRef } from 'react';
import Decimal from 'break_infinity.js';
import { GameState, SkillNode } from '../types';
import { SKILL_TREE, formatNumber } from '../gameData';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { WheatIcon, WorkerIcon } from './Icons';

const CANVAS_SIZE = 20000;

interface SkillTreeProps {
    gameState: GameState;
    onBuySkill: (skillId: string) => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({ gameState, onBuySkill }) => {
    const { ref, isDragging, events } = useDraggableScroll();
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);

    // Center the view on mount
    useEffect(() => {
        // Small timeout to ensure layout is ready
        const timer = setTimeout(() => {
            if (ref.current) {
                const container = ref.current;
                // Scroll to center of the canvas
                container.scrollTop = (CANVAS_SIZE - container.clientHeight) / 2;
                container.scrollLeft = (CANVAS_SIZE - container.clientWidth) / 2;
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Handle Wheel Zoom
    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY) * 0.1;
            setZoom(prev => Math.min(Math.max(prev + delta, 0.2), 2));
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    const getNodeState = (node: SkillNode) => {
        const isUnlocked = gameState.unlockedSkills.includes(node.id);
        if (isUnlocked) return 'unlocked';

        if (node.id === 'peasant_eff_1') return 'available';

        const isReachable = SKILL_TREE.some(other =>
            gameState.unlockedSkills.includes(other.id) && (
                other.connections.includes(node.id) ||
                node.connections.includes(other.id)
            )
        );

        return isReachable ? 'available' : 'locked';
    };

    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden flex flex-col">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            {/* Zoom Indicator (No Buttons) */}
            <div className="absolute top-4 right-4 z-50 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-600 backdrop-blur-sm pointer-events-none">
                <div className="text-xs font-bold text-slate-400 tabular-nums">Zoom: {Math.round(zoom * 100)}%</div>
            </div>

            {/* Canvas */}
            <div
                ref={ref}
                {...events}
                className={`flex-1 overflow-auto relative custom-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
                <div
                    className="relative bg-slate-950/50 origin-top-left transition-transform duration-200 ease-out"
                    style={{
                        width: `${CANVAS_SIZE * zoom}px`,
                        height: `${CANVAS_SIZE * zoom}px`,
                        transform: `scale(${zoom})`,
                    }}
                >
                    {/* We need a wrapper for the scale to work correctly without affecting the scrollable area calculation incorrectly */}
                    <div style={{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px`, transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
                        <div className="absolute inset-0 pointer-events-none" style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}></div>

                        {/* Content Container - Centered at CANVAS_SIZE/2, CANVAS_SIZE/2 */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 visible">
                            {/* Connections (Lines) */}
                            <svg className="overflow-visible absolute top-0 left-0 pointer-events-none">
                                {SKILL_TREE.map(node => (
                                    node.connections.map(targetId => {
                                        const target = SKILL_TREE.find(n => n.id === targetId);
                                        if (!target) return null;

                                        const isUnlocked = gameState.unlockedSkills.includes(node.id) && gameState.unlockedSkills.includes(targetId);
                                        const isAvailable = gameState.unlockedSkills.includes(node.id);

                                        return (
                                            <line
                                                key={`${node.id}-${targetId}`}
                                                x1={node.x}
                                                y1={node.y}
                                                x2={target.x}
                                                y2={target.y}
                                                stroke={isUnlocked ? '#fbbf24' : (isAvailable ? '#fbbf24' : '#475569')}
                                                strokeWidth={isUnlocked ? 4 : 2}
                                                strokeOpacity={isUnlocked ? 1 : (isAvailable ? 0.5 : 0.2)}
                                            />
                                        );
                                    })
                                ))}
                            </svg>

                            {/* Nodes */}
                            {SKILL_TREE.map(node => {
                                const state = getNodeState(node);
                                const canAfford = gameState.wheat.gte(node.cost);
                                const isHovered = hoveredNodeId === node.id;

                                let bgClass = 'bg-slate-800 border-slate-600';
                                let iconClass = 'text-slate-500';

                                if (state === 'unlocked') {
                                    bgClass = 'bg-amber-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
                                    iconClass = 'text-amber-400';
                                } else if (state === 'available') {
                                    bgClass = 'bg-slate-700 border-amber-700/50 hover:border-amber-500 hover:bg-slate-600 cursor-pointer';
                                    iconClass = 'text-amber-700';
                                    if (canAfford) {
                                        bgClass += ' hover:shadow-[0_0_10px_rgba(245,158,11,0.3)]';
                                    }
                                }

                                return (
                                    <div key={node.id} className="absolute" style={{ left: node.x, top: node.y }}>
                                        <button
                                            onMouseEnter={() => setHoveredNodeId(node.id)}
                                            onMouseLeave={() => setHoveredNodeId(null)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (state === 'available' && canAfford) {
                                                    onBuySkill(node.id);
                                                }
                                            }}
                                            className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${bgClass}`}
                                        >
                                            {React.createElement(node.icon, { className: `text-xl ${iconClass}` })}
                                        </button>

                                        {/* Tooltip */}
                                        {isHovered && (
                                            <div
                                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-64 bg-slate-900/95 border border-amber-900/50 p-3 rounded-lg shadow-2xl backdrop-blur-md text-slate-100 z-50 pointer-events-none"
                                                style={{
                                                    // Invert zoom scale for tooltip so it stays readable size
                                                    transform: `translate(-50%, 0) scale(${1 / zoom})`,
                                                    transformOrigin: 'bottom center'
                                                }}
                                            >
                                                <div className="text-center mb-2">
                                                    <h3 className="font-heading text-lg text-amber-500 leading-tight">{node.name}</h3>
                                                </div>
                                                <p className="text-xs text-slate-300 mb-3 italic text-center">"{node.description}"</p>

                                                <div className="flex items-center justify-center gap-2 mb-3 text-xs bg-slate-800/50 py-1 rounded">
                                                    <span className="text-emerald-400 font-bold">
                                                        {node.effect.type === 'efficiency' && `+${(node.effect.value * 100) - 100}% Eficiência`}
                                                        {node.effect.type === 'speed' && `+${(node.effect.value * 100) - 100}% Velocidade`}
                                                        {node.effect.type === 'luck' && `10% chance de dobrar produção`}
                                                    </span>
                                                </div>

                                                {state !== 'unlocked' && (
                                                    state === 'locked' ? (
                                                        <div className="w-full py-1 bg-slate-800 text-slate-500 text-center rounded font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2">
                                                            <i className="fa-solid fa-lock"></i> Bloqueado
                                                        </div>
                                                    ) : (
                                                        <div className={`w-full py-1 font-bold text-sm flex items-center justify-center gap-1 ${canAfford ? 'text-amber-500' : 'text-red-400'}`}>
                                                            {formatNumber(node.cost)}
                                                            {node.costType === 'wheat' && <WheatIcon className="text-current" />}
                                                        </div>
                                                    )
                                                )}

                                                {/* Arrow */}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-900/95"></div>
                                            </div>
                                        )
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SkillTree;
