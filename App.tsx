import React, { useState, useEffect, useRef } from 'react';
import Decimal from 'break_infinity.js';
import { GameState } from './types';
import {
  WheatIcon, PeasantIcon, MillIcon, StableIcon,
  GuildIcon, MarketIcon, CastleIcon, CathedralIcon, CitadelIcon, KingdomIcon, WorkerIcon
} from './components/Icons';
import {
  PEASANT_COST, MILL_COST, STABLE_COST, GUILD_COST, MARKET_COST, CASTLE_COST, CATHEDRAL_COST, CITADEL_COST, KINGDOM_COST,
  HARVEST_DURATION_MS, MILL_DURATION_MS, STABLE_DURATION_MS, GUILD_DURATION_MS, MARKET_DURATION_MS, CASTLE_DURATION_MS, CATHEDRAL_DURATION_MS, CITADEL_DURATION_MS, KINGDOM_DURATION_MS,
  WHEAT_PER_HARVEST, PEASANTS_PER_MILL_CYCLE, MILLS_PER_STABLE_CYCLE, STABLES_PER_GUILD_CYCLE, GUILDS_PER_MARKET_CYCLE, MARKETS_PER_CASTLE_CYCLE, CASTLES_PER_CATHEDRAL_CYCLE, CATHEDRALS_PER_CITADEL_CYCLE, CITADELS_PER_KINGDOM_CYCLE,
  SAVE_KEY, AUTOMATION_THRESHOLD, GENERATOR_ORDER, STATE_KEYS, UPGRADES_DATA, GENERATOR_INFO, INITIAL_STATE,
  formatNumber, getUpgradesForType, getUpgradeCost, calculateMultipliers, calculatePurchase,
  BuyMode, GeneratorType, Upgrade,
  WORKER_COST,
  PEASANT_WHEAT_COST, MILL_WHEAT_COST, STABLE_WHEAT_COST, GUILD_WHEAT_COST, MARKET_WHEAT_COST, CASTLE_WHEAT_COST, CATHEDRAL_WHEAT_COST, CITADEL_WHEAT_COST, KINGDOM_WHEAT_COST,
  PEASANT_PREV_COST, MILL_PREV_COST, STABLE_PREV_COST, GUILD_PREV_COST, MARKET_PREV_COST, CASTLE_PREV_COST, CATHEDRAL_PREV_COST, CITADEL_PREV_COST, KINGDOM_PREV_COST
} from './gameData';
import GeneratorCard from './components/GeneratorCard';

type FPSLimit = number | 'vsync' | 'unlimited';



