import React, { useState, useEffect, useRef, useMemo } from 'react';
import Decimal from 'break_infinity.js';
import { GameState, GeneratorType } from './types';
import {
  WheatIcon, PeasantIcon, MillIcon, StableIcon,
  GuildIcon, MarketIcon, CastleIcon, CathedralIcon, CitadelIcon, KingdomIcon, WorkerIcon, LandIcon, OreIcon
} from './components/Icons';
import {
  PEASANT_COST, MILL_COST, STABLE_COST, GUILD_COST, MARKET_COST, CASTLE_COST, CATHEDRAL_COST, CITADEL_COST, KINGDOM_COST,
  HARVEST_DURATION_MS, MILL_DURATION_MS, STABLE_DURATION_MS, GUILD_DURATION_MS, MARKET_DURATION_MS, CASTLE_DURATION_MS, CATHEDRAL_DURATION_MS, CITADEL_DURATION_MS, KINGDOM_DURATION_MS, EMPIRE_DURATION_MS, DYNASTY_DURATION_MS, PANTHEON_DURATION_MS, PLANE_DURATION_MS, GALAXY_DURATION_MS, UNIVERSE_DURATION_MS, MULTIVERSE_DURATION_MS,
  WHEAT_PER_HARVEST, PEASANTS_PER_MILL_CYCLE, MILLS_PER_STABLE_CYCLE, STABLES_PER_GUILD_CYCLE, GUILDS_PER_MARKET_CYCLE, MARKETS_PER_CASTLE_CYCLE, CASTLES_PER_CATHEDRAL_CYCLE, CATHEDRALS_PER_CITADEL_CYCLE, CITADELS_PER_KINGDOM_CYCLE, KINGDOMS_PER_EMPIRE_CYCLE, EMPIRES_PER_DYNASTY_CYCLE, DYNASTIES_PER_PANTHEON_CYCLE, PANTHEONS_PER_PLANE_CYCLE, PLANES_PER_GALAXY_CYCLE, GALAXIES_PER_UNIVERSE_CYCLE, UNIVERSES_PER_MULTIVERSE_CYCLE,
  SAVE_KEY, AUTOMATION_THRESHOLD, GENERATOR_ORDER, STATE_KEYS, GENERATOR_INFO, INITIAL_STATE, SKILL_TREE,
  formatNumber, calculateMultipliers, calculatePurchase, calculateWorkerMultiplier,
  BuyMode,
  WORKER_COST,
  PEASANT_WHEAT_COST, MILL_WHEAT_COST, STABLE_WHEAT_COST, GUILD_WHEAT_COST, MARKET_WHEAT_COST, CASTLE_WHEAT_COST, CATHEDRAL_WHEAT_COST, CITADEL_WHEAT_COST, KINGDOM_WHEAT_COST, EMPIRE_WHEAT_COST, DYNASTY_WHEAT_COST, PANTHEON_WHEAT_COST, PLANE_WHEAT_COST, GALAXY_WHEAT_COST, UNIVERSE_WHEAT_COST, MULTIVERSE_WHEAT_COST,
  PEASANT_PREV_COST, MILL_PREV_COST, STABLE_PREV_COST, GUILD_PREV_COST, MARKET_PREV_COST, CASTLE_PREV_COST, CATHEDRAL_PREV_COST, CITADEL_PREV_COST, KINGDOM_PREV_COST, EMPIRE_PREV_COST, DYNASTY_PREV_COST, PANTHEON_PREV_COST, PLANE_PREV_COST, GALAXY_PREV_COST, UNIVERSE_PREV_COST, MULTIVERSE_PREV_COST
} from './gameData';
import GeneratorCard from './components/GeneratorCard';
import BottomNav from './components/BottomNav';
import SkillTree from './components/SkillTree';

import SettingsModal from './components/SettingsModal';
import { useDraggableScroll } from './hooks/useDraggableScroll';

export type FPSLimit = number | 'vsync' | 'unlimited';



interface InfoModalProps {
  type: GeneratorType;
  onClose: () => void;
  onNavigate: (type: GeneratorType) => void;
  gameState: GameState;
}

