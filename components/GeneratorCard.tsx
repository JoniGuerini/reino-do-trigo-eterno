import React from 'react';
import Decimal from 'break_infinity.js';
import { GameState, GeneratorType } from '../types';
import {
    BuyMode, GENERATOR_ORDER, STATE_KEYS, AUTOMATION_THRESHOLD,
    GENERATOR_INFO, calculateMultipliers, calculatePurchase, formatNumber
} from '../gameData';
import { WorkerIcon, WheatIcon } from './Icons';

interface GeneratorCardProps {
    type: GeneratorType;
    gameState: GameState;
    progressValue: number;
    buyMode: BuyMode;
    holdingBtn: GeneratorType | null;
    costFeedback: { costs: { wheat: Decimal, workers: Decimal, prevTier: Decimal, prevTierKey: keyof GameState | null }, visible: boolean } | undefined;
    setInfoModal: (type: GeneratorType) => void;
    handlePressStart: (type: GeneratorType, e: React.MouseEvent | React.TouchEvent) => void;
    handlePressEnd: () => void;
}

const GeneratorCard: React.FC<GeneratorCardProps> = React.memo(({
    type,
    gameState,
    progressValue,
    buyMode,
    holdingBtn,
    costFeedback,
    setInfoModal,
    handlePressStart,
    handlePressEnd
}) => {
    const info = GENERATOR_INFO[type];
    const stateKey = STATE_KEYS[type];
    const count = gameState[stateKey] as Decimal;
    const purchaseData = calculatePurchase(type, gameState, buyMode);

    // Multipliers for display
    const { speedMult, effMult } = calculateMultipliers(type, gameState.unlockedSkills || []);
    const currentProd = info.prodAmount.mul(effMult);
    const currentDuration = info.duration / speedMult;
    const isFast = currentDuration < 0.5 && count.gt(0);

    // Check Automation Status
    const currentIndex = GENERATOR_ORDER.indexOf(type);
    const nextTierType = currentIndex < GENERATOR_ORDER.length - 1 ? GENERATOR_ORDER[currentIndex + 1] : null;
    const nextTierCount = nextTierType ? gameState[STATE_KEYS[nextTierType]] as Decimal : new Decimal(0);
    const isAutomated = nextTierCount.gte(AUTOMATION_THRESHOLD);

    // Missing resource calculation is now done inline in the render


    const isAffordable = purchaseData.canAfford;

    return (
        <div className="flex flex-col gap-1 h-40">
            <div className="relative bg-parchment-100 rounded-xl p-3 border border-parchment-border shadow-sm overflow-hidden flex-1 flex flex-col justify-center">
                <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/rough-cloth.png')]"></div>

                <div className="absolute bottom-[-10px] right-[-15px] text-wood-900/5 text-9xl pointer-events-none transform -rotate-12 z-0">
                    {React.createElement(info.icon)}
                </div>

                <div className="relative z-10 flex flex-col justify-center h-full gap-2">
                    {/* Header & Cost Group */}
                    <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-start w-full">
                            <div className="text-sm font-bold uppercase tracking-wider text-wood-700 flex items-center gap-2">
                                {React.createElement(info.icon, { className: 'text-xl ' + info.colorClass })}
                                {type === 'peasant' ? 'Camponeses' : info.name + (info.name.endsWith('s') ? '' : 's')}
                            </div>
                            <button
                                onClick={() => setInfoModal(type)}
                                className="text-amber-800 hover:text-amber-600 transition-colors w-6 h-6 flex items-center justify-center"
                                title="Informações"
                            >
                                <i className="fa-solid fa-exclamation text-sm"></i>
                            </button>
                        </div>

                        {/* Cost Display (Static Only) */}
                        <div className="flex items-center h-4">
                            <div className="flex items-center gap-3 text-xs font-bold text-wood-600 opacity-80">
                                {purchaseData.costs.workers.gt(0) && (
                                    <div className="flex items-center gap-1">
                                        {formatNumber(purchaseData.costs.workers)} <WorkerIcon className="text-[10px] text-slate-700" />
                                    </div>
                                )}
                                {purchaseData.costs.prevTier.gt(0) && (
                                    <div className="flex items-center gap-1">
                                        {formatNumber(purchaseData.costs.prevTier)} {React.createElement(info.costIcon, { className: info.costColor + " text-[10px]" })}
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    {formatNumber(purchaseData.costs.wheat)} <WheatIcon className="text-[10px] text-harvest" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-5 bg-wood-300/30 rounded-full p-[3px] shadow-inner shrink-0">
                        <div
                            className={`h-full rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] relative overflow-hidden ${info.colorClass.replace('text-', 'bg-')} ${info.colorClass.replace('text-', 'border-').replace('700', '400')} ${isFast ? 'animate-progress-flow' : ''}`}
                            style={{
                                width: isFast ? '100%' : `${isNaN(progressValue) ? 0 : progressValue}%`,
                                transition: 'none',
                                willChange: 'width'
                            }}
                        >
                            {!isFast && <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex justify-between items-center h-6 relative">
                        <span className="bg-parchment-100 px-2 py-0.5 rounded border border-parchment-border shadow-sm text-wood-800 flex items-center gap-2 text-xs font-bold uppercase tracking-wide tabular-nums z-10 relative">
                            <i className="fa-solid fa-cubes text-wood-600" />
                            {formatNumber(count)}
                        </span>

                        {/* Dynamic Feedback (Centered in Stats Row) */}
                        {costFeedback?.visible && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                <div className="flex items-center gap-2 font-bold text-xs tabular-nums animate-fade-in bg-parchment-100/90 px-2 py-0.5 rounded border border-red-200 shadow-sm">
                                    {costFeedback.costs.workers.gt(0) && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-red-700">-{formatNumber(costFeedback.costs.workers)}</span>
                                            <WorkerIcon className="text-xs text-slate-700" />
                                        </div>
                                    )}
                                    {costFeedback.costs.prevTier.gt(0) && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-red-700">-{formatNumber(costFeedback.costs.prevTier)}</span>
                                            {React.createElement(info.costIcon, { className: info.costColor + " text-xs" })}
                                        </div>
                                    )}
                                    {costFeedback.costs.wheat.gt(0) && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-red-700">-{formatNumber(costFeedback.costs.wheat)}</span>
                                            <WheatIcon className="text-xs text-harvest" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <span className={`bg-parchment-100 px-2 py-0.5 rounded border border-parchment-border shadow-sm flex items-center gap-1 text-xs font-bold tabular-nums z-10 relative ${effMult.gt(1) ? 'text-emerald-700' : 'text-wood-800'}`}>
                            {count.gt(0) ? `+${formatNumber(count.mul(currentProd))}` : '0'}
                            {React.createElement(info.prodIcon, { className: info.prodColor })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 h-9 shrink-0">
                {isAutomated ? (
                    <div className="flex-1 rounded-lg bg-gradient-to-b from-yellow-300 to-yellow-500 border-2 border-yellow-700 shadow-md flex items-center justify-center gap-2 text-yellow-900 font-heading text-xs font-bold uppercase tracking-widest select-none cursor-default relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
                        <i className="fa-solid fa-certificate text-sm"></i>
                        Autossuficiente
                    </div>
                ) : (
                    <button
                        onMouseDown={(e) => handlePressStart(type, e)}
                        onMouseUp={handlePressEnd}
                        onMouseLeave={handlePressEnd}
                        onTouchStart={(e) => {
                            e.preventDefault(); // Prevent mouse emulation
                            handlePressStart(type, e);
                        }}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            handlePressEnd();
                        }}
                        disabled={!isAffordable && holdingBtn !== type}
                        className={`flex-1 rounded-lg font-heading text-sm font-bold tracking-widest uppercase transition-all duration-200 relative overflow-hidden shadow-md group select-none flex flex-col items-center justify-center h-full
              ${isAffordable
                                ? 'bg-wood-700 text-parchment-100 border-2 border-wood-900 hover:bg-wood-800 hover:shadow-lg active:translate-y-[1px] active:scale-[0.98]'
                                : 'bg-wood-300 text-amber-900 border-2 border-wood-400 cursor-not-allowed'
                            }`}
                    >
                        {isAffordable && (
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
                        )}
                        <span className="relative z-10 drop-shadow-md flex items-center gap-2 justify-center w-full tabular-nums">
                            {isAffordable
                                ? `${type === 'peasant' ? 'Contratar' : 'Construir'}${purchaseData.amount.gt(1) ? ` (+${formatNumber(purchaseData.amount)})` : ''} `
                                : (
                                    <div className="flex items-center gap-3">
                                        {gameState.workers.lt(purchaseData.costs.workers) && (
                                            <div className="flex items-center">
                                                {formatNumber(purchaseData.costs.workers.sub(gameState.workers))}
                                                <WorkerIcon className="text-xs mb-0.5 ml-1" />
                                            </div>
                                        )}
                                        {purchaseData.costs.prevTierKey && gameState[purchaseData.costs.prevTierKey].lt(purchaseData.costs.prevTier) && (
                                            <div className="flex items-center">
                                                {formatNumber(purchaseData.costs.prevTier.sub(gameState[purchaseData.costs.prevTierKey] as Decimal))}
                                                {React.createElement(info.costIcon, { className: "mb-0.5 ml-1" })}
                                            </div>
                                        )}
                                        {gameState.wheat.lt(purchaseData.costs.wheat) && (
                                            <div className="flex items-center">
                                                {formatNumber(purchaseData.costs.wheat.sub(gameState.wheat))}
                                                <WheatIcon className="text-xs mb-0.5 ml-1" />
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </span>
                    </button>
                )}


            </div>
        </div>
    );
});

export default GeneratorCard;