interface InfoModalProps {
  type: GeneratorType;
  onClose: () => void;
  onNavigate: (type: GeneratorType) => void;
  gameState: GameState;
  buyUpgrade: (upgrade: Upgrade) => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ type, onClose, onNavigate, gameState, buyUpgrade }) => {
  const info = GENERATOR_INFO[type];
  const upgrades = getUpgradesForType(type);
  const { speedMult, effMult } = calculateMultipliers(type, gameState.upgrades || {});
  const { ref, isDragging, events } = useDraggableScroll();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wood-900/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-parchment-200 rounded-lg shadow-2xl border-4 border-wood-500 relative overflow-hidden flex flex-col h-[60vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
        <button onClick={onClose} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-wood-700 hover:text-wood-900 z-20"><i className="fa-solid fa-xmark text-xl"></i></button>
        <div className="bg-parchment-300/50 p-6 text-center border-b border-wood-300/30 shrink-0">
          <div className={`text-4xl mb-3 ${info.colorClass}`}>{React.createElement(info.icon)}</div>
          <h2 className="font-heading text-2xl text-wood-900">{info.name}</h2>
          <p className="italic text-wood-700 font-serif text-center leading-relaxed text-sm mt-2 max-w-2xl mx-auto">"{info.flavor}"</p>
        </div>

        <div
          ref={ref}
          {...events}
          className={`p-6 overflow-y-auto custom-scrollbar flex-1 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Stats */}
            <div className="flex flex-col gap-6">
              <div className="bg-white/40 p-4 rounded border border-parchment-border flex-1 flex flex-col justify-center gap-4">
                <div className="flex justify-between items-center border-b border-wood-300/20 pb-2 mb-2">
                  <span className="font-bold text-wood-800 text-xs uppercase tracking-wider">Custos Base</span>
                  <div className="flex flex-col items-end gap-1">
                    {/* Worker Cost */}
                    <span className="font-heading text-wood-900 flex items-center gap-2 tabular-nums">
                      {formatNumber(new Decimal(WORKER_COST))}
                      <WorkerIcon className="text-lg text-slate-700" />
                    </span>
                    {/* Prev Tier Cost */}
                    {type !== 'peasant' && (
                      <span className="font-heading text-wood-900 flex items-center gap-2 tabular-nums">
                        {type === 'mill' && formatNumber(new Decimal(MILL_PREV_COST))}
                        {type === 'stable' && formatNumber(new Decimal(STABLE_PREV_COST))}
                        {type === 'guild' && formatNumber(new Decimal(GUILD_PREV_COST))}
                        {type === 'market' && formatNumber(new Decimal(MARKET_PREV_COST))}
                        {type === 'castle' && formatNumber(new Decimal(CASTLE_PREV_COST))}
                        {type === 'cathedral' && formatNumber(new Decimal(CATHEDRAL_PREV_COST))}
                        {type === 'citadel' && formatNumber(new Decimal(CITADEL_PREV_COST))}
                        {type === 'kingdom' && formatNumber(new Decimal(KINGDOM_PREV_COST))}
                        {React.createElement(info.costIcon, { className: `text-lg ${info.costColor}` })}
                      </span>
                    )}
                    {/* Wheat Cost */}
                    <span className="font-heading text-wood-900 flex items-center gap-2 tabular-nums">
                      {type === 'peasant' && formatNumber(new Decimal(PEASANT_WHEAT_COST))}
                      {type === 'mill' && formatNumber(new Decimal(MILL_WHEAT_COST))}
                      {type === 'stable' && formatNumber(new Decimal(STABLE_WHEAT_COST))}
                      {type === 'guild' && formatNumber(new Decimal(GUILD_WHEAT_COST))}
                      {type === 'market' && formatNumber(new Decimal(MARKET_WHEAT_COST))}
                      {type === 'castle' && formatNumber(new Decimal(CASTLE_WHEAT_COST))}
                      {type === 'cathedral' && formatNumber(new Decimal(CATHEDRAL_WHEAT_COST))}
                      {type === 'citadel' && formatNumber(new Decimal(CITADEL_WHEAT_COST))}
                      {type === 'kingdom' && formatNumber(new Decimal(KINGDOM_WHEAT_COST))}
                      <WheatIcon className="text-lg text-harvest" />
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-wood-300/20 pb-2 mb-2">
                  <span className="font-bold text-wood-800 text-xs uppercase tracking-wider">Produção</span>
                  <span className="font-heading text-wood-900 flex items-center gap-2 tabular-nums">
                    <span className={effMult.gt(1) ? 'text-emerald-700 font-bold' : ''}>{formatNumber(info.prodAmount.mul(effMult))}</span>
                    {React.createElement(info.prodIcon, { className: `text-lg ${info.prodColor}` })}
                    <span className={`text-sm ml-1 font-body font-bold ${speedMult > 1 ? 'text-emerald-700' : 'text-wood-600'}`}>/ {info.duration / speedMult}s</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-wood-800 text-xs uppercase tracking-wider">{info.totalLabel}</span>
                  <span className="font-heading text-wood-900 flex items-center gap-2 tabular-nums">{formatNumber(gameState[info.totalKey] as Decimal)}{React.createElement(info.prodIcon, { className: `text-lg ${info.prodColor}` })}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Upgrades */}
            <div className="flex flex-col gap-4 relative">
              {/* Divider for desktop */}
              <div className="hidden md:block absolute left-[-1rem] top-0 bottom-0 w-px bg-wood-300/30"></div>

              <h3 className="font-heading text-wood-900 text-center text-lg uppercase tracking-wider">Tecnologias</h3>
              {upgrades.length > 0 ? (
                <div className="space-y-3">
                  {upgrades.map(u => {
                    const currentRank = gameState.upgrades?.[u.id] || 0;
                    const maxRank = u.maxRank || 10;
                    const isMaxed = currentRank >= maxRank;
                    const cost = getUpgradeCost(u, currentRank);
                    const canAfford = gameState.wheat.gte(cost);

                    return (
                      <div key={u.id} className={`p-3 rounded border flex flex-col gap-2 ${currentRank > 0 ? 'bg-emerald-100/50 border-emerald-300' : 'bg-white/40 border-parchment-border'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-wood-900 text-sm flex items-center gap-2">
                              {u.name}
                              {currentRank > 0 && <span className="text-xs bg-wood-200 px-1.5 rounded text-wood-800 border border-wood-300">Lv {currentRank}</span>}
                            </div>
                            <div className="text-[10px] text-wood-600 leading-tight">{u.description}</div>
                          </div>
                          {isMaxed ? (
                            <i className="fa-solid fa-check text-emerald-600" title="Máximo Atingido"></i>
                          ) : (
                            <div className="flex items-center gap-1 font-heading text-sm text-wood-800 tabular-nums">
                              {formatNumber(cost)} <WheatIcon className="text-harvest" />
                            </div>
                          )}
                        </div>
                        {!isMaxed && (
                          <button
                            onClick={() => buyUpgrade(u)}
                            disabled={!canAfford}
                            className={`w-full py-1 text-[10px] uppercase font-bold tracking-wider rounded border transition-all ${canAfford ? 'bg-wood-700 text-parchment-100 border-wood-900 hover:bg-wood-800' : 'bg-wood-300 text-wood-500 border-wood-400 cursor-not-allowed'}`}
                          >
                            {currentRank === 0 ? 'Pesquisar' : 'Melhorar'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-wood-500 italic text-sm">Nenhuma tecnologia disponível.</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="p-2 shrink-0 flex justify-center gap-2 overflow-x-auto custom-scrollbar">
          {GENERATOR_ORDER.map((genType) => {
            const genInfo = GENERATOR_INFO[genType];
            const isCurrent = genType === type;
            // Check visibility (unlocked)
            const index = GENERATOR_ORDER.indexOf(genType);
            const prevType = index > 0 ? GENERATOR_ORDER[index - 1] : null;
            const isVisible = index === 0 || (prevType && ((gameState[STATE_KEYS[prevType]] as Decimal).gt(0) || (gameState[STATE_KEYS[genType]] as Decimal).gt(0)));

            if (!isVisible) return null;

            return (
              <button
                key={genType}
                onClick={() => onNavigate(genType)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border-2 relative overflow-hidden ${isCurrent ? 'bg-wood-700 text-parchment-100 border-wood-900 scale-110 shadow-lg z-10' : 'bg-parchment-100 border-transparent hover:bg-white hover:scale-105'}`}
                title={genInfo.name}
              >
                {isCurrent && <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>}
                {React.createElement(genInfo.icon, { className: isCurrent ? '' : genInfo.colorClass })}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const useDraggableScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    startY.current = e.pageY;
    scrollTop.current = ref.current.scrollTop;
    document.body.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const y = e.pageY;
    const walk = (y - startY.current) * 1.5;
    ref.current.scrollTop = scrollTop.current - walk;
  };

  const onMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
  };

  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    }
  };

  return { ref, isDragging, events: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave } };
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        // Re-hydrate Decimals
        const hydrated: any = { ...parsed };
        Object.keys(hydrated).forEach(key => {
          if (typeof hydrated[key] === 'string' && !isNaN(parseFloat(hydrated[key])) && key !== 'upgrades') {
            // Heuristic: if it looks like a number, try to convert to Decimal
            // But wait, some keys are not Decimals (like upgrades).
            // Better to use the INITIAL_STATE keys as reference.
          }
        });

        // Safer approach: Iterate over INITIAL_STATE keys
        Object.keys(INITIAL_STATE).forEach(key => {
          const k = key as keyof GameState;
          if (INITIAL_STATE[k] instanceof Decimal) {
            if (parsed[k] !== undefined) {
              hydrated[k] = new Decimal(parsed[k]);
            } else {
              hydrated[k] = new Decimal(INITIAL_STATE[k] as Decimal);
            }
          }
        });

        // Migration: Convert boolean upgrades to number (Rank 1)
        if (parsed.upgrades) {
          const migratedUpgrades: Record<string, number> = {};
          Object.entries(parsed.upgrades).forEach(([key, val]) => {
            if (typeof val === 'boolean') {
              migratedUpgrades[key] = val ? 1 : 0;
            } else {
              migratedUpgrades[key] = val as number;
            }
          });
          hydrated.upgrades = migratedUpgrades;
        }

        // Merge with initial state to ensure new fields (like upgrades) exist
        return { ...INITIAL_STATE, ...hydrated };
      }
    } catch (e) {
      console.error("Erro ao carregar save:", e);
    }
    return INITIAL_STATE;
  });

  const isResettingRef = useRef(false);
  const stateRef = useRef(gameState);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (isResettingRef.current) return;
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
    }, 5000);

    return () => clearInterval(saveInterval);
  }, []);

  const [progress, setProgress] = useState({
    wheat: 0,
    mill: 0,
    stable: 0,
    guild: 0,
    market: 0,
    castle: 0,
    cathedral: 0,
    citadel: 0,
    kingdom: 0
  });

  // Helper map for progress keys since 'peasant' uses 'wheat'
  const PROGRESS_KEYS: Record<GeneratorType, keyof typeof progress> = {
    peasant: 'wheat',
    mill: 'mill',
    stable: 'stable',
    guild: 'guild',
    market: 'market',
    castle: 'castle',
    cathedral: 'cathedral',
    citadel: 'citadel',
    kingdom: 'kingdom'
  };

  const [fpsLimit, setFpsLimit] = useState<FPSLimit>('vsync');
  const [actualFPS, setActualFPS] = useState(0);
  const [showFPS, setShowFPS] = useState(false);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const loopRef = useRef<number | NodeJS.Timeout | null>(null);

  const [buyMode, setBuyMode] = useState<BuyMode>('1');
  const [holdingBtn, setHoldingBtn] = useState<GeneratorType | null>(null);
  const [infoModal, setInfoModal] = useState<GeneratorType | null>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drag to Scroll Logic
  const { ref: scrollContainerRef, isDragging, events: dragEvents } = useDraggableScroll();

  // Fullscreen Logic
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // Auto-enter fullscreen on first interaction
  useEffect(() => {
    const attemptFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          // Ignore errors (likely blocked by browser policy if no gesture)
        });
      }
    };

    const listener = () => {
      attemptFullscreen();
      window.removeEventListener('click', listener);
      window.removeEventListener('touchstart', listener);
    };

    window.addEventListener('click', listener);
    window.addEventListener('touchstart', listener);

    return () => {
      window.removeEventListener('click', listener);
      window.removeEventListener('touchstart', listener);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  // Cost Feedback State
  const [costFeedback, setCostFeedback] = useState<Record<string, {
    costs: { wheat: Decimal, workers: Decimal, prevTier: Decimal, prevTierKey: keyof GameState | null },
    visible: boolean
  }>>({});
  const lastFeedbackTimeRef = useRef<Record<string, number>>({});
  const accumulatedCostRef = useRef<Record<string, { wheat: Decimal, workers: Decimal, prevTier: Decimal }>>({});
  const feedbackTimeoutRefs = useRef<Record<string, number>>({});
  const lastWorkerTimeRef = useRef(Date.now());





  const buyUpgrade = (upgrade: Upgrade) => {
    setGameState(prev => {
      const currentRank = prev.upgrades[upgrade.id] || 0;
      const maxRank = upgrade.maxRank || 10;

      if (currentRank >= maxRank) return prev;

      const cost = getUpgradeCost(upgrade, currentRank);

      if (prev.wheat.lt(cost)) return prev;

      return {
        ...prev,
        wheat: prev.wheat.sub(cost),
        upgrades: { ...prev.upgrades, [upgrade.id]: currentRank + 1 }
      };
    });
  };

  const toggleBuyMode = () => {
    const modes: BuyMode[] = ['1', '1%', '10%', '50%', '100%'];
    const currentIndex = modes.indexOf(buyMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setBuyMode(modes[nextIndex]);
  };

  useEffect(() => {
    const measureInterval = setInterval(() => {
      setActualFPS(framesRef.current);
      framesRef.current = 0;
    }, 1000);
    return () => clearInterval(measureInterval);
  }, []);

  // MAIN GAME LOOP
  useEffect(() => {
    lastTimeRef.current = performance.now();

    const loop = () => {
      if (isResettingRef.current) return;

      const now = performance.now();
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      framesRef.current++;

      setProgress((prev) => {
        const state = stateRef.current;
        let updates = { ...prev };
        let stateUpdates: Partial<GameState> = {};
        let hasUpdates = false;

        // Helper for production logic
        const processGenerator = (
          type: GeneratorType,
          count: Decimal,
          currentProg: number,
          baseDuration: number,
          baseOutput: number,
          targetResource: Exclude<keyof GameState, 'upgrades'>,
          totalResource: Exclude<keyof GameState, 'upgrades'>
        ): number => {
          if (count.lte(0)) return currentProg;

          const { speedMult, effMult } = calculateMultipliers(type, state.upgrades || {});
          const duration = baseDuration / speedMult;
          const output = new Decimal(baseOutput).mul(effMult);

          let nextProg = currentProg + ((dt / duration) * 100);
          if (nextProg >= 100) {
            const cycles = Math.floor(nextProg / 100);
            nextProg = nextProg % 100;
            const produced = count.mul(output).mul(cycles);

            // Queue state update
            const currentTarget = stateUpdates[targetResource] || state[targetResource] as Decimal;
            const currentTotal = stateUpdates[totalResource] || state[totalResource] as Decimal;

            stateUpdates[targetResource] = currentTarget.add(produced) as any;
            stateUpdates[totalResource] = currentTotal.add(produced) as any;
            hasUpdates = true;
          }
          return nextProg;
        };

        // 1. Peasant -> Wheat
        updates.wheat = processGenerator('peasant', state.peasants, prev.wheat, HARVEST_DURATION_MS, WHEAT_PER_HARVEST, 'wheat', 'totalHarvested');

        // 2. Mill -> Peasant
        updates.mill = processGenerator('mill', state.mills, prev.mill, MILL_DURATION_MS, PEASANTS_PER_MILL_CYCLE, 'peasants', 'totalPeasantsGenerated');

        // 3. Stable -> Mill
        updates.stable = processGenerator('stable', state.stables, prev.stable, STABLE_DURATION_MS, MILLS_PER_STABLE_CYCLE, 'mills', 'totalMillsGenerated');

        // 4. Guild -> Stable
        updates.guild = processGenerator('guild', state.guilds, prev.guild, GUILD_DURATION_MS, STABLES_PER_GUILD_CYCLE, 'stables', 'totalStablesGenerated');

        // 5. Market -> Guild
        updates.market = processGenerator('market', state.markets, prev.market, MARKET_DURATION_MS, GUILDS_PER_MARKET_CYCLE, 'guilds', 'totalGuildsGenerated');

        // 6. Castle -> Market
        updates.castle = processGenerator('castle', state.castles, prev.castle, CASTLE_DURATION_MS, MARKETS_PER_CASTLE_CYCLE, 'markets', 'totalMarketsGenerated');

        // 7. Cathedral -> Castle
        updates.cathedral = processGenerator('cathedral', state.cathedrals, prev.cathedral, CATHEDRAL_DURATION_MS, CASTLES_PER_CATHEDRAL_CYCLE, 'castles', 'totalCastlesGenerated');

        // 8. Citadel -> Cathedral
        updates.citadel = processGenerator('citadel', state.citadels, prev.citadel, CITADEL_DURATION_MS, CATHEDRALS_PER_CITADEL_CYCLE, 'cathedrals', 'totalCathedralsGenerated');

        // 9. Kingdom -> Citadel
        updates.kingdom = processGenerator('kingdom', state.kingdoms, prev.kingdom, KINGDOM_DURATION_MS, CITADELS_PER_KINGDOM_CYCLE, 'citadels', 'totalCitadelsGenerated');

        if (hasUpdates) {
          setGameState(curr => ({ ...curr, ...stateUpdates }));
        }

        // Passive Worker Generation (1 per second) - Wall Clock Logic
        const nowTime = Date.now();
        const timeDiff = nowTime - lastWorkerTimeRef.current;

        if (timeDiff >= 1000) {
          const secondsPassed = Math.floor(timeDiff / 1000);
          if (secondsPassed > 0) {
            lastWorkerTimeRef.current += secondsPassed * 1000;

            setGameState(curr => ({
              ...curr,
              workers: curr.workers.add(secondsPassed),
              totalWorkersGenerated: curr.totalWorkersGenerated.add(secondsPassed)
            }));
          }
        }

        return updates;
      });

      if (fpsLimit === 'vsync') {
        loopRef.current = requestAnimationFrame(loop);
      } else {
        loopRef.current = setTimeout(loop, 0);
      }
    };

    loop();

    return () => {
      if (typeof loopRef.current === 'number') {
        cancelAnimationFrame(loopRef.current);
      } else if (loopRef.current) {
        clearTimeout(loopRef.current as NodeJS.Timeout);
      }
    };
  }, [fpsLimit]);

  // Handle Cost Feedback Logic
  const showCostFeedback = (type: GeneratorType, costs: { wheat: Decimal, workers: Decimal, prevTier: Decimal, prevTierKey: keyof GameState | null }) => {
    const now = Date.now();
    const lastUpdate = lastFeedbackTimeRef.current[type] || 0;

    // Clear existing hide timer
    if (feedbackTimeoutRefs.current[type]) {
      clearTimeout(feedbackTimeoutRefs.current[type]);
    }

    let newTotal = { ...costs };

    // Check if within 2 seconds window to accumulate
    if (now - lastUpdate < 2000) {
      const currentAccumulated = accumulatedCostRef.current[type] || { wheat: new Decimal(0), workers: new Decimal(0), prevTier: new Decimal(0) };
      newTotal.wheat = currentAccumulated.wheat.add(costs.wheat);
      newTotal.workers = currentAccumulated.workers.add(costs.workers);
      newTotal.prevTier = currentAccumulated.prevTier.add(costs.prevTier);
    }

    // Update refs
    accumulatedCostRef.current[type] = newTotal;
    lastFeedbackTimeRef.current[type] = now;

    // Update state to show feedback
    setCostFeedback(prev => ({
      ...prev,
      [type]: { costs: newTotal, visible: true }
    }));

    // Set new hide timer (2 seconds)
    feedbackTimeoutRefs.current[type] = setTimeout(() => {
      setCostFeedback(prev => ({
        ...prev,
        [type]: { ...prev[type], visible: false }
      }));
    }, 2000) as unknown as number;
  };

  const executeBuy = (type: GeneratorType) => {
    // Calculate based on current state (ref is safe for event handlers/intervals in this context)
    const current = stateRef.current;
    const { amount, costs, canAfford } = calculatePurchase(type, current, buyMode);

    if (!canAfford) return;

    // Trigger feedback once
    showCostFeedback(type, costs);

    // Update state
    setGameState((curr) => {
      // Re-verify affordability
      const check = calculatePurchase(type, curr, buyMode);
      if (!check.canAfford) return curr;

      const nextState = { ...curr };

      // Deduct costs
      nextState.wheat = nextState.wheat.sub(check.costs.wheat);
      nextState.workers = nextState.workers.sub(check.costs.workers);

      if (check.costs.prevTierKey) {
        // We need to cast to Decimal because TS might not know for sure, but our logic guarantees it
        const prevKey = check.costs.prevTierKey as keyof GameState;
        if (nextState[prevKey] instanceof Decimal) {
          (nextState[prevKey] as Decimal) = (nextState[prevKey] as Decimal).sub(check.costs.prevTier);
        }
      }

      // Add purchased amount
      const stateKey = STATE_KEYS[type];
      (nextState[stateKey] as Decimal) = (nextState[stateKey] as Decimal).add(check.amount);

      return nextState;
    });
  };

  useEffect(() => {
    if (!holdingBtn) return;
    const intervalId = setInterval(() => {
      executeBuy(holdingBtn);
    }, 150);
    return () => clearInterval(intervalId);
  }, [holdingBtn, buyMode]);

  const handlePressStart = (type: GeneratorType, e: React.MouseEvent | React.TouchEvent) => {
    // Check if affordable before executing to avoid visual glitches
    const { canAfford } = calculatePurchase(type, gameState, buyMode);

    if (canAfford) {
      executeBuy(type);
    }

    setHoldingBtn(type);
  };
  const handlePressEnd = () => setHoldingBtn(null);

  const handleResetGame = () => {
    if (confirm("Tem certeza que deseja apagar todo o progresso?")) {
      isResettingRef.current = true;
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };





  return (
    <div className="h-screen w-screen font-body relative overflow-hidden bg-wood-900">
      <div className="absolute inset-0 bg-parchment-100 opacity-5 pointer-events-none z-0"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(62,39,35,0.4)_100%)]"></div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wood-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-parchment-200 rounded-lg shadow-2xl border-4 border-wood-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
            <button onClick={() => setShowSettings(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-wood-700 hover:text-wood-900 z-20"><i className="fa-solid fa-xmark text-xl"></i></button>
            <div className="bg-parchment-300/50 p-6 text-center border-b border-wood-300/30">
              <div className="text-4xl mb-3 text-wood-700"><i className="fa-solid fa-gear"></i></div>
              <h2 className="font-heading text-2xl text-wood-900">Configurações</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between bg-white/40 p-4 rounded border border-parchment-border">
                <span className="font-bold text-wood-900 text-sm uppercase tracking-wider">Monitor de FPS</span>
                <button onClick={() => setShowFPS(!showFPS)} className={`px-4 py-1.5 rounded font-heading text-sm border-2 transition-all shadow-sm ${showFPS ? 'bg-wood-700 text-parchment-100 border-wood-900' : 'bg-parchment-100 text-wood-500 border-wood-300'}`}>{showFPS ? 'LIGADO' : 'DESLIGADO'}</button>
              </div>
              <div className="flex items-center justify-between bg-white/40 p-4 rounded border border-parchment-border">
                <span className="font-bold text-wood-900 text-sm uppercase tracking-wider">Limite de FPS (VSync)</span>
                <button onClick={() => setFpsLimit(prev => prev === 'vsync' ? 'unlimited' : 'vsync')} className={`px-4 py-1.5 rounded font-heading text-sm border-2 transition-all shadow-sm ${fpsLimit === 'vsync' ? 'bg-wood-700 text-parchment-100 border-wood-900' : 'bg-parchment-100 text-wood-500 border-wood-300'}`}>{fpsLimit === 'vsync' ? 'LIGADO' : 'DESLIGADO'}</button>
              </div>
            </div>
            <div className="p-4 bg-wood-800 text-center"><button onClick={() => setShowSettings(false)} className="px-6 py-2 bg-wood-600 text-parchment-100 rounded font-heading border border-wood-500 hover:bg-wood-500 transition-colors uppercase tracking-widest text-sm">Fechar</button></div>
          </div>
        </div>
      )}

      {infoModal && (
        <InfoModal
          type={infoModal}
          onClose={() => setInfoModal(null)}
          onNavigate={(t) => setInfoModal(t)}
          gameState={gameState}
          buyUpgrade={buyUpgrade}
        />
      )}

      <div className="relative z-10 w-full h-full bg-parchment-200 overflow-hidden select-none flex flex-col">
        <header className="pt-6 pb-4 px-8 text-center bg-parchment-300/50 border-b border-wood-300/30 relative shrink-0">
          <div className="absolute top-4 right-4 flex gap-4 z-50">
            <button onClick={toggleFullscreen} className="text-wood-700 hover:text-wood-900 transition-colors" title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}>
              <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-lg`}></i>
            </button>
            <button onClick={handleResetGame} className="text-red-700 hover:text-red-900 transition-colors" title="Apagar Progresso (Reset)">
              <i className="fa-solid fa-trash text-lg"></i>
            </button>
            <button onClick={() => setShowSettings(true)} className="text-wood-700 hover:text-wood-900 transition-colors" title="Configurações">
              <i className="fa-solid fa-gear text-lg"></i>
            </button>
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-20 text-wood-900"><i className="fa-solid fa-crown text-2xl"></i></div>
          <h1 className="text-4xl md:text-5xl font-heading text-wood-900 drop-shadow-sm mb-1 tracking-tight">Fantasia Medieval</h1>
          <p className="text-sm font-bold text-wood-500 uppercase tracking-widest text-[0.65rem]">Gestão Feudal</p>
        </header>

        <div className="border-b border-wood-300/30 bg-parchment-100/50 shrink-0">
          <div className="p-4 flex flex-col items-center justify-center">
            <span className="text-wood-500 text-[10px] font-bold uppercase tracking-widest mb-1">Estoque Real</span>
            <div className="flex items-center justify-center gap-8 w-full">
              <div className="flex items-center gap-3 text-wood-900">
                <WheatIcon className="text-3xl text-harvest shrink-0" />
                <span className="text-5xl font-heading leading-none tabular-nums whitespace-nowrap">{formatNumber(gameState.wheat)}</span>
              </div>
              <div className="flex items-center gap-2 text-wood-800" title="Trabalhadores (Gerados 1/s)">
                <WorkerIcon className="text-2xl" />
                <span className="text-3xl font-heading leading-none tabular-nums whitespace-nowrap">{formatNumber(gameState.workers)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center p-2 bg-parchment-300/30 border-b border-wood-300/30 shrink-0">
          <div className="flex items-center">
            <button onClick={toggleBuyMode} className="min-w-[2.5rem] px-2 py-0.5 rounded font-heading font-bold text-[10px] bg-wood-700 text-parchment-100 border border-wood-900 shadow-sm hover:bg-wood-600 transition-all flex items-center justify-center active:translate-y-[1px] select-none" title="Clique para mudar a quantidade de compra"><span>{buyMode}</span></button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          {...dragEvents}
          className={`flex-1 p-6 bg-parchment-300 shadow-inner grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        >
          {GENERATOR_ORDER.map((type, index) => {
            const prevType = index > 0 ? GENERATOR_ORDER[index - 1] : null;
            // Visible if: It's the first one OR we have the previous one OR we already own the current one
            const isVisible = index === 0 || (prevType && ((gameState[STATE_KEYS[prevType]] as Decimal).gt(0) || (gameState[STATE_KEYS[type]] as Decimal).gt(0)));

            if (!isVisible) return null;

            return (
              <GeneratorCard
                key={type}
                type={type}
                gameState={gameState}
                progressValue={progress[PROGRESS_KEYS[type]]}
                buyMode={buyMode}
                holdingBtn={holdingBtn}
                costFeedback={costFeedback[type]}
                setInfoModal={setInfoModal}
                handlePressStart={handlePressStart}
                handlePressEnd={handlePressEnd}
              />
            );
          })}
        </div>

        <div className="bg-wood-900 py-3 border-t-4 border-wood-700 relative flex items-center justify-center h-10 shrink-0">
          <div className="text-parchment-100/30"><i className="fa-brands fa-fort-awesome text-xs"></i></div>
          {showFPS && <div className="absolute right-4 text-[10px] text-parchment-100 font-mono"><span title="Quadros por segundo atuais">FPS: {actualFPS}</span></div>}
        </div>
      </div>
    </div>
  );
}