const InfoModal: React.FC<InfoModalProps> = ({ type, onClose, onNavigate, gameState }) => {
  const info = GENERATOR_INFO[type];
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
                        {type === 'empire' && formatNumber(new Decimal(EMPIRE_PREV_COST))}
                        {type === 'dynasty' && formatNumber(new Decimal(DYNASTY_PREV_COST))}
                        {type === 'pantheon' && formatNumber(new Decimal(PANTHEON_PREV_COST))}
                        {type === 'plane' && formatNumber(new Decimal(PLANE_PREV_COST))}
                        {type === 'galaxy' && formatNumber(new Decimal(GALAXY_PREV_COST))}
                        {type === 'universe' && formatNumber(new Decimal(UNIVERSE_PREV_COST))}
                        {type === 'multiverse' && formatNumber(new Decimal(MULTIVERSE_PREV_COST))}
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
                      {type === 'empire' && formatNumber(new Decimal(EMPIRE_WHEAT_COST))}
                      {type === 'dynasty' && formatNumber(new Decimal(DYNASTY_WHEAT_COST))}
                      {type === 'pantheon' && formatNumber(new Decimal(PANTHEON_WHEAT_COST))}
                      {type === 'plane' && formatNumber(new Decimal(PLANE_WHEAT_COST))}
                      {type === 'galaxy' && formatNumber(new Decimal(GALAXY_WHEAT_COST))}
                      {type === 'universe' && formatNumber(new Decimal(UNIVERSE_WHEAT_COST))}
                      {type === 'multiverse' && formatNumber(new Decimal(MULTIVERSE_WHEAT_COST))}
                      <WheatIcon className="text-lg text-harvest" />
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-wood-300/20 pb-2 mb-2">
                  <span className="font-bold text-wood-800 text-xs uppercase tracking-wider">Produção</span>
                  <span className="font-heading text-wood-900 flex items-center gap-2 tabular-nums">
                    {(() => {
                      const currentDuration = info.duration / speedMult;
                      const currentProd = info.prodAmount.mul(effMult);

                      if (currentDuration <= 1.0 && currentDuration > 0) {
                        const prodPerSec = currentProd.div(currentDuration);
                        return (
                          <>
                            <span className={effMult.gt(1) ? 'text-emerald-700 font-bold' : ''}>{formatNumber(prodPerSec)}</span>
                            {React.createElement(info.prodIcon, { className: `text-lg ${info.prodColor}` })}
                            <span className={`text-sm ml-1 font-body font-bold ${speedMult > 1 ? 'text-emerald-700' : 'text-wood-600'}`}>/ s</span>
                          </>
                        );
                      }

                      return (
                        <>
                          <span className={effMult.gt(1) ? 'text-emerald-700 font-bold' : ''}>{formatNumber(currentProd)}</span>
                          {React.createElement(info.prodIcon, { className: `text-lg ${info.prodColor}` })}
                          <span className={`text-sm ml-1 font-body font-bold ${speedMult > 1 ? 'text-emerald-700' : 'text-wood-600'}`}>/ {currentDuration}s</span>
                        </>
                      );
                    })()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-wood-800 text-xs uppercase tracking-wider">{info.totalLabel}</span>
                  <span className="font-heading text-wood-900 flex items-center gap-2 tabular-nums">{formatNumber(gameState[info.totalKey] as Decimal)}{React.createElement(info.prodIcon, { className: `text-lg ${info.prodColor}` })}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Upgrades - REMOVED (Moved to Skill Tree) */}
            <div className="flex flex-col gap-4 relative">
              <div className="hidden md:block absolute left-[-1rem] top-0 bottom-0 w-px bg-wood-300/30"></div>
              <h3 className="font-heading text-wood-900 text-center text-lg uppercase tracking-wider">Tecnologias</h3>
              <p className="text-center text-wood-500 italic text-sm">
                As tecnologias agora fazem parte da Árvore de Habilidades.
              </p>
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
        } else if (parsed.unlockedSkills) {
          // Migration from v1 (unlockedSkills array) to v2 (upgrades map)
          const migratedUpgrades: Record<string, number> = {};
          parsed.unlockedSkills.forEach((skillId: string) => {
            migratedUpgrades[skillId] = 1;
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

  // REMOVED: useEffect to sync stateRef from gameState.
  // stateRef is now the source of truth, and gameState is just for rendering.
  // useEffect(() => {
  //   stateRef.current = gameState;
  // }, [gameState]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (isResettingRef.current) return;
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
    }, 5000);

    return () => clearInterval(saveInterval);
  }, []);

  type ProgressState = Record<GeneratorType, { val: number, lastLuck: number }>;

  // Use refs for progress to avoid re-renders
  const progressStateRef = useRef<ProgressState>({
    peasant: { val: 0, lastLuck: 0 },
    mill: { val: 0, lastLuck: 0 },
    stable: { val: 0, lastLuck: 0 },
    guild: { val: 0, lastLuck: 0 },
    market: { val: 0, lastLuck: 0 },
    castle: { val: 0, lastLuck: 0 },
    cathedral: { val: 0, lastLuck: 0 },
    citadel: { val: 0, lastLuck: 0 },
    kingdom: { val: 0, lastLuck: 0 },
    empire: { val: 0, lastLuck: 0 },
    dynasty: { val: 0, lastLuck: 0 },
    pantheon: { val: 0, lastLuck: 0 },
    plane: { val: 0, lastLuck: 0 },
    galaxy: { val: 0, lastLuck: 0 },
    universe: { val: 0, lastLuck: 0 },
    multiverse: { val: 0, lastLuck: 0 }
  });

  // Refs for direct DOM manipulation of progress bars
  const progressRefs = useRef<Record<GeneratorType, HTMLDivElement | null>>({
    peasant: null, mill: null, stable: null, guild: null, market: null, castle: null,
    cathedral: null, citadel: null, kingdom: null, empire: null, dynasty: null,
    pantheon: null, plane: null, galaxy: null, universe: null, multiverse: null
  });

  // State for luck animation triggers (still needs to be state to re-render card)
  const [luckState, setLuckState] = useState<Record<GeneratorType, number>>({
    peasant: 0, mill: 0, stable: 0, guild: 0, market: 0, castle: 0,
    cathedral: 0, citadel: 0, kingdom: 0, empire: 0, dynasty: 0,
    pantheon: 0, plane: 0, galaxy: 0, universe: 0, multiverse: 0
  });

  // Helper map for progress keys
  const PROGRESS_KEYS: Record<GeneratorType, keyof ProgressState> = {
    peasant: 'peasant',
    mill: 'mill',
    stable: 'stable',
    guild: 'guild',
    market: 'market',
    castle: 'castle',
    cathedral: 'cathedral',
    citadel: 'citadel',
    kingdom: 'kingdom',
    empire: 'empire',
    dynasty: 'dynasty',
    pantheon: 'pantheon',
    plane: 'plane',
    galaxy: 'galaxy',
    universe: 'universe',
    multiverse: 'multiverse'
  };

  const [fpsLimit, setFpsLimit] = useState<FPSLimit>('vsync');
  const [actualFPS, setActualFPS] = useState(0);
  const [showFPS, setShowFPS] = useState(false);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const loopRef = useRef<number | NodeJS.Timeout | null>(null);
  const lastUiUpdateRef = useRef(0);
  const pendingUpdatesRef = useRef(false);

  const [buyMode, setBuyMode] = useState<BuyMode>('1');
  const [holdingBtn, setHoldingBtn] = useState<GeneratorType | null>(null);
  const [infoModal, setInfoModal] = useState<GeneratorType | null>(null);
  const [currentView, setCurrentView] = useState<'kingdom' | 'skills'>('kingdom');

  const [showSettings, setShowSettings] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
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

  // Optimize Multipliers Calculation
  const multipliersCache = useMemo(() => {
    const cache: Record<GeneratorType, { speedMult: number, effMult: Decimal, hasLuck: boolean, luckMult: number }> = {} as any;
    GENERATOR_ORDER.forEach(type => {
      cache[type] = calculateMultipliers(type, gameState.upgrades || {});
    });
    return cache;
  }, [gameState.upgrades]);

  const workerMult = useMemo(() => {
    return calculateWorkerMultiplier(gameState.upgrades || {});
  }, [gameState.upgrades]);

  // MAIN GAME LOOP
  useEffect(() => {
    lastTimeRef.current = performance.now();

    const loop = () => {
      if (isResettingRef.current) return;

      const now = performance.now();
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      framesRef.current++;

      const state = stateRef.current;
      // Removed local hasUpdates, using pendingUpdatesRef instead
      let luckUpdates: Record<string, number> = {};
      let hasLuckUpdates = false;

      // Helper for production logic
      const processGenerator = (
        type: GeneratorType,
        count: Decimal,
        baseDuration: number,
        baseOutput: number,
        targetResource: Exclude<keyof GameState, 'upgrades' | 'unlockedSkills'>,
        totalResource: Exclude<keyof GameState, 'upgrades' | 'unlockedSkills'>
      ) => {
        const currentProg = progressStateRef.current[type];
        if (count.lte(0)) return;

        // Use cached multipliers
        const { speedMult, effMult, hasLuck, luckMult } = multipliersCache[type];

        const duration = baseDuration / speedMult;
        let output = new Decimal(baseOutput).mul(effMult);
        let luckTriggered = false;

        // Luck Mechanic: 10% chance to multiply output by luckMult
        if (hasLuck && Math.random() < 0.1) {
          output = output.mul(luckMult);
          luckTriggered = true;
        }

        let nextProg = currentProg.val + ((dt / duration) * 100);
        let nextLastLuck = currentProg.lastLuck;

        if (nextProg >= 100) {
          const cycles = Math.floor(nextProg / 100);
          nextProg = nextProg % 100;
          const produced = count.mul(output).mul(cycles);

          // Update stateRef immediately to avoid stale state in next loop
          const currentTarget = state[targetResource] as Decimal;
          const currentTotal = state[totalResource] as Decimal;

          // Mutate stateRef.current (safe because we are the only writer in the loop)
          // We cast to any to bypass readonly check if needed, but here we just update the properties
          (state[targetResource] as Decimal) = currentTarget.add(produced);
          (state[totalResource] as Decimal) = currentTotal.add(produced);

          pendingUpdatesRef.current = true;

          if (luckTriggered) {
            nextLastLuck = Date.now();
            luckUpdates[type] = nextLastLuck;
            hasLuckUpdates = true;
          }
        }

        // Update Ref State
        progressStateRef.current[type] = { val: nextProg, lastLuck: nextLastLuck };

        // Direct DOM Update
        const barRef = progressRefs.current[type];
        if (barRef) {
          // Use a slightly higher threshold than GeneratorCard (0.5s) to ensure we switch to static mode
          // BEFORE the candy animation triggers. This prevents "loading bar + candy" glitches.
          const isFast = (duration / 1000) <= 1.0;
          if (isFast) {
            barRef.style.width = '100%';
          } else {
            barRef.style.width = `${nextProg}%`;
          }
        }
      };

      // 1. Peasant -> Wheat
      processGenerator('peasant', state.peasants, HARVEST_DURATION_MS, WHEAT_PER_HARVEST, 'wheat', 'totalHarvested');

      // 2. Mill -> Peasant
      processGenerator('mill', state.mills, MILL_DURATION_MS, PEASANTS_PER_MILL_CYCLE, 'peasants', 'totalPeasantsGenerated');

      // 3. Stable -> Mill
      processGenerator('stable', state.stables, STABLE_DURATION_MS, MILLS_PER_STABLE_CYCLE, 'mills', 'totalMillsGenerated');

      // 4. Guild -> Stable
      processGenerator('guild', state.guilds, GUILD_DURATION_MS, STABLES_PER_GUILD_CYCLE, 'stables', 'totalStablesGenerated');

      // 5. Market -> Guild
      processGenerator('market', state.markets, MARKET_DURATION_MS, GUILDS_PER_MARKET_CYCLE, 'guilds', 'totalGuildsGenerated');

      // 6. Castle -> Market
      processGenerator('castle', state.castles, CASTLE_DURATION_MS, MARKETS_PER_CASTLE_CYCLE, 'markets', 'totalMarketsGenerated');

      // 7. Cathedral -> Castle
      processGenerator('cathedral', state.cathedrals, CATHEDRAL_DURATION_MS, CASTLES_PER_CATHEDRAL_CYCLE, 'castles', 'totalCastlesGenerated');

      // 8. Citadel -> Cathedral
      processGenerator('citadel', state.citadels, CITADEL_DURATION_MS, CATHEDRALS_PER_CITADEL_CYCLE, 'cathedrals', 'totalCathedralsGenerated');

      // 9. Kingdom -> Citadel
      processGenerator('kingdom', state.kingdoms, KINGDOM_DURATION_MS, CITADELS_PER_KINGDOM_CYCLE, 'citadels', 'totalCitadelsGenerated');

      // 10. Empire -> Kingdom
      processGenerator('empire', state.empires, EMPIRE_DURATION_MS, KINGDOMS_PER_EMPIRE_CYCLE, 'kingdoms', 'totalKingdomsGenerated');

      // 11. Dynasty -> Empire
      processGenerator('dynasty', state.dynasties, DYNASTY_DURATION_MS, EMPIRES_PER_DYNASTY_CYCLE, 'empires', 'totalEmpiresGenerated');

      // 12. Pantheon -> Dynasty
      processGenerator('pantheon', state.pantheons, PANTHEON_DURATION_MS, DYNASTIES_PER_PANTHEON_CYCLE, 'dynasties', 'totalDynastiesGenerated');

      // 13. Plane -> Pantheon
      processGenerator('plane', state.planes, PLANE_DURATION_MS, PANTHEONS_PER_PLANE_CYCLE, 'pantheons', 'totalPantheonsGenerated');

      // 14. Galaxy -> Plane
      processGenerator('galaxy', state.galaxies, GALAXY_DURATION_MS, PLANES_PER_GALAXY_CYCLE, 'planes', 'totalPlanesGenerated');

      // 15. Universe -> Galaxy
      processGenerator('universe', state.universes, UNIVERSE_DURATION_MS, GALAXIES_PER_UNIVERSE_CYCLE, 'galaxies', 'totalGalaxiesGenerated');

      // 16. Multiverse -> Universe
      processGenerator('multiverse', state.multiverses, MULTIVERSE_DURATION_MS, UNIVERSES_PER_MULTIVERSE_CYCLE, 'universes', 'totalUniversesGenerated');

      // Passive Worker Generation (1 per second) - Wall Clock Logic
      const nowTime = Date.now();
      const timeDiff = nowTime - lastWorkerTimeRef.current;

      if (timeDiff >= 1000) {
        const secondsPassed = Math.floor(timeDiff / 1000);
        if (secondsPassed > 0) {
          lastWorkerTimeRef.current += secondsPassed * 1000;

          const generated = new Decimal(secondsPassed).mul(workerMult);
          console.log(`[Worker Debug] Seconds: ${secondsPassed}, Mult: ${workerMult.toString()}, Generated: ${generated.toString()}`);

          // Mutate stateRef directly
          state.workers = state.workers.add(generated);
          state.totalWorkersGenerated = state.totalWorkersGenerated.add(generated);
          pendingUpdatesRef.current = true;
        }
      }

      // Throttle UI updates to 100ms (10fps)
      if (pendingUpdatesRef.current && (now - lastUiUpdateRef.current >= 100)) {
        // Sync React state with the updated ref state
        setGameState({ ...state });
        lastUiUpdateRef.current = now;
        pendingUpdatesRef.current = false;
      }

      if (hasLuckUpdates) {
        setLuckState(prev => ({ ...prev, ...luckUpdates }));
      }






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
  }, [fpsLimit, multipliersCache, workerMult]);

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

    // Update state based on stateRef (Source of Truth)
    const nextState = { ...stateRef.current };

    // Re-verify affordability using the latest state
    const check = calculatePurchase(type, nextState, buyMode);
    if (!check.canAfford) return;

    // Deduct costs
    nextState.wheat = nextState.wheat.sub(check.costs.wheat);
    nextState.workers = nextState.workers.sub(check.costs.workers);

    if (check.costs.prevTierKey) {
      const prevKey = check.costs.prevTierKey as keyof GameState;
      if (nextState[prevKey] instanceof Decimal) {
        (nextState[prevKey] as Decimal) = (nextState[prevKey] as Decimal).sub(check.costs.prevTier);
      }
    }

    // Add purchased amount
    const stateKey = STATE_KEYS[type];
    (nextState[stateKey] as Decimal) = (nextState[stateKey] as Decimal).add(check.amount);

    // Sync stateRef immediately
    stateRef.current = nextState;

    // Trigger React render
    setGameState(nextState);
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

  const handleBuySkill = (skillId: string) => {
    const skill = SKILL_TREE.find(s => s.id === skillId);
    if (!skill) return;

    // Use stateRef as source of truth
    const prev = stateRef.current;
    const currentRank = prev.upgrades[skillId] || 0;
    const maxRank = skill.maxRank || 1;

    if (currentRank >= maxRank) return;

    // Calculate cost for next rank: BaseCost * (2 ^ currentRank)
    const costMultiplier = new Decimal(2).pow(currentRank);
    const currentCost = skill.cost.mul(costMultiplier);

    if (prev.wheat.lt(currentCost)) return;

    const newUpgrades = { ...prev.upgrades };
    newUpgrades[skillId] = currentRank + 1;

    const newUnlocked = [...prev.unlockedSkills];
    if (currentRank === 0) {
      newUnlocked.push(skillId);
    }

    const newState = {
      ...prev,
      wheat: prev.wheat.sub(currentCost),
      upgrades: newUpgrades,
      unlockedSkills: newUnlocked
    };

    // Sync stateRef immediately
    stateRef.current = newState;

    // Trigger React render
    setGameState(newState);
  };

  const handleResetGame = () => {
    if (confirm("Tem certeza que deseja apagar todo o progresso?")) {
      isResettingRef.current = true;
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  const handleSaveAndExit = () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
    try {
      window.close();
    } catch (e) {
      // Ignore
    }
    // Fallback if window.close() fails (common in browsers)
    setShowSaveConfirm(true);
  };





  return (
    <div className="h-screen w-screen font-body relative overflow-hidden bg-wood-900">
      <div className="absolute inset-0 bg-parchment-100 opacity-5 pointer-events-none z-0"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(62,39,35,0.4)_100%)]"></div>

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        showFPS={showFPS}
        setShowFPS={setShowFPS}
        fpsLimit={fpsLimit}
        setFpsLimit={setFpsLimit}
        onSaveAndExit={handleSaveAndExit}
      />

      {showSaveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-wood-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-parchment-200 rounded-lg shadow-2xl border-4 border-wood-500 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
            <div className="bg-parchment-300/50 p-6 text-center border-b border-wood-300/30">
              <div className="text-4xl mb-3 text-emerald-700"><i className="fa-solid fa-floppy-disk"></i></div>
              <h2 className="font-heading text-2xl text-wood-900">Jogo Salvo!</h2>
            </div>
            <div className="p-6 text-center">
              <p className="text-wood-800 font-serif text-lg mb-2">Seu progresso foi salvo com segurança.</p>
              <p className="text-wood-600 text-sm italic">Você pode fechar esta janela agora.</p>
            </div>
            <div className="p-4 bg-wood-800 text-center">
              <button onClick={() => setShowSaveConfirm(false)} className="px-8 py-2 bg-wood-600 text-parchment-100 rounded font-heading border border-wood-500 hover:bg-wood-500 transition-colors uppercase tracking-widest text-sm shadow-lg">
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {infoModal && (
        <InfoModal
          type={infoModal}
          onClose={() => setInfoModal(null)}
          onNavigate={(t) => setInfoModal(t)}
          gameState={gameState}
        />
      )}

      <div className="relative z-10 w-full h-full bg-parchment-200 overflow-hidden select-none flex flex-col">
        <header className={`pt-6 pb-4 px-8 text-center bg-parchment-300/50 border-b border-wood-300/30 relative shrink-0 ${currentView === 'skills' ? 'hidden' : ''}`}>
          <div className="absolute top-4 right-4 flex gap-4 z-50">
            {showFPS && (
              <div className="flex items-center gap-1 bg-parchment-100/80 px-2 py-1 rounded border border-wood-300 text-xs font-bold text-wood-600 tabular-nums shadow-sm">
                <span>{actualFPS}</span>
                <span className="text-[10px] opacity-70">FPS</span>
              </div>
            )}
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

        <div className={`border-b border-wood-300/30 bg-parchment-100/50 shrink-0 ${currentView === 'skills' ? 'hidden' : ''}`}>
          <div className="p-2">
            <span className="text-wood-500 text-[10px] font-bold uppercase tracking-widest mb-1 block px-2">Estoque Real</span>
            <div className="flex flex-wrap gap-2 px-2">
              {/* Workers (Pillar Resource) */}
              <div className="flex items-center gap-2 text-parchment-100 bg-wood-700 px-3 py-1.5 rounded border border-wood-900 shadow-sm" title={`Trabalhadores (Gerados ${formatNumber(workerMult)}/s)`}>
                <WorkerIcon className="text-base" />
                <span className="text-lg font-heading leading-none tabular-nums whitespace-nowrap w-24 text-right">{formatNumber(gameState.workers)}</span>
              </div>
              {/* Wheat */}
              <div
                onClick={() => setCurrentView('kingdom')}
                className={`flex items-center gap-2 text-wood-900 bg-parchment-200/50 px-3 py-1.5 rounded border border-wood-300/30 shadow-sm cursor-pointer hover:bg-parchment-200 transition-colors ${currentView === 'kingdom' ? 'ring-2 ring-harvest' : ''}`}
              >
                <WheatIcon className="text-lg text-harvest shrink-0" />
                <span className="text-lg font-heading leading-none tabular-nums whitespace-nowrap w-24 text-right">{formatNumber(gameState.wheat)}</span>
              </div>
              {/* Land */}
              <div
                onClick={() => setCurrentView('land')}
                className={`flex items-center gap-2 text-emerald-800 bg-parchment-200/50 px-3 py-1.5 rounded border border-wood-300/30 shadow-sm cursor-pointer hover:bg-parchment-200 transition-colors ${currentView === 'land' ? 'ring-2 ring-emerald-400' : ''}`}
              >
                <LandIcon className="text-lg shrink-0" />
                <span className="text-lg font-heading leading-none tabular-nums whitespace-nowrap w-24 text-right">{formatNumber(gameState.land)}</span>
              </div>
              {/* Ores */}
              <div
                onClick={() => setCurrentView('ores')}
                className={`flex items-center gap-2 text-slate-700 bg-parchment-200/50 px-3 py-1.5 rounded border border-wood-300/30 shadow-sm cursor-pointer hover:bg-parchment-200 transition-colors ${currentView === 'ores' ? 'ring-2 ring-slate-400' : ''}`}
              >
                <OreIcon className="text-lg shrink-0" />
                <span className="text-lg font-heading leading-none tabular-nums whitespace-nowrap w-24 text-right">{formatNumber(gameState.ores)}</span>
              </div>
            </div>
          </div>
        </div>

        {currentView === 'kingdom' ? (
          <>
            <div className="flex justify-center p-2 bg-parchment-300/30 border-b border-wood-300/30 shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={toggleBuyMode} className="h-7 min-w-[2.5rem] px-2 rounded font-heading font-bold text-[10px] bg-wood-700 text-parchment-100 border border-wood-900 shadow-sm hover:bg-wood-600 transition-all flex items-center justify-center active:translate-y-[1px] select-none" title="Clique para mudar a quantidade de compra"><span>{buyMode}</span></button>
                <button onClick={() => setCurrentView('skills')} className="h-7 min-w-[2.5rem] px-2 rounded font-heading font-bold text-[10px] bg-wood-700 text-parchment-100 border border-wood-900 shadow-sm hover:bg-wood-600 transition-all flex items-center justify-center active:translate-y-[1px] select-none" title="Árvore de Habilidades">
                  <i className="fa-solid fa-tree text-xs"></i>
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              {...dragEvents}
              className={`flex-1 p-6 bg-amber-900 shadow-inner grid grid-cols-1 md::grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto relative ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] opacity-40 pointer-events-none fixed"></div>
              {GENERATOR_ORDER.map((type, index) => {
                const prevType = index > 0 ? GENERATOR_ORDER[index - 1] : null;
                const isVisible = index === 0 || (prevType && ((gameState[STATE_KEYS[prevType]] as Decimal).gt(0) || (gameState[STATE_KEYS[type]] as Decimal).gt(0)));

                if (!isVisible) return null;



                return (
                  <GeneratorCard
                    key={type}
                    type={type}
                    progressRef={(el: HTMLDivElement) => { progressRefs.current[type] = el; }}
                    lastLuck={luckState[type]}
                    holdingBtn={holdingBtn}
                    costFeedback={costFeedback[type]}
                    multipliers={multipliersCache[type]}
                    setInfoModal={setInfoModal}
                    handlePressStart={handlePressStart}
                    handlePressEnd={handlePressEnd}
                    buyMode={buyMode}
                    gameState={gameState}
                  />
                );
              })}

            </div>
          </>
        ) : (currentView === 'land' || currentView === 'ores') ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-parchment-200">
            <div className="text-6xl text-wood-300 mb-4">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h2 className="text-2xl font-heading text-wood-800 mb-2">Em Breve</h2>
            <p className="text-wood-600 font-serif italic">Desbloquear Linha de produção futuramente</p>
          </div>
        ) : (
          <SkillTree
            gameState={gameState}
            onBuySkill={handleBuySkill}
            onBack={() => setCurrentView('kingdom')}
            showFPS={showFPS}
            actualFPS={actualFPS}
          />
        )}

        <BottomNav
          currentView={currentView}
          onNavigate={setCurrentView}
          className={currentView === 'skills' ? 'hidden' : ''}
        />
      </div>
    </div>
  );
}